var salesRepModel = require('../model/salesRep'),
    config = require('../config'),
    customError = require('../lib/custom_errors');

exports.setup = function(app) {
    app.get('/api/salesRep', getSalesRepList);
    app.get('/api/salesRep/:salesRep_id', getSalesRep);
    app.post('/api/salesRep', insertSalesRep);
}

/**
 * GET /api/salesRep
 */
function getSalesRepList(req, res, next) {
    salesRepModel.getSalesReps({},function(err, salesReps){
        if(err)
            return next(err);

        res.send(salesReps);
    })
}

/**
 * GET /api/salesRep/:salesRep_id
 */
function getSalesRep(req, res, next) {
    salesRepModel.getSalesRep(req.params.salesRep_id,function(err, salesReps){
        if(err)
            return next(err);

        res.send(salesReps);
    })
}

/**
 * POST /api/salesRep
 */
function insertSalesRep(req, res, next) {
    var data = req.param('sales_rep',null);

    if(data!=null){
        salesRepModel.addSalesRep(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}
