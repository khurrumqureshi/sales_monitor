var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    utils = require('../lib/util');

var sales = new Schema({
    productId: Schema.Types.ObjectId,
    brickId: Schema.Types.ObjectId,
    chemistId: Schema.Types.ObjectId,
    unitsSold: Number,
    updatedDate: Number
});

var salesModel = mongoose.model('Sales', sales);

module.exports.addSales = function(data, callback){
    data.productId = ObjectId.fromString(data.productId);
    data.brickId = ObjectId.fromString(data.brickId);
    data.chemistId = ObjectId.fromString(data.chemistId);
    new salesModel(data).save(function(err){
        if(err)
            return callback(new customError.Database("Failed to save record."),null);

        callback(null,{status: "Record has been inserted"});
    })
}

module.exports.getSales = function(query, callback){
    salesModel.find(query,function(err, sales){
        if (err)
            return callback(new customError.Database("Failed to get records."),null);

        callback(null, sales);
    })
}

module.exports.getSalesByProducts = function(products,startPeriod,endperiod,callback){
    salesModel.aggregate(
        {
            $match: { productId: {$in: products}, updatedDate:{$gte:startPeriod,$lt:endperiod}}
        },
        { $group: { _id: '$productId', salesUnit: { $sum: '$unitsSold' }}},
        { $project: { _id: 1, salesUnit: 1 }},
        function (err, productSales){
            if(err)
            callback(err, null);
            else
            callback(null,productSales);
        })
}

module.exports.getSalesByBricks = function(bricks,startPeriod,endperiod,callback){
    salesModel.aggregate(
        {
            $match: { brickId: {$in: bricks}, updatedDate:{$gte:startPeriod,$lt:endperiod}}
        },
        { $group: { _id: '$brickId', salesUnit: { $sum: '$unitsSold' }}},
        { $project: { _id: 1, salesUnit: 1 }},
        function (err, brickSales){
            if(err)
                callback(err, null);
            else
                callback(null,brickSales);
        })
}

