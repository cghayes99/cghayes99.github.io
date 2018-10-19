/* Global Constants
============================================= */
const MAPBOX_API_KEY = "pk.eyJ1IjoiY2doYXllczk5IiwiYSI6ImNqbjB4cXF3bDAzZHQzcW84NjZwaWtzYWEifQ.FNyqY-OeU-ofKd8GMBgwww";

const EARTHQUAKE_ALL_MONTH_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const EARTHQUAKE_ALL_WEEK_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const EARTHQUAKE_ALL_DAY_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const EARTHQUAKE_ALL_HOUR_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

const TECTONIC_PLATES_URL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

const LAYER_OUTDOORS = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`);
const LAYER_SATELLITE = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`);
const LAYER_LIGHT = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_API_KEY}`);

/* Global Var
============================================= */

var legend = L.control({
    position : "bottomleft"
});

var plateStyle = {
    color       : "#E0840D",
    fillOpacity : 0,
    opacity     : 0.75
};

//****************** init *****************************//
d3.json(EARTHQUAKE_ALL_WEEK_URL, dataset => {
    renderFeatures(dataset.features);
});    

//****************** Event Listeners ******************//


/* Functions
============================================= */
function renderFeatures(dataset) {
	//make the earthquake markers w/ tooltips
	var earthquakes = L.geoJSON(dataset, {
		onEachFeature : (feature, layer) => {
            return layer.bindPopup(`<table class="table table-bordered">
                      <tr><td class="popup--title" colspan="2">${feature.properties.place}</td></tr>
                      <tr><td class="popup--time" colspan="2">${new Date(feature.properties.time)}</td></tr>
                      <tr><td class="popup--mag">Magnitude</td><td class="popup--mag-value">${feature.properties.mag}</td></tr>
                      </table>`);
		},
		//make them circles w/ a gradient color and size
		pointToLayer: (feature, latLong) => {
			var markerOptions = {
				color: "#1F3838",
				fillColor: circleColor(feature.properties.mag),
                fillOpacity: circleOpacity(feature.properties.mag),
				opacity: 1,
				radius: circleRadius(feature.properties.mag),
				weight: 0.75
			};
			return L.circleMarker(latLong, markerOptions);
		}
	});
	renderMap(earthquakes);
}

function renderBaseMaps() {
 	var baseMaps = {
        Light     : LAYER_LIGHT,
        Outdoors  : LAYER_OUTDOORS,
		Satellite : LAYER_SATELLITE
	};
    return baseMaps;
}

function renderMap(earthquakes) {

	// create tectonic plates layer
	var plates = new L.LayerGroup();

	// get the tectonic plates data
	d3.json(TECTONIC_PLATES_URL, dataset => {
		L.geoJSON(dataset, {
			style: plateStyle,
			pane: "lines"
		}).addTo(plates);
	});

	// create overlay object
	var overlayMaps = {
        Earthquakes       : earthquakes,
		"Tectonic Plates" : plates,
	};

	// plot map
	var plotMap = L.map("map", {
		center: [ 32.69530673, -40.43175435 ],
		layers: [LAYER_LIGHT, earthquakes, plates ],
        zoom: 4
	});

	plotMap.createPane("lines");
	plotMap.getPane("lines").style.zIndex = 300;
    
	//layer control
	L.control.layers(renderBaseMaps(), overlayMaps, {
        collapsed: false
	}).addTo(plotMap);    

	legend.onAdd = function() {
		var div = L.DomUtil.create("div", "info legend");
        var mags = [2.5, 3, 3.5, 4, 4.5, 5, 5.5];
        var table = "<table>";

        mags.forEach(function(mag){
            table +=`<tr><td><i style="background:${circleColor(mag+1)}"></i>${mag.toFixed(1)}</td><td class="dash">&ndash;</td><td>${((mag+1)-0.5).toFixed(1)}</td></tr>`;
        });
        table += "</table>";
        div.innerHTML = table;
        return div;
	};
    
	legend.addTo(plotMap);
}

function circleColor(mag) {
	return mag > 6.0 ? "#800026" :
           mag > 5.5 ? "#BD0026" :
           mag > 5.0 ? "#E31A1C" :
           mag > 4.5 ? "#FC4E2A" :
           mag > 4.0 ? "#FD8D3C" :
           mag > 3.5 ? "#FEB24C" :
           mag > 3.0 ? "#FED976" :
                       "#FFEDA0";
}

function circleRadius(mag) {
    return Math.sqrt(Math.pow(mag, 2)*15);
}

function circleOpacity(mag) {
    return mag/10;
}

