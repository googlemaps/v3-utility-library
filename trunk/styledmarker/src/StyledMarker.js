/**
 * @name StyledMarkerMaker
 * @version 0.5
 * @author Gabriel Schneider
 * @copyright (c) 2010 Gabriel Schneider
 * @fileoverview This gives you static functions for creating dynamically
 *     sized and colored marker markers using Charts API outputs as well
 *     as an ability to extend with custom types.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

var StyledIcons = {};
 
function StyledMarker(opts) {
  var me=this, k, cpn, cp, ct;
  opts=opts||{};
  ct = opts.customtype;
  
  function setupStyle_(refresh) {
    ct.getStyle_(function() {
      me.setIcon(ct.icon);
      me.setShape(ct.shape);
    },refresh);
    ct.getStyle_(function() {
      me.setShadow(ct.shadow);
    }, refresh, true);
  }
  
  if (ct) {
    opts.icon = 'nothing';
    this.setOptions(opts);
    setupStyle_(false);
    cpn = ct.pn_;
    for (k = 0; k < ct.pn_.length; k++) {
      google.maps.event.addListener(ct.props, cpn[k] + '_changed', function() {
        setupStyle_(true);
      });
    }
  } else {
    this.setOptions(opts);
  }
}
StyledMarker.prototype = new google.maps.Marker();

function StyledIcon() {  
  this.getURL = function(){return '';};
  this.getShadowURL = function(){return '';};
  this.getAnchor = function(){return new google.maps.Point(0,0);};
  this.getShadowAnchor = function(){return new google.maps.Point(0,0);};
  this.getShape = function(){return {coord:[],type:'poly'};};
  this.icon;
  this.shadow;
  this.shape;
  
  this.init = function(o, props) {
    var k,w, gpn, gp, me = this;
    me.props = new google.maps.MVCObject();
    me.pn_ = [];
    me.os_ = {};
    me.styleClass = {};
    for (k in props) {
      me.os_[k]=(o[k])?true:false;
      me.props.set(k, props[k]);
      me.pn_.push(k);
    }
    if (o.styleClass) {
      me.styleClass = o.styleClass;
      gpn = o.styleClass.pn_;
      gp = o.styleClass.props;
      for (k = 0; k < gpn.length; k++) {
        //gp.bindTo(gpn[k],me.props);
        if (o.styleClass.os_[gpn[k]]) me.props.set(gpn[k], gp[gpn[k]]);
        google.maps.event.addListener(gp, [gpn[k] + '_changed'], (function(x) {
          return function() {
            me.props.set(gpn[x], gp[gpn[x]]);
          };
        })(k));
      }
    }
  };
  
  this.getStyle_ = function(callback,refresh,shadow) {
    var me = this, _image, _event;
    if(refresh||(shadow&&!me.shadow)||(!shadow&&!me.icon)) {
      _image = document.createElement('img');
      _event = google.maps.event.addDomListener(_image, 'load', function() {
        var w = _image.width, h = _image.height;
        if (shadow) {
          me.shadow = new google.maps.MarkerImage(me.getShadowURL(),null,null,me.getShadowAnchor(w,h));
        } else {
          me.icon = new google.maps.MarkerImage(me.getURL(),null,null,me.getAnchor(w,h));
          me.shape = me.getShape(w,h);
        }
        google.maps.event.removeListener(_event);
        _image = null;
        callback();
      });
      _image.src = (shadow)?this.getShadowURL():this.getURL();
    } else {
      callback();
    }
  }
};

StyledIcons.Marker = function(opts) {
  var me = this;
  opts=opts||{};
  
  me.init(opts, {
    text:opts.text||'',
    color:opts.color||'ff0000',
    fore:opts.fore||'000000',
    starcolor:opts.starcolor||null
  });

  me.getURL = function(){
    var _url, mp=me.props;
    if (mp.starcolor) {
      _url = 'http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin_star|';
    } else {
      _url = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=';
    }
    if (mp.text) {
      mp.text = mp.text.substr(0,1);
    }
    _url+=mp.text+'|';
    _url+=mp.color+'|';
    _url+=mp.fore;
    if (mp.starcolor) {
      _url+='|'+mp.starcolor;
    }
    return _url;
  };
  me.getShadowURL = function(){
    if (me.props.starcolor) {
      return 'http://chart.apis.google.com/chart?chst=d_map_xpin_shadow&chld=pin_star';
    } else {
      return 'http://chart.apis.google.com/chart?chst=d_map_pin_shadow';
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
    _iconmap.type = 'poly';
    return _iconmap;
  };
};
StyledIcons.Marker.prototype = new StyledIcon();

StyledIcons.Bubble = function(opts) {
  var me = this;
  
  me.init(opts, {
    text:opts.text||'',
    color:opts.color||'ff0000',
    fore:opts.fore||'000000'
  });
  
  me.getURL = function(){
    var mp=me.props,_url = 'http://chart.apis.google.com/chart?chst=d_bubble_text_small&chld=bb|';
    _url+=mp.text+'|';
    _url+=mp.color+'|';
    _url+=mp.fore;
    return _url;
  };
  me.getShadowURL = function(){
    return 'http://chart.apis.google.com/chart?chst=d_bubble_text_small_shadow&chld=bb|' + (opts.text||'');
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
    _iconmap.type = 'poly';
    return _iconmap;
  };
};
StyledIcons.Bubble.prototype = new StyledIcon();

StyledIcons.Flat = function(opts) {
  var me = this;
  
  me.init(opts, {
    width: opts.width || 32,
    height: opts.height || 32,
    primaryColor: opts.primaryColor || '#ff0000',
    shadowColor: opts.shadowColor || '#000000',
    label: MapIconMaker.escapeUserText_(opts.label) || '',
    labelColor: opts.labelColor || '#000000',
    labelSize: opts.labelSize || 0,
    shape: opts.shape ||  'circle',
    shapeCode: (shape === 'circle') ? 'it' : 'itr'
  });

  me.getURL = function(){
    var mp=me.props,_url = 'http://chart.apis.google.com/chart?cht=' + shapeCode;
    _url+='&chs=' +  mp.width + 'x' + mp.height + 
          '&chco=' + mp.primaryColor.replace('#', '') + ',' + 
          mp.shadowColor.replace('#', '') + 'ff,ffffff01' +
          '&chl=' + mp.label + '&chx=' + mp.labelColor.replace('#', '') + 
          ',' + mp.labelSize + '&chf=bg,s,00000000' + '&ext=.png';
    return _url;
  };
  me.getShadowURL = function(){
    return '';
  };
  me.getAnchor = function(width,height){
    return new google.maps.Point((width / 2, height / 2));
  };
  me.getShadowAnchor = function(width,height){
    return new google.maps.Point(0,0);
  };
  me.getShape = function(width,height){
    var _iconmap = {};
    if (shapeCode === 'itr') {
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
    _iconmap.type = 'poly';
    return _iconmap;
  };
};
StyledIcons.Flat.prototype = new StyledIcon();