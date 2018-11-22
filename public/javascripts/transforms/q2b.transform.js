/* This module transforms the raw data into an array which contains
 * the data needed in the home court advantage by country graph
 */

/**
 * Maps countries to their wins and losses when they
 * are playing in their home country.
 * 
 * @param {*} data 
 */
function transformQ2b(data){
    let countryResult = {};

    for(let year of Object.keys(data)){
        var appendToResult = (name, win, loss) => {
            let tmp = countryResult[name];
            if(tmp){
                let yearDat = tmp[year];
                if(yearDat){
                    tmp[year] = {
                        wins: yearDat.wins + win,
                        loss: yearDat.loss + loss
                    }
                } else { // create a new entry
                    tmp[year] = {
                        wins: win,
                        loss
                    }
                }
            } else { // create a new entry
                countryResult[name] = {};
                countryResult[name][year] = {
                    wins: win,
                    loss
                }
            }
        }
        // Retrieve all the tables needed
        let dataset = data[year];
        let games = dataset.games;
        let teams = dataset.teams;
        let scores = dataset.scores;
        let venues = dataset.venues;
        let countries = dataset.countries;
        // Build new dataset based on games
        for(let gameId of Object.keys(games)){
            let game = games[gameId];
            let home = teams[game.home];
            let away = teams[game.away];
            let score = scores[game.score];
            let venue = venues[game.venue];
            createQ2bCountryEntry('home', home, score, venue, countries, appendToResult);
            createQ2bCountryEntry('away', away, score, venue, countries, appendToResult);
        }
    }
    return countryResult;
}

function createQ2bCountryEntry(type, team, score, venue, countries, appendToResult){
    // var appendToResult = (name, win, loss)
    let other = type == 'home' ? 'away' : 'home';
    let tCountry = team.country;
    let vCountry = venue.country;
    // check if the team is playing at home country
    if(tCountry == vCountry){
        if(score[type] < score[other]){
            appendToResult(countries[team.country], 0, 1); // loss
        } else if(score[type] > score[other]){
            appendToResult(countries[team.country], 1, 0); // win
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
function transformQ2bD3(data){
    let years = [];
    let countries = [];

    for(let country of Object.keys(data)){
        let countryDat = data[country];
        let values = [];
        for(let year of Object.keys(countryDat)){
            let yearDat = countryDat[year];
            values.push({
                id: country,
                year: new Date(year),
                wins: yearDat.wins,
                loss: yearDat.loss
            });
            if(!years.includes(year)){
                years.push(year);
            }
        }
        countries.push({
            id: country.replace(/[ ]/gim, '-'),
            values
        });
    }
    years = years.map(x => { return { year: new Date(x) }; });
    return {
        years,
        countries
    };
}