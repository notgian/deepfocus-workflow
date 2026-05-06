const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Token = require('../models/tokens');
const User = require('../models/users');
const getGoogleClient = require('../utils/googleAuth');

router.get('/', async (req, res) => {
   
    if (!req.session.user)
            return res.redirect('/auth/fakelogin')

    try {
        const user = await User.findById(req.session.user._id);
        
        const oauth2Client = await getGoogleClient(req.session.user._id);
        if (!oauth2Client) return res.redirect('/auth/google');

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // fetch calendars
        const listResponse = await calendar.calendarList.list();
        const calendarColors = {}; // event dot colors based on the set colors in google calendar settings  

        const calendars = listResponse.data.items.map(cal => {
            // Save color for the event dots later
            calendarColors[cal.id] = cal.backgroundColor; 

            return {            
                id: cal.id,
                summary: cal.summary,
                selected: (user.selectedCalendars || []).includes(cal.id),
                backgroundColor: cal.backgroundColor 
            };
        });

        console.log(calendars);

        let allEvents = [];

        // fetch events ONLY if the user has selected calendars
        const selectedList = user.selectedCalendars || [];
        if (selectedList.length > 0) {
            const eventPromises = selectedList.map(async (calId) => {
                const response = await calendar.events.list({
                    calendarId: calId,
                    timeMin: new Date().toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime'
                });

                // 3. Map Google data to match your HBS variable names
                return response.data.items.map(event => {
                    const start = new Date(event.start.dateTime || event.start.date);
                    const end = new Date(event.end.dateTime || event.end.date);
                    
                    return {
                        summary: event.summary,
                        startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        rawStart: start, // Used for sorting below
                        duration: Math.round((end - start) / 60000),
                        color: calendarColors[calId] || '--primary-blue' 
                    };
                });
            });

            const results = await Promise.all(eventPromises);
            // Flatten the nested arrays and sort chronologically
            allEvents = results.flat().sort((a, b) => a.rawStart - b.rawStart);
        }

         res.render('calendar.hbs', {
            title: 'Calendar | Deepfocus Workflow',
            css: ['/css/calendar.css'],
            user: req.session.user,
            calendars: calendars,
            events: allEvents
        });

    } catch (error) {
        console.error('Calendar API Error:', error);
        res.status(500).send("Error fetching calendar data.");
    }
});

router.post('/update-selection', async (req, res) => {
    try {        
        let selection = req.body.calendarIds || [];
   
        if (!Array.isArray(selection)) selection = [selection];

        // Save selection to the logged-in user's document
        await User.findByIdAndUpdate(req.session.user._id, { selectedCalendars: selection });        
        res.redirect('/calendar');

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update selection");
    }
});

module.exports = { 
    calendarRouter: router 
};