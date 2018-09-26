/* Global Var
============================================= */
var tableData = data;
var counter = 0;
var btnSearch = d3.select("#btn-search");
var btnReset = d3.select("#btn-reset");
var searchControls = d3.selectAll(".form-control");

//****************** init *****************************//
init();


//****************** Event Listeners ******************//

btnSearch.on("click", function() {
    d3.event.preventDefault();

    var frmDatetime = d3.select("#frm-datetime").property("value");
    var frmShape = d3.select("#frm-shape").property("value").toUpperCase();
    var frmCity = d3.select("#frm-city").property("value").toUpperCase();
    var frmState = d3.select("#frm-state").property("value").toUpperCase();
    var frmCountry = d3.select("#frm-country").property("value").toUpperCase();

    var parms = new Search(frmDatetime, frmShape, frmCity, frmState, frmCountry);
    counter++;

    filterDataTable(parms, counter);
});

btnReset.on("click", function() {
    resetForm();
});

searchControls.on("input", function() {
    var currentControl = this;
    d3.selectAll("input").each(function() {
        if (this != currentControl) {
            this.disabled = true;
        }
    });
    d3.selectAll("select").each(function() {
        if (this != currentControl) {
            this.disabled = true;
        }
    });
});

/* Functions
============================================= */

/*
 * search parameter object
 * 
 */
function Search(datetime, shape, city, state, country) {
    this.dateTime = datetime;
    this.shape = shape;
    this.city = city;
    this.state = (state === "SELECT STATE") ? null : state;
    this.country = (country === "SELECT COUNTRY") ? null : country;
}

/*
 * kick off the show
 */
function init() {
    tableData.forEach((obj) => {
        obj.uid = genUID();
    });

    tableRender(tableData, ['datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments']);
}

/* 
 * search filtering of table data on the DOM
 * @param parms, counter
 * 
 */
function filterDataTable(parms, counter) {
    var filteredData = [];

    var filteredDatetime = tableData.filter(tableData => tableData.datetime === parms.dateTime);
    var filteredShape = tableData.filter(tableData => tableData.shape.toUpperCase() === parms.shape);
    var filteredCity = tableData.filter(tableData => tableData.city.toUpperCase() === parms.city);
    var filteredState = tableData.filter(tableData => tableData.state.toUpperCase() === parms.state);
    var filteredCountry = tableData.filter(tableData => tableData.country.toUpperCase() === parms.country);

    filteredData.push(filteredDatetime);
    filteredData.push(filteredCity);
    filteredData.push(filteredState);
    filteredData.push(filteredCountry);
    filteredData.push(filteredShape);

    // previous,current count
    d3.select("table").attr("data-count-previous", d3.select("table").attr("data-count"));
    d3.select("table").attr("data-count", counter);

    d3.select("tbody").selectAll("tr").classed("ufo--hide", true);

    filteredData.forEach((filtered) => {
        filtered.forEach((obj) => {
            d3.select("tr[data-uid='" + obj.uid + "']").classed("ufo--hide", false);
        });
    });
}

/*
 * reset input form
 */
function resetForm() {
    d3.select("tbody").selectAll("tr").classed("ufo--hide", false);
    d3.selectAll("input").property("value", "");
    d3.selectAll("select").property("selectedIndex", 0);
    d3.selectAll("input").property("disabled", false);
    d3.selectAll("select").property("disabled",false);
}


/*
 * reads data array of objects 
 * appends table to onto the DOM
 *
 * @param tableData, tableColumns
 * @returns table
 */
function tableRender(tableData, tableColumns) {
    var table = d3.select("table");
    var tbody = table.append("tbody");

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(tableData)
        .enter()
        .append("tr")
        .attr("data-uid", function(row) {
            return row.uid;
        });

    // create a cell in each row for each column
    rows.selectAll("td")
        .data(function(row) {
            return tableColumns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append("td")
        .text(function(cell) {
            return cell.value;
        });

    return table;
}

/*
 * generates a UUID
 * 
 * @return uuid
 */
function genUID() {
    return Math.random().toString(36).substr(2, 16);
}