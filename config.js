/**
 * API configs
 */

module.exports.main = {
    port: process.env.PORT || 3000,
    httpsPort:443,
    debug: true,
    version: "0.1"
};

module.exports.dbOptions = {
    server:{
        'auto_reconnect': true,
        'poolSize': 20,
        'socketOptions': {keepAlive: 60}
    }
};

module.exports.connectionString = 'mongodb://admin:admin123@widmore.mongohq.com:10010/Sales'
//module.exports.connectionString = 'mongodb://localhost:27017/Sales'

module.exports.projectDirectory = __dirname;