// -------- D3 Scripts ---------

/**
 * Displays the team data as a line graph
 *
 * @param {*} data
 */
function displayQ3MultilineGraph(data){
    var container = document.getElementById('q3container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    // These parameters can shift the graph left, right, up, and down
    const margin = {top: 60, right: 250, bottom: 30, left: 100};
    // These parameters shift the legend of the graph
    const offset = {x: margin.left + 40, y: 50};
    // These parameters shift the title of the graph
    const tOffset = {x: 0, y: margin.top - 15};

    //Data
    let teams = data.teams;
    let countries = data.countries;

    let svg = canvas('#q3container', width, height);
    // content dimensions
    let cWidth = width - margin.left - margin.right;
    let cHeight = height - margin.top - margin.bottom;

    // Append graph title
    svg.append('text').html('Team Performance by Country')
        .attr('fill', 'white')
        .attr('x', cWidth / 2 + tOffset.x)
        .attr('y', tOffset.y);

    // Functions for defining the x,y axis values
    let x = d3.scaleBand()
        .rangeRound([0, cWidth])
        .paddingInner(0.05)
        .align(0.1);
    let y = d3.scaleLinear().range([cHeight, 0]);
    let z = d3.scaleOrdinal(d3.schemeCategory10); //colours

    let g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(teams.map(function(t) { return t.teamName; })); //Teams
    y.domain([0, 100]); //Performance
    z.domain(countries.map(c => { return c })); //Country

    // Append X and Y axis
    g.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(0,${cHeight})`)
        .call(d3.axisBottom(x))
        .append('text')
        .attr('x', cWidth / 1.75)
        .attr('dy', '3em')
        .attr('fill', 'white')
        .text('Teams');

    g.append('g')
        .attr('class', 'axis axis-y')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '-4rem')
        .attr('fill', 'white')
        .text('Performance (%)')
        .style('font-size', '1rem');

    // Draw Bars
    g.selectAll(".bar")
        .data(teams)
        .enter().append("rect")
        .attr("x", function(d) { return x(d.teamName); })
        .attr("y", function(d) { return y(d.performance); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return cHeight - y(d.performance); })
        .style('fill', d => {return z(d.country);})
        .style('opacity', 0.75)
        .attr('class', d => { return d.teamName.replace(/[ ]/gim, '-') + " " + d.country.replace(/[ ]/gim, '-'); })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

    // Draw legend
    let legend = svg.selectAll('.legend')
        .data(countries)
        .enter().append('g')
        .attr('class', d => { return `legend ${d.replace(/[ ]/gim, '-')}`;})
        .attr('transform', `translate(${offset.x}, ${offset.y})`);

    legend.append('rect')
        .attr('x', cWidth - 20)
        .attr('y', (d, i) => {
            return i * 20;
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', d => {
            return z(d);
        });

    legend.append('text')
        .attr('x', cWidth - 8)
        .attr('y', (d, i) => {
            return (i * 20) + 10;
        })
        .text(d => {
            return d;
        })
        .attr('fill', d => { let col = d == 'New Zealand' ? 'white' : '#f9e89a'; return col; })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

    // Draw Tooltips

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Mouse over effects

    function mouseout(d) {
        let dClass;
        let id;
        if(d.country){
            dClass = d.teamName.replace(/[ ]/gim, '-')
            id = d.country.replace(/[ ]/gim, '-');
        }else{
            dClass = d.replace(/[ ]/gim, '-');
            id = d.replace(/[ ]/gim, '-');
        }
        $(`.${dClass}`).css('opacity', 0.75);
        $(`#${id}`).css('stroke-width', '2px');
        $(`#${id}`).css('cursor', 'default');
        $(`.${id} text`).css('cursor', 'default');
        $(`.${id} text`).css('font-weight', 'normal');
        // Make tool-tip vanish
        tooltip.transition().duration(500).style('opacity', 0);
    }

    function mouseover(d) {
        let dClass;
        let id;
        if(d.country){
            dClass = d.teamName.replace(/[ ]/gim, '-')
            id = d.country.replace(/[ ]/gim, '-');
        }else{
            dClass = d.replace(/[ ]/gim, '-');
            id = d.replace(/[ ]/gim, '-');
        }
        $(`.${dClass}`).css('opacity', 1);
        let performance = d.performance;
        if(performance) { // display tooltip
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Performance (%): ${performance.toFixed(2)}%<br>Wins: ${d.wins}<br>Loss: ${d.loss}`)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        }
        $(`#${id}`).css('stroke-width', '6px');
        $(`#${id}`).css('cursor', 'pointer');
        $(`.${id} text`).css('cursor', 'pointer');
        $(`.${id} text`).css('font-weight', 'bolder');
    }
}