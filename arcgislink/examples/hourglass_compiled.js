(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var i, j = Math.PI / 180, l = 0;
window.ags_jsonp = window.ags_jsonp || {};
var n = google.maps, o, p, r, s = {T:null, R:false}, t = {}, u = {};
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
  n.event.trigger.apply(this, arguments)
}
function y(a, b) {
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
function A(a) {
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
function aa() {
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
var B = "esriGeometryPoint", C = "esriGeometryMultipoint", D = "esriGeometryPolyline", E = "esriGeometryPolygon", F = "esriGeometryEnvelope";
function ba(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof n.LatLng || b instanceof n.Marker) {
    return a && a.splice && a.length > 1 ? C : B
  }else {
    if(b instanceof n.Polyline) {
      return D
    }else {
      if(b instanceof n.Polygon) {
        return E
      }else {
        if(b instanceof n.LatLngBounds) {
          return F
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return B
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
function G(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b && b.splice && b.length > 0) {
    b = b[0]
  }
  if(b instanceof n.LatLng || b instanceof n.Marker || b instanceof n.Polyline || b instanceof n.Polygon || b instanceof n.LatLngBounds) {
    return true
  }
  return false
}
function H(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
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
      if(G(a)) {
        var e;
        d = "{";
        switch(ba(a)) {
          case B:
            e = a && a.splice ? a[0] : a;
            if(e instanceof n.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case C:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof n.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case D:
            c = [];
            a = a && a.splice ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + H(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case E:
            c = [];
            e = a && a.splice ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + H(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case F:
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
function ca(a, b) {
  for(var c = [], d = 2, e = arguments.length;d < e;d++) {
    c.push(arguments[d])
  }
  return function() {
    a.apply(b, c)
  }
}
function da(a, b, c) {
  b.K ? a.push(b.copyrightText) : n.event.addListenerOnce(b, "load", function() {
    K(c)
  })
}
function K(a) {
  var b = null;
  if(a) {
    var c = a.controls[n.ControlPosition.BOTTOM_RIGHT];
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
      a.controls[n.ControlPosition.BOTTOM_RIGHT].push(b);
      n.event.addListener(a, "maptypeid_changed", function() {
        K(a)
      })
    }
    var f = a.s;
    c = [];
    if(f) {
      d = 0;
      for(e = f.getLength();d < e;d++) {
        da(c, f.getAt(d).S, a)
      }
    }
    var k = a.overlayMapTypes;
    if(k) {
      d = 0;
      for(e = k.getLength();d < e;d++) {
        f = k.getAt(d)
      }
    }
    f = a.mapTypes.get(a.getMapTypeId());
    b.innerHTML = c.join("<br/>")
  }
}
function L(a, b, c, d) {
  var e = "ags_jsonp_" + l++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = J(b);
  var k = document.getElementsByTagName("head")[0];
  if(!k) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    f && k.removeChild(f);
    f = null;
    d.apply(null, arguments);
    x(u, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !s.R) {
    f = document.createElement("script");
    f.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    f.id = e;
    k.appendChild(f)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var g = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      g = false
    }
    if(s.R) {
      g = true
    }
    if(g && !s.T) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var h = aa();
    h.onreadystatechange = function() {
      if(h.readyState === 4) {
        if(h.status === 200) {
          eval(h.responseText)
        }else {
          throw new Error("Error code " + h.status);
        }
      }
    };
    h.open("POST", g ? s.T + "?" + a : a, true);
    h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    h.send(b)
  }
  x(u, "jsonpstart", e);
  return e
}
u.fa = function(a, b, c, d) {
  L(a, b, c, d)
};
u.Q = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        u.Q(a, c)
      }else {
        G(c) && c.setMap(a)
      }
    }
  }
};
u.ja = function(a, b) {
  u.Q(null, a);
  if(b) {
    a.length = 0
  }
};
function M(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
M.prototype.forward = function(a) {
  return a
};
M.prototype.o = function(a) {
  return a
};
M.prototype.n = function() {
  return 360
};
M.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function N(a) {
  a = a || {};
  M.call(this, a)
}
N.prototype = new M;
function O(a) {
  a = a || {};
  M.call(this, a);
  var b = a.I, c = a.N * j, d = a.O * j, e = a.J * j;
  this.a = a.p / a.unit;
  this.e = a.m * j;
  this.h = a.G;
  this.i = a.H;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  e = P(this, e, this.d);
  c = P(this, c, this.d);
  d = P(this, d, this.d);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.D = a / (this.b * Math.pow(c, this.b));
  this.g = this.r(this.a, this.D, e, this.b)
}
O.prototype = new M;
O.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function P(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
i = O.prototype;
i.r = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
i.q = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
i.M = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.q(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.q(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * j;
  a = this.r(this.a, this.D, P(this, a[1] * j, this.d), this.b);
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
i.o = function(a) {
  var b = a[0] - this.h, c = a[1] - this.i;
  a = Math.atan(b / (this.g - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.g - c) * (this.g - c)) / (this.a * this.D), 1 / this.b);
  return[(a / this.b + this.e) / j, this.M(b, this.d, Math.PI / 2 - 2 * Math.atan(b)) / j]
};
i.n = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  M.call(this, a);
  this.a = a.p / a.unit;
  var b = a.I;
  this.v = a.ca;
  var c = a.J * j;
  this.e = a.m * j;
  this.h = a.G;
  this.i = a.H;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.u = this.c * this.c;
  this.F = this.u * this.c;
  this.l = this.c / (1 - this.c);
  this.P = this.j(c, this.a, this.c, this.u, this.F)
}
Q.prototype = new M;
Q.prototype.j = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
Q.prototype.forward = function(a) {
  var b = a[1] * j, c = a[0] * j;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.l * Math.pow(Math.cos(b), 2);
  c = (c - this.e) * Math.cos(b);
  var f = this.j(b, this.a, this.c, this.u, this.F);
  return[this.h + this.v * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.l) * Math.pow(c, 5) / 120), this.i + this.v * (f - this.P) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.l) * Math.pow(c, 6) / 720)]
};
Q.prototype.o = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.P + (c - this.i) / this.v) / (this.a * (1 - this.c / 4 - 3 * this.u / 64 - 5 * this.F / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.l * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.h) / (e * this.v);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.l) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.l - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.e + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.l + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / j, e / j]
};
Q.prototype.n = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  M.call(this, a);
  this.a = (a.p || 6378137) / (a.unit || 1);
  this.e = (a.m || 0) * j
}
R.prototype = new M;
R.prototype.forward = function(a) {
  var b = a[1] * j;
  return[this.a * (a[0] * j - this.e), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
R.prototype.o = function(a) {
  return[(a[0] / this.a + this.e) / j, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / j]
};
R.prototype.n = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  M.call(this, a);
  var b = a.I, c = a.N * j, d = a.O * j, e = a.J * j;
  this.a = a.p / a.unit;
  this.e = a.m * j;
  this.h = a.G;
  this.i = a.H;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  c = T(this, c, this.d);
  d = T(this, d, this.d);
  e = T(this, e, this.d);
  this.b = (a * a - b * b) / (d - c);
  this.C = a * a + this.b * c;
  this.g = this.r(this.a, this.C, this.b, e)
}
S.prototype = new M;
S.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function T(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
i = S.prototype;
i.r = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
i.q = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
i.M = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.q(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.q(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * j;
  a = this.r(this.a, this.C, this.b, T(this, a[1] * j, this.d));
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
i.o = function(a) {
  var b = a[0] - this.h;
  a = a[1] - this.i;
  var c = Math.sqrt(b * b + (this.g - a) * (this.g - a)), d = this.b > 0 ? 1 : -1;
  c = (this.C - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.g - d * a)) / this.b + this.e) / j, this.M(c, this.d, Math.asin(c / 2)) / j]
};
i.n = function() {
  return Math.PI * 2 * this.a
};
i.n = function() {
  return Math.PI * 2 * this.a
};
o = new N({wkid:4326});
p = new N({wkid:4269});
r = new R({wkid:102113, p:6378137, m:0, unit:1});
t = {"4326":o, "4269":p, "102113":r, "102100":new R({wkid:102100, p:6378137, m:0, unit:1})};
u.ia = function(a, b) {
  var c = t["" + a];
  if(c) {
    return c
  }
  if(b instanceof M) {
    c = t["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = v(c, 'PROJECTION["', '"]'), f = v(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(v(v(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.p = parseFloat(f[1]);
      d.I = parseFloat(f[2]);
      d.J = parseFloat(v(c, '"Latitude_Of_Origin",', "]"));
      d.m = parseFloat(v(c, '"Central_Meridian",', "]"));
      d.G = parseFloat(v(c, '"False_Easting",', "]"));
      d.H = parseFloat(v(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new M(d);
        break;
      case "Lambert_Conformal_Conic":
        d.N = parseFloat(v(c, '"Standard_Parallel_1",', "]"));
        d.O = parseFloat(v(c, '"Standard_Parallel_2",', "]"));
        c = new O(d);
        break;
      case "Transverse_Mercator":
        d.ca = parseFloat(v(c, '"Scale_Factor",', "]"));
        c = new Q(d);
        break;
      case "Albers":
        d.N = parseFloat(v(c, '"Standard_Parallel_1",', "]"));
        d.O = parseFloat(v(c, '"Standard_Parallel_2",', "]"));
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
  this.K = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.X) {
    var d = this;
    window.setTimeout(function() {
      W(d)
    }, b.X * 1E3)
  }else {
    W(this)
  }
}
function W(a) {
  L(a.url, {}, "", function(b) {
    ea(a, b)
  })
}
function ea(a, b) {
  w(b, a);
  a.spatialReference = b.spatialReference.wkt ? M.ha(b.spatialReference.wkt) : t[b.spatialReference.wkid];
  b.tables !== undefined ? L(a.url + "/layers", {}, "", function(c) {
    X(a, c)
  }) : X(a, b)
}
function X(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, k, g;
  f = 0;
  for(k = b.layers.length;f < k;f++) {
    g = b.layers[f];
    e = new U(a.url + "/" + g.id);
    w(g, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(k = b.tables.length;f < k;f++) {
      g = b.tables[f];
      e = new U(a.url + "/" + g.id);
      w(g, e);
      d.push(e)
    }
  }
  f = 0;
  for(k = c.length;f < k;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.B = [];
      d = 0;
      for(g = e.subLayerIds.length;d < g;d++) {
        var h;
        a: {
          h = e.subLayerIds[d];
          var m = a.layers;
          if(m) {
            for(var q = 0, fa = m.length;q < fa;q++) {
              if(h === m[q].id) {
                h = m[q];
                break a
              }
              if(h && typeof h === "string" && m[q].name.toLowerCase() === h.toLowerCase()) {
                h = m[q];
                break a
              }
            }
          }
          h = null
        }
        e.B.push(h);
        h.ga = e
      }
    }
  }
  a.K = true;
  x(a, "load")
}
function ga(a) {
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
      if(c.B) {
        for(var f = 0, k = c.B.length;f < k;f++) {
          if(c.B[f].visible === false) {
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
      f = ga(a)
    }
    e.layerDefs = A(f);
    f = b.layerIds;
    var k = b.layerOption || "show";
    if(f === undefined) {
      f = ha(a)
    }
    if(f.length > 0) {
      e.layers = k + ":" + f.join(",")
    }else {
      if(a.K && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = y(b.time, b.da)
    }
    e.Z = b.Z;
    if(e.f === "image") {
      return a.url + "/export?" + J(e)
    }else {
      L(a.url + "/export", e, "", function(g) {
        if(g.extent) {
          var h, m = g.extent, q = t[m.spatialReference.wkid || m.spatialReference.wkt];
          q = q || o;
          h = q.o([m.xmin, m.ymin]);
          m = q.o([m.xmax, m.ymax]);
          h = new n.LatLngBounds(new n.LatLng(h[1], h[0]), new n.LatLng(m[1], m[0]));
          g.bounds = h;
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
function Y(a) {
  this.$ = a ? a.lods : null;
  this.A = a ? t[a.spatialReference.wkid || a.spatialReference.wkt] : r;
  if(!this.A) {
    throw new Error("unsupported Spatial Reference");
  }
  this.U = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.A.n() / this.U / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.$.length - 1 : 20;
  if(n.Size) {
    this.ka = a ? new n.Size(a.cols, a.rows) : new n.Size(256, 256)
  }
  this.V = Math.pow(2, this.minZoom) * this.U;
  this.aa = a ? a.origin.x : -2.0037508342787E7;
  this.ba = a ? a.origin.y : 2.0037508342787E7;
  if(a) {
    for(var b, c = 0;c < a.lods.length - 1;c++) {
      b = a.lods[c].resolution / a.lods[c + 1].resolution;
      if(b > 2.001 || b < 1.999) {
        throw new Error("This type of map cache is not supported in V3. \nScale ratio between zoom levels must be 2");
      }
    }
  }
}
Y.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.A.forward([a.lng(), a.lat()]), d = b || new n.Point(0, 0);
  d.x = (c[0] - this.aa) / this.V;
  d.y = (this.ba - c[1]) / this.V;
  return d
};
Y.prototype.fromLatLngToPoint = Y.prototype.fromLatLngToPoint;
new Y;
function Z(a, b) {
  b = b || {};
  this.S = a instanceof V ? a : new V(a);
  this.minZoom = b.minZoom;
  this.maxZoom = b.maxZoom;
  this.z = b.opacity || 1;
  this.Y = b.ea || {};
  this.w = this.t = false;
  this.k = null;
  b.map && this.setMap(b.map)
}
Z.prototype = new n.OverlayView;
Z.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  this.k = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.z && z(a, this.z);
  this.W = n.event.addListener(this.getMap(), "bounds_changed", ca(this.L, this));
  a = this.getMap();
  a.s = a.s || new n.MVCArray;
  a.s.push(this);
  K(a)
};
Z.prototype.onAdd = Z.prototype.onAdd;
Z.prototype.onRemove = function() {
  n.event.removeListener(this.W);
  this.k.parentNode.removeChild(this.k);
  this.k = null;
  var a = this.getMap(), b = a.s;
  if(b) {
    for(var c = 0, d = b.getLength();c < d;c++) {
      if(b.getAt(c) == this) {
        b.removeAt(c);
        break
      }
    }
  }
  K(a)
};
Z.prototype.onRemove = Z.prototype.onRemove;
Z.prototype.draw = function() {
  if(!this.t || this.w === true) {
    this.L()
  }
};
Z.prototype.draw = Z.prototype.draw;
Z.prototype.L = function() {
  if(this.t === true) {
    this.w = true
  }else {
    var a = this.getMap(), b = a ? a.getBounds() : null;
    if(b) {
      var c = this.Y;
      c.bounds = b;
      b = r;
      var d = a.getDiv();
      c.width = d.offsetWidth;
      c.height = d.offsetHeight;
      if((a = a.getProjection()) && a instanceof Y) {
        b = a.A
      }
      c.imageSR = b;
      x(this, "drawstart");
      var e = this;
      this.t = true;
      this.k.style.backgroundImage = "";
      ia(this.S, c, function(f) {
        e.t = false;
        if(e.w === true) {
          e.w = false;
          e.L()
        }else {
          if(f.href) {
            var k = e.getProjection(), g = f.bounds, h = k.fromLatLngToDivPixel(g.getSouthWest());
            k = k.fromLatLngToDivPixel(g.getNorthEast());
            g = e.k;
            g.style.left = h.x + "px";
            g.style.top = k.y + "px";
            g.style.width = k.x - h.x + "px";
            g.style.height = h.y - k.y + "px";
            e.k.style.backgroundImage = "url(" + f.href + ")";
            f = Math.min(Math.max(e.z, 0), 1);
            e.z = f;
            z(e.k, f)
          }
          x(e, "drawend")
        }
      })
    }
  }
};
var $ = u;window.onload = function() {
  var a = {zoom:4, center:new google.maps.LatLng(40, -100), mapTypeId:google.maps.MapTypeId.ROADMAP, streetViewControl:true}, b = new google.maps.Map(document.getElementById("map_canvas"), a);
  a = new Z("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer");
  google.maps.event.addListener(a, "drawstart", function() {
    document.getElementById("drawing").style.visibility = "visible"
  });
  google.maps.event.addListener(a, "drawend", function() {
    document.getElementById("drawing").style.visibility = "hidden"
  });
  a.setMap(b);
  google.maps.event.addListener($, "jsonpstart", function() {
    b.setOptions({draggableCursor:"wait"})
  });
  google.maps.event.addListener($, "jsonpend", function() {
    b.setOptions({draggableCursor:"url(http://maps.gstatic.com/intl/en_us/mapfiles/openhand_8_8.cur),default"})
  })
};})()
