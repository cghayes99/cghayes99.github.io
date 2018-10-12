/* Global Constants
============================================= */
const SVG_WIDTH = 1100;
const SVG_HEIGHT = 700;

const textState = "State";
const textPoverty = "In Poverty (%)";
const textAge = "Age (Median)";
const textIncome = "Household Income (Median)";
const textObesity = "Obesity (%)";
const textSmokes = "Smokers (%)";
const textHealthcare = "Lacks Healthcare (%)";

const POVERTY = "poverty";
const AGE = "age";
const INCOME = "income";
const OBESITY = "obesity";
const SMOKES = "smokes";
const HEALTHCARE = "healthcare";

const X_AXIS = "X";
const Y_AXIS = "Y;";

/* Global Var
============================================= */
var xLinearScale,
    yLinearScale,
    xLabelsGroup,
    yLabelsGroup,
    xAxis,
    yAxis;

var plot,
    plotLabel,
    plotTip,
    plotGroup,
    bottomAxis,
    leftAxis;

var labelPoverty,
    labelAge,
    labelIncome,
    labelObesity,
    labelSmokes,
    labelHealthcare;
    
//****************** init *****************************//
var selectXaxis = POVERTY;
var selectYaxis = HEALTHCARE;
var activeXlabel = textPoverty;
var activeYlabel = textHealthcare;

var margin = {
    top: 20,
    bottom: 120,
    left: 120,
    right: 40
};

var width = SVG_WIDTH - margin.left - margin.right;
var height = SVG_HEIGHT - margin.top - margin.bottom;

var svg = d3.select(".chart")
    .append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chart = svg.append("g");

var div = d3.select(".chart")
    .append("div")
    .attr("class", "chart-tooltip")
    .style("opacity", 0);    

//****************** Event Listeners ******************//
d3.csv("resources/data/data.csv", function(error, DATASET) {

    DATASET.forEach(function(data) {
        data.abbr = data.abbr;
        data.state = data.state;
        data.poverty = (+data.poverty);
        data.healthcare = (+data.healthcare);
        data.age = (+data.age);
        data.smokes = (+data.smokes);
        data.income = (+data.income);
        data.obesity = (+data.obesity);
    });

    // Initial scale
    xLinearScale = xScale(selectXaxis, DATASET);
    yLinearScale = yScale(selectYaxis, DATASET);

    // Initial axis
    bottomAxis = d3.axisBottom(xLinearScale);
    leftAxis = d3.axisLeft(yLinearScale);

    // plot group: data, label, tooltip
    plotGroup = chart.append("g");

    // label group: x/y axis selectable datapoints
    xLabelsGroup = chart.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    yLabelsGroup = chart.append("g")
        .attr("transform", "rotate(-90)");

    labelPoverty = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 35)
        .attr("value", POVERTY)
        .classed("axis-text", true)
        .classed("inactive", false)
        .text(textPoverty);

    labelAge = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", AGE)
        .classed("axis-text", true)
        .classed("inactive", true)
        .text(textAge);

    labelIncome = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 85)
        .attr("value", INCOME)
        .classed("axis-text", true)
        .classed("inactive", true)
        .text(textIncome);

    labelObesity = yLabelsGroup.append("text")
        .attr("y", 35 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", OBESITY)
        .classed("axis-text", true)
        .classed("inactive", true)
        .text(textObesity);

    labelSmokes = yLabelsGroup.append("text")
        .attr("y", 60 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", SMOKES)
        .classed("axis-text", true)
        .classed("inactive", true)
        .text(textSmokes);

    labelHealthcare = yLabelsGroup.append("text")
        .attr("y", 85 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", HEALTHCARE)
        .classed("axis-text", true)
        .classed("inactive", false)
        .text(textHealthcare);

    // plot: data points
    plot = plotGroup.selectAll("circle")
        .data(DATASET)
        .enter()
        .append("circle")
        .attr("cx", function(data) {
            return xLinearScale(data[selectXaxis]);
        })
        .attr("cy", function(data) {
            return yLinearScale(data[selectYaxis]);
        })
        .attr("r", 18)
        .attr("fill", "#27E8B4")
        .attr("opacity", ".5");

    // plot: state label
    plotLabel = plotGroup.append("text")
        .selectAll("tspan")
        .data(DATASET)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data[selectXaxis] - 0);
        })
        .attr("y", function(data) {
            return yLinearScale(data[selectYaxis] - 0.22);
        })
        .text(function(data) {
            return data.abbr;
        });
        
    // plot: tooltip
    plotTip = plotGroup.selectAll("circle, tspan")
        .on("mouseover", function(data) {
            div.transition()
                .duration(100)
                .style("opacity", 0.9);
            div.html(`<table class="table table-sm table-bordered table-dark">
                      <tr><th>${textState.bold()}</th><td>${data.state}</td></tr>
                      <tr><th>${activeXlabel.bold()}</th><td>${data[selectXaxis]}</td></tr>
                      <tr><th>${activeYlabel.bold()}</th><td>${data[selectYaxis]}</td></tr>
                      </table>`)
                .style("top", (d3.event.pageY - 0) + "px")
                .style("left", (d3.event.pageX) + 10 + "px");
        })
        .on("mouseout", function() {
            div.transition()
                .duration(1800)
                .style("opacity", 0);
        });

    // display axis
    xAxis = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    yAxis = chart.append("g")
        .call(leftAxis);


    //****************** chart --- Event Listeners ******************//
    xLabelsGroup.selectAll("text").on("click", function() {
        var selected = d3.select(this).attr("value");

        if (selected != selectXaxis) {
            xLabelsGroupReset();

            if (selected === POVERTY) {
                labelPoverty.classed("active", true).classed("inactive", false);
                activeXlabel = textPoverty;
            } else if (selected === AGE) {
                labelAge.classed("active", true).classed("inactive", false);
                activeXlabel = textAge;
            } else if (selected === INCOME) {
                labelIncome.classed("active", true).classed("inactive", false);
                activeXlabel = textIncome;
            }

            xLinearScale = xScale(selected, DATASET);
            xAxis = renderXaxis(xLinearScale, xAxis);
            plot = renderPlot(plot, xLinearScale, selected, X_AXIS);
            plotLabel = renderPlotLabel(plotLabel, xLinearScale, selected, X_AXIS);

            selectXaxis = selected;
        }
    });

    yLabelsGroup.selectAll("text").on("click", function() {
        var selected = d3.select(this).attr("value");

        if (selected != selectYaxis) {
            yLabelsGroupReset();

            if (selected === OBESITY) {
                labelObesity.classed("active", true).classed("inactive", false);
                activeYlabel = textObesity;
            } else if (selected === SMOKES) {
                labelSmokes.classed("active", true).classed("inactive", false);
                activeYlabel = textSmokes;
            } else if (selected === HEALTHCARE) {
                labelHealthcare.classed("active", true).classed("inactive", false);
                activeYlabel = textHealthcare;
            }

            yLinearScale = yScale(selected, DATASET);
            yAxis = renderYaxis(yLinearScale, yAxis);
            plot = renderPlot(plot, yLinearScale, selected, Y_AXIS);
            plotLabel = renderPlotLabel(plotLabel, yLinearScale, selected, Y_AXIS);

            selectYaxis = selected;
        }
    });
});


