(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var i = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var l = google.maps, n, o, q, r = {G:null, C:false}, t = {}, v = {};
function w(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function x(a, b, c) {
  if(a && b) {
    var d;
    for(d in a) {
      if(c || !(d in b)) {
        b[d] = a[d]
      }
    }
  }
  return b
}
function z() {
  l.event.trigger.apply(this, arguments)
}
function ba(a) {
  var b = "";
  for(var c in a) {
    if(a.hasOwnProperty(c)) {
      if(b.length > 0) {
        b += ";"
      }
      b += c + ":" + a[c]
    }
  }
  return b
}
function da() {
  if(typeof XMLHttpRequest === "undefined") {
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0")
    }catch(a) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0")
    }catch(b) {
    }
    try {
      return new ActiveXObject("Msxml2.XMLHTTP")
    }catch(c) {
    }
    throw new Error("This browser does not support XMLHttpRequest.");
  }else {
    return new XMLHttpRequest
  }
}
var A = "esriGeometryPoint", B = "esriGeometryMultipoint", C = "esriGeometryPolyline", D = "esriGeometryPolygon", E = "esriGeometryEnvelope";
function ea(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof l.LatLng || b instanceof l.Marker) {
    return a && a.splice && a.length > 1 ? B : A
  }else {
    if(b instanceof l.Polyline) {
      return C
    }else {
      if(b instanceof l.Polygon) {
        return D
      }else {
        if(b instanceof l.LatLngBounds) {
          return E
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return A
          }else {
            if(b.points) {
              return B
            }else {
              if(b.paths) {
                return C
              }else {
                if(b.rings) {
                  return D
                }
              }
            }
          }
        }
      }
    }
  }
  return null
}
function F(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof l.LatLng || b instanceof l.Marker || b instanceof l.Polyline || b instanceof l.Polygon || b instanceof l.LatLngBounds) {
    return true
  }
  return false
}
function I(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function J(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(J(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(F(a)) {
        var e;
        d = "{";
        switch(ea(a)) {
          case A:
            e = a && a.splice ? a[0] : a;
            if(e instanceof l.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case B:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof l.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case C:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + I(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case D:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + I(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case E:
            e = a && a.splice ? a[0] : a;
            d += "xmin:" + e.getSouthWest().lng() + ",ymin:" + e.getSouthWest().lat() + ",xmax:" + e.getNorthEast().lng() + ",ymax:" + e.getNorthEast().lat();
            break
        }
        d += ", spatialReference:{wkid:4326}";
        d += "}";
        return d
      }else {
        if(a.toJSON) {
          return a.toJSON()
        }else {
          b = "";
          for(c in a) {
            if(a.hasOwnProperty(c)) {
              if(b.length > 0) {
                b += ", "
              }
              b += c + ":" + J(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function fa(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = J(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function K(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e;
  b = fa(b);
  var j = document.getElementsByTagName("head")[0];
  if(!j) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    f && j.removeChild(f);
    f = null;
    d.apply(null, arguments);
    z(v, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !r.C) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    j.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var h = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      h = false
    }
    if(r.C) {
      h = true
    }
    if(h && !r.G) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var g = da();
    g.onreadystatechange = function() {
      if(g.readyState === 4) {
        if(g.status === 200) {
          eval(g.responseText)
        }else {
          throw new Error("Error code " + g.status);
        }
      }
    };
    g.open("POST", h ? r.G + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  z(v, "jsonpstart", e);
  return e
}
v.S = function(a, b, c, d) {
  K(a, b, c, d)
};
v.B = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        v.B(a, c)
      }else {
        F(c) && c.setMap(a)
      }
    }
  }
};
v.V = function(a, b) {
  v.B(null, a);
  if(b) {
    a.length = 0
  }
};
function L(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
L.prototype.forward = function(a) {
  return a
};
L.prototype.i = function() {
  return 360
};
L.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function M(a) {
  a = a || {};
  L.call(this, a)
}
M.prototype = new L;
function N(a) {
  a = a || {};
  L.call(this, a);
  var b = a.r, c = a.v * i, d = a.w * i, e = a.s * i;
  this.a = a.j / a.unit;
  this.g = a.h * i;
  this.k = a.p;
  this.l = a.q;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  e = O(this, e, this.c);
  c = O(this, c, this.c);
  d = O(this, d, this.c);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.A = a / (this.b * Math.pow(c, this.b));
  this.t = this.m(this.a, this.A, e, this.b)
}
N.prototype = new L;
N.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function O(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
N.prototype.m = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
N.prototype.forward = function(a) {
  var b = a[0] * i;
  a = this.m(this.a, this.A, O(this, a[1] * i, this.c), this.b);
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.t - a * Math.cos(b)]
};
N.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  L.call(this, a);
  this.a = a.j / a.unit;
  var b = a.r;
  this.F = a.R;
  var c = a.s * i;
  this.g = a.h * i;
  this.k = a.p;
  this.l = a.q;
  a = 1 / b;
  this.e = 2 * a - a * a;
  this.o = this.e * this.e;
  this.D = this.o * this.e;
  this.n = this.e / (1 - this.e);
  this.J = this.d(c, this.a, this.e, this.o, this.D)
}
P.prototype = new L;
P.prototype.d = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
P.prototype.forward = function(a) {
  var b = a[1] * i, c = a[0] * i;
  a = this.a / Math.sqrt(1 - this.e * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.n * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var f = this.d(b, this.a, this.e, this.o, this.D);
  return[this.k + this.F * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.n) * Math.pow(c, 5) / 120), this.l + this.F * (f - this.J) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.n) * Math.pow(c, 6) / 720)]
};
P.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  L.call(this, a);
  this.a = (a.j || 6378137) / (a.unit || 1);
  this.g = (a.h || 0) * i
}
Q.prototype = new L;
Q.prototype.forward = function(a) {
  var b = a[1] * i;
  return[this.a * (a[0] * i - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
Q.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  L.call(this, a);
  var b = a.r, c = a.v * i, d = a.w * i, e = a.s * i;
  this.a = a.j / a.unit;
  this.g = a.h * i;
  this.k = a.p;
  this.l = a.q;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  c = T(this, c, this.c);
  d = T(this, d, this.c);
  e = T(this, e, this.c);
  this.b = (a * a - b * b) / (d - c);
  this.z = a * a + this.b * c;
  this.t = this.m(this.a, this.z, this.b, e)
}
S.prototype = new L;
S.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function T(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
S.prototype.m = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
S.prototype.forward = function(a) {
  var b = a[0] * i;
  a = this.m(this.a, this.z, this.b, T(this, a[1] * i, this.c));
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.t - a * Math.cos(b)]
};
S.prototype.i = function() {
  return Math.PI * 2 * this.a
};
S.prototype.i = function() {
  return Math.PI * 2 * this.a
};
n = new M({wkid:4326});
o = new M({wkid:4269});
q = new Q({wkid:102113, j:6378137, h:0, unit:1});
t = {"4326":n, "4269":o, "102113":q, "102100":new Q({wkid:102100, j:6378137, h:0, unit:1})};
v.Q = function(a, b) {
  var c = t["" + a];
  if(c) {
    return c
  }
  if(b instanceof L) {
    c = t["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = w(c, 'PROJECTION["', '"]'), f = w(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(w(w(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.j = parseFloat(f[1]);
      d.r = parseFloat(f[2]);
      d.s = parseFloat(w(c, '"Latitude_Of_Origin",', "]"));
      d.h = parseFloat(w(c, '"Central_Meridian",', "]"));
      d.p = parseFloat(w(c, '"False_Easting",', "]"));
      d.q = parseFloat(w(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new L(d);
        break;
      case "Lambert_Conformal_Conic":
        d.v = parseFloat(w(c, '"Standard_Parallel_1",', "]"));
        d.w = parseFloat(w(c, '"Standard_Parallel_2",', "]"));
        c = new N(d);
        break;
      case "Transverse_Mercator":
        d.R = parseFloat(w(c, '"Scale_Factor",', "]"));
        c = new P(d);
        break;
      case "Albers":
        d.v = parseFloat(w(c, '"Standard_Parallel_1",', "]"));
        d.w = parseFloat(w(c, '"Standard_Parallel_2",', "]"));
        c = new S(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      t["" + a] = c
    }
  }
  return c
};
function U(a) {
  this.url = a;
  this.definition = null
}
function V(a, b) {
  this.url = a;
  this.M = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.K) {
    var d = this;
    window.setTimeout(function() {
      ga(d)
    }, b.K * 1E3)
  }else {
    ga(this)
  }
}
function ga(a) {
  K(a.url, {}, "", function(b) {
    ha(a, b)
  })
}
function ha(a, b) {
  x(b, a);
  a.spatialReference = b.spatialReference.wkt ? v.Q(b.spatialReference.wkt) : t[b.spatialReference.wkid];
  b.tables !== undefined ? K(a.url + "/layers", {}, "", function(c) {
    ia(a, c)
  }) : ia(a, b)
}
function ia(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, j, h;
  f = 0;
  for(j = b.layers.length;f < j;f++) {
    h = b.layers[f];
    e = new U(a.url + "/" + h.id);
    x(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(j = b.tables.length;f < j;f++) {
      h = b.tables[f];
      e = new U(a.url + "/" + h.id);
      x(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.subLayers = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var m = a.layers;
          if(m) {
            for(var k = 0, p = m.length;k < p;k++) {
              if(g === m[k].id) {
                g = m[k];
                break a
              }
              if(g && typeof g === "string" && m[k].name.toLowerCase() === g.toLowerCase()) {
                g = m[k];
                break a
              }
            }
          }
          g = null
        }
        e.subLayers.push(g);
        g.T = e
      }
    }
  }
  a.M = true;
  z(a, "load")
}
V.prototype.find = function(a, b, c) {
  if(a) {
    var d = x(a, {});
    if(a.layerIds) {
      d.layers = a.layerIds.join(",");
      delete d.layerIds
    }
    if(a.searchFields) {
      d.searchFields = a.searchFields.join(",")
    }
    d.contains = a.contains === false ? false : true;
    if(a.layerDefinitions) {
      d.layerDefs = ba(a.layerDefinitions);
      delete d.layerDefinitions
    }
    d.sr = 4326;
    d.returnGeometry = a.returnGeometry === false ? false : true;
    K(this.url + "/find", d, "", function(e) {
      var f, j, h;
      if(e.results) {
        for(f = 0;f < e.results.length;f++) {
          j = e.results[f];
          a: {
            h = j.geometry;
            var g = a.overlayOptions, m = null, k = void 0, p = void 0, y = void 0;
            k = void 0;
            var G = void 0, s = void 0, u = void 0, R = void 0, H = void 0;
            g = g || {};
            if(h) {
              m = [];
              if(h.x) {
                k = new l.Marker(x(g.markerOptions || g, {position:new l.LatLng(h.y, h.x)}));
                m.push(k)
              }else {
                s = h.points || h.paths || h.rings;
                if(!s) {
                  h = m;
                  break a
                }
                var ca = [];
                p = 0;
                for(y = s.length;p < y;p++) {
                  u = s[p];
                  if(h.points) {
                    k = new l.Marker(x(g.markerOptions || g, {position:new l.LatLng(u[1], u[0])}));
                    m.push(k)
                  }else {
                    H = [];
                    k = 0;
                    for(G = u.length;k < G;k++) {
                      R = u[k];
                      H.push(new l.LatLng(R[1], R[0]))
                    }
                    if(h.paths) {
                      k = new l.Polyline(x(g.polylineOptions || g, {path:H}));
                      m.push(k)
                    }else {
                      h.rings && ca.push(H)
                    }
                  }
                }
                if(h.rings) {
                  k = new l.Polygon(x(g.U || g, {paths:ca}));
                  m.push(k)
                }
              }
            }
            h = m
          }
          j.L = {geometry:h, attributes:j.attributes};
          delete j.attributes
        }
      }
      b(e);
      c && e && e.error && c(e.error)
    })
  }
};
function W(a) {
  this.N = a ? a.lods : null;
  this.u = a ? t[a.spatialReference.wkid || a.spatialReference.wkt] : q;
  if(!this.u) {
    throw new Error("unsupported Spatial Reference");
  }
  this.H = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.u.i() / this.H / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.N.length - 1 : 20;
  if(l.Size) {
    this.W = a ? new l.Size(a.cols, a.rows) : new l.Size(256, 256)
  }
  this.I = Math.pow(2, this.minZoom) * this.H;
  this.O = a ? a.origin.x : -2.0037508342787E7;
  this.P = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
W.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.u.forward([a.lng(), a.lat()]), d = b || new l.Point(0, 0);
  d.x = (c[0] - this.O) / this.I;
  d.y = (this.P - c[1]) / this.I;
  return d
};
W.prototype.fromLatLngToPoint = W.prototype.fromLatLngToPoint;
new W;
new l.OverlayView;
var ja = v;var X = [], Y, Z, $;
function ka(a) {
  a = a.results;
  for(var b = 0, c = a.length;b < c;b++) {
    la(a[b])
  }
}
function la(a) {
  var b = a.L, c = b.geometry;
  b = b.attributes;
  a = a.layerName + ":" + a.foundFieldName + " = " + a.value + "<br/>";
  var d = '<div style="width:200px;height:200px;overflow:auto;font-size:small">';
  d += "<b>" + a + "</b>";
  for(var e in b) {
    if(b.hasOwnProperty(e)) {
      d += e + ": " + b[e] + "<br/>"
    }
  }
  d += "</div>";
  e = 0;
  for(b = c.length;e < b;e++) {
    var f = c[e];
    google.maps.event.addListener(f, "click", function() {
      var j;
      if(f.getPosition) {
        j = f.getPosition()
      }else {
        var h, g, m = 0, k = 0, p = 0;
        j = f.getPaths();
        for(var y = 0, G = j.getLength();y < G;y++) {
          h = j.getAt(y);
          for(var s = 0, u = h.getLength();s < u;s++) {
            g = h.getAt(s);
            m += g.lat();
            k += g.lng();
            p++
          }
        }
        j = p > 0 ? new google.maps.LatLng(m / p, k / p) : null
      }
      j = j;
      $.setContent(d);
      $.setPosition(j);
      $.open(Y)
    });
    X.push(f);
    f.setMap(Y)
  }
  document.getElementById("results").innerHTML += '<div onclick="highlight(' + (X.length - 1) + ')" onmouseover="this.style.backgroundColor=\'#AAAAEE\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'">' + a + "</div>"
}
window.onload = function() {
  var a = {zoom:4, center:new google.maps.LatLng(40, -100), mapTypeId:google.maps.MapTypeId.ROADMAP};
  Y = new google.maps.Map(document.getElementById("map_canvas"), a);
  Z = new V("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer");
  google.maps.event.addListenerOnce(Z, "load", function() {
    document.getElementById("find").disabled = false
  });
  google.maps.event.addListener(ja, "jsonpstart", function() {
    document.getElementById("busy").style.visibility = "visible"
  });
  google.maps.event.addListener(ja, "jsonpend", function() {
    document.getElementById("busy").style.visibility = "hidden"
  });
  $ = new google.maps.InfoWindow
};
window.find = function(a) {
  if(X) {
    for(var b = 0;b < X.length;b++) {
      X[b].setMap(null)
    }
    X.length = 0
  }
  $ && $.close();
  document.getElementById("results").innerHTML = "";
  b = document.getElementById("exact").checked;
  Z.find({returnGeometry:true, searchText:a, contains:!b, layerIds:[0, 2], searchFields:["CITY_NAME", "NAME", "SYSTEM", "STATE_ABBR", "STATE_NAME"], sr:4326}, ka)
};
window.highlight = function(a) {
  (a = X[a]) && google.maps.event.trigger(a, "click")
};})()
