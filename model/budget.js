var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    utils = require('../lib/util');

var budget = new Schema({
    productId: Schema.Types.ObjectId,
    units: Number,
    value: Number,
    month: Number,
    year: Number
});

var budgetModel = mongoose.model('Budgets', budget);

module.exports.addBudget = function(data, callback){
    data.productId = ObjectId.fromString(data.productId);
    new budgetModel(data).save(function(err){
        if(err)
            return callback(new customError.Database("Failed to save record."),null);

        callback(null,{status: "Record has been inserted"});
    })
}

module.exports.getBudgets = function(query, callback){
    budgetModel.find(query,function(err, budgets){
        if (err)
            return callback(new customError.Database("Failed to get records."),null);

        callback(null, budgets);
    })
}

module.exports.getBudget = function(query, callback){
    budgetModel.findOne(query,function(err, budget){
        if (err)
            return callback(new customError.Database("Failed to get record."),null);

        callback(null, budget);
    })
}

module.exports.getBudgetbyMonthbyYear = function(matchQuery,callback){
    budgetModel.aggregate(
        {
            $match: matchQuery
        },
        { $group: { _id: {year:'$year',month:'$month'}, budgetUnit: { $sum: '$units' }, budgetValue:{ $sum:'$value'}}},
        { $project: {
            _id: 0,
            year:'$_id.year',
            month:'$_id.month',
            budgetUnits: '$budgetUnit',
            budgetValue: '$budgetValue'
        }},
        function (err, budget){
            if(err)
                callback(err, null);
            else
                callback(null,budget && budget.length >0 ? budget[0] : null);
        })
}

