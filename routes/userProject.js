const express = require('express');

const Projects = require('../models/projects.js');
const { isUserSession } = require('../util/middlewares.js');

const router = express.Router();


// TODO require google passport authentication
router.get('/open', [isUserSession], async (req, res) => {
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

    res.redirect('/dash')
})

// TODO: route for checkout, which unsets

module.exports = {
    userProjectRouter: router
}
