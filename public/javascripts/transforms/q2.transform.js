/* This module transforms the raw data into an array which contains
 * the data needed in the home court advantage by teams graph
 */

/**
 * Maps the teams with the wins and losses when
 * they are playing in their home court (their own country)
 * 
 * @param {*} data 
 */
function transformQ2 (data){
    var teamsResult = {};

    for(let year of Object.keys(data)){
        var appendToTeams = (name, win, loss, country) => {
            let tmp = teamsResult[name];
            // if it exists, increment current win and loss value
            if(tmp){
                // check if the team has an entry for the year
                let yearDat = tmp[year];
                if(yearDat){ // entry exists, increment wins and loss
                    var newDat = {
                        wins: yearDat.wins + win,
                        loss: yearDat.loss + loss,
                        country
                    }
                    tmp[year] = newDat;
                } else { // create new entry
                    tmp[year] = {
                        wins: win,
                        loss,
                        country
                    }
                }
            } else { // create a new entry
                teamsResult[name] = {};
                teamsResult[name][year] = {
                    wins: win,
                    loss,
                    country
                }
            }
        }
        // Retrieve the data needed to transform data
        let dataset = data[year];
        let games = dataset.games;
        let teams = dataset.teams;
        let scores = dataset.scores;
        let venues = dataset.venues;
        // Build new dataset based on the games
        for(let gameId of Object.keys(games)){
            let game = games[gameId];
            let home = teams[game.home];
            let away = teams[game.away];
            let score = scores[game.score];
            let venue = venues[game.venue];
            createQ2TeamEntry('home', home, score, venue, appendToTeams); 
            createQ2TeamEntry('away', away, score, venue, appendToTeams);
        }
    }
    return teamsResult;
}

/**
 *  Checks if the given team has won or lost the round
 */
function createQ2TeamEntry(type, team, score, venue, appendToTeams) {
    let other = type == 'home' ? 'away' : 'home';
    let tCountry = team.country;
    let vCountry = venue.country;
    // check if the team is playing at home country
    if(tCountry == vCountry){
        if(score[type] < score[other]){
            appendToTeams(team.name, 0, 1, team.country); // loss
        } else if(score[type] > score[other]){
            appendToTeams(team.name, 1, 0, team.country); // win
        }
    }
}

/**
 * Converts the results of the transform() function
 * into a structure which can be read by d3.
 * 
 * It turns the 'year -> {win, loss}' mapping into an
 * array which has the schema of {year, wins, loss}.
 */
function transformQ2D3(data) {
    let years = [];
    let teams = [];
    for(let team of Object.keys(data)){
        let teamDat = data[team];
        let values = [];
        let country = 1;
        for(let year of Object.keys(teamDat)){
            let yearDat = teamDat[year];
            values.push({
                id: team,
                year: new Date(year),
                wins: yearDat.wins,
                loss: yearDat.loss
            });
            if(!years.includes(year)){
                years.push(year);
            }
            country = yearDat.country;
        }
        teams.push({
           id: team.replace(/[ ]/gim, '-'),
           country,
           values 
        })
    }
    years = years.map(x => { return { year: new Date(x) }; });
    return {
        years,
        teams
    };
}
