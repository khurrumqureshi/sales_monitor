var salesRepModel = require('../model/salesRep'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    async = require('async'),
    brickModel = require('../model/brick'),
    salesModel = require('../model/sales'),
    budgetModel = require('../model/budget'),
    utils = require('../lib/util'),
    ObjectId = require('mongoose').Types.ObjectId;

exports.setup = function(app) {
    app.get('/api/salesRep', getSalesRepList);
    app.get('/api/salesRep/:salesRep_id', getSalesRep);
    app.get('/api/salesRep/:id/salesTrend', getSalesTrend);
    app.post('/api/salesRep', insertSalesRep);
    app.post('/salesTrend', showSalesTrend);
    app.post('/salesTrend-iPad', showSalesTrendIPad);
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

        salesRepModel.incorporateSalesData(salesReps,function(newSalesRep){
            res.send(newSalesRep);
        })
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

/**
 * GET /api/salesRep/:id/salesTrend?startDate=4324324&endDate=423423342&productId=5242jh42kh
 */

function getSalesTrend(req, res, next){
    if(req.params.id && req.query.startDate && req.query.endDate){
        salesRepModel.getBasicSalesRep(req.params.id,function(err, salesRep){
            if(err)
                return next(err);

            var matchQuery = { brickId: {$in: salesRep.bricks}, updatedDate:{$gte:parseInt(req.query.startDate),$lt:parseInt(req.query.endDate)}};
            if(req.query.productId && req.query.productId.length>0)
                matchQuery["productId"] = ObjectId.fromString(req.query.productId);

            salesModel.getSalesTrends(matchQuery,function(err,sales){
                if(err)
                    return next(err);

                async.forEach(sales,function(sale,cb){
                    var budgetMatchQuery = { month: sale.month , year:sale.year};
                    if(req.query.productId && req.query.productId.length>0)
                        budgetMatchQuery["productId"] = ObjectId.fromString(req.query.productId);
                    budgetModel.getBudgetbyMonthbyYear(budgetMatchQuery,function(err,budget){
                        if(err || budget==null)
                            cb();
                        else{
                            sale["budgetUnits"] = budget.budgetUnits;
                            sale["budgetValue"] = budget.budgetValue;
                            sale["month"] = utils.getMonthName(sale.month);
                            sale["monthNumber"] = sale.month;
                            cb();
                        }
                    })
                },function(err){
                    res.send(sales);
                })
            })
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));

}

/**
 * POST /api/salesRep/salesTrend
 */

function showSalesTrend(req, res, next){
    getSalesTrends(req,function(err,sales){
        if(err)
        return next(err);

        res.render('trends',{sales:JSON.stringify(sales)});
    })
}

/**
 * POST /salesTrend-ipad
 */

function showSalesTrendIPad(req, res, next){
    getSalesTrends(req,function(err,sales){
        if(err)
            return next(err);

        res.render('trends-ipad',{sales:JSON.stringify(sales)});
    })
}

function getSalesTrends(req,callback){
    salesRepModel.getBasicSalesRep(req.session.user._id,function(err, salesRep){
        if(err)
            return callback(err,null);

        var matchQuery = { brickId: {$in: salesRep.bricks}, updatedDate:{$gte:(new Date(req.body.startDate)).getTime(),$lt:(new Date(req.body.endDate)).getTime()}};
        if(req.query.productId && req.query.productId.length>0)
            matchQuery["productId"] = ObjectId.fromString(req.query.productId);

        salesModel.getSalesTrends(matchQuery,function(err,sales){
            if(err)
                return callback(err,null);

            async.forEach(sales,function(sale,cb){
                var budgetMatchQuery = { month: sale.month , year:sale.year};
                if(req.query.productId && req.query.productId.length>0)
                    budgetMatchQuery["productId"] = ObjectId.fromString(req.query.productId);
                budgetModel.getBudgetbyMonthbyYear(budgetMatchQuery,function(err,budget){
                    if(err || budget==null)
                        cb();
                    else{
                        sale["budgetUnits"] = budget.budgetUnits;
                        sale["budgetValue"] = budget.budgetValue;
                        sale["month"] = utils.getMonthName(sale.month);
                        cb();
                    }
                })
            },function(err){
                callback(null,sales);
            })
        })
    })
}
