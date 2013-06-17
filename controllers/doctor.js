var doctorModel = require('../model/doctor'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    async = require('async'),
    utils = require('../lib/util'),
    salesRepModel = require('../model/salesRep');

exports.setup = function(app) {
    app.get('/api/doctor', getSalesRepDoctors);
    app.post('/api/doctor/create', createSalesRepDoctors);
    app.put('/api/doctor/:id', updateDoctor);
    app.post('/api/salesRep/:id/doctor', insertDoctor);
    app.delete('/api/doctor/:id', deleteDoctor);
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

                res.send(doctor);
            })
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}

/**
 * PUT /api/doctor/:id
 */

function updateDoctor(req, res, next){
    var data = req.param('doctor',null);
    if(data!=null){
        doctorModel.updateDoctor(req.params.id,{$set:data},function(err,doctor){
            if(err)
                return next(err);

            res.send(doctor);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}

/**
 * DELETE /api/doctor/:id
 */

function deleteDoctor(req, res, next){
    doctorModel.removeDoctor(req.params.id,function(err,result){
        if(err)
            return next(err);

        res.send(result);
    })
}

/**
 * GET /api/doctor
 */

function getSalesRepDoctors(req, res, next){
    res.send(req.session.user.doctors);
}

/**
 * POST /api/doctor/create
 */

function createSalesRepDoctors(req, res, next){
    console.log(req.body);
    res.send(req.body);
}