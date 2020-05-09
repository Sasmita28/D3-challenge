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



  var margin = {
    top: 50,
    right: 350,
    bottom: 80,
    left: 100
  };

  // Define dimensions of the chart area
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .classed("chart",true);

  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";


  // function used for updating x-scale var upon click on axis label
  function xScale(censusData, chosenXAxis) {
    // create xScale
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]/1.15),
        d3.max(censusData, d => d[chosenXAxis]+2)
      ])
      .range([0, width]);

    return xLinearScale;

  }


  // function used for updating y-scale var upon click on axis label
  function yScale(censusData, chosenYAxis) {
    // create yScale
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]/1.15),
        d3.max(censusData, d => d[chosenYAxis]+2)
      ])
      .range([height,0]);

    return yLinearScale;

  }

  // function used for updating xAxis var upon click on axis label
  function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xAxis;
  }

  // function used for updating yAxis var upon click on axis label
  function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  }


  // function used for updating circles group with a transition to
  // new circles
  function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
  }

  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis,chosenYAxis,circlesGroup) {


    var xlabel;
    var ylabel;

     

    if (chosenXAxis === "poverty") {
      xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age:";
    }

    else {
      xlabel = "Income:";
    }



    if (chosenYAxis === "healthcare") {
      ylabel = "Healthcare:";
    }
    else if (chosenYAxis === "smokes") {
      ylabel = "Smokes:";
    }

    else {
      ylabel = "Obesity:";
    }
  // for tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}(${d.abbr})<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });

    circlesGroup.call(toolTip);

    

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return circlesGroup;

  
  }


  d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

    // parse data
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis=chartGroup.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 9)
      .classed("stateCircle",true)
      // .attr("fill", "steelblue")
      .attr("opacity", "1.1");

    var circlesLableGroup= chartGroup.selectAll("texts")
    .data(censusData)
    .enter()
    .append("text") 
    .text(function(d) {
      return (d.abbr);
    })
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", "10px")
    .classed("stateText",true);
    // .attr("fill", "white")
    // .attr("text-anchor", "middle");
    

    // Create group for three x-axis labels
    var labelsXGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`)
      .classed("aText",true);

    var povertyLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsXGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age(Median)");

    var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income(Median)");

    // Create group for three y-axis labels
    var labelsYGroup = chartGroup.append("g")
      .attr("transform", `translate(${-50},${height/2})`)
      .classed("aText",true);

    // append y axis
    var healthcareLabel = labelsYGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare(%)");
    
    var smokesLabel = labelsYGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -20 )
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes(%)");

    var obesityLabel = labelsYGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity(%)");


    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
   

    // x axis labels event listener
    labelsXGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(censusData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


          // for updating the states inside the circles
          circlesLableGroup.transition()
                    .duration(1000)
                    .attr("x", d => xLinearScale(d[chosenXAxis]));

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);

            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {

            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);

            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          
          }
          else {

            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          }
        }
      });

      // y axis labels event listener
    labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // for updating the states inside the circles
        circlesLableGroup.transition()
                    .duration(1000)
                    .attr("y", d => yLinearScale(d[chosenYAxis]));


        // selecting the clicked one 
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);

          obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {

          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);

          obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        
        }
        else {

          obesityLabel
          .classed("active", true)
          .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        }
      
      }
    });
  }).catch(function(error) {
    console.log(error);
  });

};
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);