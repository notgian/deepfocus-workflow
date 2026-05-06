const express = require('express');

const Projects = require('../models/projects.js');

const router = express.Router();

// TODO require google passport authentication
// TODO replace the fake login with redirect to '/'
router.get('/', async (req, res) => {
    if (!req.session.user)
        return res.redirect('/auth/fakelogin')
        // return res.redirect('/')
    
    // get user projects
    const projects = await Projects.find({
        userId: req.session.user._id 
    }).lean();

    res.render('projects.hbs', {
        title: 'Projects | Deepfocus Workflow',
        css: ['/css/projects.css'],
        js: ['/js/projects.js'],
        user: req.session.user,
        projects: projects
    })
});

router.get('/open', async (req, res) => {

})

/* API LIKE FUNCTIONS */

router.post('/', async (req, res) => {
    const projectName = req.body?.projectName;
    const projectDesc = req.body?.projectDesc || ''; 
    const userId = req?.session?.user?._id
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})
    if (!projectName)
        return res.status(400).json({message:'Incomplete fields: projectName is required.'})

    try {
        new Projects({
            userId: userId,
            projectName: projectName,
            projectDesc: projectDesc
        }).save();

        return res.status(200).json({message:'Project created successfuly.'})
    } catch (err) {
        return res.status(500).json({message: 'Server encountered an error. ' + err})
    }
})


module.exports = {
    projectsRouter: router
}
