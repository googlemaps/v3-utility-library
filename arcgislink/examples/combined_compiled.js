(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var i, k = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var l = google.maps, m, o, p, r = {ea:null, Z:false}, s = {}, t = {};
function u(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function v(a) {
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
function fa(a, b) {
  for(var c = [], d = 2, e = arguments.length;d < e;d++) {
    c.push(arguments[d])
  }
  return function() {
    a.apply(b, c)
  }
}
function I(a, b, c) {
  b.H ? a.push(b.copyrightText) : l.event.addListenerOnce(b, "load", function() {
    J(c)
  })
}
function J(a) {
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
        J(a)
      })
    }
    var f = a.B;
    c = [];
    if(f) {
      d = 0;
      for(e = f.getLength();d < e;d++) {
        I(c, f.getAt(d).c, a)
      }
    }
    var j = a.overlayMapTypes;
    if(j) {
      d = 0;
      for(e = j.getLength();d < e;d++) {
        f = j.getAt(d);
        if(f instanceof K) {
          for(var h = 0, g = f.q.length;h < g;h++) {
            I(c, f.q[h].c, a)
          }
        }
      }
    }
    f = a.mapTypes.get(a.getMapTypeId());
    if(f instanceof K) {
      d = 0;
      for(e = f.q.length;d < e;d++) {
        I(c, f.q[d].c, a)
      }
      b.style.color = f.ra ? "#ffffff" : "#000000"
    }
    b.innerHTML = c.join("<br/>")
  }
}
function L(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = H(b);
  var j = document.getElementsByTagName("head")[0];
  if(!j) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    f && j.removeChild(f);
    f = null;
    d.apply(null, arguments);
    x(t, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !r.Z) {
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
    if(r.Z) {
      h = true
    }
    if(h && !r.ea) {
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
    g.open("POST", h ? r.ea + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  x(t, "jsonpstart", e);
  return e
}
t.qa = function(a, b, c, d) {
  L(a, b, c, d)
};
t.Y = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        t.Y(a, c)
      }else {
        E(c) && c.setMap(a)
      }
    }
  }
};
t.va = function(a, b) {
  t.Y(null, a);
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
M.prototype.s = function(a) {
  return a
};
M.prototype.u = function() {
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
  var b = a.R, c = a.V * k, d = a.W * k, e = a.S * k;
  this.a = a.v / a.unit;
  this.h = a.t * k;
  this.k = a.P;
  this.l = a.Q;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.m(c, b);
  b = this.m(d, b);
  e = P(this, e, this.g);
  c = P(this, c, this.g);
  d = P(this, d, this.g);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.N = a / (this.b * Math.pow(c, this.b));
  this.i = this.A(this.a, this.N, e, this.b)
}
O.prototype = new M;
O.prototype.m = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function P(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
i = O.prototype;
i.A = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
i.z = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
i.U = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.z(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.z(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * k;
  a = this.A(this.a, this.N, P(this, a[1] * k, this.g), this.b);
  b = this.b * (b - this.h);
  return[this.k + a * Math.sin(b), this.l + this.i - a * Math.cos(b)]
};
i.s = function(a) {
  var b = a[0] - this.k, c = a[1] - this.l;
  a = Math.atan(b / (this.i - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.i - c) * (this.i - c)) / (this.a * this.N), 1 / this.b);
  return[(a / this.b + this.h) / k, this.U(b, this.g, Math.PI / 2 - 2 * Math.atan(b)) / k]
};
i.u = function() {
  return Math.PI * 2 * this.a
};
function Q(a) {
  a = a || {};
  M.call(this, a);
  this.a = a.v / a.unit;
  var b = a.R;
  this.G = a.na;
  var c = a.S * k;
  this.h = a.t * k;
  this.k = a.P;
  this.l = a.Q;
  a = 1 / b;
  this.d = 2 * a - a * a;
  this.D = this.d * this.d;
  this.O = this.D * this.d;
  this.r = this.d / (1 - this.d);
  this.X = this.m(c, this.a, this.d, this.D, this.O)
}
Q.prototype = new M;
Q.prototype.m = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
Q.prototype.forward = function(a) {
  var b = a[1] * k, c = a[0] * k;
  a = this.a / Math.sqrt(1 - this.d * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.r * Math.pow(Math.cos(b), 2);
  c = (c - this.h) * Math.cos(b);
  var f = this.m(b, this.a, this.d, this.D, this.O);
  return[this.k + this.G * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.r) * Math.pow(c, 5) / 120), this.l + this.G * (f - this.X) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.r) * Math.pow(c, 6) / 720)]
};
Q.prototype.s = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.d)) / (1 + Math.sqrt(1 - this.d));
  c = (this.X + (c - this.l) / this.G) / (this.a * (1 - this.d / 4 - 3 * this.D / 64 - 5 * this.O / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.r * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.d * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.d) / Math.pow(1 - this.d * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.k) / (e * this.G);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.r) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.r - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.h + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.r + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / k, e / k]
};
Q.prototype.u = function() {
  return Math.PI * 2 * this.a
};
function R(a) {
  a = a || {};
  M.call(this, a);
  this.a = (a.v || 6378137) / (a.unit || 1);
  this.h = (a.t || 0) * k
}
R.prototype = new M;
R.prototype.forward = function(a) {
  var b = a[1] * k;
  return[this.a * (a[0] * k - this.h), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
R.prototype.s = function(a) {
  return[(a[0] / this.a + this.h) / k, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / k]
};
R.prototype.u = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  M.call(this, a);
  var b = a.R, c = a.V * k, d = a.W * k, e = a.S * k;
  this.a = a.v / a.unit;
  this.h = a.t * k;
  this.k = a.P;
  this.l = a.Q;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.m(c, b);
  b = this.m(d, b);
  c = T(this, c, this.g);
  d = T(this, d, this.g);
  e = T(this, e, this.g);
  this.b = (a * a - b * b) / (d - c);
  this.M = a * a + this.b * c;
  this.i = this.A(this.a, this.M, this.b, e)
}
S.prototype = new M;
S.prototype.m = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function T(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
i = S.prototype;
i.A = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
i.z = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
i.U = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.z(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.z(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * k;
  a = this.A(this.a, this.M, this.b, T(this, a[1] * k, this.g));
  b = this.b * (b - this.h);
  return[this.k + a * Math.sin(b), this.l + this.i - a * Math.cos(b)]
};
i.s = function(a) {
  var b = a[0] - this.k;
  a = a[1] - this.l;
  var c = Math.sqrt(b * b + (this.i - a) * (this.i - a)), d = this.b > 0 ? 1 : -1;
  c = (this.M - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.i - d * a)) / this.b + this.h) / k, this.U(c, this.g, Math.asin(c / 2)) / k]
};
i.u = function() {
  return Math.PI * 2 * this.a
};
i.u = function() {
  return Math.PI * 2 * this.a
};
m = new N({wkid:4326});
o = new N({wkid:4269});
p = new R({wkid:102113, v:6378137, t:0, unit:1});
s = {"4326":m, "4269":o, "102113":p, "102100":new R({wkid:102100, v:6378137, t:0, unit:1})};
t.ua = function(a, b) {
  var c = s["" + a];
  if(c) {
    return c
  }
  if(b instanceof M) {
    c = s["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = u(c, 'PROJECTION["', '"]'), f = u(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(u(u(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.v = parseFloat(f[1]);
      d.R = parseFloat(f[2]);
      d.S = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.t = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.P = parseFloat(u(c, '"False_Easting",', "]"));
      d.Q = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new M(d);
        break;
      case "Lambert_Conformal_Conic":
        d.V = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.W = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new O(d);
        break;
      case "Transverse_Mercator":
        d.na = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new Q(d);
        break;
      case "Albers":
        d.V = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.W = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new S(d);
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
function U(a) {
  this.url = a;
  this.definition = null
}
function V(a, b) {
  this.url = a;
  this.H = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.ja) {
    var d = this;
    window.setTimeout(function() {
      W(d)
    }, b.ja * 1E3)
  }else {
    W(this)
  }
}
function W(a) {
  L(a.url, {}, "", function(b) {
    a.F(b)
  })
}
V.prototype.F = function(a) {
  var b = this;
  w(a, this);
  this.spatialReference = a.spatialReference.wkt ? M.ta(a.spatialReference.wkt) : s[a.spatialReference.wkid];
  a.tables !== undefined ? L(this.url + "/layers", {}, "", function(c) {
    X(b, c)
  }) : X(b, a)
};
function X(a, b) {
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
    w(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(j = b.tables.length;f < j;f++) {
      h = b.tables[f];
      e = new U(a.url + "/" + h.id);
      w(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.L = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var n = a.layers;
          if(n) {
            for(var q = 0, ja = n.length;q < ja;q++) {
              if(g === n[q].id) {
                g = n[q];
                break a
              }
              if(v(g) && n[q].name.toLowerCase() === g.toLowerCase()) {
                g = n[q];
                break a
              }
            }
          }
          g = null
        }
        e.L.push(g);
        g.sa = e
      }
    }
  }
  a.H = true;
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
      if(c.L) {
        for(var f = 0, j = c.L.length;f < j;f++) {
          if(c.L[f].visible === false) {
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
    e.layerDefs = ca(f);
    f = b.layerIds;
    var j = b.layerOption || "show";
    if(f === undefined) {
      f = ha(a)
    }
    if(f.length > 0) {
      e.layers = j + ":" + f.join(",")
    }else {
      if(a.H && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = ba(b.time, b.oa)
    }
    e.la = b.la;
    if(e.f === "image") {
      return a.url + "/export?" + H(e)
    }else {
      L(a.url + "/export", e, "", function(h) {
        if(h.extent) {
          var g, n = h.extent, q = s[n.spatialReference.wkid || n.spatialReference.wkt];
          q = q || m;
          g = q.s([n.xmin, n.ymin]);
          n = q.s([n.xmax, n.ymax]);
          g = new l.LatLngBounds(new l.LatLng(g[1], g[0]), new l.LatLng(n[1], n[0]));
          h.bounds = g;
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
function Y(a) {
  this.ma = a ? a.lods : null;
  this.w = a ? s[a.spatialReference.wkid || a.spatialReference.wkt] : p;
  if(!this.w) {
    throw new Error("unsupported Spatial Reference");
  }
  this.fa = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.w.u() / this.fa / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.ma.length - 1 : 20;
  if(l.Size) {
    this.ga = a ? new l.Size(a.cols, a.rows) : new l.Size(256, 256)
  }
  this.K = Math.pow(2, this.minZoom) * this.fa;
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
Y.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.w.forward([a.lng(), a.lat()]), d = b || new l.Point(0, 0);
  d.x = (c[0] - this.ca) / this.K;
  d.y = (this.da - c[1]) / this.K;
  return d
};
Y.prototype.fromLatLngToPoint = Y.prototype.fromLatLngToPoint;
Y.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.w.s([a.x * this.K + this.ca, this.da - a.y * this.K]);
  return new l.LatLng(a[1], a[0])
};
var ka = new Y;
function Z(a, b) {
  b = b || {};
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  w(b, this);
  this.c = a instanceof V ? a : new V(a);
  if(b.aa) {
    var c = u(this.c.url, "", "://");
    this.ha = c + "://" + b.aa + u(this.c.url, c + "://" + u(this.c.url, "://", "/"), "");
    this.ba = parseInt(u(b.aa, "[", "]"), 10)
  }
  this.name = b.name || this.c.name;
  this.maxZoom = b.maxZoom || 19;
  this.minZoom = b.minZoom || 0;
  this.$ = b.$ || this.maxZoom;
  if(this.c.H) {
    this.F(b)
  }else {
    var d = this;
    l.event.addListenerOnce(this.c, "load", function() {
      d.F(b)
    })
  }
  this.j = {};
  this.o = b.map
}
Z.prototype.F = function(a) {
  if(this.c.tileInfo) {
    this.p = new Y(this.c.tileInfo);
    this.minZoom = a.minZoom || this.p.minZoom;
    this.maxZoom = a.maxZoom || this.p.maxZoom
  }
};
Z.prototype.getTileUrl = function(a, b) {
  var c = b - (this.p ? this.p.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    d = this.c.url;
    if(this.ha) {
      d = this.ha.replace("[" + this.ba + "]", "" + (a.y + a.x) % this.ba)
    }
    if(this.c.singleFusedMapCache === false || b > this.$) {
      c = this.p || (this.o ? this.o.getProjection() : ka);
      if(!c instanceof Y) {
        c = ka
      }
      d = c.ga;
      var e = 1 << b, f = new l.Point(a.x * d.width / e, (a.y + 1) * d.height / e);
      e = new l.Point((a.x + 1) * d.width / e, a.y * d.height / e);
      f = new l.LatLngBounds(c.fromPointToLatLng(f), c.fromPointToLatLng(e));
      e = {f:"image"};
      e.bounds = f;
      e.format = "png32";
      e.width = d.width;
      e.height = d.height;
      e.imageSR = c.w;
      d = ia(this.c, e)
    }else {
      d = d + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
Z.prototype.T = function(a) {
  this.e = a;
  var b = this.j;
  for(var c in b) {
    b.hasOwnProperty(c) && y(b[c], a)
  }
};
function K(a, b) {
  b = b || {};
  var c;
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  w(b, this);
  var d = a;
  if(v(a)) {
    d = [new Z(a, b)]
  }else {
    if(a instanceof V) {
      d = [new Z(a, b)]
    }else {
      if(a instanceof Z) {
        d = [a]
      }else {
        if(a.length > 0 && v(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new Z(a[c], b)
          }
        }
      }
    }
  }
  this.q = d;
  this.j = {};
  if(b.maxZoom !== undefined) {
    this.maxZoom = b.maxZoom
  }else {
    var e = 0;
    for(c = 0;c < d.length;c++) {
      e = Math.max(e, d[c].maxZoom)
    }
    this.maxZoom = e
  }
  if(d[0].p) {
    this.tileSize = d[0].p.ga;
    this.projection = d[0].p
  }else {
    this.tileSize = new l.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
K.prototype.getTile = function(a, b, c) {
  for(var d = c.createElement("div"), e = "_" + a.x + "_" + a.y + "_" + b, f = 0;f < this.q.length;f++) {
    var j = this.q[f];
    if(b <= j.maxZoom && b >= j.minZoom) {
      var h = j.getTileUrl(a, b);
      if(h) {
        var g = c.createElement(document.all ? "img" : "div");
        g.style.border = "0px none";
        g.style.margin = "0px";
        g.style.padding = "0px";
        g.style.overflow = "hidden";
        g.style.position = "absolute";
        g.style.top = "0px";
        g.style.left = "0px";
        g.style.width = "" + this.tileSize.width + "px";
        g.style.height = "" + this.tileSize.height + "px";
        if(document.all) {
          g.src = h
        }else {
          g.style.backgroundImage = "url(" + h + ")"
        }
        d.appendChild(g);
        j.j[e] = g;
        if(j.e !== undefined) {
          y(g, j.e)
        }else {
          this.e !== undefined && y(g, this.e)
        }
      }
    }
  }
  this.j[e] = d;
  d.setAttribute("tid", e);
  return d
};
K.prototype.getTile = K.prototype.getTile;
K.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.j[a] && delete this.j[a];
    for(var b = 0;b < this.q.length;b++) {
      var c = this.q[b];
      c.j[a] && delete c.j[a]
    }
  }
};
K.prototype.releaseTile = K.prototype.releaseTile;
K.prototype.T = function(a) {
  this.e = a;
  var b = this.j;
  for(var c in b) {
    if(b.hasOwnProperty(c)) {
      for(var d = b[c].childNodes, e = 0;e < d.length;e++) {
        y(d[e], a)
      }
    }
  }
};
function $(a, b) {
  b = b || {};
  this.c = a instanceof V ? a : new V(a);
  this.minZoom = b.minZoom;
  this.maxZoom = b.maxZoom;
  this.e = b.opacity || 1;
  this.ka = b.pa || {};
  this.I = this.C = false;
  this.n = null;
  b.map && this.setMap(b.map);
  this.o = null
}
$.prototype = new l.OverlayView;
$.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  this.n = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.e && y(a, this.e);
  this.ia = l.event.addListener(this.getMap(), "bounds_changed", fa(this.J, this));
  a = this.getMap();
  a.B = a.B || new l.MVCArray;
  a.B.push(this);
  J(a);
  this.o = a
};
$.prototype.onAdd = $.prototype.onAdd;
$.prototype.onRemove = function() {
  l.event.removeListener(this.ia);
  this.n.parentNode.removeChild(this.n);
  this.n = null;
  var a = this.o, b = a.B;
  if(b) {
    for(var c = 0, d = b.getLength();c < d;c++) {
      if(b.getAt(c) == this) {
        b.removeAt(c);
        break
      }
    }
  }
  J(a);
  this.o = null
};
$.prototype.onRemove = $.prototype.onRemove;
$.prototype.draw = function() {
  if(!this.C || this.I === true) {
    this.J()
  }
};
$.prototype.draw = $.prototype.draw;
$.prototype.T = function(a) {
  this.e = a = Math.min(Math.max(a, 0), 1);
  y(this.n, a)
};
$.prototype.J = function() {
  if(this.C === true) {
    this.I = true
  }else {
    var a = this.getMap(), b = a ? a.getBounds() : null;
    if(b) {
      var c = this.ka;
      c.bounds = b;
      b = p;
      var d = a.getDiv();
      c.width = d.offsetWidth;
      c.height = d.offsetHeight;
      if((a = a.getProjection()) && a instanceof Y) {
        b = a.w
      }
      c.imageSR = b;
      x(this, "drawstart");
      var e = this;
      this.C = true;
      this.n.style.backgroundImage = "";
      ia(this.c, c, function(f) {
        e.C = false;
        if(e.I === true) {
          e.I = false;
          e.J()
        }else {
          if(f.href) {
            var j = e.getProjection(), h = f.bounds, g = j.fromLatLngToDivPixel(h.getSouthWest());
            j = j.fromLatLngToDivPixel(h.getNorthEast());
            h = e.n;
            h.style.left = g.x + "px";
            h.style.top = j.y + "px";
            h.style.width = j.x - g.x + "px";
            h.style.height = g.y - j.y + "px";
            e.n.style.backgroundImage = "url(" + f.href + ")";
            e.T(e.e)
          }
          x(e, "drawend")
        }
      })
    }
  }
};
function la(a) {
  this.o = a;
  J(a)
}
la.prototype.J = function() {
  J(this.o)
};
var ma = K;window.onload = function() {
  var a = {zoom:13, center:new google.maps.LatLng(45.5, -122.7), mapTypeId:"arcgis", mapTypeControlOptions:{mapTypeIds:["arcgis", google.maps.MapTypeId.ROADMAP]}, streetViewControl:true};
  a = new google.maps.Map(document.getElementById("map_canvas"), a);
  var b = new ma("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer", {name:"ArcGIS"});
  a.mapTypes.set("arcgis", b);
  new la(a);
  (new $("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer")).setMap(a)
};})()
