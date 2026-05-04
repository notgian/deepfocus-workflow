const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt')

require('dotenv').config()

// Configuration
// assume that for the test data we'll just use the dev db
const DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/dfw_dev`;

// Import Models
const User = require('../models/users');
const Project = require('../models/projects');
const Note = require('../models/notes');
const Activity = require('../models/activity');

/**
 * Drops all existing data in the relevant collections
 */
async function clearDatabase() {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Note.deleteMany({});
    await Activity.deleteMany({});
    console.log('--- Database Cleared ---');
}

/**
 * Creates n users
 * @returns {Array} Array of created user documents
 */
async function generateUsers(count=5) {
    const users = [];
    const SALT_ROUNDS = 10;
    const plainPassword = 'password';

    // Hash the password once outside the loop for efficiency 
    // unless you want unique passwords per user.
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    for (let i = 0; i < count; i++) {
        const user = await User.create({
            email: faker.internet.email(),
            local: { 
                password: hashedPassword 
            }
        });
        users.push(user);
    }
    
    console.log(`Generated ${users.length} Users (passwords hashed with bcrypt).`);
    return users;
}

/**
 * Creates 2-5 projects per user
 * @param {Array} users 
 * @returns {Array} Array of created project documents
 */
async function generateProjects(users) {
    const allProjects = [];
    for (const user of users) {
        const count = faker.number.int({ min: 2, max: 5 });
        for (let i = 0; i < count; i++) {
            const project = await Project.create({
                userId: user._id,
                projectName: faker.commerce.productName(),
                projectDesc: faker.company.catchPhrase()
            });
            allProjects.push(project);
        }
    }
    console.log(`Generated ${allProjects.length} Projects.`);
    return allProjects;
}

/**
 * Creates notes (including mandatory "Links" note) for each project
 * @param {Array} projects 
 */
async function generateNotes(projects) {
    let count = 0;
    for (const project of projects) {
        // Mandatory "Links" note
        await Note.create({
            userId: project.userId,
            projectId: project._id,
            title: 'Links',
            content: faker.internet.url()
        });

        // 1-5 Random notes
        const noteCount = faker.number.int({ min: 1, max: 5 });
        for (let i = 0; i < noteCount; i++) {
            await Note.create({
                userId: project.userId,
                projectId: project._id,
                title: faker.lorem.words(3),
                content: faker.lorem.paragraph()
            });
            count++;
        }
    }
    console.log(`Generated ${count + projects.length} Notes (including "Links").`);
}

/**
 * Creates activity across 10 days for each project
 * @param {Array} projects 
 */
async function generateActivity(projects) {
    const durations = [25, 40, 50];
    const MAX_MINUTES = 300; // 5 Hours

    for (const project of projects) {
        for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
            const activityDate = new Date();
            activityDate.setDate(activityDate.getDate() - (10 - dayOffset));
            activityDate.setHours(0, 0, 0, 0);

            const sessions = [];
            let currentDailyMinutes = 0;

            while (currentDailyMinutes < MAX_MINUTES) {
                const length = faker.helpers.arrayElement(durations);
                if (currentDailyMinutes + length > MAX_MINUTES) break;

                const start = new Date(activityDate);
                start.setHours(9 + Math.floor(currentDailyMinutes / 60), currentDailyMinutes % 60);
                
                const end = new Date(start);
                end.setMinutes(start.getMinutes() + length);

                sessions.push({
                    projectId: project._id,
                    length,
                    start,
                    end
                });

                currentDailyMinutes += length;
            }

            if (sessions.length > 0) {
                await Activity.create({
                    userId: project.userId,
                    date: activityDate,
                    focusTimes: sessions
                });
            }
        }
    }
    console.log('Generated activity logs for the last 10 days.');
}

/**
 * Orchestrator function
 */
async function runSeeder() {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB Connected.');

        await clearDatabase();
        
        const users = await generateUsers();
        const projects = await generateProjects(users);
        
        await generateNotes(projects);
        await generateActivity(projects);

        console.log('--- Seeding Process Complete ---');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await mongoose.connection.close();
    }
}

runSeeder();
