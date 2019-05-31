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
  .domain(d3.range(1, 11, 1))
  .range(["#87cefa", "#86c6ef", "#85bde4", "#83b7d9", "#82afce", "#80a6c2", "#7e9fb8", "#7995aa", "#758b9e", "#708090"]);

var xLable = svg.selectAll(".xLable")
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
d3.json("https://raw.githubusercontent.com/zhuguotian/lesa_data_management/master/test.json", function(error, dataset) {

  // group data by location
  var nest = d3.nest()
    .key(function(d) { return d.location; })
    .entries(dataset);

  // array of locations in the data
  var locations = nest.map(function(d) { return d.key; });
  var currentLocationIndex = 0;

  // create location dropdown menu
  var locationMenu = d3.select("#locationDropdown");
  locationMenu
    .append("select")
    .attr("id", "locationMenu")
    .selectAll("option")
      .data(locations)
      .enter()
      .append("option")
      .attr("value", function(d, i) { return i; })
      .text(function(d) { return d; });

  // function to create the initial heatmap
  var drawHeatmap = function(location) {

    // filter the data to return object of location of interest
    var selectLocation = nest.find(function(d) {
      return d.key == location;
    });

    var heatmap = svg.selectAll(".hour")
      .data(selectLocation.values)
      .enter()
      .append("rect")
      .attr("x", function(d) { return (d.hour-1) * gridSize; })
      .attr("y", function(d) { return (d.day-1) * gridSize; })
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("stroke", "white")
      .style("stroke-opacity", 0.6)
      .style("fill", function(d) { return colours(d.value); })
    }
  drawHeatmap(locations[currentLocationIndex]);

  var updateHeatmap = function(location) {
    console.log("currentLocationIndex: " + currentLocationIndex)
    // filter data to return object of location of interest
    var selectLocation = nest.find(function(d) {
      return d.key == location;
    });

    // update the data and redraw heatmap
    var heatmap = svg.selectAll(".hour")
      .data(selectLocation.values)
      .transition()
        .duration(500)
        .style("fill", function(d) { return colours(d.value); })
  }

  // run update function when dropdown selection changes
  locationMenu.on("change", function() {
    // find which location was selected from the dropdown
    var selectedLocation = d3.select(this)
      .select("select")
      .property("value");
    currentLocationIndex = +selectedLocation;
    // run update function with selected location
    updateHeatmap(locations[currentLocationIndex]);
  });    

  d3.selectAll(".nav").on("click", function() {
    if(d3.select(this).classed("left")) {
      if(currentLocationIndex == 0) {
        currentLocationIndex = locations.length-1;
      } else {
        currentLocationIndex--;  
      }
    } else if(d3.select(this).classed("right")) {
      if(currentLocationIndex == locations.length-1) {
        currentLocationIndex = 0;
      } else {
        currentLocationIndex++;  
      }
    }
    d3.select("#locationMenu").property("value", currentLocationIndex)
    updateHeatmap(locations[currentLocationIndex]);
  })
})