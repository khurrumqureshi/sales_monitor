var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    utils = require('../lib/util'),
    chemistModel = require('./chemist'),
    async = require('async');

var doctor = new Schema({
    name: String,
    address: String,
    phone: Number,
    email: String,
    speciality: String
    //chemists: [{type:Schema.Types.ObjectId, ref:'Chemists'}]
});

var doctorModel = mongoose.model('Doctors', doctor);

module.exports.addDoctor = function(data, callback){
//    var chemists = [];
//    async.forEach(data.chemists,function(chemistId,cb){
//        chemistModel.getChemist(chemistId,function(err,chemist){
//            if(err)
//                cb();
//            else{
//                chemists.push(chemist);
//                cb();
//            }
//        })
//    },function(err){
        //data.chemists = chemists;
        new doctorModel(data).save(function(err, doctor){
            if(err)
                return callback(new customError.Database("Failed to save record."),null);

            callback(null,doctor);
        })
    //})
}

module.exports.getDoctors = function(query, callback){
//    doctorModel
//        .find(query)
//        .populate('chemists')
//        .exec(function (err, doctors) {
//            if (err)
//                return callback(new customError.Database("Failed to get records."),null);
//
//            callback(null, doctors)
//        })

    doctorModel.find(query,function(err,doctors){
        if (err)
            return callback(new customError.Database("Failed to get records."),null);

        callback(null, doctors)
    })
}

//module.exports.getDoctor = function(id, callback){
//    doctorModel
//        .findOne({ _id:ObjectId.fromString(id) })
//        .populate('chemists')
//        .exec(function (err, doctor) {
//            if (err)
//                return callback(new customError.Database("Failed to get record."),null);
//
//            callback(null, doctor)
//        })
//}