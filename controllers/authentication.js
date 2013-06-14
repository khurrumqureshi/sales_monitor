var passport = require('passport'),
    customError = require('../lib/custom_errors'),
    salesRepModel = require('../model/salesRep');

exports.setup = function(app) {
    app.get('/',title);
    app.get('/main',main);
    app.get('/bricks', brickSales)
    app.get('/trends', salesTrends)
    app.get('/logout', logout)
    app.post('/login', authenticate);
    app.post('/loginWeb', authenticateWeb);
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

function authenticateWeb(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err);}

        if (!user) {
            req.session.loginStatus = true;
            return res.redirect('/');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }

            salesRepModel.getSalesRep(user._id.toString(),function(err, salesRep){
                salesRepModel.incorporateSalesData(salesRep,function(newSalesRep){
                    req.session.loginStatus = false;
                    req.session.user = newSalesRep;
                    res.redirect('/main');
                })
            })
        });
    })(req, res, next);
};

function title(req, res, next){
    res.render('login',{loginFailure:typeof req.session.loginStatus == "undefined" ? false : req.session.loginStatus});
}

function main(req, res, next){
    res.render('main',{user:JSON.stringify(req.session.user ? req.session.user : {})});
}

function brickSales(req, res, next){
    res.render('bricks',{user:JSON.stringify(req.session.user ? req.session.user : {})});
}

function salesTrends(req, res, next){
    res.render('trends',{user:JSON.stringify(req.session.user ? req.session.user : {})});
}

function logout(req,res,next){
    req.session.user = {};
    req.logout();
    res.redirect('/');
}