/* Functions
============================================= */

/*
 * calculates x scale bases on min/max values
 *
 * @param axis, dataset
 * @return xLinearScale
 */
function xScale(axis, dataset) {
    var min = d3.min(dataset, function(obj) {
        return +obj[axis] * 0.75;
    });
    var max = d3.max(dataset, function(obj) {
        return +obj[axis] * 1;
    });
    var xls = d3.scaleLinear().range([0, width]).domain([min, max]);
    return xls;
}

/*
 * calculates y scale bases on min/max values
 *
 * @param axis, dataset
 * @return yLinearScale
 */
function yScale(axis, dataset) {
    var min = d3.min(dataset, function(obj) {
        return +obj[axis] * 0.75;
    });
    var max = d3.max(dataset, function(obj) {
        return +obj[axis] * 1;
    });
    var yls = d3.scaleLinear().range([height, 0]).domain([min, max]);
    return yls;
}

/*
 * onChange: renders x axis scale
 *
 * @param scale, axis
 * @return axis
 */
function renderXaxis(scale, axis) {
    var bottomAxis = d3.axisBottom(scale);
    axis.transition()
        .duration(1000)
        .call(bottomAxis);

    return axis;
}

/*
 * onChange: renders y axis scale
 *
 * @param scale, axis
 * @return axis
 */
function renderYaxis(scale, axis) {
    var leftAxis = d3.axisLeft(scale);
    axis.transition()
        .duration(1000)
        .call(leftAxis);

    return axis;
}

/*
 * onChange: renders plot points for x/y axis
 *
 * @param plot, scale, selection, axis
 * @return plot
 */
function renderPlot(plot, scale, selection, axis) {
    if (axis === X_AXIS) {
        plot.transition()
            .duration(1000)
            .attr("cx", function(data) {
                return scale(data[selection]);
            });
    }

    if (axis === Y_AXIS) {
        plot.transition()
            .duration(1000)
            .attr("cy", function(data) {
                return scale(data[selection]);
            });
    }

    return plot;
}

/*
 * onChange: renders "state" value in plot for x/y axis
 *
 * @param plotLabel, scale, selection, axis
 * @return plotLabel
 */
function renderPlotLabel(plotLabel, scale, selection, axis) {
    if (axis === X_AXIS) {
        plotLabel.transition()
            .duration(1000)
            .attr("x", function(data) {
                return scale(data[selection]);
            });
    }

    if (axis === Y_AXIS) {
        plotLabel.transition()
            .duration(1000)
            .attr("y", function(data) {
                return scale(data[selection] - 0.22);
            });
    }

    return plotLabel;
}

/*
 * reset x-axis labels; set all to inactive
 */
function xLabelsGroupReset() {
    labelPoverty.classed("active", false).classed("inactive", true);
    labelAge.classed("active", false).classed("inactive", true);
    labelIncome.classed("active", false).classed("inactive", true);
}

/*
 * reset y-axis labels; set all to inactive
 */
function yLabelsGroupReset() {
    labelObesity.classed("active", false).classed("inactive", true);
    labelSmokes.classed("active", false).classed("inactive", true);
    labelHealthcare.classed("active", false).classed("inactive", true);
}