const express = require('express');

const Projects = require('../models/projects.js');
const BrainDump = require('../models/braindumps.js');
const Notes = require('../models/notes.js');


const { isUserSession } = require('../util/middlewares.js');

const router = express.Router();

// TODO require google passport authentication
// TODO replace the fake login with redirect to '/'
router.get('/', [isUserSession], async (req, res) => {
    // get user projects
    const projects = await Projects.find({
        userId: req.session.user._id 
    }).lean();
        
    // unset the open project; closing it
    req.session.project = undefined;

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

// TODO require google passport authentication
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

router.delete('/:projectId', async (req, res) => {
    const userId = req?.session?.user?._id
    
    if (!userId)
        return res.status(401).json({message:'Unauthorized'})

    try {
        const foundProject = await Projects.findOne({_id: req.params.projectId}).lean();

        if (!foundProject)
            return res.status(404).json({message:'Project does not exist.'})
        
        const deleteNotes = await Notes.deleteMany({projectId: req.params.projectId});
        const deleteDumps = await BrainDump.deleteMany({projectId: req.params.projectId});
        const deleteProject = await Projects.deleteOne({_id: req.params.projectId});

        return res.status(200).json({message:'Project deleted successfuly.'})
    } catch (err) {
        return res.status(500).json({message: 'Server encountered an error. ' + err})
    }
})


module.exports = {
    projectsRouter: router
}
