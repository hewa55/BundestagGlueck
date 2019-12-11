var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("sentiment_result.csv",
    function(data) {

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.party;})
        .entries(data);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.session; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([1, d3.max(data, function(d) { return +d.negative_rank; })])
        .range([ height, 0 ]);

    svg.append("g")
        .call(d3.axisLeft(y).ticks(6,"f"));

    // add x axis title
    svg.append("text")
         .attr("text-anchor", "end")
         .attr("x", width)
         .attr("y", height + margin.top + 15)
         .text("Sitzungsnummern der 19 Legislaturperiode");
    // y axis title
    svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left+30)
            .attr("x", -margin.top)
            .text("Rang der Unzufriedenheit");

    // color palette
    //var res = sumstat.map(function(d){ return d.party }) // list of group names
    var res = ["AfD","FDP","CDU/CSU","DIE LINKE","SPD","BÜNDNIS 90/DIE GRÜNEN"];
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['rgb(0, 158, 224,0.4)','rgb(255, 237, 0,0.4)','rgb(0, 0, 0,0.4)',
            'rgb(223, 4, 4,0.4)',
            'rgb(227, 0, 15,0.4)','rgb(70, 150, 43,0.4)']);


    var colorFull = d3.scaleOrdinal()
            .domain(res)
            .range(['rgb(0, 158, 224,1)','rgb(255, 237, 0,1)','rgb(0, 0, 0,1)',
                'rgb(223, 4, 4,1)',
                'rgb(227, 0, 15,1)','rgb(70, 150, 43,1)']);

        var tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .attr("id","tooltip_bottom")
            //.style("background-color", "grey")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "black")
            .style("position","absolute");
        var img = document.createElement("IMG");
        // -2- Create 3 functions to show / update/ hide the tooltip
    var showTooltip = function(d) {
            tooltip
                .transition()
                .duration(200);
            tooltip
                .style("opacity", 1)
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
                //.style("background-color",colorFull(d.key));
        document.getElementById(d.key).attributes.getNamedItem("stroke").value =colorFull(d.key);
        document.getElementById(d.key).attributes.getNamedItem("stroke-width").value =8;

        img.src = "images/"+d.key.charAt(0)+".jpg";
        img.height = "25";
        document.getElementById("tooltip_bottom").appendChild(img);

        };
        var moveTooltip = function(d) {
            tooltip
                .style("left", (d3.mouse(this)[0]+90) + "px")
                .style("top", (d3.mouse(this)[1]+95) + "px");
        };
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
            document.getElementById(d.key).attributes.getNamedItem("stroke").value =color(d.key);
            document.getElementById(d.key).attributes.getNamedItem("stroke-width").value =3;
            document.getElementById("tooltip_bottom").removeChild(img);
            img.src = ""
        };

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d.key) })
            .attr("stroke-width", 3)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return x(d.session); })
                    .y(function(d) { return y(+d.positive_rank); })
                    (d.values)
            })
            .attr("id",function (d) {
                return d.key
            })
            .on("mouseover",showTooltip)
            .on("mousemove",moveTooltip)
            .on("mouseleave",hideTooltip)

});

/*var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
*/
/*
var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
        return color(d.name);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
            .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
            });

        d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
                console.log(width/mouse[0])
                var xDate = x.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);

                var beginning = 0,
                    end = lines[i].getTotalLength(),
                    target = null;

                while (true){
                    target = Math.floor((beginning + end) / 2);
                    pos = lines[i].getPointAtLength(target);
                    if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                        break;
                    }
                    if (pos.x > mouse[0])      end = target;
                    else if (pos.x < mouse[0]) beginning = target;
                    else break; //position found
                }

                d3.select(this).select('text')
                    .text(y.invert(pos.y).toFixed(2));

                return "translate(" + mouse[0] + "," + pos.y +")";
            });
    });*/
