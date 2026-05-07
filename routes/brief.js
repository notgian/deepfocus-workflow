const express = require('express');
const Token = require('../models/tokens');
const User = require('../models/users');
const BrainDump = require('../models/braindumps.js');
const { google } = require('googleapis');
const { GoogleGenAI } = require("@google/genai");
const getGoogleClient = require('../utils/googleAuth');

const { isUserSession, isUserProject } = require('../util/middlewares.js');

const router = express.Router();

// TODO require google passport authentication
router.get('/', [isUserSession, isUserProject], async (req, res) => {

    try {
        const user = await User.findById(req.session.user._id);

        const oauth2Client = await getGoogleClient(req.session.user._id);
        if (!oauth2Client) return res.redirect('/auth/google');

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // fetch calendars
        const listResponse = await calendar.calendarList.list();
        const calendarColors = {}; // store google calendar color settings for UI visuals (e.g. calendar source, calendar event)
        const calendarNames = {};

        const calendars = listResponse.data.items.map(cal => {
            calendarColors[cal.id] = cal.backgroundColor; 
            calendarNames[cal.id] = cal.summary;
            return {            
                id: cal.id,
                summary: cal.summary,
                selected: (user.selectedCalendars || []).includes(cal.id),
                backgroundColor: cal.backgroundColor 
            };
        });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let allEvents = [];

        // fetch events ONLY if the user has selected calendars
        const selectedList = user.selectedCalendars || [];
        if (selectedList.length > 0) {
            const eventPromises = selectedList.map(async (calId) => {
                const response = await calendar.events.list({
                    calendarId: calId,
                    timeMin: startOfDay.toISOString(),
                    timeMax: endOfDay.toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime'
                });

                return response.data.items.map(event => {
                    const start = new Date(event.start.dateTime || event.start.date);
                    const end = new Date(event.end.dateTime || event.end.date);
                    const duration = Math.round((end - start) / 60000);

                    const title = event.summary.toLowerCase();
                    const calName = (calendarNames[calId] || "").toLowerCase();

                    return {
                        summary: event.summary,
                        startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        endTime: end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        rawStart: start, 
                        duration: duration,
                        color: calendarColors[calId] || 'var(--primary-blue)' 
                    };
                });
            });

            const results = await Promise.all(eventPromises);
            allEvents = results.flat().sort((a, b) => a.rawStart - b.rawStart);
        }


        /* Render page */
        const renderOpts = {
            title: `Mission Brief | ${req.session.project.projectName}`,
            project: req.session.project,
            user: req.session.user,
            css: ['/css/userProjects.css', '/css/brief.css'],
            js: ['/js/userProjects.js', '/js/brief.js', '/js/sidebar.js'],
        }

        if (allEvents.length > 0)
            renderOpts['events'] = allEvents;
        if (req.session?.project?.brief)
            renderOpts['brief'] = req.session.project.brief
        
        res.render('brief.hbs', renderOpts)

    } catch (error) {
        console.error('Calendar API Error:', error);
        res.status(500).send("Error fetching calendar data.");
    }
})

/* API LIKE FUNCTIONS*/
router.post('/', async (req, res) => {
    const userId = req?.session?.user?._id;
    const projectId = req?.session?.project?._id;
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})
    if (!projectId)
        return res.status(400).json({message:'No project selected.'})

    if (req.session?.project?.brief)
        return res.status(200).json({
            message: "Brief exists. Not generating a new one.", 
            data: req.session.project.brief
        })
    
    // TODO: something ig
    // Generate mission brief, store it, then send it
    const recentDumps = await BrainDump.find({_id: userId})
        .sort({date: -1})
        .limit(5)
        .lean()

    let brainDumps = []
    for (let dump of recentDumps) {
        brainDumps.push(dump.content)
    }

    if (brainDumps.length == 0) {
        return res.status(200).json({
            message: "Cannot create summary. No brain dumps exist.", 
            data: "Cannot create summary. No brain dumps exist."
        })
    }

    let prompt = 'I will provide you a set of \"brain dumps\." Each brain dump is a brief description of the user\'s work at a point in time. These brain dumps are ordered in descending order, wherein the first is the most recent, and the last is the least recent. Each brain dump will be separated with three consecutive colons or :::. Analyze these brain dumps and generate a concise summary of a maximum of three sentences. If there is no need to use three sentences, then use less sentences to describe the brain dumps. The generated summary should be a brief description of where the user last left off in terms of their work. Speak in the second person, refering to the user as \"You." Each generated sentence must end in a period. Following this sentence are each of the brain dumps in descending order.   '
    prompt += brainDumps.join(' ::: ')

    console.log(prompt)
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });
    
    // req.session.project.brief = "Generated text here";
    req.session.project.brief = response.text;

    return res.status(200).json({
        message: "Brief generated.", 
        data: req.session.project.brief
    })
})

module.exports = {
    missionBriefRouter: router
}
