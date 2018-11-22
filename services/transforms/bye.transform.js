/**
 * Transform the bye string into an object which contains information about
 * the home and away teams.
 * 
 * @param {*} data 
 */
exports.transform = (data) => {
    // Extract the teams involved in the BYE
    var byeInfo = data['Date'];
    var byeComponents = byeInfo.split(':'); 
    var teamsInfo = byeComponents[1].trim();
    var teams = teamsInfo.split(' and ').map(x => x.trim());
    return {
        home: teams[0],
        away: teams[1]
    }
}