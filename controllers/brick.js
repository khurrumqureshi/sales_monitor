var brickModel = require('../model/brick'),
    config = require('../config'),
    customError = require('../lib/custom_errors');

exports.setup = function(app) {
    app.get('/api/brick', getBrickList);
    app.post('/api/brick', insertBrick);
}

/**
 * GET /api/brick
 */
function getBrickList(req, res, next) {
    brickModel.getBricks({},function(err, bricks){
        if(err)
            return next(err);

        res.send(bricks);
    })
}

/**
 * POST /api/brick
 */
function insertBrick(req, res, next) {
    var data = req.param('brick',null);
    if(data!=null){
        brickModel.addBrick(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}