var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors');

var salesRepSchema = new Schema({
    firstName: String,
    lastName: String,
    designation: String,
    area: String,
    email: String,
    password: String,
    businessUnitId : {type:Schema.types.ObjectId, ref:'BusinessUnit'},
    bricks: [{type:Schema.types.ObjectId, ref:'Brick'}],
    doctors: [{type:Schema.types.ObjectId, ref:'Doctor'}]
});

var salesRepModel = mongoose.model('SalesRep', salesRepSchema);

module.exports.addSalesRep = function(data,callback){
    new salesRepModel({
        firstName: data.firstName,
        lastName: data.lastName,
        designation: data.designation,
        area: data.area,
        email: data.email,
        password: data.password,
        businessUnitId: ObjectId.fromString(data.businessUnitId)
    }).save(function(err){
            if(err)
            return callback(new customError.Database("Failed to save record."),null);

            callback(null,{status: "Record has been inserted"});
        })
}

module.exports.updateSalesRep = function(id,dataToUpdate,callback){
    salesRepModel.update({_id:ObjectId.fromString(id)},dataToUpdate,function(err, numberAffected, raw){
        if(err)
        return callback(new customError.Database("Failed to update record."),null);

        callback(null,'Record has been updated');
    })
}

module.exports.getSalesRep = function(id,callback){
    salesRepModel
        .findOne({ _id:ObjectId.fromString(id) })
        .populate('businessUnitId')
        .exec(function (err, salesRep) {
            if (err)
                return callback(new customError.Database("Failed to get record."),null);

           callback(null, salesRep)
        })
}

module.exports.getSalesReps = function(query, callback){
    salesRepModel
        .find(query)
        .populate('businessUnitId')
        .exec(function (err, salesReps) {
            if (err)
                return callback(new customError.Database("Failed to get records."),null);

            callback(null, salesReps)
        })
}