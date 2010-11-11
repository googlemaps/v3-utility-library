(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var h, i = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var l = google.maps, m, n, o, q = {U:null, T:false}, r = {}, s = {};
function t(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function u(a, b, c) {
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
function v() {
  l.event.trigger.apply(this, arguments)
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
function w(a, b) {
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
function ca(a) {
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
var x = "esriGeometryPoint", y = "esriGeometryMultipoint", z = "esriGeometryPolyline", A = "esriGeometryPolygon", B = "esriGeometryEnvelope";
function ea(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof l.LatLng || b instanceof l.Marker) {
    return a && a.splice && a.length > 1 ? y : x
  }else {
    if(b instanceof l.Polyline) {
      return z
    }else {
      if(b instanceof l.Polygon) {
        return A
      }else {
        if(b instanceof l.LatLngBounds) {
          return B
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return x
          }else {
            if(b.points) {
              return y
            }else {
              if(b.paths) {
                return z
              }else {
                if(b.rings) {
                  return A
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
function C(a) {
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
function D(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function E(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(E(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(C(a)) {
        var e;
        d = "{";
        switch(ea(a)) {
          case x:
            e = a && a.splice ? a[0] : a;
            if(e instanceof l.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case y:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof l.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case z:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + D(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case A:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + D(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case B:
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
              b += c + ":" + E(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function G(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = E(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function fa(a, b) {
  for(var c = [], d = 2, e = arguments.length;d < e;d++) {
    c.push(arguments[d])
  }
  return function() {
    a.apply(b, c)
  }
}
function ga(a, b, c) {
  b.L ? a.push(b.copyrightText) : l.event.addListenerOnce(b, "load", function() {
    H(c)
  })
}
function H(a) {
  var b = null;
  if(a) {
    var c = a.controls[l.ControlPosition.BOTTOM_RIGHT];
    if(c) {
      for(var d = 0, e = c.getLength();d < e;d++) {
        if(c.getAt(d).id === "agsCopyrights") {
          b = c.getAt(d);
          break
        }
      }
    }
    if(!b) {
      b = document.createElement("div");
      b.style.fontFamily = "Arial,sans-serif";
      b.style.fontSize = "10px";
      b.style.textAlign = "right";
      b.id = "agsCopyrights";
      a.controls[l.ControlPosition.BOTTOM_RIGHT].push(b);
      l.event.addListener(a, "maptypeid_changed", function() {
        H(a)
      })
    }
    var f = a.s;
    c = [];
    if(f) {
      d = 0;
      for(e = f.getLength();d < e;d++) {
        ga(c, f.getAt(d).w, a)
      }
    }
    var j = a.overlayMapTypes;
    if(j) {
      d = 0;
      for(e = j.getLength();d < e;d++) {
        f = j.getAt(d)
      }
    }
    f = a.mapTypes.get(a.getMapTypeId());
    b.innerHTML = c.join("<br/>")
  }
}
function I(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = G(b);
  var j = document.getElementsByTagName("head")[0];
  if(!j) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    f && j.removeChild(f);
    f = null;
    d.apply(null, arguments);
    v(s, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !q.T) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    j.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var g = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      g = false
    }
    if(q.T) {
      g = true
    }
    if(g && !q.U) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var k = da();
    k.onreadystatechange = function() {
      if(k.readyState === 4) {
        if(k.status === 200) {
          eval(k.responseText)
        }else {
          throw new Error("Error code " + k.status);
        }
      }
    };
    k.open("POST", g ? q.U + "?" + a : a, true);
    k.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    k.send(b)
  }
  v(s, "jsonpstart", e);
  return e
}
s.ga = function(a, b, c, d) {
  I(a, b, c, d)
};
s.S = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        s.S(a, c)
      }else {
        C(c) && c.setMap(a)
      }
    }
  }
};
s.ka = function(a, b) {
  s.S(null, a);
  if(b) {
    a.length = 0
  }
};
function J(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
J.prototype.forward = function(a) {
  return a
};
J.prototype.o = function(a) {
  return a
};
J.prototype.n = function() {
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
  var b = a.J, c = a.P * i, d = a.Q * i, e = a.K * i;
  this.a = a.p / a.unit;
  this.e = a.m * i;
  this.h = a.H;
  this.i = a.I;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  e = M(this, e, this.d);
  c = M(this, c, this.d);
  d = M(this, d, this.d);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.F = a / (this.b * Math.pow(c, this.b));
  this.g = this.r(this.a, this.F, e, this.b)
}
L.prototype = new J;
L.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function M(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
h = L.prototype;
h.r = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
h.q = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
h.O = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.q(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.q(a, b, c)
  }
  return e
};
h.forward = function(a) {
  var b = a[0] * i;
  a = this.r(this.a, this.F, M(this, a[1] * i, this.d), this.b);
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
h.o = function(a) {
  var b = a[0] - this.h, c = a[1] - this.i;
  a = Math.atan(b / (this.g - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.g - c) * (this.g - c)) / (this.a * this.F), 1 / this.b);
  return[(a / this.b + this.e) / i, this.O(b, this.d, Math.PI / 2 - 2 * Math.atan(b)) / i]
};
h.n = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  J.call(this, a);
  this.a = a.p / a.unit;
  var b = a.J;
  this.v = a.ea;
  var c = a.K * i;
  this.e = a.m * i;
  this.h = a.H;
  this.i = a.I;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.u = this.c * this.c;
  this.G = this.u * this.c;
  this.l = this.c / (1 - this.c);
  this.R = this.j(c, this.a, this.c, this.u, this.G)
}
N.prototype = new J;
N.prototype.j = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.forward = function(a) {
  var b = a[1] * i, c = a[0] * i;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.l * Math.pow(Math.cos(b), 2);
  c = (c - this.e) * Math.cos(b);
  var f = this.j(b, this.a, this.c, this.u, this.G);
  return[this.h + this.v * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.l) * Math.pow(c, 5) / 120), this.i + this.v * (f - this.R) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.l) * Math.pow(c, 6) / 720)]
};
N.prototype.o = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.R + (c - this.i) / this.v) / (this.a * (1 - this.c / 4 - 3 * this.u / 64 - 5 * this.G / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.l * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.h) / (e * this.v);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.l) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.l - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.e + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.l + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / i, e / i]
};
N.prototype.n = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  J.call(this, a);
  this.a = (a.p || 6378137) / (a.unit || 1);
  this.e = (a.m || 0) * i
}
O.prototype = new J;
O.prototype.forward = function(a) {
  var b = a[1] * i;
  return[this.a * (a[0] * i - this.e), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
O.prototype.o = function(a) {
  return[(a[0] / this.a + this.e) / i, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / i]
};
O.prototype.n = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  J.call(this, a);
  var b = a.J, c = a.P * i, d = a.Q * i, e = a.K * i;
  this.a = a.p / a.unit;
  this.e = a.m * i;
  this.h = a.H;
  this.i = a.I;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  c = Q(this, c, this.d);
  d = Q(this, d, this.d);
  e = Q(this, e, this.d);
  this.b = (a * a - b * b) / (d - c);
  this.D = a * a + this.b * c;
  this.g = this.r(this.a, this.D, this.b, e)
}
P.prototype = new J;
P.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function Q(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
h = P.prototype;
h.r = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
h.q = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
h.O = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.q(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.q(a, b, c)
  }
  return e
};
h.forward = function(a) {
  var b = a[0] * i;
  a = this.r(this.a, this.D, this.b, Q(this, a[1] * i, this.d));
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
h.o = function(a) {
  var b = a[0] - this.h;
  a = a[1] - this.i;
  var c = Math.sqrt(b * b + (this.g - a) * (this.g - a)), d = this.b > 0 ? 1 : -1;
  c = (this.D - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.g - d * a)) / this.b + this.e) / i, this.O(c, this.d, Math.asin(c / 2)) / i]
};
h.n = function() {
  return Math.PI * 2 * this.a
};
h.n = function() {
  return Math.PI * 2 * this.a
};
m = new K({wkid:4326});
n = new K({wkid:4269});
o = new O({wkid:102113, p:6378137, m:0, unit:1});
r = {"4326":m, "4269":n, "102113":o, "102100":new O({wkid:102100, p:6378137, m:0, unit:1})};
s.ja = function(a, b) {
  var c = r["" + a];
  if(c) {
    return c
  }
  if(b instanceof J) {
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
      d.p = parseFloat(f[1]);
      d.J = parseFloat(f[2]);
      d.K = parseFloat(t(c, '"Latitude_Of_Origin",', "]"));
      d.m = parseFloat(t(c, '"Central_Meridian",', "]"));
      d.H = parseFloat(t(c, '"False_Easting",', "]"));
      d.I = parseFloat(t(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new J(d);
        break;
      case "Lambert_Conformal_Conic":
        d.P = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.Q = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
        c = new L(d);
        break;
      case "Transverse_Mercator":
        d.ea = parseFloat(t(c, '"Scale_Factor",', "]"));
        c = new N(d);
        break;
      case "Albers":
        d.P = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.Q = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
        c = new P(d);
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
function R(a) {
  this.url = a;
  this.definition = null
}
function S(a, b) {
  this.url = a;
  this.L = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.Y) {
    var d = this;
    window.setTimeout(function() {
      T(d)
    }, b.Y * 1E3)
  }else {
    T(this)
  }
}
function T(a) {
  I(a.url, {}, "", function(b) {
    ha(a, b)
  })
}
function ha(a, b) {
  u(b, a);
  a.spatialReference = b.spatialReference.wkt ? J.ia(b.spatialReference.wkt) : r[b.spatialReference.wkid];
  b.tables !== undefined ? I(a.url + "/layers", {}, "", function(c) {
    U(a, c)
  }) : U(a, b)
}
function U(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, j, g;
  f = 0;
  for(j = b.layers.length;f < j;f++) {
    g = b.layers[f];
    e = new R(a.url + "/" + g.id);
    u(g, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(j = b.tables.length;f < j;f++) {
      g = b.tables[f];
      e = new R(a.url + "/" + g.id);
      u(g, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.C = [];
      d = 0;
      for(g = e.subLayerIds.length;d < g;d++) {
        var k = V(a, e.subLayerIds[d]);
        e.C.push(k);
        k.ha = e
      }
    }
  }
  a.L = true;
  v(a, "load")
}
function V(a, b) {
  var c = a.layers;
  if(c) {
    for(var d = 0, e = c.length;d < e;d++) {
      if(b === c[d].id) {
        return c[d]
      }
      if(b && typeof b === "string" && c[d].name.toLowerCase() === b.toLowerCase()) {
        return c[d]
      }
    }
  }
  return null
}
function ia(a) {
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
function ja(a) {
  var b = [];
  if(a.layers) {
    var c, d, e;
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      if(c.C) {
        for(var f = 0, j = c.C.length;f < j;f++) {
          if(c.C[f].visible === false) {
            c.visible = false;
            break
          }
        }
      }
    }
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      c.visible === true && b.push(c.id)
    }
  }
  return b
}
function ka(a, b, c, d) {
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
      f = ia(a)
    }
    e.layerDefs = ca(f);
    f = b.layerIds;
    var j = b.layerOption || "show";
    if(f === undefined) {
      f = ja(a)
    }
    if(f.length > 0) {
      e.layers = j + ":" + f.join(",")
    }else {
      if(a.L && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = ba(b.time, b.fa)
    }
    e.aa = b.aa;
    if(e.f === "image") {
      return a.url + "/export?" + G(e)
    }else {
      I(a.url + "/export", e, "", function(g) {
        if(g.extent) {
          var k, p = g.extent, F = r[p.spatialReference.wkid || p.spatialReference.wkt];
          F = F || m;
          k = F.o([p.xmin, p.ymin]);
          p = F.o([p.xmax, p.ymax]);
          k = new l.LatLngBounds(new l.LatLng(k[1], k[0]), new l.LatLng(p[1], p[0]));
          g.bounds = k;
          delete g.extent;
          c(g)
        }else {
          g = g.error;
          d && g && g.error && d(g.error)
        }
      })
    }
  }
}
function W(a) {
  this.ba = a ? a.lods : null;
  this.B = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : o;
  if(!this.B) {
    throw new Error("unsupported Spatial Reference");
  }
  this.V = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.B.n() / this.V / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.ba.length - 1 : 20;
  if(l.Size) {
    this.la = a ? new l.Size(a.cols, a.rows) : new l.Size(256, 256)
  }
  this.W = Math.pow(2, this.minZoom) * this.V;
  this.ca = a ? a.origin.x : -2.0037508342787E7;
  this.da = a ? a.origin.y : 2.0037508342787E7;
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
  var c = this.B.forward([a.lng(), a.lat()]), d = b || new l.Point(0, 0);
  d.x = (c[0] - this.ca) / this.W;
  d.y = (this.da - c[1]) / this.W;
  return d
};
W.prototype.fromLatLngToPoint = W.prototype.fromLatLngToPoint;
new W;
function X(a, b) {
  b = b || {};
  this.w = a instanceof S ? a : new S(a);
  this.minZoom = b.minZoom;
  this.maxZoom = b.maxZoom;
  this.A = b.opacity || 1;
  this.$ = b.Z || {};
  this.z = this.t = false;
  this.k = null;
  b.map && this.setMap(b.map);
  this.M = null
}
X.prototype = new l.OverlayView;
X.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  this.k = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.A && w(a, this.A);
  this.X = l.event.addListener(this.getMap(), "bounds_changed", fa(this.N, this));
  a = this.getMap();
  a.s = a.s || new l.MVCArray;
  a.s.push(this);
  H(a);
  this.M = a
};
X.prototype.onAdd = X.prototype.onAdd;
X.prototype.onRemove = function() {
  l.event.removeListener(this.X);
  this.k.parentNode.removeChild(this.k);
  this.k = null;
  var a = this.M, b = a.s;
  if(b) {
    for(var c = 0, d = b.getLength();c < d;c++) {
      if(b.getAt(c) == this) {
        b.removeAt(c);
        break
      }
    }
  }
  H(a);
  this.M = null
};
X.prototype.onRemove = X.prototype.onRemove;
X.prototype.draw = function() {
  if(!this.t || this.z === true) {
    this.N()
  }
};
X.prototype.draw = X.prototype.draw;
X.prototype.N = function() {
  if(this.t === true) {
    this.z = true
  }else {
    var a = this.getMap(), b = a ? a.getBounds() : null;
    if(b) {
      var c = this.$;
      c.bounds = b;
      b = o;
      var d = a.getDiv();
      c.width = d.offsetWidth;
      c.height = d.offsetHeight;
      if((a = a.getProjection()) && a instanceof W) {
        b = a.B
      }
      c.imageSR = b;
      v(this, "drawstart");
      var e = this;
      this.t = true;
      this.k.style.backgroundImage = "";
      ka(this.w, c, function(f) {
        e.t = false;
        if(e.z === true) {
          e.z = false;
          e.N()
        }else {
          if(f.href) {
            var j = e.getProjection(), g = f.bounds, k = j.fromLatLngToDivPixel(g.getSouthWest());
            j = j.fromLatLngToDivPixel(g.getNorthEast());
            g = e.k;
            g.style.left = k.x + "px";
            g.style.top = j.y + "px";
            g.style.width = j.x - k.x + "px";
            g.style.height = k.y - j.y + "px";
            e.k.style.backgroundImage = "url(" + f.href + ")";
            f = Math.min(Math.max(e.A, 0), 1);
            e.A = f;
            w(e.k, f)
          }
          v(e, "drawend")
        }
      })
    }
  }
};var Y, Z, $;
window.onload = function() {
  var a = {zoom:6, center:new google.maps.LatLng(38, -98), mapTypeId:google.maps.MapTypeId.ROADMAP, streetViewControl:true};
  $ = new google.maps.Map(document.getElementById("map_canvas"), a);
  Y = new X("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer");
  google.maps.event.addListenerOnce(Y.w, "load", function() {
    var b = Y.w;
    V(b, "Coarse Counties").definition = "STATE_NAME='Kansas' and POP2007>25000";
    V(b, "Detailed Counties").definition = "STATE_NAME='Kansas' and POP2007>25000";
    V(b, "states").definition = "STATE_NAME='Kansas'";
    Y.setMap($)
  });
  Z = new X("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer", {Z:{layerIds:[5, 4, 3], layerOption:"show", layerDefinitions:{"5":"STATE_NAME='New Mexico'", "4":"STATE_NAME='New Mexico' and POP2007>25000", "3":"STATE_NAME='New Mexico' and POP2007>25000"}}});
  Z.setMap($)
};})()
