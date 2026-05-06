const express = require('express');

const Projects = require('../models/projects.js');

const router = express.Router();


// TODO require google passport authentication
// TODO replace the fake login with redirect to '/'
router.get('/open', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth/fakelogin')
        // return res.redirect('/')

    const projId = req.query?.pid 
    const foundProj = await Projects.findOne({_id:projId});
    
    // No project found
    if (!foundProj)
        return res.sendStatus(404)
    // Project specified does not belong to user
    if (foundProj.userId.toString() != req.session?.user._id) 
        return res.sendStatus(403)

    req.session.project = {
        _id: foundProj._id,
        projectName: foundProj.projectName
    }

    res.redirect('/project')
})

// TODO: route for checkout, which unsets

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
    res.render('userProject.hbs', {
        title: `${req.session.project.projectName} | Deepfocus Workflow`,
        project: req.session.project,
        user: req.session.user,
        // css: ['/css/projects.css'],
        // js: ['/js/projects.js'],
    })
})

module.exports = {
    userProjectRouter: router
}
