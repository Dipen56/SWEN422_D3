
/**
 * Splits the score into home and away form
 * 
 * @param {*} data 
 */
exports.transform = (data) => {
    var rawScore = data['Score'];
    var scores= rawScore.split(/[–-–-]/).map(x => clean(x));
    return {
        home: scores[0],
        away: scores[1]
    }
}

function clean(value){
    // trim the data first
    var res = value.trim();
    // remove all letters from the value
    var res = res.replace(/[a-zA-Z]+/gim, '');
    // extract the first value from the parenthesis
    var res = res.split(/[()]/)[0];
    // parse to integer
    return parseInt(res);
}