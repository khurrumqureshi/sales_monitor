var doctorModel = require('../model/doctor'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    async = require('async'),
    utils = require('../lib/util'),
    salesRepModel = require('../model/salesRep');

exports.setup = function(app) {
    app.get('/api/doctor', getDoctorList);
    app.post('/api/salesRep/:id/doctor', insertDoctor);
}

/**
 * GET /api/doctor
 */
function getDoctorList(req, res, next) {
    doctorModel.getDoctors({},function(err, doctors){
        if(err)
            return next(err);

        res.send(doctors);
    })
}

/**
 * POST /api/salesRep/:id/doctor
 */
function insertDoctor(req, res, next) {
    var data = req.param('doctor',null);
    if(data!=null){
        doctorModel.addDoctor(data,function(err,doctor){
            if(err)
                return next(err);

            salesRepModel.updateSalesRep(req.params.id,{$push:{doctors:doctor}},function(err,result){
                if(err)
                    return next(err);

                res.send({status:"Record has been inserted."});
            })
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}

