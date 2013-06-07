var salesModel = require('../model/sales'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    salesRepModel = require('../model/salesRep'),
    brickModel = require('../model/brick'),
    async = require('async'),
    chemistModel = require('../model/chemist'),
    utils = require('../lib/util');

exports.setup = function(app) {
    app.get('/api/sales', getSalesList);
    app.post('/api/sales', insertSales);
}

/**
 * GET /api/sales
 */
function getSalesList(req, res, next) {
    salesModel.getSales({},function(err, sales){
        if(err)
            return next(err);

        res.send(sales);
    })
}

/**
 * POST /api/sales
 */
function insertSales(req, res, next) {
    var data = req.param('sale',null);
    if(data!=null){
        salesModel.addSales(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}

module.exports.generateSales = function(callback){
    salesRepModel.getSalesRep("51af187e14dd4c101d00000a",function(err, salesReps){
        if(err)
            return callback(err);

        var cloneSalesRep =  salesReps.toObject();
        var now = new Date();
        var startDate = new Date(now.getFullYear(),now.getMonth()-2,10);
        async.forEachSeries(cloneSalesRep.businessUnitId.products,function(product,cb){
            async.forEachSeries(cloneSalesRep.bricks,function(brick,brickCb){
                chemistModel.getChemists({brickId:brick._id},function(err,chemists){
                    if(err)
                        brickCb();
                    else{
                        async.forEach(chemists,function(chemist,chemistCb){
                            var units = utils.getRandomInt(10,100);
                            var data = {
                                productId: product._id.toString(),
                                brickId: brick._id.toString(),
                                chemistId: chemist._id.toString(),
                                unitsSold: units,
                                unitsValue: units*product.price,
                                updatedDate: startDate.getTime(),
                                month: startDate.getMonth()+1,
                                year: startDate.getFullYear()
                            };
                            console.log(data);
                            salesModel.addSales(data,function(err,result){
                                chemistCb();
                            })
                        },function(err){
                            brickCb();
                        })
                    }
                })
            },function(err){
                cb();
            })
        },function(err){
            callback("Sales has been generated");
        })
    })
}