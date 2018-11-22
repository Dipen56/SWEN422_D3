function transformQ1bD3(data){
    let seasonsRes = data.seasonResult;
    let yearMap = createYearMapping(seasonsRes);
    return toQ1bArray(yearMap);
}

/**
 * Transforms the success rating mapping into
 * an array.
 * 
 * @param {*} data 
 */
function toQ1bArray(data){
    let d3Results = [];
    for(let year of Object.keys(data)){
        let dataset = data[year];
        let values = [];
        for(let team of Object.keys(dataset)){
            let teamDat = dataset[team];
            let value = { team };
            for(let property of Object.keys(teamDat)){
                value[property] = teamDat[property];
            }
            values.push(value);
        }
        d3Results.push({
            year,
            values
        })
    }
    return d3Results;
}

/**
 * Maps each years to each team's success rating
 * for each portions of the season.
 * 
 * @param {*} data 
 */
function createYearMapping(data){
    
    // calculates total games
    let total = (wins, loss) => {
        return wins + loss;
    }

    // calculates success as a percentage
    let success = (wins, total) => {
        return (wins / total) * 100;
    }

    let map = {};

    let appendToMap = (year, team, early, mid, final, total) => {
        let yearEntry = map[year];
        if(yearEntry){
            yearEntry[team] = {
                early,
                mid,
                final,
                total
            };
        } else { // create a new entry
            map[year] = {};
            map[year][team] = {
                early,
                mid,
                final,
                total
            }
        }
    }

    for(let team of Object.keys(data)){
        let dataset = data[team];
        for(let year of Object.keys(dataset)){
            let yearDat = dataset[year];
            let eTotal = total(yearDat.early.wins, yearDat.early.loss);
            let mTotal = total(yearDat.mid.wins, yearDat.mid.loss);
            let fTotal = total(yearDat.final.wins, yearDat.final.loss);
            let sTotal = eTotal + mTotal + fTotal; // total games for the season
            // calculate success rates for early, mid, and final season
            let eSuccess = success(yearDat.early.wins, sTotal);
            let mSuccess = success(yearDat.mid.wins, sTotal);
            let fSuccess = success(yearDat.final.wins, sTotal);
            let tSuccess = eSuccess + mSuccess + fSuccess; // overall success rate
            appendToMap(year, team, eSuccess, mSuccess, fSuccess, tSuccess);
        }
    }
    return map;
}
