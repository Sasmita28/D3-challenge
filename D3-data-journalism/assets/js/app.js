// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  };
  
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

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
    .domain(d3.extent(data, d => d.poverty))
    .range([0,chartWidth]);

    

    // Configure a linear scale for the vertical axis 
    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.healthcare))
    .range([chartHeight,0]);

    // console.log(xLinearScale);

   

    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Create one SVG circle per piece of data
  // Use the linear scales to position each circle within the chart
    var selection = chartGroup.selectAll(".scatter")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "scatter")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "lightblue");


    chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("svg:text") 
    .text(function(d) {
      return (d.abbr);
      
    })
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", "10px")
    .attr("fill", "black");
   


  
})
