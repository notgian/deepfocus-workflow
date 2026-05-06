
const express = require('express');

const Projects = require('../models/projects.js');

const router = express.Router();

// TODO require google passport authentication
router.get('/', async (req, res) => {
    if (!req.session.user)
        return res.redirect('/auth/fakelogin')
    
    // get user projects
    const projects = await Projects.find({
        userId: req.session.user._id 
    }).lean();

    res.render('projects.hbs', {
        title: 'Projects | Deepfocus Workflow',
        css: ['/css/projects.css'],
        user: req.session.user,
        projects: projects
    })
});

module.exports = {
    projectsRouter: router
}
