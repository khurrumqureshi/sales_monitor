var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors');

var businessUnit = new Schema({
    name: String,
    description: String,
    products: [{
        productId:Schema.types.ObjectId,
        productName: String,
        price: Number
    }]
});

var businessUnitModel = mongoose.model('BusinessUnit', businessUnit);

module.exports.addBusinessUnit = function(data, callback){
    var businessUnit = new businessUnitModel({name:data.name,description:data.description});
    for(var key in data.products){
        businessUnit.products.push({
            productId:new ObjectId(),
            productName: data.products[key].productName,
            price: data.products[key].price
        })
    }

    businessUnit.save(function(err){
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
