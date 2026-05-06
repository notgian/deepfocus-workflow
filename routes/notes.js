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

/* API Like functions */

// TODO require google passport authentication
router.get('/list', async (req, res) => {
    const userId = req?.session?.user?._id
    const projectId = req?.session?.project?._id
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})
    if (!projectId)
        return res.status(400).json({message:'No project selected.'})
    
    try {
        const foundNotes = await Notes.find({userId: userId, projectId}).lean()
        return res.status(200).json({message:"OK", data: foundNotes})
    } catch (err) {
        return res.status(500).json({message:"Something went wrong " + err})
    }
})

// TODO require google passport authentication
router.get('/:noteId', async (req, res) => {
    const userId = req?.session?.user?._id
    const projectId = req?.session?.project?._id
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})
    if (!projectId)
        return res.status(400).json({message:'No project selected.'})
    
    try {
        const foundNote = await Notes.findOne({_id: req.params.noteId}).lean()
        return res.status(200).json({message:"OK", data: foundNote})
    } catch (err) {
        return res.status(500).json({message:"Something went wrong " + err})
    }
})

router.post('/edit/:noteId', async (req, res) => {
    const userId = req?.session?.user?._id
    const projectId = req?.session?.project?._id

    const title = req?.body?.title;
    const content = req?.body?.content;
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})
    if (!projectId)
        return res.status(400).json({message:'No project selected.'})
    if (!title && !content)
        return res.status(400).json({message:'No title nor content provided.'})
    
    // Check first if note exists
    try {
        const foundNote = await Notes.findOne({_id: req.params.noteId}).lean()
        if (!foundNote)
            return res.status(404).json({message:"Note not found."})

        // Update if note exists
        const updateObj = {}
        if (title)
            updateObj['title'] = title
        if (content)
            updateObj['content'] = content
        const result = await Notes.findOneAndUpdate({_id: req.params.noteId}, updateObj)
    } catch (err) {
        return res.status(500).json({message:"Something went wrong " + err})
    }
})

module.exports = {
    notesRouter: router
}
