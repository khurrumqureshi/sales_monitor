var config = config = require('../config');
var express = require('express');
var mongoStore = require('connect-mongo')(express)

module.exports = function(db,app,passport){
    app.configure(function() {
        app.set('views', config.projectDirectory + '/views');
        app.set('view engine', 'ejs');
        app.use(express.logger('dev'));
        app.use(express.compress());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({
            store:new mongoStore({url: config.connectionString}),
            secret: 'secret'
        }));
        app.use(express.bodyParser());
        app.use(passport.initialize());
        app.use(passport.session());
    });

    app.configure('development', function() {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });
    app.configure('production', function() {
        app.use(express.errorHandler());
    });

    configureControllers(app);
    // Setup Express error handler middleware!
    app.use(function(err, req, res, next){
        res.send(err.code,{error:err.toString()});
    });
}

function configureControllers(app) {
    [
        'businessUnit', 'salesRep', 'authentication', 'distributor', 'brick', 'chemist', 'budget', 'sales'
    ].map(function(controllerName) {
            var controller = require('../controllers/' + controllerName);
            return controller.setup(app);
        });
}


