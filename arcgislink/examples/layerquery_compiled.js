(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var h = google.maps, j, l, n, r = {G:null, C:false}, s = {}, u = {};
function v(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function x(a) {
  return a && a.splice
}
function y(a, b, c) {
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
  h.event.trigger.apply(this, arguments)
}
function ba(a, b) {
  var c = "";
  if(a) {
    c += a.getTime() - a.getTimezoneOffset() * 6E4
  }
  if(b) {
    c += ", " + (b.getTime() - b.getTimezoneOffset() * 6E4)
  }
  return c
}
function ca() {
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
var A = "esriGeometryPoint", C = "esriGeometryMultipoint", D = "esriGeometryPolyline", E = "esriGeometryPolygon", I = "esriGeometryEnvelope";
function J(a) {
  var b = a;
  if(x(a) && a.length > 0) {
    b = a[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker) {
    return x(a) && a.length > 1 ? C : A
  }else {
    if(b instanceof h.Polyline) {
      return D
    }else {
      if(b instanceof h.Polygon) {
        return E
      }else {
        if(b instanceof h.LatLngBounds) {
          return I
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return A
          }else {
            if(b.points) {
              return C
            }else {
              if(b.paths) {
                return D
              }else {
                if(b.rings) {
                  return E
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
function K(a) {
  var b = a;
  if(x(a) && a.length > 0) {
    b = a[0]
  }
  if(x(b) && b.length > 0) {
    b = b[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker || b instanceof h.Polyline || b instanceof h.Polygon || b instanceof h.LatLngBounds) {
    return true
  }
  return false
}
function L(a, b) {
  for(var c = [], d, e = 0, g = a.getLength();e < g;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function ga(a) {
  var b, c, d, e = "{";
  switch(J(a)) {
    case A:
      b = x(a) ? a[0] : a;
      if(b instanceof h.Marker) {
        b = b.getPosition()
      }
      e += "x:" + b.lng() + ",y:" + b.lat();
      break;
    case C:
      d = [];
      for(c = 0;c < a.length;c++) {
        b = a[c] instanceof h.Marker ? a[c].getPosition() : a[c];
        d.push("[" + b.lng() + "," + b.lat() + "]")
      }
      e += "points: [" + d.join(",") + "]";
      break;
    case D:
      d = [];
      a = x(a) ? a : [a];
      for(c = 0;c < a.length;c++) {
        d.push("[" + L(a[c].getPath()) + "]")
      }
      e += "paths:[" + d.join(",") + "]";
      break;
    case E:
      d = [];
      b = x(a) ? a[0] : a;
      a = b.getPaths();
      for(c = 0;c < a.getLength();c++) {
        d.push("[" + L(a.getAt(c), true) + "]")
      }
      e += "rings:[" + d.join(",") + "]";
      break;
    case I:
      b = x(a) ? a[0] : a;
      e += "xmin:" + b.getSouthWest().lng() + ",ymin:" + b.getSouthWest().lat() + ",xmax:" + b.getNorthEast().lng() + ",ymax:" + b.getNorthEast().lat();
      break
  }
  e += ", spatialReference:{wkid:4326}";
  e += "}";
  return e
}
function M(a) {
  var b;
  if(typeof a === "object") {
    if(x(a)) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(M(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(K(a)) {
        return ga(a)
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
              b += c + ":" + M(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function ha(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = M(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function ia(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e;
  b = ha(b);
  var q = document.getElementsByTagName("head")[0];
  if(!q) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    g && q.removeChild(g);
    g = null;
    d.apply(null, arguments);
    z(u, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !r.C) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = e;
    q.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var o = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      o = false
    }
    if(r.C) {
      o = true
    }
    if(o && !r.G) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var i = ca();
    i.onreadystatechange = function() {
      if(i.readyState === 4) {
        if(i.status === 200) {
          eval(i.responseText)
        }else {
          throw new Error("Error code " + i.status);
        }
      }
    };
    i.open("POST", o ? r.G + "?" + a : a, true);
    i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    i.send(b)
  }
  z(u, "jsonpstart", e);
  return e
}
u.P = function(a, b, c, d) {
  ia(a, b, c, d)
};
u.B = function(a, b) {
  if(x(b)) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      c = b[d];
      if(x(c)) {
        u.B(a, c)
      }else {
        K(c) && c.setMap(a)
      }
    }
  }
};
u.S = function(a, b) {
  u.B(null, a);
  if(b) {
    a.length = 0
  }
};
function N(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
N.prototype.forward = function(a) {
  return a
};
N.prototype.i = function() {
  return 360
};
N.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function O(a) {
  a = a || {};
  N.call(this, a)
}
O.prototype = new N;
function P(a) {
  a = a || {};
  N.call(this, a);
  var b = a.r, c = a.v * f, d = a.w * f, e = a.s * f;
  this.a = a.j / a.unit;
  this.g = a.h * f;
  this.k = a.p;
  this.l = a.q;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  e = R(this, e, this.c);
  c = R(this, c, this.c);
  d = R(this, d, this.c);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.A = a / (this.b * Math.pow(c, this.b));
  this.t = this.m(this.a, this.A, e, this.b)
}
P.prototype = new N;
P.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function R(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
P.prototype.m = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
P.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.m(this.a, this.A, R(this, a[1] * f, this.c), this.b);
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.t - a * Math.cos(b)]
};
P.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  N.call(this, a);
  this.a = a.j / a.unit;
  var b = a.r;
  this.F = a.N;
  var c = a.s * f;
  this.g = a.h * f;
  this.k = a.p;
  this.l = a.q;
  a = 1 / b;
  this.e = 2 * a - a * a;
  this.o = this.e * this.e;
  this.D = this.o * this.e;
  this.n = this.e / (1 - this.e);
  this.J = this.d(c, this.a, this.e, this.o, this.D)
}
S.prototype = new N;
S.prototype.d = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
S.prototype.forward = function(a) {
  var b = a[1] * f, c = a[0] * f;
  a = this.a / Math.sqrt(1 - this.e * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.n * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var g = this.d(b, this.a, this.e, this.o, this.D);
  return[this.k + this.F * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.n) * Math.pow(c, 5) / 120), this.l + this.F * (g - this.J) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.n) * Math.pow(c, 6) / 720)]
};
S.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function T(a) {
  a = a || {};
  N.call(this, a);
  this.a = (a.j || 6378137) / (a.unit || 1);
  this.g = (a.h || 0) * f
}
T.prototype = new N;
T.prototype.forward = function(a) {
  var b = a[1] * f;
  return[this.a * (a[0] * f - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
T.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function U(a) {
  a = a || {};
  N.call(this, a);
  var b = a.r, c = a.v * f, d = a.w * f, e = a.s * f;
  this.a = a.j / a.unit;
  this.g = a.h * f;
  this.k = a.p;
  this.l = a.q;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  c = V(this, c, this.c);
  d = V(this, d, this.c);
  e = V(this, e, this.c);
  this.b = (a * a - b * b) / (d - c);
  this.z = a * a + this.b * c;
  this.t = this.m(this.a, this.z, this.b, e)
}
U.prototype = new N;
U.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function V(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
U.prototype.m = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
U.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.m(this.a, this.z, this.b, V(this, a[1] * f, this.c));
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.t - a * Math.cos(b)]
};
U.prototype.i = function() {
  return Math.PI * 2 * this.a
};
U.prototype.i = function() {
  return Math.PI * 2 * this.a
};
j = new O({wkid:4326});
l = new O({wkid:4269});
n = new T({wkid:102113, j:6378137, h:0, unit:1});
s = {"4326":j, "4269":l, "102113":n, "102100":new T({wkid:102100, j:6378137, h:0, unit:1})};
u.R = function(a, b) {
  var c = s["" + a];
  if(c) {
    return c
  }
  if(b instanceof N) {
    c = s["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = v(c, 'PROJECTION["', '"]'), g = v(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(v(v(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.j = parseFloat(g[1]);
      d.r = parseFloat(g[2]);
      d.s = parseFloat(v(c, '"Latitude_Of_Origin",', "]"));
      d.h = parseFloat(v(c, '"Central_Meridian",', "]"));
      d.p = parseFloat(v(c, '"False_Easting",', "]"));
      d.q = parseFloat(v(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new N(d);
        break;
      case "Lambert_Conformal_Conic":
        d.v = parseFloat(v(c, '"Standard_Parallel_1",', "]"));
        d.w = parseFloat(v(c, '"Standard_Parallel_2",', "]"));
        c = new P(d);
        break;
      case "Transverse_Mercator":
        d.N = parseFloat(v(c, '"Scale_Factor",', "]"));
        c = new S(d);
        break;
      case "Albers":
        d.v = parseFloat(v(c, '"Standard_Parallel_1",', "]"));
        d.w = parseFloat(v(c, '"Standard_Parallel_2",', "]"));
        c = new U(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      s["" + a] = c
    }
  }
  return c
};
function ja(a) {
  this.url = a;
  this.definition = null
}
ja.prototype.query = function(a, b, c) {
  if(a) {
    var d = y(a, {});
    if(a.geometry && !(a.geometry && typeof a.geometry === "string")) {
      d.geometry = ga(a.geometry);
      d.geometryType = J(a.geometry);
      d.inSR = 4326
    }
    if(a.spatialRelationship) {
      d.spatialRel = a.spatialRelationship;
      delete d.spatialRelationship
    }
    if(a.outFields && x(a.outFields)) {
      d.outFields = a.outFields.join(",")
    }
    if(a.objectIds) {
      d.objectIds = a.objectIds.join(",")
    }
    if(a.time) {
      d.time = ba(a.time, a.O)
    }
    d.outSR = 4326;
    d.returnGeometry = a.returnGeometry === false ? false : true;
    d.returnIdsOnly = a.returnIdsOnly === true ? true : false;
    delete d.overlayOptions;
    ia(this.url + "/query", d, "", function(e) {
      var g = e.features, q = a.overlayOptions;
      if(g) {
        var o, i, w;
        o = 0;
        for(i = g.length;o < i;o++) {
          w = g[o];
          if(w.geometry) {
            var k;
            a: {
              k = w.geometry;
              var p = q, t = null, m = void 0, F = void 0, da = void 0;
              m = void 0;
              var ea = void 0, G = void 0, B = void 0, Q = void 0, H = void 0;
              p = p || {};
              if(k) {
                t = [];
                if(k.x) {
                  m = new h.Marker(y(p.markerOptions || p, {position:new h.LatLng(k.y, k.x)}));
                  t.push(m)
                }else {
                  G = k.points || k.paths || k.rings;
                  if(!G) {
                    k = t;
                    break a
                  }
                  var fa = [];
                  F = 0;
                  for(da = G.length;F < da;F++) {
                    B = G[F];
                    if(k.points) {
                      m = new h.Marker(y(p.markerOptions || p, {position:new h.LatLng(B[1], B[0])}));
                      t.push(m)
                    }else {
                      H = [];
                      m = 0;
                      for(ea = B.length;m < ea;m++) {
                        Q = B[m];
                        H.push(new h.LatLng(Q[1], Q[0]))
                      }
                      if(k.paths) {
                        m = new h.Polyline(y(p.polylineOptions || p, {path:H}));
                        t.push(m)
                      }else {
                        k.rings && fa.push(H)
                      }
                    }
                  }
                  if(k.rings) {
                    m = new h.Polygon(y(p.Q || p, {paths:fa}));
                    t.push(m)
                  }
                }
              }
              k = t
            }
            w.geometry = k
          }
        }
      }
      b(e, e.error);
      c && e && e.error && c(e.error)
    })
  }
};
function W(a) {
  this.K = a ? a.lods : null;
  this.u = a ? s[a.spatialReference.wkid || a.spatialReference.wkt] : n;
  if(!this.u) {
    throw new Error("unsupported Spatial Reference");
  }
  this.H = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.u.i() / this.H / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.K.length - 1 : 20;
  if(h.Size) {
    this.T = a ? new h.Size(a.cols, a.rows) : new h.Size(256, 256)
  }
  this.I = Math.pow(2, this.minZoom) * this.H;
  this.L = a ? a.origin.x : -2.0037508342787E7;
  this.M = a ? a.origin.y : 2.0037508342787E7;
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
  var c = this.u.forward([a.lng(), a.lat()]), d = b || new h.Point(0, 0);
  d.x = (c[0] - this.L) / this.I;
  d.y = (this.M - c[1]) / this.I;
  return d
};
W.prototype.fromLatLngToPoint = W.prototype.fromLatLngToPoint;
new W;
new h.OverlayView;var X = null, Y = null, Z = null, ka = {fillColor:"#883333", fillOpacity:0.35, strokeColor:"#FF0000", strokeWeight:3, zIndex:100, strokeOpacity:1}, $ = {fillColor:"#333388", fillOpacity:0.35, strokeColor:"#FFFFFF", strokeWeight:1, strokeOpacity:1, zIndex:0};
function la(a) {
  a = a.features;
  for(var b = 0, c = a.length;b < c;b++) {
    ma(a[b])
  }
}
function ma(a) {
  var b = a.attributes, c = "<div id='iwdiv' style='font-size:12px'><b>" + b.NAME + "</b><hr/><b>2000 Population: </b>" + b.POP2000 + "<br/><b>2000 Population per Sq. Mi.: </b>" + b.POP00_SQMI + "<br/><b>2007 Population: </b>" + b.POP2007 + "<br/><b>2007 Population per Sq. Mi.: </b>" + b.POP07_SQMI + "</div>", d = a.geometry[0], e = na(d);
  d.setMap(X);
  google.maps.event.addListener(d, "mouseover", function() {
    oa(d, c, e)
  });
  google.maps.event.addListener(d, "mouseout", function() {
    d.setOptions($);
    Z && Z.close()
  });
  google.maps.event.addListener(d, "click", function() {
    oa(d, c, e)
  })
}
function na(a) {
  var b, c, d = 0, e = 0, g = 0;
  a = a.getPaths();
  for(var q = 0, o = a.getLength();q < o;q++) {
    b = a.getAt(q);
    for(var i = 0, w = b.getLength();i < w;i++) {
      c = b.getAt(i);
      d += c.lat();
      e += c.lng();
      g++
    }
  }
  if(g > 0) {
    return new google.maps.LatLng(d / g, e / g)
  }
  return null
}
function oa(a, b, c) {
  Y && Y.setOptions($);
  a.setOptions(ka);
  Y = a;
  if(Z) {
    Z.setContent(b);
    Z.setPosition(c)
  }else {
    Z = new google.maps.InfoWindow({content:b, position:c, maxWidth:240})
  }
  Z.open(X)
}
window.onload = function() {
  var a = {zoom:6, center:new google.maps.LatLng(43, -106), mapTypeId:google.maps.MapTypeId.ROADMAP};
  X = new google.maps.Map(document.getElementById("map_canvas"), a);
  (new ja("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/3")).query({returnGeometry:true, where:"STATE_NAME = 'Utah'", outFields:["NAME", "POP2000", "POP2007", "POP00_SQMI", "POP07_SQMI"], overlayOptions:$}, la)
};})()
