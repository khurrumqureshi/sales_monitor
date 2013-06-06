var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    utils = require('../lib/util');

var chemist = new Schema({
    name: String,
    address: String,
    distributorId: Schema.Types.ObjectId,
    brickId: Schema.Types.ObjectId
});

var chemistModel = mongoose.model('Chemists', chemist);

module.exports.addChemist = function(data, callback){
    data.distributorId = ObjectId.fromString(data.distributorId);
    data.brickId = ObjectId.fromString(data.brickId);
    new chemistModel(data).save(function(err){
        if(err)
            return callback(new customError.Database("Failed to save record."),null);

        callback(null,{status: "Record has been inserted"});
    })
}

module.exports.getChemists = function(query, callback){
    chemistModel.find(query,function(err, chemists){
        if (err)
            return callback(new customError.Database("Failed to get records."),null);

        callback(null, chemists);
    })
}

module.exports.getChemist = function(id, callback){
    chemistModel.findOne({ _id:ObjectId.fromString(id) },function(err, chemist){
        if (err)
            return callback(new customError.Database("Failed to get record."),null);

        callback(null, chemist);
    })
}

