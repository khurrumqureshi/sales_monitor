var budgetModel = require('../model/budget'),
    config = require('../config'),
    customError = require('../lib/custom_errors');

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