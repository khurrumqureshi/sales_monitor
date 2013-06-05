var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    utils = require('../lib/util');

var businessUnit = new Schema({
    name: String,
    description: String,
    products: [{
        productName: String,
        price: Number
    }]
});

var businessUnitModel = mongoose.model('BusinessUnit', businessUnit);

module.exports.addBusinessUnit = function(data, callback){
    new businessUnitModel({
        name:data.name,
        description:data.description,
        products:data.products
    }).save(function(err){
        if(err)
            return callback(new customError.Database("Failed to save record."),null);

        callback(null,{status: "Record has been inserted"});
    })
}

module.exports.getBusinessUnits = function(query, callback){
    businessUnitModel.find(query,function(err, businessUnits){
        if (err)
            return callback(new customError.Database("Failed to get records."),null);

        callback(null, businessUnits)
    })
}
