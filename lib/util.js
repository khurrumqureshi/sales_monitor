module.exports.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.getUniqueId = function ()
{
    return ((new Date()).getTime() + "" + Math.floor(Math.random() *
        1000000)).substr(0, 18);
};

module.exports.cloneObject=function clone(obj){

    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); // changed (twice)

    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

module.exports.getMonthName = function(month){
    var monthName = "";
    switch(month){
        case 1:
            monthName="Jan";
            break;
        case 2:
            monthName="Feb";
            break;
        case 3:
            monthName="Mar";
            break;
        case 4:
            monthName="Apr";
            break;
        case 5:
            monthName="May";
            break;
        case 6:
            monthName="Jun";
            break;
        case 7:
            monthName="Jul";
            break;
        case 8:
            monthName="Aug";
            break;
        case 9:
            monthName="Sep";
            break;
        case 10:
            monthName="Oct";
            break;
        case 11:
            monthName="Nov";
            break;
        case 12:
            monthName="Dec";
            break;
        default:
            monthName="";
            break;
    }

    return monthName;
}
