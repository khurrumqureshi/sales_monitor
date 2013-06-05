var businessUnitModel = require('../model/businessUnit'),
    config = require('../config'),
    customError = require('../lib/custom_errors');

exports.setup = function(app) {
    app.get('/api/businessUnit', getBusinessUnitList);
    app.post('/api/businessUnit', insertBusinessUnit);
}

/**
 * GET /api/businessUnit
 */
function getBusinessUnitList(req, res, next) {
    businessUnitModel.getBusinessUnits({},function(err, businessUnits){
        if(err)
            return next(err);

        res.send(businessUnits);
    })
}

/**
 * POST /api/businessUnit
 */
function insertBusinessUnit(req, res, next) {
    var data = req.param('business_unit',null);
    if(data!=null){
        businessUnitModel.addBusinessUnit(data,function(err,result){
            if(err)
                return next(err);

            res.send(result);
        })
    }
    else
        next(new customError.MissingParameter("Required parameter missing"));
}
