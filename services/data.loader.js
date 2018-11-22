/**
 * This module loads all the files and returns a relational data
 * structure to the user.
 */

var csv = require('csvtojson');
var pipeline = require('./pipeline');

const years = ['2008', '2009', '2010', '2011', '2012', '2013'];
const partial = 'Table1.csv';

exports.load = async () => {
    var result = {};

    // Transform CSV to JSON and map to year
    for(let year of years){
        let filename = `${year}-${partial}`;
        let filepath = __dirname + '/data/' + filename;
        var json = await csv().fromFile(filepath);
        result[year] = pipeline.toRelationalStructure(year, json);
    }

    return result;
}
