
var teamPerformance = {};

/**
 * Maps the teams with the wins and losses when
 * they are playing in their home court (their own country)
 *
 * @param {*} data
 */
function transformQ3 (data){
    // var yearPerformance = {};
    // var nzTeams = [];
    // var ausTeams = [];

    for(let year of Object.keys(data)){
        let dataSetPerYear = data[year];
        let teams = dataSetPerYear.teams;
        let games = dataSetPerYear.games;
        let scores = dataSetPerYear.scores;
        var countries = dataSetPerYear.countries;
        for(let gamesid of Object.keys(games)){
            let game = games[gamesid];
            let scoreID = game.score;
            let score = scores[scoreID];
            findTeamPerformance(score, game, teams, countries);
        }
    }
    return convertToArray();
}

function findTeamPerformance(score, game, teams, countries){

    //Ids
    var homeTeamID = game.home;
    var awayTeamID = game.away;
    var homeTeamCountryID =  teams[homeTeamID].country;
    var awayTeamCountryID = teams[awayTeamID].country;

    //Names
    var homeTeamName = teams[homeTeamID].name;
    var awayTeamName = teams[awayTeamID].name;
    var homeTeamCountryName = countries[homeTeamCountryID];
    var awayTeamCountryName = countries[awayTeamCountryID];

    //Scores
    var homeTeamScore = score.home;
    var awayTeamScore = score.away;

    if(homeTeamScore < awayTeamScore){ //Home team loss
        appendTeamPerformance (homeTeamName, homeTeamCountryName, 0, 1, homeTeamScore);
        appendTeamPerformance(awayTeamName, awayTeamCountryName, 1, 0, awayTeamScore);
    }else if(homeTeamScore > awayTeamScore){ //Home team win
        appendTeamPerformance (homeTeamName, homeTeamCountryName, 1, 0, homeTeamScore);
        appendTeamPerformance(awayTeamName, awayTeamCountryName, 0, 1, awayTeamScore);
    }
}

function appendTeamPerformance(teamName, country, win, loss, score) {
    var successRatio;

    var calculate_success_ratio = function (win, loss) {
        if (win == 0) {
            return successRatio = 0;
        } else if (loss == 0) {
            return successRatio = 1;
        } else {
            return successRatio = (win / (win+loss)) * 100;
        }
    }

    var tempValue = this.teamPerformance[country];
    if (tempValue) {
        var team = tempValue[teamName];
        if(team){
            this.teamPerformance[country][teamName] = {
                wins: team.wins + win,
                loss: team.loss + loss,
                performance: calculate_success_ratio(team.wins + win, team.loss + loss),
                score: team.score + score
            }
        }else{
            this.teamPerformance[country][teamName] = {
                wins: win,
                loss: loss,
                performance: calculate_success_ratio(win, loss),
                score: score
            }
        }
    } else {
        this.teamPerformance[country] = {};
        this.teamPerformance[country][teamName] = {
            wins: win,
            loss: loss,
            performance: calculate_success_ratio(win, loss),
            score: score,
        }
    }
}

// -------- Data Transformations ---------

/**
 * Converts the results of the transform() function
 * into a structure which can be read by d3.
 *
 */
function convertToArray() {
    let teams = [];
    let countries = [];
    for(let country of Object.keys(this.teamPerformance)){
        let teamsData = this.teamPerformance[country];
        let teamName;
        for(let team of Object.keys(teamsData)){
            teamName = team;
            teams.push({
                teamName,
                country: country,
                wins: teamsData[team].wins,
                loss: teamsData[team].loss,
                performance: teamsData[team].performance,
                score: teamsData[team].score
            });
            if(!countries.includes(country)){
                countries.push(country);
            }

        }
    }

    teams.sort(function(a,b){return b.performance - a.performance});

    return {
        teams,
        countries
    };
}