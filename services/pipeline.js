var dateTransform = require('./transforms/date.transform');
var byeTransform = require('./transforms/bye.transform');
var scoreTransform = require('./transforms/score.transform');
var countries = require('./countries.data');

/**
 * This module is responsible for transforming the json data into
 *  a relational data structure.
 */

let teamsTableID = 0;
let scoreTableID = 0;
let venueTableID = 0; 
let byesTableID = 0;
let roundTableID = 0;
let gamesTableID = 0;

// Mappings
let teamToID = {};
let idToTeam = {};

let venueToID = {};
let idToVenue = {}

let byesTable = {};
let scoreTable = {};
let roundTable = {};
let gamesTable = {};

/**
 * Converts the JSON data into a relational data structure
 * 
 * @param {*} json 
 */
exports.toRelationalStructure = (year, data) => {
    clearTables();
    for(var item of data){
        if(isBye(item)){
            var byeInfo = byeTransform.transform(item);
            // change team info to ids
            var byeEntry = {
                round: item['Round'],
                home: toTeamID(byeInfo.home),
                away: toTeamID(byeInfo.away)
            }
            // push to the table
            byesTable[byesTableID] = byeEntry;
            byesTableID++;
        } else {
            // Extract and uniformise fields
            const date = dateTransform.transform(year, item);
            const score = scoreTransform.transform(item);
            const home = fix(item['Home Team']);
            const away = fix(item['Away Team']);
            const venue = fix(item['Venue']);
            const round = item['Round'];
            appendGameInfo(round, date, score, home, away, venue);
        }
    }
    var result = mergeTables();
    return result;
}

function fix(str){
    return str.trim().replace('[^A-Za-z0-9]', '');
}

function mergeTables(){
    var result = {
        countries: countries.countries,
        games: gamesTable,
        teams: idToTeam,
        venues: idToVenue,
        scores: scoreTable,
        rounds: roundTable,
        byes: byesTable
    };
    return result;
}

function appendGameInfo(round, date, score, home, away, venue){
    // Create a unique id
    var id = gamesTableID;
    gamesTableID++;
    // Create a new entry for the games table
    const gamesEntry = {
        id,
        home: toTeamID(home),
        away: toTeamID(away),
        score: toScoreID(score),
        venue: toVenueID(venue),
        round: toRoundID(round, date)
    }
    // Push into the table
    gamesTable[id] = gamesEntry;
    return id;
}

/**
 * Appends the home and away score into the 
 * score table and returns the score id associated
 * to the new entry.
 * 
 * @param {*} score 
 */
function toScoreID(score){
    // Create a unique id
    var id = scoreTableID;
    scoreTableID++;
    // Push new entry into the scores table
    const scoreEntry = {
        id,
        home: score.home,
        away: score.away
    }
    // Push into the table
    scoreTable[id] = scoreEntry;
    return id;
}

/**
 * Creates a round ID and also pushes the round information into the
 * rounds table.
 * 
 * @param {*} round 
 * @param {*} date 
 */
function toRoundID(round, date){
    // Create a unique id
    var id = roundTableID;
    roundTableID++;
    // Push new entry into the rounds table
    const roundEntry = {
        id,
        round,
        date
    }
    // push into the table
    roundTable[id] = roundEntry;
    return id;
}


/**
 * If the venue exists in the venues table, it returns the venue ID,
 * otherwise it creates a new venue ID and then appends the venue information
 * into the tables.
 * 
 * @param {*} venue 
 */
function toVenueID(venue){
    var venueID = venueToID[venue];
    if(venueID == null){ // venue not added yet
        venueID = venueTableID;
        venueTableID++;
        // Create the entry
        const venueEntry = {
            name: venue,
            country: countries.getCountryIDFromVenue(venue)
        }
        // append to tables
        venueToID[venue] = venueID;
        idToVenue[venueID] = venueEntry;
    }
    return venueID;
}

/**
 * If the team name exists in the teams table, it returns the respective team ID,
 * otherwise it creates a new team ID and then appends the team information into
 * the tables.
 * 
 * @param {*} team 
 */
function toTeamID(team){
    var teamID = teamToID[team];
    if(teamID == null){ // team not added yet
        teamID = teamsTableID;
        teamsTableID++;
        // Create the entry
        const teamEntry = {
            name: team,
            country: countries.getCountryIDFromTeam(team)
        }
        // append to tables
        teamToID[team] = teamID;
        idToTeam[teamID] = teamEntry;
    }
    return teamID;
}

function clearTables (){
    teamsTableID = 0;
    scoreTableID = 0;
    venueTableID = 0;
    byesTableID = 0;
    roundTableID = 0;
    gamesTableID = 0;
    teamToID = {};
    idToTeam = {};
    venueToID = {};
    idToVenue = {}
    byesMap = {};
    scoreTable = {};
    roundTable = {};
    gamesTable = {};
}

function isBye(data){
    return isNaN(new Date(data['Date']));
}