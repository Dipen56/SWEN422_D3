/**
 * This module is responsible for transforming dates that 
 * D3 is compatible with
 */

var moment = require('moment');

/**
 * Transforms the date into a format that 
 * 
 * @param {*} year 
 * @param {*} data 
 */
exports.transform = (year, data) => {
    var date = formatDate(year, data['Date']);
    var result = moment(date, 'YYYYMMDD').format('MMMM DD YYYY');
    return result;
}  

/**
 * Transforms the date field into the YYYYMMDD format
 * 
 * @param {*} data 
 */
function formatDate(year, data){
    var date = new Date(data);
    var rawMonth = date.getMonth() + 1;
    var month = rawMonth.toString().length < 2 ? '0' + rawMonth : rawMonth.toString();
    var date = date.getDate();
    var result = `${year}${month}${date}`;
    return result;
}