var dataset;
var x_axis = d3.range(1,21),
y_axis = d3.range(1,26);

var margin = {top:40, right:50, bottom:70, left:50};

// calculate width and height based on window size
var w = Math.max(Math.min(window.innerWidth, 1000), 500) - margin.left - margin.right - 20,
gridSize = Math.floor(w / y_axis.length),
h = gridSize * (x_axis.length+2);

//reset the overall font size
var newFontSize = w * 62.5 / 900;
d3.select("html").style("font-size", newFontSize + "%");

// svg container
var svg = d3.select("#heatmap")
  .append("svg")
  .attr("width", w + margin.top + margin.bottom)
  .attr("height", h + margin.left + margin.right)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// linear colour scale
var colours = d3.scaleLinear()
  .domain(d3.range(2000, 3000))
  .range(["white", "#87cefa"]);

var xLable = svg.selectAll(".xLable")Hello Günter
  .data(x_axis)
  .enter()
  .append("text")
  .text(function(d) { return d; })
  .attr("x", 0)
  .attr("y", function(d, i) { return i * gridSize; })
  .style("text-anchor", "end")
  .attr("transform", "translate(-6," + gridSize / 1.5 + ")")

var yLabel = svg.selectAll(".yLabel")
  .data(y_axis)
  .enter()
  .append("text")
  .text(function(d) { return d; })
  .attr("x", function(d, i) { return i * gridSize; })
  .attr("y", 0)
  .style("text-anchor", "middle")
  .attr("transform", "translate(" + gridSize / 2 + ", -6)");

// load data
d3.json("https://raw.githubusercontent.com/zhuguotian/lesa_data_management/master/data/TOF02.json", function(error, dataset) {

  // group data by timestamp
  var nest = d3.nest()
    .key(function(d) { return d.time; })
    .entries(dataset);

  // array of locations in the data
  var timestamps = nest.map(function(d) { return d.key; });
  var currentTimeIndex = 0;

  // create location dropdown menu
  var timeMenu = d3.select("#timeDropdown");
  timeMenu
    .append("select")
    .attr("id", "timeMenu")
    .selectAll("option")
      .data(timestamps)
      .enter()
      .append("option")
      .attr("value", function(d, i) { return i; })
      .text(function(d) { return d; });

  //draw initial heat-map
  var drawHeatmap = function(time) {

    // filter the data through timestamp
    var selectTime = nest.find(function(d) {
      return d.key == time;
    });

    var heatmap = svg.selectAll(".hour")
      .data(selectTime.values)
      .enter()
      .append("rect")
      .attr("x", function(d) { return (d.ycoord-1) * gridSize; })
      .attr("y", function(d) { return (d.xcoord-1) * gridSize; })
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("stroke", "white")
      .style("stroke-opacity", 0.6)
      .style("fill", function(d) { return colours(d.distance); })
  }

  drawHeatmap(timestamps[currentTimeIndex]);

  var updateHeatmap = function(time) {
    console.log("currentTimeIndex: " + currentTimeIndex)
    // filter data to return object of location of interest
    var selectTime = nest.find(function(d) {
      return d.key == time;
    });

    // update the data and redraw heatmap
    var heatmap = svg.selectAll(".hour")
      .data(selectTime.values)
      .transition()
        .duration(500)
        .style("fill", function(d) { return colours(d.distance); })
  }

  // run update function when dropdown selection changes
  timeMenu.on("change", function() {
    // find which location was selected from the dropdown
    var selectedLocation = d3.select(this)
      .select("select")
      .property("distance");
    currentTimeIndex = +selectedLocation;
    // run update function with selected location
    updateHeatmap(timestamps[currentTimeIndex]);
  });    

  d3.selectAll(".nav").on("click", function() {
    if(d3.select(this).classed("left")) {
      if(currentTimeIndex == 0) {
        currentTimeIndex = timestamps.length-1;
      } else {
        currentTimeIndex--;  
      }
    } else if(d3.select(this).classed("right")) {
      if(currentTimeIndex == timestamps.length-1) {
        currentTimeIndex = 0;
      } else {
        currentTimeIndex++;  
      }
    }
    d3.select("#timeMenu").property("value", currentTimeIndex)
    updateHeatmap(timestamps[currentTimeIndex]);
  })
})