var config = config = require('../config');

module.exports = function(app,express){
    app.configure(function() {
        app.use(express.logger('dev'));
        app.use(express.compress());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.bodyParser());
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

    //configureControllers(app);
    // Setup Express error handler middleware!
    app.use(function(err, req, res, next){
        res.send(err.code,{error:err.toString()});
    });
}

function configureControllers(app) {
    [
        'customer','job','product','employee'
    ].map(function(controllerName) {
            var controller = require('../controllers/' + controllerName);
            return controller.setup(app);
        });
}


