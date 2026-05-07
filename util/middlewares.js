function isUserSession(req, res, next) {
    // TODO: this should redirect to '/' for the actual app
    if (!req.session?.user)
        return res.redirect('/auth/fakelogin')
        // return res.redirect('/')
    next()
}

function isUserProject (req, res, next) {
    // TODO: make an error page and this redirects to error page
    if (!req.session?.project)
        return res.redirect('/auth/fakelogin')
        // return res.redirect('/')
    next()
}

module.exports = {
    isUserSession: isUserSession,
    isUserProject: isUserProject
}
