# deepfocus-workflow


# How to run
First install dependencies.

```shell
npm install .
```

Then run the application.
```shell
# run dev build
npm run dev
# run prod build
npm run start
```






The DeepFocus Workflow: "The Cognitive Loop"
1. The Context Sync (The "Battery Check")
Action: The app syncs with your Google Calendar (or .ics upload).
Result: It calculates your Social Battery for the day. If you have 4 hours of meetings, your battery is "Low." If your day is clear, it’s "High."

2. The Project Load (The "Mission Brief")
Action: The user selects a project (e.g., “Thesis Backend”).
Result: Instead of opening 20 tabs, the app displays a Mission Brief. This is an AI-distilled summary of exactly where you left off last time, including the most important URL or file path you need. (This kills the "Startup Tax").
* implicit feature: user can take notes, save links/files or filepaths

3. The Adaptive Sprint (The "Work Session")
Action: User starts a focus timer.
Result: The timer automatically adjusts based on the Social Battery.
High Battery? 50-minute Deep Work session.
Low Battery? 20-minute Micro-sprint with a mandatory "no-screen" break suggested afterward.
* somewhat optional feature: play white noise w/in the web app

4. The Brain Dump (The "Save Game")
Action: When the user "Checks Out," you type one messy sentence about what you just did or what’s blocking you.
Result: The app saves this "State." Our AI cleans up your messy note into a professional "Mission Brief" that will be waiting for you the next time you pick up this project.
