module.exports.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.getUniqueId = function ()
{
    return ((new Date()).getTime() + "" + Math.floor(Math.random() *
        1000000)).substr(0, 18);
};
