var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Schema = mongoose.Schema,
    customError = require('../lib/custom_errors'),
    budgetModel = require('../model/budget'),
    salesModel = require('../model/sales'),
    async = require('async');

var salesRepSchema = new Schema({
    firstName: String,
    lastName: String,
    designation: String,
    area: String,
    email: String,
    password: String,
    businessUnitId : {type:Schema.Types.ObjectId, ref:'BusinessUnit'},
    bricks: [{type:Schema.Types.ObjectId, ref:'Bricks'}],
    doctors: [{type:Schema.Types.ObjectId, ref:'Doctor'}]
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
    salesRepModel.findByIdAndUpdate(ObjectId.fromString(id),dataToUpdate,function(err, salesRep){
        if(err)
        return callback(new customError.Database("Failed to update record."),null);

        callback(null,'Record has been updated');
    })
}

module.exports.getSalesRep = function(id,callback){
    salesRepModel
        .findOne({ _id:ObjectId.fromString(id) })
        .populate('businessUnitId bricks Bricks.distributorId')
        .exec(function (err, salesRep) {
            if (err)
                return callback(new customError.Database("Failed to get record."),null);

           callback(null, salesRep)
        })
}

module.exports.getSalesReps = function(query, callback){
    salesRepModel
        .find(query)
        .populate('businessUnitId bricks')
        .exec(function (err, salesReps) {
            if (err)
                return callback(new customError.Database("Failed to get records."),null);

            callback(null, salesReps)
        })
}

module.exports.verifyCredentials = function(query,callback){
    salesRepModel.findOne(query,function(err,salesRep){
        if (err)
            return callback(new customError.Database("Failed to get record."),null);

        if(salesRep==null)
            callback(new customError.InvalidCredentials("Failed to verify credentials"),null);
        else
            callback(null, salesRep)
    })
}

module.exports.incorporateSalesData = function(salesReps, rootCallback){
    var cloneSalesRep =  salesReps.toObject();
    var now = new Date();
    var startDate = new Date(now.getFullYear(),now.getMonth(),1);

    async.parallel([
        function(callback){
            var products = [];
            for(var key in cloneSalesRep.businessUnitId.products)
                products.push(cloneSalesRep.businessUnitId.products[key]._id);

            salesModel.getSalesByProducts(products,startDate.getTime(),now.getTime(),function(err,productSales){
                if(err)
                    callback();
                else{
                    for(var key in cloneSalesRep.businessUnitId.products){
                        var product = cloneSalesRep.businessUnitId.products[key];
                        for(var salesKey in productSales){
                            if(productSales[salesKey]._id.toString()==product._id.toString()){
                                product["salesUnit"] = productSales[salesKey].salesUnit;
                                break;
                            }
                        }
                    }
                    callback();
                }
            })
        },
        function(callback){
            async.forEach(cloneSalesRep.businessUnitId.products,function(product,cb){
                budgetModel.getBudget({productId:product._id,month:(now.getMonth()+1),year:now.getFullYear()},function(err,budget){
                    if(err || budget==null)
                        cb();
                    else{
                        product["budgetUnits"] = budget.units;
                        cb();
                    }
                })
            },function(err){
                callback();
            })
        },
        function(callback){
            var bricks = [];
            for(var key in cloneSalesRep.bricks)
                bricks.push(cloneSalesRep.bricks[key]._id);

            salesModel.getSalesByBricks(bricks,startDate.getTime(),now.getTime(),function(err,brickSales){
                if(err)
                    callback();
                else{
                        for(var key in cloneSalesRep.bricks){
                            var brick = cloneSalesRep.bricks[key];
                            var temp = [];
                            for(var salesKey in brickSales){
                                if(brickSales[salesKey].brickId.toString()==brick._id.toString()){
                                    var product = getProductDetails(cloneSalesRep.businessUnitId.products,brickSales[salesKey].productId)
                                    temp.push({
                                        productName:product.productName,
                                        price:product.price,
                                        salesUnit:brickSales[salesKey].salesUnit
                                    });
                                }
                            }
                            brick["sales"] = temp;
                        }
                    callback();
                }
            })
        }
    ],
        function(err, results){
            rootCallback(cloneSalesRep);
        });
}

function getProductDetails(products,productId){
    var product = {};
    for(var key in products){
        if(products[key]._id.toString()==productId.toString()){
            product = products[key];
            break;
        }
    }
    return product;
}