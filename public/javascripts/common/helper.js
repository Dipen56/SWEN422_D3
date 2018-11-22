
/**
 * Calculates the success ratio based on the
 * win and losses. 
 * 
 * @param {number} wins 
 * @param {number} loss 
 */
function calculateSuccess(wins, loss){
    // calculate number of games
    let games = wins + loss;
    // calculate win rate
    let winRate = wins / games;
    // return as percentage
    return winRate * 100;
}