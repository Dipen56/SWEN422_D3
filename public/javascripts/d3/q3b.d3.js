function displayQ3bBarGraph(year, data){

    var container = document.getElementById('q3bcontainer');
    container.innerHTML = ''; // clear anything inside it first
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    // These parameters can shift the graph left, right, up, and down
    const margin = {top: 60, right: 250, bottom: 30, left: 100};
    // These parameters shift the legend of the graph
    const offset = {x: margin.left + 40, y: 50};
    // These parameters shift the title of the graph
    const tOffset = {x: 0, y: margin.top - 15};

    let svg = canvas('#q3bcontainer', width, height);
    // content dimensions
    let cWidth = width - margin.left - margin.right;
    let cHeight = height - margin.top - margin.bottom;
    let g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Append graph title
    svg.append('text').html(`Intercountry Performance for ${year}`)
    .attr('fill', 'white')
    .attr('x', cWidth / 2 + tOffset.x)
    .attr('y', tOffset.y);

    // Functions for defining the x,y,z axis
    let x = d3.scaleBand()
        .rangeRound([0, cWidth])
        .paddingInner(0.05)
        .align(0.1);

    let y = d3.scaleLinear().range([cHeight, 0]);
        
    let z = d3.scaleOrdinal()
        .range(['#44d677', '#fc5569']);

    let keys = ['wins', 'loss'];
    let maxY = year.includes('-') ? d3.max(data, d => { return d.total; }) : 5;
    x.domain(data.map(d => { return d.team; }));
    y.domain([0, maxY]).nice();
    z.domain(keys);

    // Draw line axis
    g.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', `translate(0,${cHeight})`)
        .call(d3.axisBottom(x))
     .append('text')
        .attr('x', cWidth / 2)
        .attr('dy', '3em')
        .attr('fill', 'white')
        .text('Teams');

    g.append('g')
        .attr('class', 'axis axis-y')
        .call(d3.axisLeft(y).ticks(null, 's'))
     .append('text')
        .attr('x', 2)
        .attr('y', y(y.ticks().pop()) + 0.5)
        .attr('dy', '0.32em')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text('Total intercountry games');

    // Draw stacked bar charts
    let stack = d3.stack().keys(keys);
    
    g.append('g')
        .selectAll('g')
        .data(stack(data))
        .enter().append('g')
            .attr('fill', d => {return z(d.key); })
        .selectAll('rect')
        .data(d => {return d; })
        .enter().append('rect')
            .attr('class', d => { return getDataClass(d); })
            .attr('x', d => { return x(d.data.team); })
            .attr('y', d => { return y(d[1]); })
            .attr('height', d => { return y(d[0]) - y(d[1]); })
            .attr('width', x.bandwidth())
            .style('opacity', 0.75)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

    // Append legend
    let legend = g.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'end')
        .selectAll('.legend')
        .data(keys.slice().reverse())
        .enter().append('g')
            .attr('class','legend')
            .attr('transform', (d, i) => { return 'translate(0,' + i*20 + ')'; });

    legend.append('rect')
        .attr('x', cWidth + 19)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', z);

    legend.append('text')
        .attr('x', cWidth + 70)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .attr('fill', 'white')
        .text(d => { return d.toUpperCase(); });

    // Setup tooltip

    let tooltip = d3.select('body').append('div')
        .attr('class', 'q3btooltip')
        .style('opacity', 0);
    
    // Mouse Effects

    function mousemove(d){
        let dClass = getDataClass(d);
        $(`.${dClass}`).css('opacity', 1);
        let partial = determineWinLose(d);
        let value = getDataValue(d);
        let team = d.data.team;
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(`${team}<br>${partial}: ${value}`)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
    }

    function mouseout(d){
        let dClass = getDataClass(d);
        $(`.${dClass}`).css('opacity', 0.75);
        // Make tool-tip vanish
        tooltip.transition().duration(500).style('opacity', 0);
    }

    // Helper Functions

    function getDataClass(data){
        let partial = determineWinLose(data);
        let team = data.data.team.replace(/[ ]/gim, '-');
        return `${partial}-${team}`;
    }

    function getDataValue(data){
        let winlose = determineWinLose(data);
        return data.data[winlose];
    }

    function determineWinLose(data){
        // identify whether it is the win value or loss value
        let d0 = data[0];
        let d1 = data[1];
        let wins = data.data.wins;
        // if d0 == wins, then looking at loss value, if d1 == wins, looking at win
        return d0 == wins ? 'loss' : d1 == wins? 'wins' : 'loss';
    }
}