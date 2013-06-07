var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    utils = require('../lib/util');

var brick = new Schema({
    name: String,
    distributorId: {type:Schema.Types.ObjectId, ref:'Distributors'},
    location: {lat: Number, long: Number}
});

var brickModel = mongoose.model('Bricks', brick);

module.exports.addBrick = function(data, callback){
    data.distributorId = ObjectId.fromString(data.distributorId);
    new brickModel(data).save(function(err){
        if(err)
            return callback(new customError.Database("Failed to save record."),null);

        callback(null,{status: "Record has been inserted"});
    })
}

module.exports.getBricks = function(query, callback){
    brickModel
        .find(query)
        .populate('distributorId')
        .exec(function (err, bricks) {
            if (err)
                return callback(new customError.Database("Failed to get records."),null);

            callback(null, bricks)
        })
}

module.exports.getBrick = function(id, callback){
    brickModel.findOne({ _id:ObjectId.fromString(id) },function(err, brick){
        if (err)
            return callback(new customError.Database("Failed to get record."),null);

        callback(null, brick);
    })
}
