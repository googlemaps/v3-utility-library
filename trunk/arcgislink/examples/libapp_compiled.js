(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var h = Math.PI / 180, i = 0, j = google.maps, l, n, o, p = {A:null, w:false}, s = {}, t = {};
function u(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function v(a, b, c) {
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
function w() {
  j.event.trigger.apply(this, arguments)
}
function x() {
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
var y = "esriGeometryPoint", z = "esriGeometryMultipoint", A = "esriGeometryPolyline", B = "esriGeometryPolygon", C = "esriGeometryEnvelope";
function D(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof j.LatLng || b instanceof j.Marker) {
    return a && a.splice && a.length > 1 ? z : y
  }else {
    if(b instanceof j.Polyline) {
      return A
    }else {
      if(b instanceof j.Polygon) {
        return B
      }else {
        if(b instanceof j.LatLngBounds) {
          return C
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return y
          }else {
            if(b.points) {
              return z
            }else {
              if(b.paths) {
                return A
              }else {
                if(b.rings) {
                  return B
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
function E(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof j.LatLng || b instanceof j.Marker || b instanceof j.Polyline || b instanceof j.Polygon || b instanceof j.LatLngBounds) {
    return true
  }
  return false
}
function F(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function G(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(G(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(E(a)) {
        var e;
        d = "{";
        switch(D(a)) {
          case y:
            e = a && a.splice ? a[0] : a;
            if(e instanceof j.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case z:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof j.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case A:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + F(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case B:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + F(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case C:
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
function H(a) {
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
function I(a, b, c, d) {
  var e = "ags_jsonp_" + i++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = e + " && " + e;
  b = H(b);
  var m = document.getElementsByTagName("head")[0];
  if(!m) {
    throw new Error("document must have header tag");
  }
  window[e] = function() {
    delete window[e];
    f && m.removeChild(f);
    f = null;
    d.apply(null, arguments);
    w(t, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !p.w) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    m.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var k = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      k = false
    }
    if(p.w) {
      k = true
    }
    if(k && !p.A) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var g = x();
    g.onreadystatechange = function() {
      if(g.readyState === 4) {
        if(g.status === 200) {
          eval(g.responseText)
        }else {
          throw new Error("Error code " + g.status);
        }
      }
    };
    g.open("POST", k ? p.A + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  w(t, "jsonpstart", e);
  return e
}
t.H = function(a, b, c, d) {
  I(a, b, c, d)
};
t.v = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        t.v(a, c)
      }else {
        E(c) && c.setMap(a)
      }
    }
  }
};
t.T = function(a, b) {
  t.v(null, a);
  if(b) {
    a.length = 0
  }
};
function J(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
J.prototype.e = function() {
  return 360
};
J.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function K(a) {
  a = a || {};
  J.call(this, a)
}
K.prototype = new J;
function L(a) {
  a = a || {};
  J.call(this, a);
  var b = a.n, c = a.r * h, d = a.s * h, e = a.p * h;
  this.a = a.i / a.j;
  this.o = a.h * h;
  this.t = a.l;
  this.u = a.m;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.b(c, b);
  b = this.b(d, b);
  e = M(this, e, this.c);
  c = M(this, c, this.c);
  d = M(this, d, this.c);
  this.g = Math.log(a / b) / Math.log(c / d);
  this.F = a / (this.g * Math.pow(c, this.g));
  this.J = this.k(this.a, this.F, e, this.g)
}
L.prototype = new J;
L.prototype.b = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function M(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
L.prototype.k = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
L.prototype.e = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  J.call(this, a);
  this.a = a.i / a.j;
  var b = a.n;
  this.P = a.K;
  var c = a.p * h;
  this.o = a.h * h;
  this.t = a.l;
  this.u = a.m;
  a = 1 / b;
  this.d = 2 * a - a * a;
  this.z = this.d * this.d;
  this.G = this.z * this.d;
  this.O = this.d / (1 - this.d);
  this.M = this.b(c, this.a, this.d, this.z, this.G)
}
N.prototype = new J;
N.prototype.b = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.e = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  J.call(this, a);
  this.a = (a.i || 6378137) / (a.j || 1);
  this.o = (a.h || 0) * h
}
O.prototype = new J;
O.prototype.e = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  J.call(this, a);
  var b = a.n, c = a.r * h, d = a.s * h, e = a.p * h;
  this.a = a.i / a.j;
  this.o = a.h * h;
  this.t = a.l;
  this.u = a.m;
  a = 1 / b;
  b = 2 * a - a * a;
  this.c = Math.sqrt(b);
  a = this.b(c, b);
  b = this.b(d, b);
  c = Q(this, c, this.c);
  d = Q(this, d, this.c);
  e = Q(this, e, this.c);
  this.g = (a * a - b * b) / (d - c);
  this.D = a * a + this.g * c;
  this.J = this.k(this.a, this.D, this.g, e)
}
P.prototype = new J;
P.prototype.b = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function Q(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
P.prototype.k = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
P.prototype.e = function() {
  return Math.PI * 2 * this.a
};
P.prototype.e = function() {
  return Math.PI * 2 * this.a
};
l = new K({wkid:4326});
n = new K({wkid:4269});
o = new O({wkid:102113, semi_major:6378137, central_meridian:0, unit:1});
s = {"4326":l, "4269":n, "102113":o, "102100":new O({wkid:102100, semi_major:6378137, central_meridian:0, unit:1})};
function R(a, b) {
  var c = s["" + a];
  if(c) {
    return c
  }
  if(b instanceof J) {
    c = s["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = u(c, 'PROJECTION["', '"]'), f = u(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.j = parseFloat(u(u(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.i = parseFloat(f[1]);
      d.n = parseFloat(f[2]);
      d.p = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.h = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.l = parseFloat(u(c, '"False_Easting",', "]"));
      d.m = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new J(d);
        break;
      case "Lambert_Conformal_Conic":
        d.r = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.s = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new L(d);
        break;
      case "Transverse_Mercator":
        d.K = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new N(d);
        break;
      case "Albers":
        d.r = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.s = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new P(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      s["" + a] = c
    }
  }
  return c
}
function S(a) {
  this.url = a;
  this.definition = null
}
S.prototype.load = function() {
  var a = this;
  this.q || I(this.url, {}, "", function(b) {
    v(b, a);
    a.q = true;
    w(a, "load")
  })
};
function T(a, b) {
  this.url = a;
  this.q = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  b.N || this.load()
}
T.prototype.load = function() {
  var a = this;
  I(this.url, {}, "", function(b) {
    U(a, b)
  })
};
function U(a, b) {
  v(b, a);
  a.spatialReference = b.spatialReference.wkt ? R(b.spatialReference.wkt) : s[b.spatialReference.wkid];
  b.tables !== undefined ? I(a.url + "/layers", {}, "", function(c) {
    V(a, c)
  }) : V(a, b)
}
function V(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, m, k;
  f = 0;
  for(m = b.layers.length;f < m;f++) {
    k = b.layers[f];
    e = new S(a.url + "/" + k.id);
    v(k, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(m = b.tables.length;f < m;f++) {
      k = b.tables[f];
      e = new S(a.url + "/" + k.id);
      v(k, e);
      d.push(e)
    }
  }
  f = 0;
  for(m = c.length;f < m;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.L = [];
      d = 0;
      for(k = e.subLayerIds.length;d < k;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var q = a.layers;
          if(q) {
            for(var r = 0, X = q.length;r < X;r++) {
              if(g === q[r].id) {
                g = q[r];
                break a
              }
              if(g && typeof g === "string" && q[r].name.toLowerCase() === g.toLowerCase()) {
                g = q[r];
                break a
              }
            }
          }
          g = null
        }
        e.L.push(g);
        g.S = e
      }
    }
  }
  a.q = true;
  w(a, "load")
}
new (function(a) {
  this.I = a ? a.lods : null;
  this.C = a ? s[a.spatialReference.wkid || a.spatialReference.wkt] : o;
  if(!this.C) {
    throw new Error("unsupported Spatial Reference");
  }
  this.B = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.C.e() / this.B / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.I.length - 1 : 20;
  if(j.Size) {
    this.V = a ? new j.Size(a.cols, a.rows) : new j.Size(256, 256)
  }
  this.U = Math.pow(2, this.minZoom) * this.B;
  this.Q = a ? a.origin.x : -2.0037508342787E7;
  this.R = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
});
new j.OverlayView;
var W = t;function Y(a) {
  var b = document.getElementById("log");
  b.innerHTML = b.innerHTML + a + "</br>"
}
window.loadSvc = function() {
  document.getElementById("log").innerHTML = "";
  var a = document.getElementById("services"), b = new T(a.options[a.selectedIndex].text);
  google.maps.event.addListener(b, "load", function() {
    Y("description:" + b.description);
    Y("layers:");
    for(var c = b.layers, d = 0;d < c.length;d++) {
      var e = c[d];
      Y("  layer" + e.id + ":" + e.name + " (" + e.url)
    }
    if(c = b.tables) {
      Y("tables:");
      for(d = 0;d < c.length;d++) {
        e = c[d];
        Y("table" + e.id + ":" + e.name + " (" + e.url)
      }
    }
  })
};
window.onload = function() {
  W.H("http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer", {}, "callback", function(a) {
    Y("layerdesc:" + a.serviceDescription)
  })
};})()
