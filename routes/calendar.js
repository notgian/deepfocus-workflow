const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Token = require('../models/tokens');
const User = require('../models/users');

router.get('/', async (req, res) => {
   
    if (!req.session.user)
            return res.redirect('/auth/fakelogin')

    try {
        const user = await User.findById(req.session.user._id);
        const tokenData = await Token.findOne({ userId: req.session.user._id });

        if (!tokenData) return res.redirect('/auth/google');

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );

        oauth2Client.setCredentials({
            access_token: tokenData.accessTok,
            refresh_token: tokenData.refreshTok
        });

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
                selected: user.selectedCalendars.includes(cal.id),
                backgroundColor: cal.backgroundColor 
            };
        });

        console.log(calendars);

        let allEvents = [];

        // fetch events ONLY if the user has selected calendars
        if (user.selectedCalendars && user.selectedCalendars.length > 0) {
            const eventPromises = user.selectedCalendars.map(async (calId) => {
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