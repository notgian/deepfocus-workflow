const express = require('express');

const Projects = require('../models/projects.js');

const router = express.Router();

// TODO require google passport authentication
// TODO replace the fake login with redirect to '/'
router.get('/', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth/fakelogin')
        // return res.redirect('/')
    // TODO: make an error page and this redirects to error page
    if (!req.session?.project)
        return res.redirect('/auth/fakelogin')
        // return res.redirect('/')
    res.render('dash.hbs', {
        title: `${req.session.project.projectName} | Deepfocus Workflow`,
        project: req.session.project,
        user: req.session.user,
        css: ['/css/userProjects.css'],
        js: ['/js/userProjects.js'],
    })
})

module.exports = {
    dashboardRouter: router
}
