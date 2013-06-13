var LocalStrategy = require('passport-local').Strategy
var salesRepModel = require('./../model/salesRep'),
    config = require('./../config');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            // asynchronous verification, for effect...
            //process.nextTick(function () {
               salesRepModel.verifyCredentials({email:username,password:password},function(err,user){
                   if (err) { return done(err); }
                   if (!user) { return done(null, false, { message: 'Invalid Credentials' }); }
                    return done(null, user);
                })
            //});
        }
    ));
}