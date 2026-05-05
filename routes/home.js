const express = require('express');

const homeRoute = express.Router();

homeRoute.get('/', (req, res) => {
    res.render('index.hbs', {
        title: 'Deepfocus Workflow',
        css: ['/css/home.css']
    })
});


module.exports = {
    homeRoute: homeRoute
}
