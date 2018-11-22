
/**
 * Retrieves the wins and losses of each team per season.
 * 
 * @param {*} data 
 */
function transformQ3b(data){
    let teamResults = {};

    for(let year of Object.keys(data)){
        // Call back function to append entry to the results
        let appendToResults = (name, win, loss) => {
            let yearDat = teamResults[year];
            if(yearDat){
                let teamDat = yearDat[name];
                if(teamDat){
                    yearDat[name] = {
                        wins: teamDat.wins + win,
                        loss: teamDat.loss + loss
                    }
                } else { // create new entry
                    yearDat[name] = {
                        wins: win,
                        loss
                    }
                }
            } else { // create new entry
                teamResults[year] = {};
                teamResults[year][name] = {
                    wins: win,
                    loss
                }
            }
        }
        // Retrieve all data information
        let dataset = data[year];
        let teams = dataset.teams;
        let games = dataset.games;
        let scores = dataset.scores;
        let venues = dataset.venues;
        // Create entries based on games
        for(let gameId of Object.keys(games)){
            let game = games[gameId];
            let score = scores[game.score];
            let home = teams[game.home];
            let away = teams[game.away];
            let venue = venues[game.venue];
            createQ3bEntry('home', home, score, venue, appendToResults);
            createQ3bEntry('away', away, score, venue, appendToResults);
        }
    }

    return transformQ3bArray(teamResults);
}

function createQ3bEntry(type, team, score, venue, appendToResults){
    let other = type == 'home' ? 'away' : 'home';
    let tCountry = team.country;
    let vCountry = venue.country;
    if(tCountry != vCountry){
        if(score[type] < score[other]){
            appendToResults(team.name, 0, 1); // loss
        } else {
            appendToResults(team.name, 1, 0); // win
        }
    }
}

function transformQ3bArray(data){
    let d3Results = [];
    let totalRes = {};
    for(let year of Object.keys(data)){
        let dataset = data[year];
        let values = [];
        for(let team of Object.keys(dataset)){
            let teamDat = dataset[team];
            let total = teamDat.wins + teamDat.loss
            values.push({
                team,
                wins: teamDat.wins,
                loss: teamDat.loss,
                total
            });
            // Retrieve total wins and losses
            let totalTeamDat = totalRes[team];
            if(!totalTeamDat){
                totalTeamDat = {
                    wins: 0,
                    loss: 0,
                    total: 0
                };
            }
            totalRes[team] = {
                team,
                wins: totalTeamDat.wins + teamDat.wins,
                loss: totalTeamDat.loss + teamDat.loss,
                total: totalTeamDat.total + total 
            };
        }
        d3Results.push({
            year,
            values
        });
    }
    // Process total results
    let values = [];
    for(let team of Object.keys(totalRes)){
        let dat = totalRes[team];
        values.push(dat);
    }
    d3Results.push({
        year: '2008 - 2013',
        values
    })
    return d3Results;
}