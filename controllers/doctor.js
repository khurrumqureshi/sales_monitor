var doctorModel = require('../model/doctor'),
    config = require('../config'),
    customError = require('../lib/custom_errors'),
    async = require('async'),
    utils = require('../lib/util'),
    salesRepModel = require('../model/salesRep');

exports.setup = function(app) {
    app.get('/api/doctor', getSalesRepDoctors);
    app.post('/api/doctor/create', createSalesRepDoctors);
    app.post('/api/doctor/update', updateSalesRepDoctor);
    app.post('/api/doctor/delete', deleteSalesRepDoctor);
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
    salesRepModel.getSalesRep(req.session.user._id,function(err,salesRep){
        if(err)
        return next(err);

        res.send(salesRep.doctors);
    })

}

/**
 * POST /api/doctor/create
 */

function createSalesRepDoctors(req, res, next){
    var data = req.body;
    delete data._id;
    doctorModel.addDoctor(data,function(err,doctor){
        if(err)
            return next(err);

        salesRepModel.updateSalesRep(req.session.user._id,{$push:{doctors:doctor}},function(err,result){
            if(err)
                return next(err);

            res.send(doctor);
        })
    })
}

/**
 * POST /api/doctor/update
 */

function updateSalesRepDoctor(req, res, next){
    var data = req.body;
    delete data.__v;
    var doctorId = data._id;
    delete data._id;
    doctorModel.updateDoctor(doctorId,{$set:data},function(err,doctor){
        if(err)
            return next(err);

        res.send(doctor);
    })
}

/**
 * POST /api/doctor/delete
 */

function deleteSalesRepDoctor(req, res, next){
    var data = req.body;
    delete data.__v;
    var doctorId = data._id;
    delete data._id;
    doctorModel.removeDoctor(doctorId,function(err,doctor){
        if(err)
            return next(err);

        res.send(doctor);
    })
}