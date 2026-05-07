const express = require('express');

const Projects = require('../models/projects.js');
const BrainDump = require('../models/braindumps.js')
const { isUserSession, isUserProject } = require('../util/middlewares.js');

const router = express.Router();

// TODO require google passport authentication
router.get('/', [isUserSession, isUserProject], async (req, res) => {
    res.render('focus.hbs', {
        title: `Focus Timer | ${req.session.project.projectName}`,
        project: req.session.project,
        user: req.session.user,
        css: ['/css/userProjects.css', '/css/focus.css'],
        js: ['/js/userProjects.js', '/js/focus.js', '/js/sidebar.js'],
    })
})

/* API LIKE FUNCTION */
router.post('/dump', async (req, res) => {
    const userId = req?.session?.user?._id;
    const projectId = req?.session?.project?._id;
    const content = req?.body?.content;
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})
    if (!projectId)
        return res.status(400).json({message:'No project selected.'})
    if (!content)
        return res.status(400).json({message:'No content provided.'})
    
    try {
        const newDump = await BrainDump.create({
            userId: userId,
            projectId: projectId,
            date: new Date(),
            content: content
        })

        return res.status(200).json({message:"Braindump created successfully!", data: newDump})
    } catch (err) {
        return res.status(500).json({message:"Something went wrong " + err})
    }
})

module.exports = {
    focusRouter: router
}
