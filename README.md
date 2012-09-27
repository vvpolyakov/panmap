PANMAP - jQuery plugin for create, save and load overlays on google maps
========================================================================

Demo
----
(http://vvpolyakov.github.com/panmap/)

Usage
-----
Load scripts

    <script src="http://maps.googleapis.com/maps/api/js?sensor=false&libraries=drawing"></script>
    <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script src="PATH_TO_JS/jquery.panmap.js"></script>

**IMPORTANT! add library to google maps API! libraries=drawing

Create an instance
    $("target").panmap({
        height: "300px",
        width: "100%",
        change: function(object) {}
        data: {
            center:{lat:50.11111, lng:20.222222, zoom: 10},
            objects:[
        	{type:"marker", lat:50.11112, lng: ...},
        	{type:"marker", ...},
        	etc...
            ]
        }
    });

Make editable true

    $("target").panmap("edit",true);

Make editable false

    $("target").panmap("edit",false);

Get value

    $("target").panmap(value);

Save to JSON

    MYJSON = $.toJSON($("target").panmap(value));

Load from JSON
    
    $("target").panmap({
	data: $.evalJSON(MYJSON);
    });

