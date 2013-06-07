var passport = require('passport'),
    customError = require('../lib/custom_errors'),
    salesRepModel = require('../model/salesRep');

exports.setup = function(app) {
    app.get('/',title);
    app.get('/login',login);
    app.get('/logout', logout)
    app.post('/login', authenticate);
}

function authenticate(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return next(new customError.InvalidCredentials("Failed to verify credentials"));
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }

            salesRepModel.getSalesRep(user._id.toString(),function(err, salesRep){
                salesRepModel.incorporateSalesData(salesRep,function(newSalesRep){
                    return res.send(newSalesRep);
                })
            })

        });
    })(req, res, next);
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


