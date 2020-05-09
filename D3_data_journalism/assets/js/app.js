// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;
// Define the chart's margins as an object



  var chartMargin = {
    top: 50,
    right: 350,
    bottom:90,
    left: 100
  };
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .classed("chart",true);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);



d3.csv("assets/data/data.csv").then(function(data){
    // console.log(data);

     // Cast the hours value to a number for each piece of tvData
    data.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
  });
    // Configure a linear scale for the horizontal axis 
    var xLinearScale = d3.scaleLinear()
    .domain([8,d3.max(data, d => d.poverty)+2])
    .range([0,chartWidth]);

    

    // Configure a linear scale for the vertical axis 
    var yLinearScale = d3.scaleLinear()
    .domain([4,d3.max(data, d => d.healthcare)+2])
    .range([chartHeight,0]);

    // console.log(xLinearScale);

   

    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(11);

    // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

chartGroup.append("g")
  // .attr("transform", `translate(0, ${chartHeight})`)
  .call(leftAxis);

    // Create one SVG circle per piece of data
  // Use the linear scales to position each circle within the chart
     chartGroup.selectAll(".scatter")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "scatter")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 9)
    .classed("stateCircle",true);
    // .attr("fill", "steelblue")
    // .attr("opacity",0.7);

    // Select the texts which are to be created inside each circle in the scatter plot and the state abbrs are given as the texts.

    chartGroup.selectAll("texts")
    .data(data)
    .enter()
    .append("text") 
    .text(function(d) {
      return (d.abbr);
    })
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", "10px")
    .classed("stateText",true);
    
    // .attr("fill", "white")
    // .attr("text-anchor", "middle");
   
   
// Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left+5)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)"); 

});

};

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
