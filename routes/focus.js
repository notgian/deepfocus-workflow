const express = require('express');

const Projects = require('../models/projects.js');
const { isUserSession, isUserProject } = require('../util/middlewares.js');

const router = express.Router();

// TODO require google passport authentication
router.get('/', [isUserSession, isUserProject], async (req, res) => {
    res.render('focus.hbs', {
        title: `Focus Timer | ${req.session.project.projectName}`,
        project: req.session.project,
        user: req.session.user,
        css: ['/css/userProjects.css', '/css/focus.css'],
        js: ['/js/userProjects.js', '/js/focus.js'],
    })
})

module.exports = {
    focusRouter: router
}
