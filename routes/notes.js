const express = require('express');

const Projects = require('../models/projects.js');
const Notes = require('../models/notes.js');
const { isUserSession, isUserProject } = require('../util/middlewares.js');

const router = express.Router();

// TODO require google passport authentication
router.get('/', [isUserSession, isUserProject], async (req, res) => {
    res.render('notes.hbs', {
        title: `Dashboard | ${req.session.project.projectName}`,
        project: req.session.project,
        user: req.session.user,
        css: ['/css/userProjects.css', '/css/notes.css'],
        js: ['/js/userProjects.js', '/js/notes.js'],
    })
})

module.exports = {
    notesRouter: router
}
