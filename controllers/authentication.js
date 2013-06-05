var passport = require('passport');

exports.setup = function(app) {
    app.get('/',title);
    app.get('/login',login);
    app.get('/logout', logout)
    app.post('/login',passport.authenticate('local', { failureRedirect: '/login' }), authenticate);
}

function authenticate(req, res, next){
    res.redirect('/');
};

function title(req, res, next){
    res.render('index', { user: req.user });
}

function login(req, res, next){
    res.render('login', { user: req.user });
}

function logout(req,res,next){
    req.logout();
    res.redirect('/');
}


