(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f = Math.PI / 180, aa = 0, h = google.maps, i, k, l, p = {w:null, H:false}, q = {}, s = {};
function u(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function v(a) {
  return a && a.splice
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
function y() {
  h.event.trigger.apply(this, arguments)
}
function ba() {
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
var z = "esriGeometryPoint", A = "esriGeometryMultipoint", B = "esriGeometryPolyline", C = "esriGeometryPolygon", E = "esriGeometryEnvelope";
function ca(a) {
  var b = a;
  if(v(a) && a.length > 0) {
    b = a[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker) {
    return v(a) && a.length > 1 ? A : z
  }else {
    if(b instanceof h.Polyline) {
      return B
    }else {
      if(b instanceof h.Polygon) {
        return C
      }else {
        if(b instanceof h.LatLngBounds) {
          return E
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return z
          }else {
            if(b.points) {
              return A
            }else {
              if(b.paths) {
                return B
              }else {
                if(b.rings) {
                  return C
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
  if(v(a) && a.length > 0) {
    b = a[0]
  }
  if(v(b) && b.length > 0) {
    b = b[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker || b instanceof h.Polyline || b instanceof h.Polygon || b instanceof h.LatLngBounds) {
    return true
  }
  return false
}
function ha(a, b) {
  for(var c = [], d, e = 0, g = a.getLength();e < g;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function G(a) {
  var b;
  if(typeof a === "object") {
    if(v(a)) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(G(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(F(a)) {
        var e;
        d = "{";
        switch(ca(a)) {
          case z:
            e = v(a) ? a[0] : a;
            if(e instanceof h.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case A:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof h.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case B:
            c = [];
            a = v(a) ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + ha(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case C:
            c = [];
            e = v(a) ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + ha(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case E:
            e = v(a) ? a[0] : a;
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
              b += c + ":" + G(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function ia(a) {
  var b, c, d, e = [];
  b = 0;
  for(c = a.length;b < c;b++) {
    d = a[b];
    if(d instanceof h.Marker) {
      d = d.getPosition()
    }
    e.push({geometry:{x:d.lng(), y:d.lat(), spatialReference:{wkid:4326}}})
  }
  return{type:'"features"', features:e, doNotLocateOnRestrictedElements:false}
}
function ja(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = G(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function ka(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = ja(b);
  var r = document.getElementsByTagName("head")[0];
  if(!r) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    g && r.removeChild(g);
    g = null;
    d.apply(null, arguments);
    y(s, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !p.H) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = e;
    r.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var w = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      w = false
    }
    if(p.H) {
      w = true
    }
    if(w && !p.w) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var m = ba();
    m.onreadystatechange = function() {
      if(m.readyState === 4) {
        if(m.status === 200) {
          eval(m.responseText)
        }else {
          throw new Error("Error code " + m.status);
        }
      }
    };
    m.open("POST", w ? p.w + "?" + a : a, true);
    m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    m.send(b)
  }
  y(s, "jsonpstart", e);
  return e
}
s.X = function(a, b, c, d) {
  ka(a, b, c, d)
};
s.p = function(a, b) {
  if(v(b)) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      c = b[d];
      if(v(c)) {
        s.p(a, c)
      }else {
        F(c) && c.setMap(a)
      }
    }
  }
};
s.o = function(a, b) {
  s.p(null, a);
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
  var b = a.u, c = a.B * f, d = a.C * f, e = a.v * f;
  this.a = a.j / a.unit;
  this.g = a.h * f;
  this.k = a.s;
  this.l = a.t;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  e = O(this, e, this.c);
  c = O(this, c, this.c);
  d = O(this, d, this.c);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.G = a / (this.b * Math.pow(c, this.b));
  this.z = this.n(this.a, this.G, e, this.b)
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
N.prototype.n = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
N.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.n(this.a, this.G, O(this, a[1] * f, this.c), this.b);
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.z - a * Math.cos(b)]
};
N.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  L.call(this, a);
  this.a = a.j / a.unit;
  var b = a.u;
  this.J = a.U;
  var c = a.v * f;
  this.g = a.h * f;
  this.k = a.s;
  this.l = a.t;
  a = 1 / b;
  this.e = 2 * a - a * a;
  this.r = this.e * this.e;
  this.I = this.r * this.e;
  this.q = this.e / (1 - this.e);
  this.M = this.d(c, this.a, this.e, this.r, this.I)
}
P.prototype = new L;
P.prototype.d = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
P.prototype.forward = function(a) {
  var b = a[1] * f, c = a[0] * f;
  a = this.a / Math.sqrt(1 - this.e * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.q * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var g = this.d(b, this.a, this.e, this.r, this.I);
  return[this.k + this.J * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.q) * Math.pow(c, 5) / 120), this.l + this.J * (g - this.M) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.q) * Math.pow(c, 6) / 720)]
};
P.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  L.call(this, a);
  this.a = (a.j || 6378137) / (a.unit || 1);
  this.g = (a.h || 0) * f
}
Q.prototype = new L;
Q.prototype.forward = function(a) {
  var b = a[1] * f;
  return[this.a * (a[0] * f - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
Q.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  L.call(this, a);
  var b = a.u, c = a.B * f, d = a.C * f, e = a.v * f;
  this.a = a.j / a.unit;
  this.g = a.h * f;
  this.k = a.s;
  this.l = a.t;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  c = S(this, c, this.c);
  d = S(this, d, this.c);
  e = S(this, e, this.c);
  this.b = (a * a - b * b) / (d - c);
  this.F = a * a + this.b * c;
  this.z = this.n(this.a, this.F, this.b, e)
}
R.prototype = new L;
R.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function S(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
R.prototype.n = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
R.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.n(this.a, this.F, this.b, S(this, a[1] * f, this.c));
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.z - a * Math.cos(b)]
};
R.prototype.i = function() {
  return Math.PI * 2 * this.a
};
R.prototype.i = function() {
  return Math.PI * 2 * this.a
};
i = new M({wkid:4326});
k = new M({wkid:4269});
l = new Q({wkid:102113, j:6378137, h:0, unit:1});
q = {"4326":i, "4269":k, "102113":l, "102100":new Q({wkid:102100, j:6378137, h:0, unit:1})};
s.$ = function(a, b) {
  var c = q["" + a];
  if(c) {
    return c
  }
  if(b instanceof L) {
    c = q["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = u(c, 'PROJECTION["', '"]'), g = u(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(u(u(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.j = parseFloat(g[1]);
      d.u = parseFloat(g[2]);
      d.v = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.h = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.s = parseFloat(u(c, '"False_Easting",', "]"));
      d.t = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new L(d);
        break;
      case "Lambert_Conformal_Conic":
        d.B = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.C = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new N(d);
        break;
      case "Transverse_Mercator":
        d.U = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new P(d);
        break;
      case "Albers":
        d.B = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.C = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new R(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      q["" + a] = c
    }
  }
  return c
};
function la(a) {
  this.url = a
}
function ma(a, b, c, d) {
  if(b) {
    var e = x(b, {});
    if(v(b.D)) {
      e.D = ia(b.D)
    }
    if(v(b.m)) {
      if(b.m.length > 0) {
        e.m = ia(b.m)
      }else {
        delete e.m
      }
    }
    e.S = b.S === false ? false : true;
    e.R = b.R === true ? true : false;
    e.Q = b.Q === true ? true : false;
    e.T = b.T === true ? true : false;
    ka(a.url + "/solve", e, "", function(g) {
      if(g.routes) {
        var r = g.routes.features, w = b.overlayOptions;
        if(r) {
          var m, da, H;
          m = 0;
          for(da = r.length;m < da;m++) {
            H = r[m];
            if(H.geometry) {
              var j;
              a: {
                j = H.geometry;
                var o = w, t = null, n = void 0, I = void 0, ea = void 0;
                n = void 0;
                var fa = void 0, J = void 0, D = void 0, U = void 0, K = void 0;
                o = o || {};
                if(j) {
                  t = [];
                  if(j.x) {
                    n = new h.Marker(x(o.markerOptions || o, {position:new h.LatLng(j.y, j.x)}));
                    t.push(n)
                  }else {
                    J = j.points || j.paths || j.rings;
                    if(!J) {
                      j = t;
                      break a
                    }
                    var ga = [];
                    I = 0;
                    for(ea = J.length;I < ea;I++) {
                      D = J[I];
                      if(j.points) {
                        n = new h.Marker(x(o.markerOptions || o, {position:new h.LatLng(D[1], D[0])}));
                        t.push(n)
                      }else {
                        K = [];
                        n = 0;
                        for(fa = D.length;n < fa;n++) {
                          U = D[n];
                          K.push(new h.LatLng(U[1], U[0]))
                        }
                        if(j.paths) {
                          n = new h.Polyline(x(o.polylineOptions || o, {path:K}));
                          t.push(n)
                        }else {
                          j.rings && ga.push(K)
                        }
                      }
                    }
                    if(j.rings) {
                      n = new h.Polygon(x(o.Z || o, {paths:ga}));
                      t.push(n)
                    }
                  }
                }
                j = t
              }
              H.geometry = j
            }
          }
        }
      }
      c(g);
      d && g && g.error && d(g.error)
    })
  }
}
function T(a) {
  this.N = a ? a.lods : null;
  this.A = a ? q[a.spatialReference.wkid || a.spatialReference.wkt] : l;
  if(!this.A) {
    throw new Error("unsupported Spatial Reference");
  }
  this.K = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.A.i() / this.K / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.N.length - 1 : 20;
  if(h.Size) {
    this.aa = a ? new h.Size(a.cols, a.rows) : new h.Size(256, 256)
  }
  this.L = Math.pow(2, this.minZoom) * this.K;
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
T.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.A.forward([a.lng(), a.lat()]), d = b || new h.Point(0, 0);
  d.x = (c[0] - this.O) / this.L;
  d.y = (this.P - c[1]) / this.L;
  return d
};
T.prototype.fromLatLngToPoint = T.prototype.fromLatLngToPoint;
new T;
new h.OverlayView;
var V = s;var W, X, na;
p.w = "/proxy/proxy.ashx";
var Y = [], Z = [], $ = [];
function oa(a) {
  if(X) {
    X.close();
    X = null
  }
  var b = pa() == 0, c = b ? Y : Z;
  b = b ? new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (Y.length + 1) + "|00ff00|000000") : new google.maps.MarkerImage("http://chart.apis.google.com/chart?cht=itr&chs=24x24&chco=FF0000,000000ff,ffffff01&chl=x&chx=000000,0&chf=bg,s,00000000&ext=.png", null, null, new google.maps.Point(12, 12));
  var d = new google.maps.Marker({position:a.latLng, map:W, icon:b, draggable:true});
  c.push(d);
  google.maps.event.addListener(d, "click", function() {
    d.setMap(null);
    for(var e = 0, g = c.length;e < g;e++) {
      if(c[e] == d) {
        c.splice(e, 1);
        break
      }
    }
    d = null
  })
}
function qa(a) {
  if(a.routes) {
    a = a.routes.features;
    for(var b = 0, c = a.length;b < c;b++) {
      V.p(W, a[b].geometry);
      $ = $.concat(a[b].geometry)
    }
  }
}
function ra(a) {
  a && alert(a.message + "\n" + a.V.join("\n"))
}
function pa() {
  for(var a = document.getElementById("frm").Y, b = 0, c = a.length;b < c;b++) {
    if(a[b].checked) {
      return a[b].value
    }
  }
}
function sa() {
  X = X || new google.maps.InfoWindow({maxWidth:250, content:"<ul><li>Choose stop or barrier at top<li>Click map to add a stop or barrier<li>click marker to remove, drag to move<li>click route button to get directions"});
  X.bindTo("position", W, "center");
  X.open(W)
}
window.onload = function() {
  var a = {zoom:12, center:new google.maps.LatLng(35.23, -80.84), mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP]}, draggableCursor:"default"};
  W = new google.maps.Map(document.getElementById("map_canvas"), a);
  na = new la("http://tasks.arcgisonline.com/ArcGIS/rest/services/NetworkAnalysis/ESRI_Route_NA/NAServer/Route");
  google.maps.event.addListener(W, "click", oa);
  google.maps.event.addListener(V, "jsonpstart", function() {
    W.setOptions({draggableCursor:"wait"})
  });
  google.maps.event.addListener(V, "jsonpend", function() {
    W.setOptions({draggableCursor:"default"})
  });
  sa()
};
window.route = function() {
  V.o($);
  $ = [];
  ma(na, {D:Y, m:Z, W:document.getElementById("optimize").checked, overlayOptions:{strokeColor:"#0000BB", strokeWeight:8, strokeOpacity:0.5}}, qa, ra)
};
window.clearOverlays = function() {
  V.o($, true);
  V.o(Y, true);
  V.o(Z, true)
};
window.showHelp = sa;})()
