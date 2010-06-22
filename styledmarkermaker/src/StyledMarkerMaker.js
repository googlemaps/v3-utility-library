/**
 * @name StyledMarkerMaker
 * @version 0.5
 * @author Gabriel Schneider
 * @copyright (c) 2010 Gabriel Schneider
 * @fileoverview This gives you static functions for creating dynamically
 *     sized and colored marker markers using Charts API outputs as well
 *     as an ability to extend with custom types.
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

var StyledMarkerMaker = {
	types: {},
	setSize_: function(url,customtype,callback,shadow) {
		var _image = document.createElement("img");
		var _e = google.maps.event.addDomListener(_image, "load", function() {
			if (shadow) {
				customtype.shadowWidth = _image.width;
				customtype.shadowHeight = _image.height;
				callback(_image.width,_image.height);
			} else {
				customtype.width = _image.width;
				customtype.height = _image.height;
				callback(_image.width,_image.height);
			}
			google.maps.event.removeListener(_e);
			_image = null;
		});
		_image.src = url;
	},
	create: function(opts) {
		var _m, _i = document.createElement("img"), _s = document.createElement("img"), _ie, _se;
		opts=opts||{};
		
		if (opts.customtype) {
			opts.icon = "b";
			//opts.icon = new google.maps.MarkerImage(opts.customtype.getURL(),null,null,opts.customtype.getAnchor());
			//opts.shadow = new google.maps.MarkerImage(opts.customtype.getShadowURL(),null,null,opts.customtype.getShadowAnchor());
			//opts.shape = opts.customtype.getShape();
			_m=new google.maps.Marker(opts);
			if (!opts.customtype.width) {
				this.setSize_(opts.customtype.getURL(), opts.customtype, function(w,h) {
					_m.setIcon(new google.maps.MarkerImage(opts.customtype.getURL(),null,null,opts.customtype.getAnchor(w,h)));
					_m.setShape(opts.customtype.getShape(w,h));
					_i = null;
				});
			}
			if (!opts.customtype.shadowWidth) {
				this.setSize_(opts.customtype.getShadowURL(), opts.customtype, function(w, h) {
					_m.setShadow(new google.maps.MarkerImage(opts.customtype.getShadowURL(),null,null,opts.customtype.getShadowAnchor(w,h)));
					_s = null;
				}, true);
			}
			_i.src = opts.customtype.getURL();
			_s.src = opts.customtype.getShadowURL();
		} else {
			_m=new google.maps.Marker(opts);
		}
		return _m;
	}
};

StyledMarkerMaker.types.MARKER = function(opts) {
	var me = this;
	me.getURL = function(){
		var _url;
		if (opts.starcolor) {
			_url = "http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin_star|";
		} else {
			_url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=";
		}
		if (opts.text) {
			opts.text = opts.text.substr(0,1);
		}
		_url+=(opts.text)?opts.text+"|":"|";
		_url+=(opts.color)?opts.color+"|":"ff0000|";
		_url+=(opts.fore)?opts.fore:"000000";
		if (opts.starcolor) {
			_url+="|"+opts.starcolor;
		}
		return _url;
	};
	me.getShadowURL = function(){
		if (opts.starcolor) {
			return "http://chart.apis.google.com/chart?chst=d_map_xpin_shadow&chld=pin_star";
		} else {
			return "http://chart.apis.google.com/chart?chst=d_map_pin_shadow";
		}
	};
	me.getAnchor = function(width,height){
		return new google.maps.Point(width / 2,height);
	};
	me.getShadowAnchor = function(width,height){
		return new google.maps.Point(width / 4,height);
	};
	me.getShape = function(width,height){
		var _iconmap = {};
		_iconmap.coord = [
			width / 2, height,
			(7 / 16) * width, (5 / 8) * height,
			(5 / 16) * width, (7 / 16) * height,
			(7 / 32) * width, (5 / 16) * height,
			(5 / 16) * width, (1 / 8) * height,
			(1 / 2) * width, 0,
			(11 / 16) * width, (1 / 8) * height,
			(25 / 32) * width, (5 / 16) * height,
			(11 / 16) * width, (7 / 16) * height,
			(9 / 16) * width, (5 / 8) * height
		];
		for (var i = 0; i < _iconmap.coord.length; i++) {
			_iconmap.coord[i] = parseInt(_iconmap.coord[i]);
		}
		_iconmap.type = "poly";
		return _iconmap;
	};
};

StyledMarkerMaker.types.BUBBLE = function(opts) {
	var me = this;
	me.getURL = function(){
		var _url = "http://chart.apis.google.com/chart?chst=d_bubble_text_small&chld=bb|";
		_url+=(opts.text)?opts.text+"|":"|";
		_url+=(opts.color)?opts.color+"|":"ff0000|";
		_url+=(opts.fore)?opts.fore:"000000";
		return _url;
	};
	me.getShadowURL = function(){
		return "http://chart.apis.google.com/chart?chst=d_bubble_text_small_shadow&chld=bb|" + (opts.text||'');
	};
	me.getAnchor = function(width,height){
		return new google.maps.Point(0,42);
	};
	me.getShadowAnchor = function(width,height){
		return new google.maps.Point(0,44);
	};
	me.getShape = function(width,height){
		var _iconmap = {};
		_iconmap.coord = [
			0,44,
			13,26,
			13,6,
			17,1,
			width - 4,1,
			width,6,
			width,21,
			width - 4,26,
			21,26
		];
		for (var i = 0; i < _iconmap.coord.length; i++) {
			_iconmap.coord[i] = parseInt(_iconmap.coord[i]);
		}
		_iconmap.type = "poly";
		return _iconmap;
	};
};

StyledMarkerMaker.types.FLAT = function(opts) {
	var me = this;
	var width = opts.width || 32;
	var height = opts.height || 32;
	var primaryColor = opts.primaryColor || "#ff0000";
	var shadowColor = opts.shadowColor || "#000000";
	var label = MapIconMaker.escapeUserText_(opts.label) || "";
	var labelColor = opts.labelColor || "#000000";
	var labelSize = opts.labelSize || 0;
	var shape = opts.shape ||  "circle";
	var shapeCode = (shape === "circle") ? "it" : "itr";

	me.getURL = function(){
		var _url = "http://chart.apis.google.com/chart?cht=" + shapeCode;
		_url+="&chs=" + width + "x" + height + 
		      "&chco=" + primaryColor.replace("#", "") + "," + 
		      shadowColor.replace("#", "") + "ff,ffffff01" +
		      "&chl=" + label + "&chx=" + labelColor.replace("#", "") + 
		      "," + labelSize + "&chf=bg,s,00000000" + "&ext=.png";
		return _url;
	};
	me.getShadowURL = function(){
		return "";
	};
	me.getAnchor = function(){
		return new google.maps.Point((width / 2, height / 2));
	};
	me.getShadowAnchor = function(width,height){
		return new google.maps.Point(0,0);
	};
	me.getShape = function(){
		var _iconmap = {};
		if (shapeCode === "itr") {
			_iconmap.coord = [0, 0, width, 0, width, height, 0, height];
		} else {
			_iconmap.coord = [];
			var polyNumSides = 8;
			var polySideLength = 360 / polyNumSides;
			var polyRadius = Math.min(width, height) / 2;
			for (var a = 0; a < (polyNumSides + 1); a++) {
				var aRad = polySideLength * a * (Math.PI / 180);
				var pixelX = polyRadius + polyRadius * Math.cos(aRad);
				var pixelY = polyRadius + polyRadius * Math.sin(aRad);
				_iconmap.coord.push(parseInt(pixelX), parseInt(pixelY));
			}
		}
		_iconmap.type = "poly";
		return _iconmap;
	};
};