// -------- Data Transformations ---------

// this is used to store ordered teams based on there placing
var orderedReconstructedArray = [];

/**
 * This function is used to find the placing of the team.
 * @param data
 * @returns {{teamsResult: Array, seasonResult: {}}}
 */
function transformq1 (data){
    //Datasets that will be returned
    let teamsResult = [];
    let seasonResult = {};

    for(let year of Object.keys(data)){
        let dataset = data[year]; //dataset for each year/season
        let games = dataset.games;
        let teams = dataset.teams;
        let scores = dataset.scores;
        let rounds = dataset.rounds;

        var appendToTeams = (name, score, round, win, loss) => {
            let tmp = teamsResult[year]; //group data by year
            var numLoss = 1; //number of games lost
            if(win > loss){
                numLoss = 0;
            }
            if(tmp){
                let yearDat = tmp[name];
                if(yearDat){ //if particular team with requested name exists inside a particular year
                    tmp[name] = {
                        score: yearDat.score + score, //sum up score
                        final_placing: yearDat.final_placing + numLoss //calculate number of games won
                    };
                } else { // create new entry
                    tmp[name] = {
                        score,
                        final_placing: numLoss};
                }
            } else { // create a new entry
                teamsResult[year] = {};
                teamsResult[year][name] = {
                    score,
                    final_placing: numLoss
                }
            }
        }

        var appendToSeason = (name, season, win, loss) => {
            let tmp = seasonResult[name];
            if(tmp){ // season entry exists
                let yearDat = tmp[year];
                if(yearDat){ // year data exists
                    let seasonDat = yearDat[season];
                    if(seasonDat){ //season data exists
                        seasonResult[name][year][season] = {
                            wins: seasonDat.wins + win,
                            loss: seasonDat.loss + loss
                        }
                    } else { // create a new entry
                        seasonResult[name][year][season] = {
                            wins: win,
                            loss
                        }
                    }
                } else { // create a new entry
                    seasonResult[name][year] = {};
                    seasonResult[name][year][season] = {
                        wins: win,
                        loss
                    }
                }
            } else { // create new entry
                seasonResult[name] = {};
                seasonResult[name][year] = {};
                seasonResult[name][year][season] = {
                    wins: win,
                    loss
                };
            }
        }

        //Calculate size for each season
        let seasonSize = Object.keys(games).length / 3;

        // Build new dataset based on the games
        for(let gameId of Object.keys(games)){
            let game = games[gameId];
            let home = teams[game.home];
            let away = teams[game.away];
            let score = scores[game.score];
            let round = rounds[game.round];
            let season = determineSeason(gameId, seasonSize);
            createTeamEntry('home', home, score, round, appendToTeams);
            createTeamEntry('away', away, score, round, appendToTeams);
            createSeasonEntry('home', home, score, season, appendToSeason);
            createSeasonEntry('away', away, score, season, appendToSeason);
        }
    }

    return {
        teamsResult,
        seasonResult
    };
}

/**
 * this functions order the ranking of the teams for each season
 * @param teamresult
 * @returns {Array}
 */
function orderFinalPlacing(teamresult) {

    let tempOrderedArray = [];

    //Sort and Find final placing for each year
    for(let year of Object.keys(teamresult)) {
        let teamInfo = teamresult[year]; //Each team data

        for(let team of Object.keys(teamInfo)){
            let teamName = team;
            let teamStat = teamInfo[team];
            tempOrderedArray.push({teamName: teamName, teamStat});
        }

        //Sort based on score if final placing of teams are the same
        tempOrderedArray.sort(function (a,b) {
            if(a.teamStat.final_placing < b.teamStat.final_placing){
                return -1;
            }else if (a.teamStat.final_placing > b.teamStat.final_placing){
                return 1;
            }else{
                if (a.teamStat.score > b.teamStat.score) {
                    return -1;
                } else if (a.teamStat.score < b.teamStat.score) {
                    return 1;
                }
                return 0;
            }
        });

        //Find final placing for teams based on the temporary array that was sorted above
        for(let i = 0; i<tempOrderedArray.length;i++){
            let tempStatObject = {
                score: tempOrderedArray[i].teamStat.score,
                final_placing: i+1,
            }
            tempOrderedArray[i].teamStat = tempStatObject;
        }

        orderedReconstructedArray.push({year: year, teams: tempOrderedArray});
        tempOrderedArray = [];
    }
    return orderedReconstructedArray;
}

/**
 * Checks whether the team passed won or lost the season
 *
 * @param type
 * @param team
 * @param score
 * @param season
 * @param appendToSeason
 */
function createSeasonEntry(type, team, score, season, appendToSeason){
    // var appendToSeason = (name, season, win, loss)
    let other = type == 'home' ? 'away' : 'home';
    if(score[type] < score[other]){
        appendToSeason(team.name, season, 0, 1); // loss
    } else {
        appendToSeason(team.name, season, 1, 0); // win
    }
}

/**
 * Checks whether the game is inside the early, mid, or final season
 *
 * @param game
 * @param seasonSize
 */
function determineSeason(game, seasonSize){
    if(game < seasonSize - 1){
        return 'early';
    } else if(game < (seasonSize * 2) - 1){
        return 'mid';
    } else {
        return 'final';
    }
}

/**
 *  Checks if the given team has won or lost the round
 */
function createTeamEntry(type, team, score, round, appendToTeams) {
    let other = type == 'home' ? 'away' : 'home';
    if(score[type] < score[other]){
        appendToTeams(team.name, score[type], round, 0, 0); // loss
    } else if(score[type] > score[other]){
        appendToTeams(team.name, score[type], round, 2, 0); // win
    }

}

/**
 * changes the object and puts them in the form of an array
 * @param data
 * @returns {{years: Array, teams: Array}}
 */
function convertToD3(data){
    let years = [];
    let teams = [];
    for(let i in data){
        let year = data[i];
        years.push(year.year);
        for(let j in data[i].teams){
            let teamsData = data[i].teams;
            let team = teamsData[j];
            let indexTeam = -1;

            //Find existing team data in teams array
            for (let k = 0; k < teams.length; k++) {
                if (teams[k].team == team.teamName) {
                    indexTeam = k;
                    break;
                }
            }
            if(indexTeam != -1){ //if team already exists, update team data
                teams[indexTeam].values.push({year: year.year, final_placing: team.teamStat.final_placing});
            }else { // push new object to teams array if team not found
                teams.push({
                    team: team.teamName,
                    values: [{year: year.year, final_placing: team.teamStat.final_placing}]
                });
            }
        }
    }
    return {
        years,
        teams
    };

}

/**
 * Creates the correct format for the data that d3 can read
 * @param data
 * @returns {{labels: Array, series: Array}}
 */
function convertToD3Two(data) {
    var teamsdata = data.teams;
    var labels = [];
    var yearMap ={};
    for(let i of teamsdata){
        labels.push(i.team);
        let value = i.values;
        for(let v of value){
            let year = v.year;
            let yeardata = yearMap[year];
            if(!yeardata){
                yearMap[year] = [];
            }
            yearMap[year].push(v.final_placing);
        }
    }
    //comment build series
    var series = [];
    for(let year of Object.keys(yearMap)){
        let values = yearMap[year];
        series.push({label: year, values});
    }
    return {
        labels,
        series
    }
}