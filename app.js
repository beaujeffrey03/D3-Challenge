console.log('app.js loaded');

var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// Append an SVG group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * .95,
      d3.max(censusData, d => d[chosenXAxis])
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.7,
        d3.max(censusData, d => d[chosenYAxis])
      ])
      .range([height, 0]);
  
    return yLinearScale;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr('cx', d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with a transition to
// new circles
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr('cy', d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating abbr group with a transition to
// new abbreviations
function renderAbbrX(abbrGroup, newXScale, chosenXAxis) {

  abbrGroup.transition()
    .duration(1000)
    .attr('cx', d => newXScale(d[chosenXAxis]));

  return abbrGroup;
}

// function used for updating circles group with a transition to
// new abbreviations
function renderAbbrY(abbrGroup, newYScale, chosenYAxis) {

  abbrGroup.transition()
    .duration(1000)
    .attr('cy', d => newYScale(d[chosenYAxis]));

  return abbrGroup;
}

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
//   var xlabel;
//   var ylabel;

//   if (chosenXAxis === 'poverty') {
//     xlabel = 'Poverty';
//   }

//   if (chosenXAxis === 'age') {
//     xlabel = 'Age';
//   }

//   else {
//     xlabel = 'Household Income';
//   }

//   if (chosenYAxis === 'healthcare') {
//     ylabel = 'Lacks Healthcare';
//   }

//   if (chosenYAxis === 'smokes') {
//     ylabel = 'Smokes';
//   }

//   else {
//     ylabel = 'Obesity';
//   }

//   var toolTip = d3.tip()
//     .attr('class', 'tooltip')
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state} <br> ${xlabel}: ${d[chosenXAxis]} <br> ${ylabel}: ${d[chosenYAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on('mouseover', function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on('mouseout', function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below
d3.csv('data.csv').then(function(censusData, err) {

    console.log(censusData);

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

  // Create x scale function
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);

  // append x axis
  var xAxis = chartGroup.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  var leftAxis = d3.axisLeft(yLinearScale);

  // append y axis
  var yAxis = chartGroup.append('g')
    .classed('y-axis', true)
    .attr('x', 0 - margin.left)
    .attr('y', 0 - (height / 2))
    .classed('axis-text', true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll('circle')
    .data(censusData)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d[chosenXAxis]))
    .attr('cy', d => yLinearScale(d[chosenYAxis]))
    .attr('r', 20)
    .attr('fill', 'green')
    .attr('opacity', '.6');

  var fontSize = 10;
  var abbrGroup = chartGroup.selectAll(null)
    .data(censusData)
    .enter()
    .append('text')
    .text(d => d.abbr)
    .attr('x', d => xLinearScale(d[chosenXAxis]))
    .attr('y', d => yLinearScale(d[chosenYAxis])+fontSize/2)
    .attr('font-size', `${fontSize}px`)
    .classed('stateText', true);

  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + 35})`);

  var povertyLabel = xlabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('value', 'poverty')
    .classed('active', true)
    .text('In Poverty (%)');

  var ageLabel = xlabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'age')
    .classed('inactive', true)
    .text('Age (Median)');

  var incomeLabel = xlabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'income')
    .classed('inactive', true)
    .text('Household Income (Median)');

  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append('g')
    .attr('transform', `rotate(-90) translate(${-height / 2}, -30)`);

  var healthcareLabel = ylabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('value', 'healthcare')
    .classed('active', true)
    .text('Lacks Healthcare (%)');

  var smokesLabel = ylabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .attr('value', 'smokes')
    .classed('inactive', true)
    .text('Smokes (%)');

  var obesityLabel = ylabelsGroup.append('text')
    .attr('x', 0)
    .attr('y', -40)
    .attr('value', 'obesity')
    .classed('inactive', true)
    .text('Obesity (%)');

  // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll('text')
    .on('click', function() {
      // get value of selection
      var value = d3.select(this).attr('value');
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        // yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        // updates abbreviations with new x values
        abbrGroup = renderAbbrX(abbrGroup, xLinearScale, chosenXAxis);

        // // updates tooltips with new info
        // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === 'poverty') {
            povertyLabel
                .classed('active', true)
                .classed('inactive', false);
            ageLabel
                .classed('active', false)
                .classed('inactive', true);
            incomeLabel
                .classed('active', false)
                .classed('inactive', true);
        }
        else if (chosenXAxis === 'age') {
            povertyLabel
                .classed('active', false)
                .classed('inactive', true);
            ageLabel
                .classed('active', true)
                .classed('inactive', false);
            incomeLabel
                .classed('active', false)
                .classed('inactive', true);
        }
        else {
            povertyLabel
                .classed('active', false)
                .classed('inactive', true);
            ageLabel
                .classed('active', false)
                .classed('inactive', true);
            incomeLabel
                .classed('active', true)
                .classed('inactive', false);
        } 
      }
    });

    // y axis labels event listener
  ylabelsGroup.selectAll('text')
  .on('click', function() {
    // get value of selection
    var value = d3.select(this).attr('value');
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;

      console.log(chosenYAxis);

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(censusData, chosenYAxis);

      // updates y axis with transition
      // xAxis = renderXAxes(xLinearScale, xAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

      // updates circles with new y values
      abbrGroup = renderAbbrY(abbrGroup, yLinearScale, chosenYAxis);

    //   // updates tooltips with new info
    //   circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === 'healthcare') {
          healthcareLabel
              .classed('active', true)
              .classed('inactive', false);
          smokesLabel
              .classed('active', false)
              .classed('inactive', true);
          obesityLabel
              .classed('active', false)
              .classed('inactive', true);
      }
      else if (chosenYAxis === 'smokes') {
          healthcareLabel
              .classed('active', false)
              .classed('inactive', true);
          smokesLabel
              .classed('active', true)
              .classed('inactive', false);
          obesityLabel
              .classed('active', false)
              .classed('inactive', true);
      }
      else {
          healthcareLabel
              .classed('active', false)
              .classed('inactive', true);
          smokesLabel
              .classed('active', false)
              .classed('inactive', true);
          obesityLabel
              .classed('active', true)
              .classed('inactive', false);
      } 
    }
  });
}).catch(function(error) {
  console.log(error);
});