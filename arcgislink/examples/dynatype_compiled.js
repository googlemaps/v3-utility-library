(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var j, k = Math.PI / 180, l = 0;
window.ags_jsonp = window.ags_jsonp || {};
var m = google.maps, n, o, p, q = {Z:null, R:false}, r = {}, s = {};
function t(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function w(a) {
  return a && typeof a === "string"
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
  m.event.trigger.apply(this, arguments)
}
function aa(a, b) {
  var c = "";
  if(a) {
    c += a.getTime() - a.getTimezoneOffset() * 6E4
  }
  if(b) {
    c += ", " + (b.getTime() - b.getTimezoneOffset() * 6E4)
  }
  return c
}
function z(a, b) {
  b = Math.min(Math.max(b, 0), 1);
  if(a) {
    var c = a.style;
    if(typeof c.opacity !== "undefined") {
      c.opacity = b
    }
    if(typeof c.filters !== "undefined") {
      c.filters.alpha.opacity = Math.floor(100 * b)
    }
    if(typeof c.filter !== "undefined") {
      c.filter = "alpha(opacity:" + Math.floor(b * 100) + ")"
    }
  }
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
var A = "esriGeometryPoint", B = "esriGeometryMultipoint", C = "esriGeometryPolyline", D = "esriGeometryPolygon", E = "esriGeometryEnvelope";
function da(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker) {
    return a && a.splice && a.length > 1 ? B : A
  }else {
    if(b instanceof m.Polyline) {
      return C
    }else {
      if(b instanceof m.Polygon) {
        return D
      }else {
        if(b instanceof m.LatLngBounds) {
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
  if(b instanceof m.LatLng || b instanceof m.Marker || b instanceof m.Polyline || b instanceof m.Polygon || b instanceof m.LatLngBounds) {
    return true
  }
  return false
}
function G(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function H(a) {
  var b = r[a.spatialReference.wkid || a.spatialReference.wkt];
  b = b || n;
  var c = b.n([a.xmin, a.ymin]);
  a = b.n([a.xmax, a.ymax]);
  return new m.LatLngBounds(new m.LatLng(c[1], c[0]), new m.LatLng(a[1], a[0]))
}
function I(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(I(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(F(a)) {
        var e;
        d = "{";
        switch(da(a)) {
          case A:
            e = a && a.splice ? a[0] : a;
            if(e instanceof m.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case B:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof m.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case C:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + G(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case D:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + G(a.getAt(b), true) + "]")
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
              b += c + ":" + I(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function J(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = I(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function K(a, b, c, d) {
  var e = "ags_jsonp_" + l++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e;
  b = J(b);
  var g = document.getElementsByTagName("head")[0];
  if(!g) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    f && g.removeChild(f);
    f = null;
    d.apply(null, arguments);
    y(s, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !q.R) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    g.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var i = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      i = false
    }
    if(q.R) {
      i = true
    }
    if(i && !q.Z) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var h = ca();
    h.onreadystatechange = function() {
      if(h.readyState === 4) {
        if(h.status === 200) {
          eval(h.responseText)
        }else {
          throw new Error("Error code " + h.status);
        }
      }
    };
    h.open("POST", i ? q.Z + "?" + a : a, true);
    h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    h.send(b)
  }
  y(s, "jsonpstart", e);
  return e
}
s.ia = function(a, b, c, d) {
  K(a, b, c, d)
};
s.Q = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        s.Q(a, c)
      }else {
        F(c) && c.setMap(a)
      }
    }
  }
};
s.ka = function(a, b) {
  s.Q(null, a);
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
L.prototype.n = function(a) {
  return a
};
L.prototype.q = function() {
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
  var b = a.J, c = a.N * k, d = a.O * k, e = a.K * k;
  this.a = a.r / a.unit;
  this.g = a.p * k;
  this.i = a.H;
  this.j = a.I;
  a = 1 / b;
  b = 2 * a - a * a;
  this.e = Math.sqrt(b);
  a = this.k(c, b);
  b = this.k(d, b);
  e = O(this, e, this.e);
  c = O(this, c, this.e);
  d = O(this, d, this.e);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.F = a / (this.b * Math.pow(c, this.b));
  this.h = this.t(this.a, this.F, e, this.b)
}
N.prototype = new L;
N.prototype.k = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function O(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
j = N.prototype;
j.t = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
j.s = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
j.M = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.s(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.s(a, b, c)
  }
  return e
};
j.forward = function(a) {
  var b = a[0] * k;
  a = this.t(this.a, this.F, O(this, a[1] * k, this.e), this.b);
  b = this.b * (b - this.g);
  return[this.i + a * Math.sin(b), this.j + this.h - a * Math.cos(b)]
};
j.n = function(a) {
  var b = a[0] - this.i, c = a[1] - this.j;
  a = Math.atan(b / (this.h - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.h - c) * (this.h - c)) / (this.a * this.F), 1 / this.b);
  return[(a / this.b + this.g) / k, this.M(b, this.e, Math.PI / 2 - 2 * Math.atan(b)) / k]
};
j.q = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  L.call(this, a);
  this.a = a.r / a.unit;
  var b = a.J;
  this.A = a.ga;
  var c = a.K * k;
  this.g = a.p * k;
  this.i = a.H;
  this.j = a.I;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.w = this.c * this.c;
  this.G = this.w * this.c;
  this.m = this.c / (1 - this.c);
  this.P = this.k(c, this.a, this.c, this.w, this.G)
}
P.prototype = new L;
P.prototype.k = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
P.prototype.forward = function(a) {
  var b = a[1] * k, c = a[0] * k;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.m * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var f = this.k(b, this.a, this.c, this.w, this.G);
  return[this.i + this.A * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.m) * Math.pow(c, 5) / 120), this.j + this.A * (f - this.P) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.m) * Math.pow(c, 6) / 720)]
};
P.prototype.n = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.P + (c - this.j) / this.A) / (this.a * (1 - this.c / 4 - 3 * this.w / 64 - 5 * this.G / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.m * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.i) / (e * this.A);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.m) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.m - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.g + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.m + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / k, e / k]
};
P.prototype.q = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  L.call(this, a);
  this.a = (a.r || 6378137) / (a.unit || 1);
  this.g = (a.p || 0) * k
}
Q.prototype = new L;
Q.prototype.forward = function(a) {
  var b = a[1] * k;
  return[this.a * (a[0] * k - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
Q.prototype.n = function(a) {
  return[(a[0] / this.a + this.g) / k, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / k]
};
Q.prototype.q = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  L.call(this, a);
  var b = a.J, c = a.N * k, d = a.O * k, e = a.K * k;
  this.a = a.r / a.unit;
  this.g = a.p * k;
  this.i = a.H;
  this.j = a.I;
  a = 1 / b;
  b = 2 * a - a * a;
  this.e = Math.sqrt(b);
  a = this.k(c, b);
  b = this.k(d, b);
  c = S(this, c, this.e);
  d = S(this, d, this.e);
  e = S(this, e, this.e);
  this.b = (a * a - b * b) / (d - c);
  this.D = a * a + this.b * c;
  this.h = this.t(this.a, this.D, this.b, e)
}
R.prototype = new L;
R.prototype.k = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function S(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
j = R.prototype;
j.t = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
j.s = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
j.M = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.s(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.s(a, b, c)
  }
  return e
};
j.forward = function(a) {
  var b = a[0] * k;
  a = this.t(this.a, this.D, this.b, S(this, a[1] * k, this.e));
  b = this.b * (b - this.g);
  return[this.i + a * Math.sin(b), this.j + this.h - a * Math.cos(b)]
};
j.n = function(a) {
  var b = a[0] - this.i;
  a = a[1] - this.j;
  var c = Math.sqrt(b * b + (this.h - a) * (this.h - a)), d = this.b > 0 ? 1 : -1;
  c = (this.D - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.h - d * a)) / this.b + this.g) / k, this.M(c, this.e, Math.asin(c / 2)) / k]
};
j.q = function() {
  return Math.PI * 2 * this.a
};
j.q = function() {
  return Math.PI * 2 * this.a
};
n = new M({wkid:4326});
o = new M({wkid:4269});
p = new Q({wkid:102113, r:6378137, p:0, unit:1});
r = {"4326":n, "4269":o, "102113":p, "102100":new Q({wkid:102100, r:6378137, p:0, unit:1})};
s.fa = function(a, b) {
  var c = r["" + a];
  if(c) {
    return c
  }
  if(b instanceof L) {
    c = r["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = t(c, 'PROJECTION["', '"]'), f = t(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(t(t(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.r = parseFloat(f[1]);
      d.J = parseFloat(f[2]);
      d.K = parseFloat(t(c, '"Latitude_Of_Origin",', "]"));
      d.p = parseFloat(t(c, '"Central_Meridian",', "]"));
      d.H = parseFloat(t(c, '"False_Easting",', "]"));
      d.I = parseFloat(t(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new L(d);
        break;
      case "Lambert_Conformal_Conic":
        d.N = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.O = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
        c = new N(d);
        break;
      case "Transverse_Mercator":
        d.ga = parseFloat(t(c, '"Scale_Factor",', "]"));
        c = new P(d);
        break;
      case "Albers":
        d.N = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.O = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
        c = new R(d);
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
function T(a) {
  this.url = a;
  this.definition = null
}
function U(a, b) {
  this.url = a;
  this.L = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.ca) {
    var d = this;
    window.setTimeout(function() {
      V(d)
    }, b.ca * 1E3)
  }else {
    V(this)
  }
}
function V(a) {
  K(a.url, {}, "", function(b) {
    a.z(b)
  })
}
U.prototype.z = function(a) {
  var b = this;
  x(a, this);
  this.spatialReference = a.spatialReference.wkt ? s.fa(a.spatialReference.wkt) : r[a.spatialReference.wkid];
  a.tables !== undefined ? K(this.url + "/layers", {}, "", function(c) {
    W(b, c)
  }) : W(b, a)
};
function W(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, g, i;
  f = 0;
  for(g = b.layers.length;f < g;f++) {
    i = b.layers[f];
    e = new T(a.url + "/" + i.id);
    x(i, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(g = b.tables.length;f < g;f++) {
      i = b.tables[f];
      e = new T(a.url + "/" + i.id);
      x(i, e);
      d.push(e)
    }
  }
  f = 0;
  for(g = c.length;f < g;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.subLayers = [];
      d = 0;
      for(i = e.subLayerIds.length;d < i;d++) {
        var h;
        a: {
          h = e.subLayerIds[d];
          var u = a.layers;
          if(u) {
            for(var v = 0, ea = u.length;v < ea;v++) {
              if(h === u[v].id) {
                h = u[v];
                break a
              }
              if(w(h) && u[v].name.toLowerCase() === h.toLowerCase()) {
                h = u[v];
                break a
              }
            }
          }
          h = null
        }
        e.subLayers.push(h);
        h.ja = e
      }
    }
  }
  a.L = true;
  y(a, "load")
}
function fa(a) {
  var b = {};
  if(a.layers) {
    for(var c = 0, d = a.layers.length;c < d;c++) {
      var e = a.layers[c];
      if(e.definition) {
        b[String(e.id)] = e.definition
      }
    }
  }
  return b
}
function ga(a) {
  var b = [];
  if(a.layers) {
    var c, d, e;
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      if(c.subLayers) {
        for(var f = 0, g = c.subLayers.length;f < g;f++) {
          if(c.subLayers[f].visible === false) {
            c.visible = false;
            break
          }
        }
      }
    }
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      c.subLayers && c.subLayers.length > 0 || c.visible === true && b.push(c.id)
    }
  }
  return b
}
function ha(a, b, c, d) {
  if(b && b.bounds) {
    var e = {};
    e.f = b.f;
    var f = b.bounds;
    e.bbox = "" + f.getSouthWest().lng() + "," + f.getSouthWest().lat() + "," + f.getNorthEast().lng() + "," + f.getNorthEast().lat();
    e.size = "" + b.width + "," + b.height;
    e.dpi = b.dpi;
    if(b.imageSR) {
      e.imageSR = b.imageSR.wkid ? b.imageSR.wkid : "{wkt:" + b.imageSR.wkt + "}"
    }
    e.bboxSR = "4326";
    e.format = b.format;
    f = b.layerDefinitions;
    if(f === undefined) {
      f = fa(a)
    }
    e.layerDefs = ba(f);
    f = b.layerIds;
    var g = b.layerOption || "show";
    if(f === undefined) {
      f = ga(a)
    }
    if(f.length > 0) {
      e.layers = g + ":" + f.join(",")
    }else {
      if(a.L && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = aa(b.time, b.ha)
    }
    e.da = b.da;
    if(e.f === "image") {
      return a.url + "/export?" + J(e)
    }else {
      K(a.url + "/export", e, "", function(i) {
        if(i.extent) {
          i.bounds = H(i.extent);
          delete i.extent;
          c(i)
        }else {
          i = i.error;
          d && i && i.error && d(i.error)
        }
      })
    }
  }
}
function X(a) {
  this.ea = a ? a.lods : null;
  this.v = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : p;
  if(!this.v) {
    throw new Error("unsupported Spatial Reference");
  }
  this.$ = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.v.q() / this.$ / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.ea.length - 1 : 20;
  if(m.Size) {
    this.aa = a ? new m.Size(a.cols, a.rows) : new m.Size(256, 256)
  }
  this.B = Math.pow(2, this.minZoom) * this.$;
  this.X = a ? a.origin.x : -2.0037508342787E7;
  this.Y = a ? a.origin.y : 2.0037508342787E7;
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
  var c = this.v.forward([a.lng(), a.lat()]), d = b || new m.Point(0, 0);
  d.x = (c[0] - this.X) / this.B;
  d.y = (this.Y - c[1]) / this.B;
  return d
};
X.prototype.fromLatLngToPoint = X.prototype.fromLatLngToPoint;
X.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.v.n([a.x * this.B + this.X, this.Y - a.y * this.B]);
  return new m.LatLng(a[1], a[0])
};
var Y = new X;
function Z(a, b) {
  b = b || {};
  if(b.opacity) {
    this.u = b.opacity;
    delete b.opacity
  }
  x(b, this);
  this.d = a instanceof U ? a : new U(a);
  if(b.U) {
    var c = t(this.d.url, "", "://");
    this.ba = c + "://" + b.U + t(this.d.url, c + "://" + t(this.d.url, "://", "/"), "");
    this.W = parseInt(t(b.U, "[", "]"), 10)
  }
  this.name = b.name || this.d.name;
  this.maxZoom = b.maxZoom || 19;
  this.minZoom = b.minZoom || 0;
  this.S = b.S || this.maxZoom;
  if(this.d.L) {
    this.z(b)
  }else {
    var d = this;
    m.event.addListenerOnce(this.d, "load", function() {
      d.z(b)
    })
  }
  this.o = {};
  this.V = b.map
}
Z.prototype.z = function(a) {
  if(this.d.tileInfo) {
    this.l = new X(this.d.tileInfo);
    this.minZoom = a.minZoom || this.l.minZoom;
    this.maxZoom = a.maxZoom || this.l.maxZoom
  }
};
Z.prototype.getTileUrl = function(a, b) {
  var c = b - (this.l ? this.l.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    var e = this.d.url;
    if(this.ba) {
      e = this.ba.replace("[" + this.W + "]", "" + (a.y + a.x) % this.W)
    }
    d = this.l || (this.V ? this.V.getProjection() : Y);
    if(!d instanceof X) {
      d = Y
    }
    var f = d.aa, g = 1 << b, i = new m.Point(a.x * f.width / g, (a.y + 1) * f.height / g);
    g = new m.Point((a.x + 1) * f.width / g, a.y * f.height / g);
    i = new m.LatLngBounds(d.fromPointToLatLng(i), d.fromPointToLatLng(g));
    g = this.d;
    if(g.fullExtent) {
      g.T = g.T || H(g.fullExtent);
      g = g.T
    }else {
      g = null
    }
    if(this.d.singleFusedMapCache === false || b > this.S) {
      c = {f:"image"};
      c.bounds = i;
      c.format = "png32";
      c.width = f.width;
      c.height = f.height;
      c.imageSR = d.v;
      d = ha(this.d, c)
    }else {
      d = g && !g.intersects(i) ? "" : e + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
function $(a, b) {
  b = b || {};
  var c;
  if(b.opacity) {
    this.u = b.opacity;
    delete b.opacity
  }
  x(b, this);
  var d = a;
  if(w(a)) {
    d = [new Z(a, b)]
  }else {
    if(a instanceof U) {
      d = [new Z(a, b)]
    }else {
      if(a instanceof Z) {
        d = [a]
      }else {
        if(a.length > 0 && w(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new Z(a[c], b)
          }
        }
      }
    }
  }
  this.C = d;
  this.o = {};
  if(b.maxZoom !== undefined) {
    this.maxZoom = b.maxZoom
  }else {
    var e = 0;
    for(c = 0;c < d.length;c++) {
      e = Math.max(e, d[c].maxZoom)
    }
    this.maxZoom = e
  }
  if(d[0].l) {
    this.tileSize = d[0].l.aa;
    this.projection = d[0].l
  }else {
    this.tileSize = new m.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
$.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.C.length;f++) {
    var g = this.C[f];
    if(b <= g.maxZoom && b >= g.minZoom) {
      var i = g.getTileUrl(a, b);
      if(i) {
        var h = c.createElement(document.all ? "img" : "div");
        h.style.border = "0px none";
        h.style.margin = "0px";
        h.style.padding = "0px";
        h.style.overflow = "hidden";
        h.style.position = "absolute";
        h.style.top = "0px";
        h.style.left = "0px";
        h.style.width = "" + this.tileSize.width + "px";
        h.style.height = "" + this.tileSize.height + "px";
        if(document.all) {
          h.src = i
        }else {
          h.style.backgroundImage = "url(" + i + ")"
        }
        d.appendChild(h);
        g.o[e] = h;
        if(g.u !== undefined) {
          z(h, g.u)
        }else {
          this.u !== undefined && z(h, this.u)
        }
      }
    }
  }
  this.o[e] = d;
  d.setAttribute("tid", e);
  return d
};
$.prototype.getTile = $.prototype.getTile;
$.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.o[a] && delete this.o[a];
    for(var b = 0;b < this.C.length;b++) {
      var c = this.C[b];
      c.o[a] && delete c.o[a]
    }
  }
};
$.prototype.releaseTile = $.prototype.releaseTile;
new m.OverlayView;window.onload = function() {
  var a = {zoom:14, center:new google.maps.LatLng(45.5, -122.7), mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControlOptions:{mapTypeIds:["arcgis", google.maps.MapTypeId.ROADMAP]}, streetViewControl:true};
  a = new google.maps.Map(document.getElementById("map_canvas"), a);
  var b = new $("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer", {name:"ArcGIS"});
  a.mapTypes.set("arcgis", b);
  a.overlayMapTypes.insertAt(0, b)
};})()
