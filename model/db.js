var config = config = require('./../config');
var mongoose= require("mongoose");

module.exports.connectDb = function(callback){
    mongoose.connect(config.connectionString,config.dbOptions);
    var conn = mongoose.connection;

    //console.log(conn);
    conn.on('error', function(err){
        console.log(err);
        console.log('Error.. connecting to database');
        process.exit(1);
    });

    conn.once('open', function() {
        callback(conn);
    });


}
