var config = config = require('./../config');
var mongoose= require("mongoose");

module.exports.connectDb = function(callback){
    mongoose.connect(config.connectionString,config.dbOptions);
    var conn = mongoose.connection;

    conn.on('error', function(){
        console.log('Error.. connecting to database');
        process.exit(1);
    });

    conn.once('open', function() {
        callback();
    });
}
