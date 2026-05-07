const express = require('express');

const Projects = require('../models/projects.js');
const { isUserSession, isUserProject } = require('../util/middlewares.js');

const router = express.Router();

// TODO require google passport authentication
router.get('/', [isUserSession, isUserProject], async (req, res) => {
    res.render('dash.hbs', {
        title: `Dashboard | ${req.session.project.projectName}`,
        project: req.session.project,
        user: req.session.user,
        css: ['/css/userProjects.css'],
        js: ['/js/userProjects.js'],
    })
})

module.exports = {
    dashboardRouter: router
}
