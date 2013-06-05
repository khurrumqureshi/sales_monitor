var distributorModel = require('../model/distributor'),
    config = require('../config'),
    customError = require('../lib/custom_errors');

exports.setup = function(app) {
    app.get('/api/distributor', getDistributorList);
    app.post('/api/distributor', insertDistributor);
}

/**
 * GET /api/distributor
 */
function getDistributorList(req, res, next) {
    distributorModel.getDistributors({},function(err, distributors){
        if(err)
            return next(err);

        res.send(distributors);
    })
}

/**
 * POST /api/distributor
 */
function insertDistributor(req, res, next) {
    var data = req.param('distributor',null);
    console.log(data);
    if(data!=null){
        distributorModel.addDistributor(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}