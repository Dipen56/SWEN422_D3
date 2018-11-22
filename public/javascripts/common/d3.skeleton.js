// -------- D3 Scripts ---------

/**
 * Creates a canvas inside the given selector
 * with the given dimensions.
 * 
 * @param {string} selector 
 * @param {number} width 
 * @param {number} height 
 */
function canvas(selector, width, height){
    return d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
}
