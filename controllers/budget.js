var budgetModel = require('../model/budget'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    businessUnitModel = require('../model/businessUnit'),
    async = require('async'),
    utils = require('../lib/util');

exports.setup = function(app) {
    app.get('/api/budget', getBudgetList);
    app.post('/api/budget', insertBudget);
}

/**
 * GET /api/budget
 */
function getBudgetList(req, res, next) {
   budgetModel.getBudgets({},function(err, budgets){
        if(err)
            return next(err);

        res.send(budgets);
    })
}

/**
 * POST /api/budget
 */
function insertBudget(req, res, next) {
    var data = req.param('budget',null);
    if(data!=null){
        budgetModel.addBudget(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}

module.exports.generateBudget = function(callback){
    businessUnitModel.getBusinessUnits({},function(err,businessUnits){
        if(err)
            return callback(err);

        async.forEach(businessUnits,function(businessUnit, cb){
            var cloneBusinessUnit =  businessUnit.toObject();
            var now = new Date();
            var startDate = new Date(now.getFullYear(),now.getMonth()-2,10);

            async.forEach(cloneBusinessUnit.products,function(product,productCallback){
                var units = utils.getRandomInt(800,1000);
                var data = {
                    productId: product._id.toString(),
                    units: units,
                    value: units*product.price,
                    month: startDate.getMonth()+1,
                    year: startDate.getFullYear()
                };
                budgetModel.addBudget(data,function(err,result){
                    productCallback();
                })
            },function(err){
                cb();
            })
        },function(err){
            callback("Finished");
        })
    })
}