var salesRepModel = require('../model/salesRep'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    async = require('async'),
    brickModel = require('../model/brick');

exports.setup = function(app) {
    app.get('/api/salesRep', getSalesRepList);
    app.get('/api/salesRep/:salesRep_id', getSalesRep);
    app.post('/api/salesRep', insertSalesRep);
    app.put('/api/salesRep/:id/bricks', updateSalesRepBricks);
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

/**
 * PUT /api/salesRep/:id/bricks
 */

function updateSalesRepBricks(req, res, next) {
    var data = req.param('bricks',null);

    if(data!=null){
        async.forEach(data,function(brickId,cb){
            brickModel.getBrick(brickId,function(err, brick){
                if(err)
                cb();
                else{
                    salesRepModel.updateSalesRep(req.params.id,{$push:{bricks:brick}},function(err, result){
                        console.log(err);
                        cb();
                    })
                }
            })
        },function(err){
            res.send("Bricks has been added")
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}
