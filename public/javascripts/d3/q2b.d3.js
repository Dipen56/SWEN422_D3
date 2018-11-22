/* This module contains D3 scripts for the second bullet point of the SWEN 422 assignment.
 * It draws a graph which shows the home court performance of each country over time.
 */

 function displayQ2bMultilineGraph(data){
    var container = document.getElementById('q2container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    // These parameters can shift the graph left, right, up, and down
    const margin = {top: 60, right: 250, bottom: 30, left: 100};
    // These parameters shift the legend of the graph
    const offset = {x: margin.left + 40, y: 50};
    // These parameters shift the title of the graph
    const tOffset = {x: 0, y: margin.top - 15}
    // Country toggles
    const toggleCountry = {};

    let countries = data.countries;
    let years = data.years;

    let svg = canvas('#q2bcontainer', width, height);
    // content dimensions
    let cWidth = width - margin.left - margin.right;
    let cHeight = height - margin.top - margin.bottom;
    let g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Append graph title
    svg.append('text').html('Home court performance of each country over time')
    .attr('fill', 'white')
    .attr('x', cWidth / 2 + tOffset.x)
    .attr('y', tOffset.y);

    // Functions for defining the x,y,z axis

    let x = d3.scaleTime().range([0, cWidth]);
    let y = d3.scaleLinear().range([cHeight, 0]);
    let z = d3.scaleOrdinal(d3.schemeCategory10); // generates colours

    let line = d3.line().curve(d3.curveCardinal)
    .x(d => { return x(d.year); })
    .y(d => { let success = calculateSuccess(d.wins,d.loss); return y(success); });

    x.domain(d3.extent(years, d => { return d.year }));
    y.domain([0,100]);
    z.domain(countries.map(c => { return c.id }));

    // Draw axis lines

    g.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', `translate(0,${cHeight})`)
    .call(d3.axisBottom(x))
    .append('text')
    .attr('x', cWidth / 1.75)
    .attr('dy', '3em')
    .attr('fill', 'white')
    .text('Years');

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

    // Draw legend

    let legend = svg.selectAll('.legend')
    .data(countries)
    .enter().append('g')
    .attr('class', d => { return `legend ${d.id}`;})
    .attr('transform', `translate(${offset.x}, ${offset.y})`);
    
    legend.append('rect')
        .attr('x', cWidth - 20)
        .attr('y', (d, i) => {
            return i * 20;
        })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', d => {
            return z(d.id);
        });

    legend.append('text')
        .attr('x', cWidth - 8)
        .attr('y', (d, i) => {
            return (i * 20) + 10;
        })
        .text(d => {
            return d.id.replace(/[-]/gim, ' ');
        })
        .attr('fill', 'white')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click',mouseclick);
    
    // Draw Tooltips

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Draw country data lines
    
    let country = g.selectAll('.country')
        .data(countries)
        .enter().append('g')
            .attr('class', 'country');

    country.append('path')
        .attr('class', 'line')
        .attr('id', d => { return d.id; })
        .attr('d', d => { let res = line(d.values); return res; })
        .style('stroke', d => { return z(d.id); })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', mouseclick);

    country.selectAll('.points')
        .data(d => { return d.values })
        .enter().append('circle')
        .attr('class', d => { let id = d.id.replace(/[ ]/gim, '-'); return `dot-${id}`; })
        .attr('cx', d => { return x(d.year); })
        .attr('cy', d => { let success = calculateSuccess(d.wins, d.loss); return y(success); })
        .attr('r', 6)
        .attr('fill', d => { return z(d.id.replace(/[ ]/gim,'-')); })
        .style('display', 'none')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', mouseclick);
        
    // Mouse over effects

    function mouseout(d) {
        let id = d.id.replace(/[ ]/gim, '-');
        $(`#${id}`).css('stroke-width', '2px');
        $(`#${id}`).css('cursor', 'default');
        $(`.${id} text`).css('cursor', 'default');
        $(`.${id} text`).css('font-weight', 'normal');
        $(`.dot-${id}`).css('display', 'none');
        $(`.dot-${id}`).css('cursor', 'pointer');
        // Make tool-tip vanish
        tooltip.transition().duration(500).style('opacity', 0);
    }

    function mouseover(d) {
        let id = d.id.replace(/[ ]/gim, '-');
        let success = calculateSuccess(d.wins, d.loss);
        if(success) { // display tooltip
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Success Rate: ${success.toFixed(2)}%<br>Wins: ${d.wins}<br>Loss: ${d.loss}`)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        }
        $(`#${id}`).css('stroke-width', '6px');
        $(`#${id}`).css('cursor', 'pointer');
        $(`.${id} text`).css('cursor', 'pointer');
        $(`.${id} text`).css('font-weight', 'bolder');
        $(`.dot-${id}`).css('display', 'block');
        $(`.dot-${id}`).css('cursor', 'pointer');
    }

    function mouseclick(d){
        let id = d.id.replace(/[ ]/gim, '-');
        // Retrieve whether it is toggled on or not
        let toggled = toggleCountry[id];
        if(toggled == null){ // no entry exists, create a new one
            toggled = false;
            toggleCountry[id] = toggled;
        } else { // invert toggled
            toggled = !toggled;
            toggleCountry[id] = toggled;
        }
        let opacity = toggled ? '1' : '0.1';
        $(`#${id}`).css('opacity', opacity);
        $(`.${id} text`).css('fill', toggled ? 'white' : '#898a8c');
        $(`.dot-${id}`).css('display', toggled ? 'block' : 'none');
    }
    
 }