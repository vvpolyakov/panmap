/*
 * jQuery panmap: Editable Google maps
 *
 * Copyright 2012 Polyakov Vladimir. (http://www.github.com/vvpolyakov/panmap)
 *
 * Dual licensed under the MIT or GPL Version 2 licenses
 *
*/

if (jQuery) (function($){

    $.fn.panmap = function(o,param) {
	var i;
	var varnames=['title','content','icon','strokeColor','strokeOpacity','strokeWeight','fillColor','fillOpacity'];
	var defaults = {
	    "marker":{
		marker:"http://maps.google.com/mapfiles/marker.png"
	    },
	    "polyline": {
		strokeColor:"#FF0000",
		strokeOpacity:"1.0",
		strokeWeight:"2",
	    },
	    "polygon": {
		strokeColor:"#FF0000",
		strokeOpacity:"1.0",
		strokeWeight:"2",
		fillColor:"#FF0000",
		fillOpacity:"0.35",
	    },
	    "rectangle": {
		strokeColor:"#FF0000",
		strokeOpacity:"1.0",
		strokeWeight:"2",
		fillColor:"#FF0000",
		fillOpacity:"0.35",
	    },
	    "circle": {
		strokeColor:"#FF0000",
		strokeOpacity:"1.0",
		strokeWeight:"2",
		fillColor:"#FF0000",
		fillOpacity:"0.35",
	    }
	};
	var u = "http://maps.google.com/mapfiles/";
	var icons = [
	    u+"marker.png",
	    u+"marker_black.png",
	    u+"marker_grey.png",
	    u+"marker_orange.png",
	    u+"marker_white.png",
	    u+"marker_yellow.png",
	    u+"marker_purple.png",
	    u+"marker_green.png",
	    u+"dd-start.png",
	    u+"dd-end.png",
	    u+"markerA.png",
	    u+"markerB.png",
	    u+"markerC.png",
	    u+"markerD.png",
	    u+"markerE.png",
	    u+"markerF.png",
	    u+"markerG.png",
	    u+"markerH.png",
	    u+"markerI.png",
	    u+"markerJ.png",
	    u+"markerK.png",
	    u+"markerL.png",
	    u+"markerM.png",
	    u+"markerN.png",
	    u+"markerO.png",
	    u+"markerP.png",
	    u+"markerQ.png",
	    u+"markerR.png",
	    u+"markerS.png",
	    u+"markerT.png",
	    u+"markerV.png",
	    u+"markerU.png",
	    u+"markerW.png",
	    u+"markerX.png",
	    u+"markerY.png",
	    u+"markerZ.png",
	    u+"arrow.png",
	    u+"ms/micons/tree.png",
	    u+"ms/micons/lodging.png",
	    u+"ms/micons/bar.png",
	    u+"ms/micons/restaurant.png",
	    u+"ms/micons/horsebackriding.png",
	    u+"ms/micons/convienancestore.png",
	    u+"ms/micons/hiker.png",
	    u+"ms/micons/swimming.png",
	    u+"ms/micons/fishing.png",
	    u+"ms/micons/golfer.png",
	    u+"ms/micons/sportvenue.png",
	]
	var tr = function(w){return w;}
	var init = function() {
	    var map;
	    var data={
		center: {lat:50,lng:20,zoom:3},
		objects :[],
	    };
	    o=$.extend(true,{
		width: "100%",
		height: "300px",
		change: function(){}
	    },o);
	
	    data = $.extend(true,data,o.data);
	    
	    $(this).get(0).dataRef = data;
	    $(this).css({width:o.width, height:o.height});


	    var mapdata = {
		zoom: data.center.zoom,
		center: new google.maps.LatLng(data.center.lat, data.center.lng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map($(this).get(0),mapdata);
	    data.map = map;
	    var infowindow = new google.maps.InfoWindow();

	    
	    var displayObject = function (obj) {
		var coordinates;
		var i;
		if (!obj.ref) switch (obj.type) {
		    case "marker":
			obj.ref = new google.maps.Marker({
			    position: new google.maps.LatLng(obj.lat,obj.lng),
			    map: map,
			    title: obj.title,
			    icon: obj.icon||null
			});
			break;
		    case "rectangle":
			obj.ref = new google.maps.Rectangle({
			    bounds: new google.maps.LatLngBounds(new google.maps.LatLng(obj.swlat,obj.swlng),new google.maps.LatLng(obj.nelat,obj.nelng)),
			    map: map,
			    strokeColor: obj.strokeColor||null,
			    strokeOpacity: obj.strokeOpacity||null,
			    strokeWeight: obj.strokeWeight||null,
			    fillColor: obj.fillColor||null,
			    fillOpacity: obj.fillOpacity||null
			});
			break;
		    case "circle":
			obj.ref = new google.maps.Circle({
			    center:new google.maps.LatLng(obj.lat,obj.lng),
			    radius: obj.radius,
			    map: map,
			    strokeColor: obj.strokeColor||null,
			    strokeOpacity: obj.strokeOpacity||null,
			    strokeWeight: obj.strokeWeight||null,
			    fillColor: obj.fillColor||null,
			    fillOpacity: obj.fillOpacity||null
			});
			break;
		    case "polygon":
		    case "polyline":
			coordinates = [];
			for (i in obj.path) {
			    coordinates.push(new google.maps.LatLng(obj.path[i].lat, obj.path[i].lng));
			}
			obj.ref = new google.maps[obj.type=='polyline'?"Polyline":"Polygon"]({
			    map: map,
			    path: coordinates,
			    strokeColor: obj.strokeColor||null,
			    strokeOpacity: obj.strokeOpacity||null,
			    strokeWeight: obj.strokeWeight||null,
			    fillColor: obj.fillColor||null,
			    fillOpacity: obj.fillOpacity||null
			});
			break;
		}
		google.maps.event.addListener(obj.ref, 'click', function(event) {
		    var html = "<div><strong>"+(obj.title||"")+"</strong><br>"+(obj.content||"")+"</div>";
		    if (data.drawingManager.get("drawingControl")) {
			html += "<table cellpadding=0 cellspacing=0 width=400>"+
			"<tr><td>"+tr('title')+"</td><td><input class=\"panmap-title\"></td></tr>"+
			"<tr><td>"+tr('content')+"</td><td><input class=\"panmap-content\"></td></tr>";
			if (obj.type=='marker') {
			    html += "<tr><td>"+tr('marker')+"</td><td>";
			    html += "<input type=hidden class=panmap-icon>";
			    for (var i=0;i<icons.length;i++) {
			        html += "<div class=\"panmap-icons\" style=\"float:left; text-align:center; border:2px solid "+(obj.icon==icons[i]?"black":"white")+"; width:25px; height:35px; margin:2px; padding:3px;cursor:pointer\"><img src=\""+icons[i]+"\"></div>";
			    }
			    html +="</td></tr>";
			}
			else {
			    html +=
			    "<tr><td>"+tr('strokeColor')+"</td><td><input class=\"panmap-strokeColor\"></td></tr>"+
			    "<tr><td>"+tr('strokeWeight')+"</td><td><input class=\"panmap-strokeWeight\"></td></tr>"+
			    "<tr><td>"+tr('strokeOpacity')+"</td><td><input class=\"panmap-strokeOpacity\"></td></tr>"+
			    "<tr><td>"+tr('fillColor')+"</td><td><input class=\"panmap-fillColor\"></td></tr>"+
			    "<tr><td>"+tr('fillOpacity')+"</td><td><input class=\"panmap-fillOpacity\"></td></tr>";
			}
			html +="</table>"+
			"<button class=\"panmap-save\">"+tr('save')+"</button>"+
			"<button class=\"panmap-delete\">"+tr('delete')+"</button>";
		    }
		    if (data.drawingManager.get("drawingControl") || obj.title > "" || obj.content>"") {
			infowindow.setContent(html);
			infowindow.setPosition(event.latLng);
			infowindow.open(map);
		    }
		    if (data.drawingManager.get("drawingControl")) {
			$(".panmap-icons").click(function(){
			    $(".panmap-icons").css({border:"2px solid white"});
			    $(this).css({border:"2px solid black"});
			    $(".panmap-icon").val($(this).find("img").attr("src"));
			});
			for (var i in varnames) {
			    $(".panmap-"+varnames[i]).val(obj[varnames[i]]);
			}
			$(".panmap-save").click(function(){
			    for (var i in varnames) {
				obj[varnames[i]] = $(".panmap-"+varnames[i]).val();
				obj.ref.set(varnames[i],obj[varnames[i]]||null);
			    }
			    o.change(obj);
			    infowindow.close();
			});
			$(".panmap-delete").click(function(){
			    obj.ref.setMap(null);
			    obj.ref = null;
			    //for (var i in obj) delete obj[i];
			    //alert(dump(obj));
			    //for (i in data.objects) if (!data.objects[i]) data.objects.splice(i,1);
			    infowindow.close();
			});
			if ($.fn.miniColors){
			    $(".panmap-strokeColor").miniColors();
			    $(".panmap-fillColor").miniColors();
			}
		    }
		});
	    }
	
	    var centersave = function() {
		data.center.lat = map.getCenter().lat();
		data.center.lng = map.getCenter().lng();
		data.center.zoom = map.getZoom();
	    };

	    for (var i=0; i<data.objects.length; i++) {
		displayObject(data.objects[i]);
	    }
	
	    
	    data.drawingManager = new google.maps.drawing.DrawingManager({
		drawingControl: false,
		drawingControldata: {
		    position: google.maps.ControlPosition.TOP_CENTER,
		},
		markerOptions:   $.extend({draggable:true},defaults.marker),
		circleOptions:   $.extend({editable:true},defaults.circle),
		polylineOptions: $.extend({editable:true},defaults.polyline),
		polygonOptions:  $.extend({editable:true},defaults.polygon),
		rectangleOptions:$.extend({editable:true},defaults.rectangle)
	    });
	    google.maps.event.addListener(data.drawingManager, 'overlaycomplete', function(event) {
		data.objects.push({type:event.type, ref:event.overlay});
		var ob = data.objects[data.objects.length-1];
		ob=$.extend(ob,defaults[event.type]);
		displayObject(ob);
		o.change(ob);
	    });
	    data.drawingManager.setMap(map);
	};
	
	
	if (o == "value") {
	    var out = $.extend(true,{},$(this).get(0).dataRef);
	    for (i=0;i<out.objects.length;i++) {
		if (!out.objects[i].ref) {
		    out.objects.splice(i,1);
		    i--;
		    continue;
		}
		switch(out.objects[i].type){
		    case "marker":
			out.objects[i].lat = out.objects[i].ref.getPosition().lat();
			out.objects[i].lng = out.objects[i].ref.getPosition().lng();
			break;
		    case "circle":
			out.objects[i].lat = out.objects[i].ref.getCenter().lat();
			out.objects[i].lng = out.objects[i].ref.getCenter().lng();
			out.objects[i].radius = out.objects[i].ref.getRadius();
			break;
		    case "rectangle":
			out.objects[i].nelat = out.objects[i].ref.getBounds().getNorthEast().lat();
			out.objects[i].nelng = out.objects[i].ref.getBounds().getNorthEast().lng();
			out.objects[i].swlat = out.objects[i].ref.getBounds().getSouthWest().lat();
			out.objects[i].swlng = out.objects[i].ref.getBounds().getSouthWest().lng();
			break;
		    case "polyline":
		    case "polygon":
			out.objects[i].path = [];
			var vertices = out.objects[i].ref.getPath();
			for (var j=0; j < vertices.length; j++) {
			    var xy = vertices.getAt(j);
			    out.objects[i].path.push({lat:xy.lat(),lng:xy.lng()});
			}
			break;
		}
		var g;
		for (var j in varnames) {
		    if (g=out.objects[i].ref.get(varnames[j])) out.objects[i][varnames[j]]=g;
		}
		out.objects[i].ref = "";
		delete out.objects[i].ref;
	    } 
	    out.center.lat=out.map.getCenter().lat();
	    out.center.lng=out.map.getCenter().lng();
	    out.center.zoom=out.map.getZoom();
	    delete out.map;
	    delete out.drawingManager;
	    return out;
	    
	} else if (o == "edit"){
	    $(this).each(function(){
		var d = $(this).get(0).dataRef;
		d.drawingManager.setOptions({
		    drawingControl: param?true:false
		});
		for(var i=0; i<d.objects.length; i++) {
		    if (d.objects[i].type=='marker') d.objects[i].ref.setDraggable(param?true:false);
		    else d.objects[i].ref.setEditable(param?true:false);
		}
	    });
	}
	else {
	    $(this).each(init);
	}
	return $(this);
    };
})(jQuery);
