var chemistModel = require('../model/chemist'),
    config = require('../config'),
    customError = require('../lib/custom_errors');

exports.setup = function(app) {
    app.get('/api/chemist', getChemistList);
    app.post('/api/chemist', insertChemist);
}

/**
 * GET /api/chemist
 */
function getChemistList(req, res, next) {
    chemistModel.getChemists({},function(err, chemists){
        if(err)
            return next(err);

        res.send(chemists);
    })
}

/**
 * POST /api/chemist
 */
function insertChemist(req, res, next) {
    var data = req.param('chemist',null);
    if(data!=null){
        chemistModel.addChemist(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}
