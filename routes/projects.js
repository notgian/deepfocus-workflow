
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('projects.hbs', {
        title: 'Projects | Deepfocus Workflow',
        css: ['/css/projects.css']
    })
});

module.exports = {
    projectsRouter: router
}
