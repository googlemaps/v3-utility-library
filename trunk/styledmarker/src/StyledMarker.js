/**
 * @name StyledMarkerMaker
 * @version 0.5
 * @author Gabriel Schneider
 * @copyright (c) 2010 Gabriel Schneider
 * @fileoverview This gives you static functions for creating dynamically
 *     styled markers using Charts API outputs as well as an ability to
 *     extend with custom types.
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

var StyledIconTypes = {};
var StyledMarker, StyledIcon;
 
(function() {
  var bu_ = 'http://chart.apis.google.com/chart?chst=',gm_ = google.maps, gp_ = gm_.Point;
  var ge_ = gm_.event, gmi_ = gm_.MarkerImage;
  

  /**
  * This class is an extended version of google.maps.Marker. It allows
  * styles to be applied that change it's appearance.
  * @extends google.maps.Marker
  * @param {StyledMarkerOptions} StyledMarkerOptions The options for the Marker
  */
  StyledMarker = function(StyledMarkerOptions) {
    var me=this,ci = me.styleIcon = StyledMarkerOptions.styleIcon;
    StyledMarkerOptions=StyledMarkerOptions||{};
    function setIcon() {
      if (ci.i_&&ci.sw_&&ci.s_) {
        me.setShape(ci.s_);
        me.setShadow(ci.sw_);
        me.setIcon(ci.i_);
      }
    }
    StyledMarkerOptions.icon = ci.getType().getURL(ci);
    me.setOptions(StyledMarkerOptions);
    
    setIcon();
    ge_.addListener(ci,'iconready',function() {
      setIcon();
    });
  };
  StyledMarker.prototype = new gm_.Marker();
  
  /**
  * This class stores style information that can be applied to StyledMarkers.
  * @extends google.maps.MVCObject
  * @param {StyledIconType} StyledIconType The type of style this icon is.
  * @param {StyledIconOptions} StyledIconOptions The options for this StyledIcon.
  * @param {StyledIcon} StyleClass A class to apply extended style information.
  */
  StyledIcon = function(StyledIconType,StyledIconOptions,StyleClass) {
    var k,v,e,me=this;
    me.i_ = null;
    me.sw_ = null;
    me.s_ = null;
    
    function gs_() {
      var image_, simage_, done_ = 0;
      image_ = document.createElement('img');
      simage_ = document.createElement('img');
      ge_.addDomListenerOnce(simage_, 'load', function() {
        var w = simage_.width, h = simage_.height;
        me.sw_ = new gmi_(StyledIconType.getShadowURL(me),null,null,StyledIconType.getShadowAnchor(me,w,h));
        done_++;
        if (done_ === 2) {
          ge_.trigger(me,'iconready');
        }
      });
      ge_.addDomListenerOnce(image_, 'load', function() {
        var w = image_.width, h = image_.height;
        me.i_ = new gmi_(StyledIconType.getURL(me),null,null,StyledIconType.getAnchor(me,w,h));
        me.s_ = StyledIconType.getShape(me,w,h);
        image_ = null;
        done_++;
        if (done_ === 2) {
          ge_.trigger(me,'iconready');
        }
      });
      image_.src = StyledIconType.getURL(me);
      simage_.src = StyledIconType.getShadowURL(me);
      if (!e) e = ge_.addListener(me,'changed',function(k) {
        gs_();
      });
    }

    /**
    * set:
    * This function sets a given style property to the given value.
    * @param {String} name The name of the property to set.
    * @param {Object} value The value to set the property to.
    * get:
    * This function gets a given style property.
    * @param {String} name The name of the property to get.
    * @return {Object}
    */
  
  
    if (StyledIconType !== StyledIconTypes.CLASS) {
      for (k in StyledIconType.defaults) {
        me.set(k, StyledIconType.defaults[k]);
      }
    } else {
      ge_.addListener(me,'changed',function(k) {
        StyledIconOptions[k] = me.get(k);
      });
    }
    me.gv_ = function() {
      return StyledIconOptions;
    };
    /**
    * This function returns the StyledIconType associated with this StyledIcon.
    * @return {StyledIconType}
    */
    me.getType = function() {
      return StyledIconType;
    };
    me.changed = function(k) {
      ge_.trigger(me,'changed',k);
    };
    me.setValues(StyledIconOptions);
    if (StyleClass) {
      ge_.addListener(StyleClass,'changed',function(k) {
        me.set(k,StyleClass.get(k));
      });
      v = StyleClass.gv_();
      for (k in v) {
        me.set(k,v[k]);
      }
    }
    if (StyledIconType !== StyledIconTypes.CLASS) {
      gs_();
    }
  };
  StyledIcon.prototype = new gm_.MVCObject();
  
  /**
  * StyledIconType
  * This class holds functions for building the information needed to style markers.
  * getURL:
  * This function builds and returns a URL to use for the Marker icon property.
  * @param {StyledIcon} icon The StyledIcon that holds style information
  * @return {String}
  * getShadowURL:
  * This function builds and returns a URL to use for the Marker shadow property.
  * @param {StyledIcon} icon The StyledIcon that holds style information
  * @return {String{
  * getAnchor:
  * This function builds and returns a Point to indicate where the marker is placed.
  * @param {StyledIcon} icon The StyledIcon that holds style information
  * @param {Number} width The width of the icon image.
  * @param {Number} height The height of the icon image.
  * @return {google.maps.Point}
  * getShadowAnchor:
  * This function builds and returns a Point to indicate where the shadow is placed.
  * @param {StyledIcon} icon The StyledIcon that holds style information
  * @param {Number} width The width of the shadow image.
  * @param {Number} height The height of the shadow image.
  * @return {google.maps.Point}
  * getShape:
  * This function builds and returns a MarkerShape to indicate where the Marker is clickable.
  * @param {StyledIcon} icon The StyledIcon that holds style information
  * @param {Number} width The width of the icon image.
  * @param {Number} height The height of the icon image.
  * @return {google.maps.MarkerShape}
  */
  
  StyledIconTypes.CLASS = {};
  
  StyledIconTypes.MARKER = {
    defaults: {
      text:'',
      color:'00ff00',
      fore:'000000',
      starcolor:null
    },
    getURL: function(props){
      var _url,starcolor_=props.get('starcolor'),
        text_=props.get('text'),
        color_=props.get('color').replace(/#/,''),
        fore_=props.get('fore').replace(/#/,'');
      if (starcolor_) {
        _url = bu_ + 'd_map_xpin_letter&chld=pin_star|';
      } else {
        _url = bu_ + 'd_map_pin_letter&chld=';
      }
      if (text_) {
        text_ = text_.substr(0,2);
      }
      _url+=text_+'|';
      _url+=color_+'|';
      _url+=fore_;
      if (starcolor_) {
        _url+='|'+starcolor_.replace(/#/,'');
      }
      return _url;
    },
    getShadowURL: function(props){
      if (props.get('starcolor')) {
        return bu_ + 'd_map_xpin_shadow&chld=pin_star';
      } else {
        return bu_ + 'd_map_pin_shadow';
      }
    },
    getAnchor: function(props,width,height){
      return new gp_(width / 2,height);
    },
    getShadowAnchor: function(props,width,height){
      return new gp_(width / 4,height);
    },
    getShape: function(props,width,height){
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
    }
  };
  StyledIconTypes.BUBBLE = {
    defaults: {
      text:'',
      color:'00ff00',
      fore:'000000'
    },
    getURL: function(props){
      var _url = bu_ + 'd_bubble_text_small&chld=bb|';
      _url+=props.get('text')+'|';
      _url+=props.get('color').replace(/#/,'')+'|';
      _url+=props.get('fore').replace(/#/,'');
      return _url;
    },
    getShadowURL: function(props){
      return bu_ + 'd_bubble_text_small_shadow&chld=bb|' + props.get('text');
    },
    getAnchor: function(props,width,height){
      return new google.maps.Point(0,42);
    },
    getShadowAnchor: function(props,width,height){
      return new google.maps.Point(0,44);
    },
    getShape: function(props,width,height){
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
    }
  };
})();