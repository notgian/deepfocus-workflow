const express = require('express');
const { google } = require('googleapis');
const User = require('../models/users'); 
const getGoogleClient = require('../utils/googleAuth');
const Projects = require('../models/projects.js');
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
            let totalDrainScore = 0;
            const DAILY_CAPACITY = 480;
            let batteryLevel = 100;
    
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
    
                        let weight = 0.5; // Default Baseline
                        const title = event.summary.toLowerCase();
                        const calName = (calendarNames[calId] || "").toLowerCase();
    
                        // Check Event Title
                        if (/exam|test|interview|pitch|defense/.test(title)) {
                            weight = 1.5;
                        } else if (/meeting|sync|call|class|lecture/.test(title)) {
                            weight = 1.0;
                        } else if (/focus|deep work|study|break/.test(title)) {
                            weight = 0.2;
                        }
                        // Check Calendar Name 
                        else if (/exam|assessment/.test(calName)) {
                            weight = 1.5;
                        } else if (/school|class|university/.test(calName)) {
                            weight = 1.0;
                        } else if (/work|project/.test(calName)) {
                            weight = 0.8;
                        }
    
                        // Score = Duration * Final Weight
                        totalDrainScore += (duration * weight);
    
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
    
                batteryLevel = Math.max(0, Math.min(100, Math.round(100 - (totalDrainScore / DAILY_CAPACITY * 100))));
                req.session.currentBattery = batteryLevel;
    
            }

            //GENERATE MESSAGES
            let energyStatus, energyAdvice, timerPreview;
            let isLowEnergy = false;

            if (batteryLevel >= 75) {
                energyStatus = "High Energy Day"
                timerPreview = "50-min session";
            } else if (batteryLevel >= 40) {
                energyStatus = "Moderate Energy Day";
                timerPreview = "25-min session";
            } else {
                energyStatus = "Low Energy Day";
                timerPreview = "15-min session";
                isLowEnergy = true;
            }

            // Persist to session for the Focus Timer route later
            req.session.currentBattery = batteryLevel;
            req.session.energyStatus = energyStatus;
            req.session.timerPreview = timerPreview;

            res.render('dash.hbs', {
                title: `Dashboard | ${req.session.project.projectName}`,
                project: req.session.project,
                user: req.session.user,
                css: ['/css/dash.css'], 
                js: ['/js/dash.js', '/js/sidebar.js'],
                
                batteryLevel: batteryLevel,
                energyStatus: energyStatus,
                timerPreview: timerPreview,
                isLowEnergy: isLowEnergy,
                events: allEvents
            });
    } catch (error) {
        console.error('Error in dashboard route:', error);
        res.status(500).send("Error loading dashboard data.");
    }   
});

module.exports = {
    dashboardRouter: router
}
