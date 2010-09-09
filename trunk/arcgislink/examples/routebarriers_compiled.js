(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var h = google.maps, i, k, l, p = {v:null, F:false}, r = {}, t = {};
function u(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function w(a) {
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
var z = "esriGeometryPoint", A = "esriGeometryMultipoint", B = "esriGeometryPolyline", D = "esriGeometryPolygon", E = "esriGeometryEnvelope";
function ca(a) {
  var b = a;
  if(w(a) && a.length > 0) {
    b = a[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker) {
    return w(a) && a.length > 1 ? A : z
  }else {
    if(b instanceof h.Polyline) {
      return B
    }else {
      if(b instanceof h.Polygon) {
        return D
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
function da(a) {
  var b = a;
  if(w(a) && a.length > 0) {
    b = a[0]
  }
  if(w(b) && b.length > 0) {
    b = b[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker || b instanceof h.Polyline || b instanceof h.Polygon || b instanceof h.LatLngBounds) {
    return true
  }
  return false
}
function ia(a, b) {
  for(var c = [], d, e = 0, g = a.getLength();e < g;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function F(a) {
  var b;
  if(typeof a === "object") {
    if(w(a)) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(F(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(da(a)) {
        var e;
        d = "{";
        switch(ca(a)) {
          case z:
            e = w(a) ? a[0] : a;
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
            a = w(a) ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + ia(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case D:
            c = [];
            e = w(a) ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + ia(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case E:
            e = w(a) ? a[0] : a;
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
              b += c + ":" + F(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function ja(a) {
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
function ka(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = F(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function la(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = ka(b);
  var q = document.getElementsByTagName("head")[0];
  if(!q) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    g && q.removeChild(g);
    g = null;
    d.apply(null, arguments);
    y(t, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !p.F) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = e;
    q.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var v = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      v = false
    }
    if(p.F) {
      v = true
    }
    if(v && !p.v) {
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
    m.open("POST", v ? p.v + "?" + a : a, true);
    m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    m.send(b)
  }
  y(t, "jsonpstart", e);
  return e
}
t.P = function(a, b, c, d) {
  la(a, b, c, d)
};
t.o = function(a, b) {
  if(w(b)) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      c = b[d];
      if(w(c)) {
        t.o(a, c)
      }else {
        da(c) && c.setMap(a)
      }
    }
  }
};
t.n = function(a, b) {
  t.o(null, a);
  if(b) {
    a.length = 0
  }
};
function G(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
G.prototype.forward = function(a) {
  return a
};
G.prototype.i = function() {
  return 360
};
G.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function L(a) {
  a = a || {};
  G.call(this, a)
}
L.prototype = new G;
function M(a) {
  a = a || {};
  G.call(this, a);
  var b = a.t, c = a.A * f, d = a.B * f, e = a.u * f;
  this.a = a.j / a.unit;
  this.g = a.h * f;
  this.k = a.r;
  this.l = a.s;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  e = N(this, e, this.c);
  c = N(this, c, this.c);
  d = N(this, d, this.c);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.D = a / (this.b * Math.pow(c, this.b));
  this.w = this.m(this.a, this.D, e, this.b)
}
M.prototype = new G;
M.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function N(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
M.prototype.m = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
M.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.m(this.a, this.D, N(this, a[1] * f, this.c), this.b);
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.w - a * Math.cos(b)]
};
M.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  G.call(this, a);
  this.a = a.j / a.unit;
  var b = a.t;
  this.H = a.O;
  var c = a.u * f;
  this.g = a.h * f;
  this.k = a.r;
  this.l = a.s;
  a = 1 / b;
  this.e = 2 * a - a * a;
  this.q = this.e * this.e;
  this.G = this.q * this.e;
  this.p = this.e / (1 - this.e);
  this.K = this.d(c, this.a, this.e, this.q, this.G)
}
O.prototype = new G;
O.prototype.d = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
O.prototype.forward = function(a) {
  var b = a[1] * f, c = a[0] * f;
  a = this.a / Math.sqrt(1 - this.e * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.p * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var g = this.d(b, this.a, this.e, this.q, this.G);
  return[this.k + this.H * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.p) * Math.pow(c, 5) / 120), this.l + this.H * (g - this.K) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.p) * Math.pow(c, 6) / 720)]
};
O.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  G.call(this, a);
  this.a = (a.j || 6378137) / (a.unit || 1);
  this.g = (a.h || 0) * f
}
P.prototype = new G;
P.prototype.forward = function(a) {
  var b = a[1] * f;
  return[this.a * (a[0] * f - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
P.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  G.call(this, a);
  var b = a.t, c = a.A * f, d = a.B * f, e = a.u * f;
  this.a = a.j / a.unit;
  this.g = a.h * f;
  this.k = a.r;
  this.l = a.s;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.d(c, b);
  b = this.d(d, b);
  c = R(this, c, this.c);
  d = R(this, d, this.c);
  e = R(this, e, this.c);
  this.b = (a * a - b * b) / (d - c);
  this.C = a * a + this.b * c;
  this.w = this.m(this.a, this.C, this.b, e)
}
Q.prototype = new G;
Q.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function R(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
Q.prototype.m = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
Q.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.m(this.a, this.C, this.b, R(this, a[1] * f, this.c));
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.w - a * Math.cos(b)]
};
Q.prototype.i = function() {
  return Math.PI * 2 * this.a
};
Q.prototype.i = function() {
  return Math.PI * 2 * this.a
};
i = new L({wkid:4326});
k = new L({wkid:4269});
l = new P({wkid:102113, j:6378137, h:0, unit:1});
r = {"4326":i, "4269":k, "102113":l, "102100":new P({wkid:102100, j:6378137, h:0, unit:1})};
t.R = function(a, b) {
  var c = r["" + a];
  if(c) {
    return c
  }
  if(b instanceof G) {
    c = r["" + a] = b
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
      d.t = parseFloat(g[2]);
      d.u = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.h = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.r = parseFloat(u(c, '"False_Easting",', "]"));
      d.s = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new G(d);
        break;
      case "Lambert_Conformal_Conic":
        d.A = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.B = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new M(d);
        break;
      case "Transverse_Mercator":
        d.O = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new O(d);
        break;
      case "Albers":
        d.A = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.B = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new Q(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      r["" + a] = c
    }
  }
  return c
};
function ma(a) {
  this.url = a
}
function na(a, b, c, d) {
  if(b) {
    var e = x(b, {});
    if(w(b.stops)) {
      e.stops = ja(b.stops)
    }
    if(w(b.barriers)) {
      if(b.barriers.length > 0) {
        e.barriers = ja(b.barriers)
      }else {
        delete e.barriers
      }
    }
    e.returnRoutes = b.returnRoutes === false ? false : true;
    e.returnDirections = b.returnDirections === true ? true : false;
    e.returnBarriers = b.returnBarriers === true ? true : false;
    e.returnStops = b.returnStops === true ? true : false;
    la(a.url + "/solve", e, "", function(g) {
      if(g.routes) {
        var q = g.routes.features, v = b.overlayOptions;
        if(q) {
          var m, ea, H;
          m = 0;
          for(ea = q.length;m < ea;m++) {
            H = q[m];
            if(H.geometry) {
              var j;
              a: {
                j = H.geometry;
                var o = v, s = null, n = void 0, I = void 0, fa = void 0;
                n = void 0;
                var ga = void 0, J = void 0, C = void 0, U = void 0, K = void 0;
                o = o || {};
                if(j) {
                  s = [];
                  if(j.x) {
                    n = new h.Marker(x(o.markerOptions || o, {position:new h.LatLng(j.y, j.x)}));
                    s.push(n)
                  }else {
                    J = j.points || j.paths || j.rings;
                    if(!J) {
                      j = s;
                      break a
                    }
                    var ha = [];
                    I = 0;
                    for(fa = J.length;I < fa;I++) {
                      C = J[I];
                      if(j.points) {
                        n = new h.Marker(x(o.markerOptions || o, {position:new h.LatLng(C[1], C[0])}));
                        s.push(n)
                      }else {
                        K = [];
                        n = 0;
                        for(ga = C.length;n < ga;n++) {
                          U = C[n];
                          K.push(new h.LatLng(U[1], U[0]))
                        }
                        if(j.paths) {
                          n = new h.Polyline(x(o.polylineOptions || o, {path:K}));
                          s.push(n)
                        }else {
                          j.rings && ha.push(K)
                        }
                      }
                    }
                    if(j.rings) {
                      n = new h.Polygon(x(o.Q || o, {paths:ha}));
                      s.push(n)
                    }
                  }
                }
                j = s
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
function S(a) {
  this.L = a ? a.lods : null;
  this.z = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : l;
  if(!this.z) {
    throw new Error("unsupported Spatial Reference");
  }
  this.I = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.z.i() / this.I / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.L.length - 1 : 20;
  if(h.Size) {
    this.S = a ? new h.Size(a.cols, a.rows) : new h.Size(256, 256)
  }
  this.J = Math.pow(2, this.minZoom) * this.I;
  this.M = a ? a.origin.x : -2.0037508342787E7;
  this.N = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
S.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.z.forward([a.lng(), a.lat()]), d = b || new h.Point(0, 0);
  d.x = (c[0] - this.M) / this.J;
  d.y = (this.N - c[1]) / this.J;
  return d
};
S.prototype.fromLatLngToPoint = S.prototype.fromLatLngToPoint;
new S;
new h.OverlayView;
var T = t;var V, W, oa;
p.v = "/proxy/proxy.ashx";
var X = [], Y = [], Z = [];
function $(a) {
  V.setOptions({draggableCursor:a ? "wait" : "default"})
}
function pa(a) {
  if(W) {
    W.close();
    W = null
  }
  var b = qa() == 0, c = b ? X : Y;
  b = b ? new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (X.length + 1) + "|00ff00|000000") : new google.maps.MarkerImage("http://chart.apis.google.com/chart?cht=itr&chs=24x24&chco=FF0000,000000ff,ffffff01&chl=x&chx=000000,0&chf=bg,s,00000000&ext=.png", null, null, new google.maps.Point(12, 12));
  var d = new google.maps.Marker({position:a.latLng, map:V, icon:b, draggable:true});
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
function ra(a) {
  $(false);
  if(a.routes) {
    a = a.routes.features;
    for(var b = 0, c = a.length;b < c;b++) {
      T.o(V, a[b].geometry);
      Z = Z.concat(a[b].geometry)
    }
  }
}
function sa(a) {
  $(false);
  a && alert(a.message + "\n" + a.details.join("\n"))
}
function qa() {
  for(var a = document.getElementById("frm").pointType, b = 0, c = a.length;b < c;b++) {
    if(a[b].checked) {
      return a[b].value
    }
  }
}
function ta() {
  W = W || new google.maps.InfoWindow({maxWidth:250, content:"<ul><li>Choose stop or barrier at top<li>Click map to add a stop or barrier<li>click marker to remove, drag to move<li>click route button to get directions"});
  W.bindTo("position", V, "center");
  W.open(V)
}
window.onload = function() {
  var a = {zoom:12, center:new google.maps.LatLng(35.23, -80.84), mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP]}, draggableCursor:"default"};
  V = new google.maps.Map(document.getElementById("map_canvas"), a);
  oa = new ma("http://tasks.arcgisonline.com/ArcGIS/rest/services/NetworkAnalysis/ESRI_Route_NA/NAServer/Route");
  google.maps.event.addListener(V, "click", pa);
  ta()
};
window.route = function() {
  T.n(Z);
  Z = [];
  $(true);
  na(oa, {stops:X, barriers:Y, findBestSequence:document.getElementById("optimize").checked, overlayOptions:{strokeColor:"#0000BB", strokeWeight:8, strokeOpacity:0.5, clickable:false}}, ra, sa)
};
window.clearOverlays = function() {
  T.n(Z, true);
  T.n(X, true);
  T.n(Y, true)
};
window.showHelp = ta;})()
