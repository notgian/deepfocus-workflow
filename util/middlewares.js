const User = require('../models/users.js');

function isUserSession(req, res, next) {
    // TODO: this should redirect to '/' for the actual app
    if (!req.session?.passport?.user) {
        console.log('NO USER? ', req.session?.passport?.user)
        // return res.redirect('/auth/fakelogin')
        return res.redirect('/')
    }

    // set req.session.user
    if (!req.session?.user) {
        User.findOne({_id: req.session.passport.user}).then( (user) => {
            console.log("--------> ", user, " | ", req.session.passport.user)
            req.session.user = user
            req.session.save( (err) => {
                next()
            }) 
        })
    } 
    else 
        next()
    
}

function isUserProject (req, res, next) {
    // TODO: make an error page and this redirects to error page
    if (!req.session?.project)
        // return res.redirect('/auth/fakelogin')
        return res.redirect('/')
    next()
}

module.exports = {
    isUserSession: isUserSession,
    isUserProject: isUserProject
}
