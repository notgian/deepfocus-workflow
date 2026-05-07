const express = require('express');
const Token = require('../models/tokens');
const User = require('../models/users');
const { google } = require('googleapis');
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

        const renderOpts = {
            title: `Mission Brief | ${req.session.project.projectName}`,
            project: req.session.project,
            user: req.session.user,
            css: ['/css/userProjects.css', '/css/brief.css'],
            js: ['/js/userProjects.js', '/js/brief.js'],
        }

        if (allEvents.length > 0)
            renderOpts['events'] = allEvents;
        
        res.render('brief.hbs', renderOpts)

    } catch (error) {
        console.error('Calendar API Error:', error);
        res.status(500).send("Error fetching calendar data.");
    }


})

module.exports = {
    missionBriefRouter: router
}
