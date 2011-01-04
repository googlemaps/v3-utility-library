(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var j, k = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var l = google.maps, m, n, o, p = {Z:null, S:false}, q = {}, r = {};
function s(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function t(a) {
  return a && typeof a === "string"
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
function y(a, b) {
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
var z = "esriGeometryPoint", A = "esriGeometryMultipoint", B = "esriGeometryPolyline", C = "esriGeometryPolygon", D = "esriGeometryEnvelope";
function ea(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof l.LatLng || b instanceof l.Marker) {
    return a && a.splice && a.length > 1 ? A : z
  }else {
    if(b instanceof l.Polyline) {
      return B
    }else {
      if(b instanceof l.Polygon) {
        return C
      }else {
        if(b instanceof l.LatLngBounds) {
          return D
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
function E(a) {
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
function F(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function G(a) {
  var b = q[a.spatialReference.wkid || a.spatialReference.wkt];
  b = b || m;
  var c = b.o([a.xmin, a.ymin]);
  a = b.o([a.xmax, a.ymax]);
  return new l.LatLngBounds(new l.LatLng(c[1], c[0]), new l.LatLng(a[1], a[0]))
}
function H(a) {
  var b;
  if(typeof a === "object") {
    if(a && a.splice) {
      b = [];
      for(var c = 0, d = a.length;c < d;c++) {
        b.push(H(a[c]))
      }
      return"[" + b.join(",") + "]"
    }else {
      if(E(a)) {
        var e;
        d = "{";
        switch(ea(a)) {
          case z:
            e = a && a.splice ? a[0] : a;
            if(e instanceof l.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case A:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof l.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case B:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + F(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case C:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + F(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case D:
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
              b += c + ":" + H(a[c])
            }
          }
          return"{" + b + "}"
        }
      }
    }
  }
  return a.toString()
}
function I(a) {
  var b = "";
  if(a) {
    a.f = a.f || "json";
    for(var c in a) {
      if(a.hasOwnProperty(c) && a[c] !== null && a[c] !== undefined) {
        var d = H(a[c]);
        b += c + "=" + (escape ? escape(d) : encodeURIComponent(d)) + "&"
      }
    }
  }
  return b
}
function J(a, b, c) {
  b.C ? a.push(b.copyrightText) : l.event.addListenerOnce(b, "load", function() {
    K(c)
  })
}
function K(a) {
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
        K(a)
      })
    }
    var f = a.agsOverlays;
    c = [];
    if(f) {
      d = 0;
      for(e = f.getLength();d < e;d++) {
        J(c, f.getAt(d).c, a)
      }
    }
    var g = a.overlayMapTypes;
    if(g) {
      d = 0;
      for(e = g.getLength();d < e;d++) {
        f = g.getAt(d);
        if(f instanceof L) {
          for(var h = 0, i = f.m.length;h < i;h++) {
            J(c, f.m[h].c, a)
          }
        }
      }
    }
    f = a.mapTypes.get(a.getMapTypeId());
    if(f instanceof L) {
      d = 0;
      for(e = f.m.length;d < e;d++) {
        J(c, f.m[d].c, a)
      }
      b.style.color = f.fa ? "#ffffff" : "#000000"
    }
    b.innerHTML = c.join("<br/>")
  }
}
function M(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e;
  b = I(b);
  var g = document.getElementsByTagName("head")[0];
  if(!g) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    f && g.removeChild(f);
    f = null;
    d.apply(null, arguments);
    x(r, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !p.S) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    g.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var h = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      h = false
    }
    if(p.S) {
      h = true
    }
    if(h && !p.Z) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var i = da();
    i.onreadystatechange = function() {
      if(i.readyState === 4) {
        if(i.status === 200) {
          eval(i.responseText)
        }else {
          throw new Error("Error code " + i.status);
        }
      }
    };
    i.open("POST", h ? p.Z + "?" + a : a, true);
    i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    i.send(b)
  }
  x(r, "jsonpstart", e);
  return e
}
r.ja = function(a, b, c, d) {
  M(a, b, c, d)
};
r.R = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        r.R(a, c)
      }else {
        E(c) && c.setMap(a)
      }
    }
  }
};
r.la = function(a, b) {
  r.R(null, a);
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
N.prototype.o = function(a) {
  return a
};
N.prototype.r = function() {
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
  var b = a.K, c = a.O * k, d = a.P * k, e = a.L * k;
  this.a = a.s / a.unit;
  this.g = a.q * k;
  this.i = a.I;
  this.j = a.J;
  a = 1 / b;
  b = 2 * a - a * a;
  this.e = Math.sqrt(b);
  a = this.k(c, b);
  b = this.k(d, b);
  e = Q(this, e, this.e);
  c = Q(this, c, this.e);
  d = Q(this, d, this.e);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.G = a / (this.b * Math.pow(c, this.b));
  this.h = this.u(this.a, this.G, e, this.b)
}
P.prototype = new N;
P.prototype.k = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function Q(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
j = P.prototype;
j.u = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
j.t = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
j.N = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.t(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.t(a, b, c)
  }
  return e
};
j.forward = function(a) {
  var b = a[0] * k;
  a = this.u(this.a, this.G, Q(this, a[1] * k, this.e), this.b);
  b = this.b * (b - this.g);
  return[this.i + a * Math.sin(b), this.j + this.h - a * Math.cos(b)]
};
j.o = function(a) {
  var b = a[0] - this.i, c = a[1] - this.j;
  a = Math.atan(b / (this.h - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.h - c) * (this.h - c)) / (this.a * this.G), 1 / this.b);
  return[(a / this.b + this.g) / k, this.N(b, this.e, Math.PI / 2 - 2 * Math.atan(b)) / k]
};
j.r = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  N.call(this, a);
  this.a = a.s / a.unit;
  var b = a.K;
  this.B = a.ha;
  var c = a.L * k;
  this.g = a.q * k;
  this.i = a.I;
  this.j = a.J;
  a = 1 / b;
  this.d = 2 * a - a * a;
  this.z = this.d * this.d;
  this.H = this.z * this.d;
  this.n = this.d / (1 - this.d);
  this.Q = this.k(c, this.a, this.d, this.z, this.H)
}
R.prototype = new N;
R.prototype.k = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
R.prototype.forward = function(a) {
  var b = a[1] * k, c = a[0] * k;
  a = this.a / Math.sqrt(1 - this.d * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.n * Math.pow(Math.cos(b), 2);
  c = (c - this.g) * Math.cos(b);
  var f = this.k(b, this.a, this.d, this.z, this.H);
  return[this.i + this.B * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.n) * Math.pow(c, 5) / 120), this.j + this.B * (f - this.Q) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.n) * Math.pow(c, 6) / 720)]
};
R.prototype.o = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.d)) / (1 + Math.sqrt(1 - this.d));
  c = (this.Q + (c - this.j) / this.B) / (this.a * (1 - this.d / 4 - 3 * this.z / 64 - 5 * this.H / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.n * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.d * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.d) / Math.pow(1 - this.d * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.i) / (e * this.B);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.n) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.n - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.g + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.n + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / k, e / k]
};
R.prototype.r = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  N.call(this, a);
  this.a = (a.s || 6378137) / (a.unit || 1);
  this.g = (a.q || 0) * k
}
S.prototype = new N;
S.prototype.forward = function(a) {
  var b = a[1] * k;
  return[this.a * (a[0] * k - this.g), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
S.prototype.o = function(a) {
  return[(a[0] / this.a + this.g) / k, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / k]
};
S.prototype.r = function() {
  return Math.PI * 2 * this.a
};
function T(a) {
  a = a || {};
  N.call(this, a);
  var b = a.K, c = a.O * k, d = a.P * k, e = a.L * k;
  this.a = a.s / a.unit;
  this.g = a.q * k;
  this.i = a.I;
  this.j = a.J;
  a = 1 / b;
  b = 2 * a - a * a;
  this.e = Math.sqrt(b);
  a = this.k(c, b);
  b = this.k(d, b);
  c = U(this, c, this.e);
  d = U(this, d, this.e);
  e = U(this, e, this.e);
  this.b = (a * a - b * b) / (d - c);
  this.F = a * a + this.b * c;
  this.h = this.u(this.a, this.F, this.b, e)
}
T.prototype = new N;
T.prototype.k = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function U(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
j = T.prototype;
j.u = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
j.t = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
j.N = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.t(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.t(a, b, c)
  }
  return e
};
j.forward = function(a) {
  var b = a[0] * k;
  a = this.u(this.a, this.F, this.b, U(this, a[1] * k, this.e));
  b = this.b * (b - this.g);
  return[this.i + a * Math.sin(b), this.j + this.h - a * Math.cos(b)]
};
j.o = function(a) {
  var b = a[0] - this.i;
  a = a[1] - this.j;
  var c = Math.sqrt(b * b + (this.h - a) * (this.h - a)), d = this.b > 0 ? 1 : -1;
  c = (this.F - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.h - d * a)) / this.b + this.g) / k, this.N(c, this.e, Math.asin(c / 2)) / k]
};
j.r = function() {
  return Math.PI * 2 * this.a
};
j.r = function() {
  return Math.PI * 2 * this.a
};
m = new O({wkid:4326});
n = new O({wkid:4269});
o = new S({wkid:102113, s:6378137, q:0, unit:1});
q = {"4326":m, "4269":n, "102113":o, "102100":new S({wkid:102100, s:6378137, q:0, unit:1})};
r.ga = function(a, b) {
  var c = q["" + a];
  if(c) {
    return c
  }
  if(b instanceof N) {
    c = q["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = s(c, 'PROJECTION["', '"]'), f = s(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(s(s(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.s = parseFloat(f[1]);
      d.K = parseFloat(f[2]);
      d.L = parseFloat(s(c, '"Latitude_Of_Origin",', "]"));
      d.q = parseFloat(s(c, '"Central_Meridian",', "]"));
      d.I = parseFloat(s(c, '"False_Easting",', "]"));
      d.J = parseFloat(s(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new N(d);
        break;
      case "Lambert_Conformal_Conic":
        d.O = parseFloat(s(c, '"Standard_Parallel_1",', "]"));
        d.P = parseFloat(s(c, '"Standard_Parallel_2",', "]"));
        c = new P(d);
        break;
      case "Transverse_Mercator":
        d.ha = parseFloat(s(c, '"Scale_Factor",', "]"));
        c = new R(d);
        break;
      case "Albers":
        d.O = parseFloat(s(c, '"Standard_Parallel_1",', "]"));
        d.P = parseFloat(s(c, '"Standard_Parallel_2",', "]"));
        c = new T(d);
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
function V(a) {
  this.url = a;
  this.definition = null
}
function W(a, b) {
  this.url = a;
  this.C = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.ca) {
    var d = this;
    window.setTimeout(function() {
      X(d)
    }, b.ca * 1E3)
  }else {
    X(this)
  }
}
function X(a) {
  M(a.url, {}, "", function(b) {
    a.A(b)
  })
}
W.prototype.A = function(a) {
  var b = this;
  w(a, this);
  this.spatialReference = a.spatialReference.wkt ? r.ga(a.spatialReference.wkt) : q[a.spatialReference.wkid];
  a.tables !== undefined ? M(this.url + "/layers", {}, "", function(c) {
    Y(b, c)
  }) : Y(b, a)
};
function Y(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, g, h;
  f = 0;
  for(g = b.layers.length;f < g;f++) {
    h = b.layers[f];
    e = new V(a.url + "/" + h.id);
    w(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(g = b.tables.length;f < g;f++) {
      h = b.tables[f];
      e = new V(a.url + "/" + h.id);
      w(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(g = c.length;f < g;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.subLayers = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var i;
        a: {
          i = e.subLayerIds[d];
          var u = a.layers;
          if(u) {
            for(var v = 0, ga = u.length;v < ga;v++) {
              if(i === u[v].id) {
                i = u[v];
                break a
              }
              if(t(i) && u[v].name.toLowerCase() === i.toLowerCase()) {
                i = u[v];
                break a
              }
            }
          }
          i = null
        }
        e.subLayers.push(i);
        i.ka = e
      }
    }
  }
  a.C = true;
  x(a, "load")
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
function ha(a) {
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
function ia(a, b, c, d) {
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
    e.layerDefs = ca(f);
    f = b.layerIds;
    var g = b.layerOption || "show";
    if(f === undefined) {
      f = ha(a)
    }
    if(f.length > 0) {
      e.layers = g + ":" + f.join(",")
    }else {
      if(a.C && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = ba(b.time, b.ia)
    }
    e.da = b.da;
    if(e.f === "image") {
      return a.url + "/export?" + I(e)
    }else {
      M(a.url + "/export", e, "", function(h) {
        if(h.extent) {
          h.bounds = G(h.extent);
          delete h.extent;
          c(h)
        }else {
          h = h.error;
          d && h && h.error && d(h.error)
        }
      })
    }
  }
}
function Z(a) {
  this.ea = a ? a.lods : null;
  this.w = a ? q[a.spatialReference.wkid || a.spatialReference.wkt] : o;
  if(!this.w) {
    throw new Error("unsupported Spatial Reference");
  }
  this.$ = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.w.r() / this.$ / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.ea.length - 1 : 20;
  if(l.Size) {
    this.aa = a ? new l.Size(a.cols, a.rows) : new l.Size(256, 256)
  }
  this.D = Math.pow(2, this.minZoom) * this.$;
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
Z.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.w.forward([a.lng(), a.lat()]), d = b || new l.Point(0, 0);
  d.x = (c[0] - this.X) / this.D;
  d.y = (this.Y - c[1]) / this.D;
  return d
};
Z.prototype.fromLatLngToPoint = Z.prototype.fromLatLngToPoint;
Z.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.w.o([a.x * this.D + this.X, this.Y - a.y * this.D]);
  return new l.LatLng(a[1], a[0])
};
var ja = new Z;
function $(a, b) {
  b = b || {};
  if(b.opacity) {
    this.v = b.opacity;
    delete b.opacity
  }
  w(b, this);
  this.c = a instanceof W ? a : new W(a);
  if(b.V) {
    var c = s(this.c.url, "", "://");
    this.ba = c + "://" + b.V + s(this.c.url, c + "://" + s(this.c.url, "://", "/"), "");
    this.W = parseInt(s(b.V, "[", "]"), 10)
  }
  this.name = b.name || this.c.name;
  this.maxZoom = b.maxZoom || 19;
  this.minZoom = b.minZoom || 0;
  this.T = b.T || this.maxZoom;
  if(this.c.C) {
    this.A(b)
  }else {
    var d = this;
    l.event.addListenerOnce(this.c, "load", function() {
      d.A(b)
    })
  }
  this.p = {};
  this.M = b.map
}
$.prototype.A = function(a) {
  if(this.c.tileInfo) {
    this.l = new Z(this.c.tileInfo);
    this.minZoom = a.minZoom || this.l.minZoom;
    this.maxZoom = a.maxZoom || this.l.maxZoom
  }
};
$.prototype.getTileUrl = function(a, b) {
  var c = b - (this.l ? this.l.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    var e = this.c.url;
    if(this.ba) {
      e = this.ba.replace("[" + this.W + "]", "" + (a.y + a.x) % this.W)
    }
    d = this.l || (this.M ? this.M.getProjection() : ja);
    if(!d instanceof Z) {
      d = ja
    }
    var f = d.aa, g = 1 << b, h = new l.Point(a.x * f.width / g, (a.y + 1) * f.height / g);
    g = new l.Point((a.x + 1) * f.width / g, a.y * f.height / g);
    h = new l.LatLngBounds(d.fromPointToLatLng(h), d.fromPointToLatLng(g));
    g = this.c;
    if(g.fullExtent) {
      g.U = g.U || G(g.fullExtent);
      g = g.U
    }else {
      g = null
    }
    if(this.c.singleFusedMapCache === false || b > this.T) {
      c = {f:"image"};
      c.bounds = h;
      c.format = "png32";
      c.width = f.width;
      c.height = f.height;
      c.imageSR = d.w;
      d = ia(this.c, c)
    }else {
      d = g && !g.intersects(h) ? "" : e + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
function L(a, b) {
  b = b || {};
  var c;
  if(b.opacity) {
    this.v = b.opacity;
    delete b.opacity
  }
  w(b, this);
  var d = a;
  if(t(a)) {
    d = [new $(a, b)]
  }else {
    if(a instanceof W) {
      d = [new $(a, b)]
    }else {
      if(a instanceof $) {
        d = [a]
      }else {
        if(a.length > 0 && t(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new $(a[c], b)
          }
        }
      }
    }
  }
  this.m = d;
  this.p = {};
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
    this.tileSize = new l.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
L.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.m.length;f++) {
    var g = this.m[f];
    if(b <= g.maxZoom && b >= g.minZoom) {
      var h = g.getTileUrl(a, b);
      if(h) {
        var i = c.createElement(document.all ? "img" : "div");
        i.style.border = "0px none";
        i.style.margin = "0px";
        i.style.padding = "0px";
        i.style.overflow = "hidden";
        i.style.position = "absolute";
        i.style.top = "0px";
        i.style.left = "0px";
        i.style.width = "" + this.tileSize.width + "px";
        i.style.height = "" + this.tileSize.height + "px";
        if(document.all) {
          i.src = h
        }else {
          i.style.backgroundImage = "url(" + h + ")"
        }
        d.appendChild(i);
        g.p[e] = i;
        if(g.v !== undefined) {
          y(i, g.v)
        }else {
          this.v !== undefined && y(i, this.v)
        }
      }
    }
  }
  this.p[e] = d;
  d.setAttribute("tid", e);
  return d
};
L.prototype.getTile = L.prototype.getTile;
L.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.p[a] && delete this.p[a];
    for(var b = 0;b < this.m.length;b++) {
      var c = this.m[b];
      c.p[a] && delete c.p[a]
    }
  }
};
L.prototype.releaseTile = L.prototype.releaseTile;
new l.OverlayView;
function ka(a) {
  this.M = a;
  K(a)
}
var la = L;window.onload = function() {
  var a = {"USA Topo":["USA_Topo_Maps"], Streets:["World_Street_Map"], "World Topo":["World_Topo_Map"], Imagery:["World_Imagery"], "Labeled Imagery":["World_Imagery", "Reference/World_Boundaries_and_Places"], Terrain:["World_Terrain_Base"], "Labeled Terrain":["World_Terrain_Base", "Reference/World_Reference_Overlay"]}, b = [google.maps.MapTypeId.ROADMAP], c = [];
  for(var d in a) {
    if(a.hasOwnProperty(d)) {
      b.push(d);
      for(var e = a[d], f = 0;f < e.length;f++) {
        e[f] = "http://services.arcgisonline.com/ArcGIS/rest/services/" + e[f] + "/MapServer"
      }
      f = {name:d};
      if(d.indexOf("Imagery") != -1) {
        f.fa = true
      }
      c.push(new la(e, f))
    }
  }
  a = {zoom:13, center:new google.maps.LatLng(35.227, -80.84), mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControlOptions:{mapTypeIds:b}};
  a = new google.maps.Map(document.getElementById("map_canvas"), a);
  for(f = 1;f < b.length;f++) {
    a.mapTypes.set(b[f], c[f - 1])
  }
  new ka(a);
  a.setMapTypeId("World Topo")
};})()
