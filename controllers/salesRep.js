var salesRepModel = require('../model/salesRep'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    async = require('async'),
    brickModel = require('../model/brick'),
    budgetModel = require('../model/budget'),
    salesModel = require('../model/sales');

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

        var cloneSalesRep =  salesReps.toObject();
        var now = new Date();
        var startDate = new Date(now.getFullYear(),now.getMonth(),1);

        async.parallel([
            function(callback){
                var products = [];
                for(var key in cloneSalesRep.businessUnitId.products)
                    products.push(cloneSalesRep.businessUnitId.products[key]._id);

                salesModel.getSalesByProducts(products,startDate.getTime(),now.getTime(),function(err,productSales){
                    if(err)
                    callback();
                    else{
                        for(var key in cloneSalesRep.businessUnitId.products){
                            var product = cloneSalesRep.businessUnitId.products[key];
                            for(var salesKey in productSales){
                                if(productSales[salesKey]._id.toString()==product._id.toString()){
                                    product["salesUnit"] = productSales[salesKey].salesUnit;
                                    break;
                                }
                            }
                        }
                        callback();
                    }
                })
            },
            function(callback){
                async.forEach(cloneSalesRep.businessUnitId.products,function(product,cb){
                    budgetModel.getBudget({productId:product._id,month:(now.getMonth()+1),year:now.getFullYear()},function(err,budget){
                        if(err || budget==null)
                            cb();
                        else{
                            product["budgetUnits"] = budget.units;
                            cb();
                        }
                    })
                },function(err){
                    callback();
                })
            },
            function(callback){
                var bricks = [];
                for(var key in cloneSalesRep.bricks)
                    bricks.push(cloneSalesRep.bricks[key]._id);

                salesModel.getSalesByBricks(bricks,startDate.getTime(),now.getTime(),function(err,brickSales){
                    if(err)
                        callback();
                    else{
                        for(var key in cloneSalesRep.bricks){
                            var brick = cloneSalesRep.bricks[key];
                            for(var salesKey in brickSales){
                                if(brickSales[salesKey]._id.toString()==brick._id.toString()){
                                    brick["salesUnit"] = brickSales[salesKey].salesUnit;
                                    break;
                                }
                            }
                        }
                        callback();
                    }
                })
            }
        ],
            function(err, results){
                res.send(cloneSalesRep);
            });
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
