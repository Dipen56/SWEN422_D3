/* This module contains D3 scripts for the second bullet point of the SWEN 422 assignment.
 * It draws a graph which shows the home court performance of each team over time.
 */

/**
 * Displays the team data as a line graph
 *
 * @param {*} data
 */
function displayQ1MultilineGraph(data){
    let container = document.getElementById('q1container');
    // this is the width of the chart
    const width = container.clientWidth;
    // this is the height of the chart
    const height = container.clientHeight;
    // These parameters can shift the graph left, right, up, and down
    const margin = {top: 100, right: 10, bottom: 30, left: 100};
    // These parameters shift the title of the graph
    const tOffset = {x: 0, y: margin.top - 60};
    // used to toggle team bars
    let toggleTeams = {};
    // used to toggle legends
    let toggleLegends = {};
    // used to check if the user has selected placing
    let isPlacingSelected = false;
    // content dimensions
    let cWidth = width - margin.left - margin.right;
    let cHeight = height - margin.top - margin.bottom;

    //chart variables
    let chartWidth       = width,
        barHeight        = 10,
        groupHeight      = barHeight * data.series.length,
        gapBetweenGroups = 15,
        spaceForLabels   = margin.left, // y change
        spaceForLegend   = margin.right;


    // Zip the placing data together into one array
    let zippedData = [];
    // Zip the team name together which corresponds to the zipped data
    let zippedDataTeamName = []
    for (let i=0; i<data.series.length; i++) {
        for (let j=0; j<data.labels.length; j++) {
            zippedData.push(data.series[i].values[j]);
            zippedDataTeamName.push(data.labels[j]);
        }
    }
    // used to set the color for the chart
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    // used to scale the charts
    let tempChartHeight = 20 +barHeight * zippedData.length + gapBetweenGroups * data.labels.length;
    // scale factor
    let scale = cHeight/tempChartHeight;
    // the chart height
    let chartHeight =  50 + (barHeight *scale)* zippedData.length + (gapBetweenGroups *scale) * data.labels.length;
    // bar height scaled down
    barHeight = barHeight * scale;
    // gaps scaled down
    gapBetweenGroups = gapBetweenGroups *scale;

    // x range reversed
    let x = d3.scaleLinear()
        .domain([d3.max(zippedData) +1,0 ])
        .range([0, cWidth]);

    // y range
    let y = d3.scaleLinear()
        .range([cHeight + gapBetweenGroups, 0]);
    // y axis format
    let yAxis = d3.axisLeft(y)
        .tickFormat("")
        .tickSize(0);

    // the SVG container
    let svg = canvas('#q1container', spaceForLabels + chartWidth + spaceForLegend, chartHeight);

    // changes the size of the SVG component
    let g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .attr("height", chartHeight);
    //moves the chart down
    $("svg").css({top: margin.top, position:'absolute'});

    // appends the chart title
    svg.append('text').html('Final Placing of Teams for Each Season')
        .attr('fill', 'white')
        .attr('x', (cWidth / 2 ) - 150 )
        .attr('y', tOffset.y -5)
        .attr('font-size', '2.0rem');

    // Create bars
    let bar = svg.selectAll(".data")
        .data(zippedData)
        .enter().append("g")
        .attr('class', 'data')
        .attr("transform", function(d, i) {
            return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.labels.length))) + ")";
        });

    // Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function(d,i) { return color(i % data.labels.length); })
        .attr("class", (d,i) => { return `data-${i}`; })
        .attr("width", x)
        .attr("height", barHeight - 1)
        .attr('y', 50)  // to move the bar lines down
        .style('opacity', 0.65)
        .on('mousemove',  mouseover)
        .on('mouseout', mouseout);

    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function(d) { return - 50; })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .text(function(d,i) {
            if (i % data.labels.length === 0)
                return data.series[Math.floor(i/data.labels.length)].label;
            else
                return ""})
        .attr('y', (margin.top - 50)+ groupHeight / 2 + 9)
        .attr("fill", "white");

    // Draw a line on the left
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
        .call(yAxis);

    // Draw legend
    let legendRectSize = 15,
        legendSpacing  = 4;

    //legend format
    let legend = svg.selectAll('.legend')
        .data(data.labels)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing ;
            var offset = -gapBetweenGroups/2;
            var horz = chartWidth - 100  ;
            var vert = i * height - offset + 50;
            return 'translate(' + horz + ',' + vert + ')';
        })
        .attr('class', (d, i)=>{return `legend-${i}`;});

    //legend shape
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return color(i); })
        .style('stroke', function (d, i) { return color(i); });

    //legend text
    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d; })
        .attr("fill", "white")
        .on('click',mouseclick);

    //y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 10)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Seasons (year) ")
        .attr("fill", "white");

    // Draw Tooltips
    let tooltip = d3.select('body').append('div')
        .attr('class', 'q1tooltip')
        .style('opacity', 0);

    // used to change the properties of the chart when the mouse is moved out
    function mouseout(d, i) {
        let id = `data-${i}`;
        let isToggled = toggleTeams[id];
        if(isToggled || isToggled == null){
            $(`.${id}`).css('opacity', '0.65');
            tooltip.transition().duration(500).style('opacity', 0);
        }
    }

    // used to change the properties of the chart when the mouse is moved over
    function mouseover(d, i) {
        let id = `data-${i}`;
        let teamName = zippedDataTeamName[i];
        let isToggled = toggleTeams[`data-${i}`];
        if(isToggled || isToggled ==null){
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Team Name: ${teamName}<br>Team Placing: ${d}`)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
            $(`.${id}`).css('opacity', '1');
        }
    }

    // used to change the properties of the chart when legend is clicked on
    function mouseclick(d, i){
        let id = d;
        let barID = [];
        // used to toggle between filter, and unselected all the bars that are selected
        if(isPlacingSelected){
            toggleTeams ={};
            for(let i = 0; i< zippedData.length; i++) {
                $(`.data-${i}`).css('opacity', '0.65');
            }
            isPlacingSelected =false;
        }
        for(let i = 0; i<zippedDataTeamName.length;i++) {
            if(zippedDataTeamName[i] == id){
                barID.push(`data-${i}`);
            }
        }
        for(let i = 0; i<barID.length;i++){
            let toggled = toggleTeams[barID[i]];
            if(toggled == null){ // no entry exists, create a new one
                toggled = false;
                toggleTeams[barID[i]] = toggled;
            } else { // invert toggled
                toggled = !toggled;
                toggleTeams[barID[i]] = toggled;
            }
            let opacity = toggled ? '1' : '0.1';
            $(`.${barID[i]}`).css('opacity', opacity);
        }
        let toggeledLegend = toggleLegends[`legend-${i}`];
        if(toggeledLegend == null){ // no entry exists, create a new one
            toggeledLegend = false;
            toggleLegends[`legend-${i}`] = toggeledLegend;
        } else { // invert toggled
            toggeledLegend = !toggeledLegend;
            toggleLegends[`legend-${i}`] = toggeledLegend;
        }
        let opacity = toggeledLegend ? '1' : '0.1';
        $(`.legend-${i}`).css('opacity', opacity);
    }

    // used to filter select only bars that the same placing as the users choose.
    function inner(data) {
        for(let i = 0; i< zippedData.length; i++) {
            $(`.data-${i}`).css('opacity', '0.65');
        }
        if(data != "All"){
            isPlacingSelected = true;
            toggleTeams ={};
            toggleLegends = {};
            for(let i = 0; i< zippedDataTeamName.length;i++){
                $(`.legend-${i}`).css('opacity', '1');
            }
            for(let i = 0; i< zippedData.length;i++){
                if(zippedData[i] != data){
                    let id = `data-${i}`;
                    let toggled = toggleTeams[id];
                    if(toggled == null){ // no entry exists, create a new one
                        toggled = false;
                        toggleTeams[id] = toggled;
                    } else { // invert toggled
                        toggled = !toggled;
                        toggleTeams[id] = toggled;
                    }
                    let opacity = toggled ? '1' : '0.1';
                    $(`.data-${i}`).css('opacity', opacity);
                }
            }
        }else{
            toggleTeams ={};
            toggleLegends = {};
            for(let i = 0; i< zippedDataTeamName.length;i++){
                $(`.legend-${i}`).css('opacity', '1');
            }
        }
    }
    return{
        inner:inner
    }
}
