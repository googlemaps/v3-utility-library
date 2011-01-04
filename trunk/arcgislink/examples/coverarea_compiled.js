(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f = Math.PI / 180, da = 0;
window.ags_jsonp = window.ags_jsonp || {};
var h = google.maps, j, l, q, r = {G:null, C:false}, t = {}, u = {};
function v(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function w(a, b, c) {
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
function x() {
  h.event.trigger.apply(this, arguments)
}
function ea() {
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
var y = "esriGeometryPoint", B = "esriGeometryMultipoint", C = "esriGeometryPolyline", D = "esriGeometryPolygon", E = "esriGeometryEnvelope";
function fa(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof h.LatLng || b instanceof h.Marker) {
    return a && a.splice && a.length > 1 ? B : y
  }else {
    if(b instanceof h.Polyline) {
      return C
    }else {
      if(b instanceof h.Polygon) {
        return D
      }else {
        if(b instanceof h.LatLngBounds) {
          return E
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return y
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
  if(b instanceof h.LatLng || b instanceof h.Marker || b instanceof h.Polyline || b instanceof h.Polygon || b instanceof h.LatLngBounds) {
    return true
  }
  return false
}
function J(a) {
  if(!a) {
    return null
  }
  return typeof a === "number" ? a : a.wkid ? a.wkid : a.toJSON()
}
function K(a, b) {
  for(var c = [], d, e = 0, g = a.getLength();e < g;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function L(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(L(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(F(a)) {
        var e;
        d = "{";
        switch(fa(a)) {
          case y:
            e = a && a.splice ? a[0] : a;
            if(e instanceof h.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case B:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof h.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case C:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + K(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case D:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + K(a.getAt(b), true) + "]")
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
              b += c + ":" + L(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function ga(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = L(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function M(a, b, c, d) {
  var e = "ags_jsonp_" + da++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e;
  b = ga(b);
  var n = document.getElementsByTagName("head")[0];
  if(!n) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    g && n.removeChild(g);
    g = null;
    d.apply(null, arguments);
    x(u, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !r.C) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = e;
    n.appendChild(g)
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
    var k = ea();
    k.onreadystatechange = function() {
      if(k.readyState === 4) {
        if(k.status === 200) {
          eval(k.responseText)
        }else {
          throw new Error("Error code " + k.status);
        }
      }
    };
    k.open("POST", o ? r.G + "?" + a : a, true);
    k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    k.send(b)
  }
  x(u, "jsonpstart", e);
  return e
}
u.Q = function(a, b, c, d) {
  M(a, b, c, d)
};
u.B = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        u.B(a, c)
      }else {
        F(c) && c.setMap(a)
      }
    }
  }
};
u.T = function(a, b) {
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
  e = Q(this, e, this.c);
  c = Q(this, c, this.c);
  d = Q(this, d, this.c);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.A = a / (this.b * Math.pow(c, this.b));
  this.t = this.m(this.a, this.A, e, this.b)
}
P.prototype = new N;
P.prototype.d = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function Q(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
P.prototype.m = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
P.prototype.forward = function(a) {
  var b = a[0] * f;
  a = this.m(this.a, this.A, Q(this, a[1] * f, this.c), this.b);
  b = this.b * (b - this.g);
  return[this.k + a * Math.sin(b), this.l + this.t - a * Math.cos(b)]
};
P.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  N.call(this, a);
  this.a = a.j / a.unit;
  var b = a.r;
  this.F = a.P;
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
R.prototype = new N;
R.prototype.d = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
R.prototype.forward = function(a) {
  var b = a[1] * f, c = a[0] * f;
  a = this.a / Math.sqrt(1 - this.e * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.n * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var g = this.d(b, this.a, this.e, this.o, this.D);
  return[this.k + this.F * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.n) * Math.pow(c, 5) / 120), this.l + this.F * (g - this.J) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.n) * Math.pow(c, 6) / 720)]
};
R.prototype.i = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  N.call(this, a);
  this.a = (a.j || 6378137) / (a.unit || 1);
  this.g = (a.h || 0) * f
}
S.prototype = new N;
S.prototype.forward = function(a) {
  var b = a[1] * f;
  return[this.a * (a[0] * f - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
S.prototype.i = function() {
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
q = new S({wkid:102113, j:6378137, h:0, unit:1});
t = {"4326":j, "4269":l, "102113":q, "102100":new S({wkid:102100, j:6378137, h:0, unit:1})};
u.S = function(a, b) {
  var c = t["" + a];
  if(c) {
    return c
  }
  if(b instanceof N) {
    c = t["" + a] = b
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
        d.P = parseFloat(v(c, '"Scale_Factor",', "]"));
        c = new R(d);
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
      t["" + a] = c
    }
  }
  return c
};
function W(a) {
  this.url = a;
  this.K = false;
  var b = this;
  M(a, {}, "", function(c) {
    w(c, b);
    b.K = true;
    x(b, "load")
  })
}
W.prototype.execute = function(a, b, c) {
  var d = {};
  a.parameters && w(a.parameters, d);
  d["env:outSR"] = a.outSpatialReference ? J(a.outSpatialReference) : 4326;
  if(a.O) {
    d["env:processSR"] = J(a.O)
  }
  M(this.url + "/execute", d, "", function(e) {
    if(e.results) {
      for(var g, n, o = 0;o < e.results.length;o++) {
        g = e.results[o];
        if(g.dataType === "GPFeatureRecordSetLayer") {
          for(var k = 0, z = g.value.features.length;k < z;k++) {
            n = g.value.features[k];
            if(n.geometry) {
              var i;
              a: {
                i = n.geometry;
                var p = a.overlayOptions, s = null, m = void 0, G = void 0, aa = void 0;
                m = void 0;
                var ba = void 0, H = void 0, A = void 0, T = void 0, I = void 0;
                p = p || {};
                if(i) {
                  s = [];
                  if(i.x) {
                    m = new h.Marker(w(p.markerOptions || p, {position:new h.LatLng(i.y, i.x)}));
                    s.push(m)
                  }else {
                    H = i.points || i.paths || i.rings;
                    if(!H) {
                      i = s;
                      break a
                    }
                    var ca = [];
                    G = 0;
                    for(aa = H.length;G < aa;G++) {
                      A = H[G];
                      if(i.points) {
                        m = new h.Marker(w(p.markerOptions || p, {position:new h.LatLng(A[1], A[0])}));
                        s.push(m)
                      }else {
                        I = [];
                        m = 0;
                        for(ba = A.length;m < ba;m++) {
                          T = A[m];
                          I.push(new h.LatLng(T[1], T[0]))
                        }
                        if(i.paths) {
                          m = new h.Polyline(w(p.polylineOptions || p, {path:I}));
                          s.push(m)
                        }else {
                          i.rings && ca.push(I)
                        }
                      }
                    }
                    if(i.rings) {
                      m = new h.Polygon(w(p.R || p, {paths:ca}));
                      s.push(m)
                    }
                  }
                }
                i = s
              }
              n.geometry = i
            }
          }
        }
      }
    }
    b(e);
    c && e && e.error && c(e.error)
  })
};
function X(a) {
  this.L = a ? a.lods : null;
  this.u = a ? t[a.spatialReference.wkid || a.spatialReference.wkt] : q;
  if(!this.u) {
    throw new Error("unsupported Spatial Reference");
  }
  this.H = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.u.i() / this.H / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.L.length - 1 : 20;
  if(h.Size) {
    this.U = a ? new h.Size(a.cols, a.rows) : new h.Size(256, 256)
  }
  this.I = Math.pow(2, this.minZoom) * this.H;
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
X.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.u.forward([a.lng(), a.lat()]), d = b || new h.Point(0, 0);
  d.x = (c[0] - this.M) / this.I;
  d.y = (this.N - c[1]) / this.I;
  return d
};
X.prototype.fromLatLngToPoint = X.prototype.fromLatLngToPoint;
new X;
new h.OverlayView;
var ha = u;var Y, ia, Z, $ = [], ja = ["#ff0000", "#ffff00", "#00ff00"];
function ka() {
  for(var a = 0;a < $.length;a++) {
    $[a].setMap(null)
  }
  $.length = 0;
  if(Z) {
    Z.close();
    Z = null
  }
}
function la(a) {
  ka();
  ia.execute({parameters:{Input_Location:{features:[{geometry:a}], spatialReference:{wkid:4326}}, Drive_Times:"1 3 5"}}, function(b, c) {
    if(c) {
      alert(c.message + c.details.join(","))
    }else {
      for(var d, e, g, n = 0;n < b.results.length;n++) {
        d = b.results[n];
        for(var o = 0, k = d.value.features.length;o < k;o++) {
          e = d.value.features[o];
          if(e.geometry) {
            for(var z = 0, i = e.geometry.length;z < i;z++) {
              g = e.geometry[z];
              $.push(g);
              g.setMap(Y);
              g.setOptions({fillColor:ja[$.length % ja.length]})
            }
          }
        }
      }
    }
  })
}
window.onload = function() {
  var a = {zoom:13, center:new google.maps.LatLng(35.23, -80.84), mapTypeId:google.maps.MapTypeId.ROADMAP};
  Y = new google.maps.Map(document.getElementById("map_canvas"), a);
  ia = new W("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Network/ESRI_DriveTime_US/GPServer/CreateDriveTimePolygons");
  google.maps.event.addListener(Y, "click", function(b) {
    la(b.latLng)
  });
  google.maps.event.addListener(ha, "jsonpstart", function() {
    Y.setOptions({draggableCursor:"wait"})
  });
  google.maps.event.addListener(ha, "jsonpend", function() {
    Y.setOptions({draggableCursor:"url(http://maps.gstatic.com/intl/en_us/mapfiles/openhand_8_8.cur),default"})
  });
  Z = new google.maps.InfoWindow({maxWidth:200, content:"Click map to get coverage area for driving time 1,2,3 min from that location.", position:Y.getCenter()});
  Z.open(Y)
};})()
