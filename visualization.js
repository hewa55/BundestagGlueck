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
