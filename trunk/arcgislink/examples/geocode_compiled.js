(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f, h = Math.PI / 180, j = 0;
window.ags_jsonp = window.ags_jsonp || {};
var k = google.maps, l, m, n, q = {L:null, K:false}, r = {}, s = {};
function t(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function u(a) {
  return a && a.splice
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
  k.event.trigger.apply(this, arguments)
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
  if(u(a) && a.length > 0) {
    b = a[0]
  }
  if(b instanceof k.LatLng || b instanceof k.Marker) {
    return u(a) && a.length > 1 ? z : y
  }else {
    if(b instanceof k.Polyline) {
      return A
    }else {
      if(b instanceof k.Polygon) {
        return B
      }else {
        if(b instanceof k.LatLngBounds) {
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
  if(u(a) && a.length > 0) {
    b = a[0]
  }
  if(u(b) && b.length > 0) {
    b = b[0]
  }
  if(b instanceof k.LatLng || b instanceof k.Marker || b instanceof k.Polyline || b instanceof k.Polygon || b instanceof k.LatLngBounds) {
    return true
  }
  return false
}
function F(a, b) {
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
    if(u(a)) {
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
            e = u(a) ? a[0] : a;
            if(e instanceof k.Marker) {
              e = e.getPosition()
            }
            d += "x:" + e.lng() + ",y:" + e.lat();
            break;
          case z:
            c = [];
            for(b = 0;b < a.length;b++) {
              e = a[b] instanceof k.Marker ? a[b].getPosition() : a[b];
              c.push("[" + e.lng() + "," + e.lat() + "]")
            }
            d += "points: [" + c.join(",") + "]";
            break;
          case A:
            c = [];
            a = u(a) ? a : [a];
            for(b = 0;b < a.length;b++) {
              c.push("[" + F(a[b].getPath()) + "]")
            }
            d += "paths:[" + c.join(",") + "]";
            break;
          case B:
            c = [];
            e = u(a) ? a[0] : a;
            a = e.getPaths();
            for(b = 0;b < a.getLength();b++) {
              c.push("[" + F(a.getAt(b), true) + "]")
            }
            d += "rings:[" + c.join(",") + "]";
            break;
          case C:
            e = u(a) ? a[0] : a;
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
  var e = "ags_jsonp_" + j++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = H(b);
  var i = document.getElementsByTagName("head")[0];
  if(!i) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    g && i.removeChild(g);
    g = null;
    d.apply(null, arguments);
    w(s, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !q.K) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = e;
    i.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var o = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      o = false
    }
    if(q.K) {
      o = true
    }
    if(o && !q.L) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var p = x();
    p.onreadystatechange = function() {
      if(p.readyState === 4) {
        if(p.status === 200) {
          eval(p.responseText)
        }else {
          throw new Error("Error code " + p.status);
        }
      }
    };
    p.open("POST", o ? q.L + "?" + a : a, true);
    p.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    p.send(b)
  }
  w(s, "jsonpstart", e);
  return e
}
s.T = function(a, b, c, d) {
  I(a, b, c, d)
};
s.J = function(a, b) {
  if(u(b)) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      c = b[d];
      if(u(c)) {
        s.J(a, c)
      }else {
        E(c) && c.setMap(a)
      }
    }
  }
};
s.V = function(a, b) {
  s.J(null, a);
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
J.prototype.q = function(a) {
  return a
};
J.prototype.m = function() {
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
  var b = a.B, c = a.G * h, d = a.H * h, e = a.C * h;
  this.a = a.n / a.unit;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  e = M(this, e, this.d);
  c = M(this, c, this.d);
  d = M(this, d, this.d);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.u = a / (this.b * Math.pow(c, this.b));
  this.g = this.p(this.a, this.u, e, this.b)
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
f = L.prototype;
f.p = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
f.o = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
f.D = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.o(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.o(a, b, c)
  }
  return e
};
f.forward = function(a) {
  var b = a[0] * h;
  a = this.p(this.a, this.u, M(this, a[1] * h, this.d), this.b);
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
f.q = function(a) {
  var b = a[0] - this.h, c = a[1] - this.i;
  a = Math.atan(b / (this.g - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.g - c) * (this.g - c)) / (this.a * this.u), 1 / this.b);
  return[(a / this.b + this.e) / h, this.D(b, this.d, Math.PI / 2 - 2 * Math.atan(b)) / h]
};
f.m = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  J.call(this, a);
  this.a = a.n / a.unit;
  var b = a.B;
  this.s = a.S;
  var c = a.C * h;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.r = this.c * this.c;
  this.v = this.r * this.c;
  this.k = this.c / (1 - this.c);
  this.I = this.j(c, this.a, this.c, this.r, this.v)
}
N.prototype = new J;
N.prototype.j = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.forward = function(a) {
  var b = a[1] * h, c = a[0] * h;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.k * Math.pow(Math.cos(b), 2);
  c = (c - this.e) * Math.cos(b);
  var g = this.j(b, this.a, this.c, this.r, this.v);
  return[this.h + this.s * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.k) * Math.pow(c, 5) / 120), this.i + this.s * (g - this.I) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.k) * Math.pow(c, 6) / 720)]
};
N.prototype.q = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.I + (c - this.i) / this.s) / (this.a * (1 - this.c / 4 - 3 * this.r / 64 - 5 * this.v / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.k * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), g = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.h) / (e * this.s);
  e = a - e * Math.tan(a) / g * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.k) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.k - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.e + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.k + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / h, e / h]
};
N.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  J.call(this, a);
  this.a = (a.n || 6378137) / (a.unit || 1);
  this.e = (a.l || 0) * h
}
O.prototype = new J;
O.prototype.forward = function(a) {
  var b = a[1] * h;
  return[this.a * (a[0] * h - this.e), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
O.prototype.q = function(a) {
  return[(a[0] / this.a + this.e) / h, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / h]
};
O.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function P(a) {
  a = a || {};
  J.call(this, a);
  var b = a.B, c = a.G * h, d = a.H * h, e = a.C * h;
  this.a = a.n / a.unit;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  c = Q(this, c, this.d);
  d = Q(this, d, this.d);
  e = Q(this, e, this.d);
  this.b = (a * a - b * b) / (d - c);
  this.t = a * a + this.b * c;
  this.g = this.p(this.a, this.t, this.b, e)
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
f = P.prototype;
f.p = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
f.o = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
f.D = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.o(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.o(a, b, c)
  }
  return e
};
f.forward = function(a) {
  var b = a[0] * h;
  a = this.p(this.a, this.t, this.b, Q(this, a[1] * h, this.d));
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
f.q = function(a) {
  var b = a[0] - this.h;
  a = a[1] - this.i;
  var c = Math.sqrt(b * b + (this.g - a) * (this.g - a)), d = this.b > 0 ? 1 : -1;
  c = (this.t - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.g - d * a)) / this.b + this.e) / h, this.D(c, this.d, Math.asin(c / 2)) / h]
};
f.m = function() {
  return Math.PI * 2 * this.a
};
f.m = function() {
  return Math.PI * 2 * this.a
};
l = new K({wkid:4326});
m = new K({wkid:4269});
n = new O({wkid:102113, n:6378137, l:0, unit:1});
r = {"4326":l, "4269":m, "102113":n, "102100":new O({wkid:102100, n:6378137, l:0, unit:1})};
s.U = function(a, b) {
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
    var e = t(c, 'PROJECTION["', '"]'), g = t(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(t(t(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.n = parseFloat(g[1]);
      d.B = parseFloat(g[2]);
      d.C = parseFloat(t(c, '"Latitude_Of_Origin",', "]"));
      d.l = parseFloat(t(c, '"Central_Meridian",', "]"));
      d.w = parseFloat(t(c, '"False_Easting",', "]"));
      d.z = parseFloat(t(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new J(d);
        break;
      case "Lambert_Conformal_Conic":
        d.G = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.H = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
        c = new L(d);
        break;
      case "Transverse_Mercator":
        d.S = parseFloat(t(c, '"Scale_Factor",', "]"));
        c = new N(d);
        break;
      case "Albers":
        d.G = parseFloat(t(c, '"Standard_Parallel_1",', "]"));
        d.H = parseFloat(t(c, '"Standard_Parallel_2",', "]"));
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
  this.O = false;
  var b = this;
  I(a, {}, "", function(c) {
    v(c, b);
    if(c.spatialReference) {
      b.spatialReference = r[c.spatialReference.wkid || c.spatialReference.wkt] || l
    }
    b.O = true;
    w(b, "load")
  })
}
function S(a, b, c, d) {
  b = v(b, {});
  if(b.A) {
    v(b.A, b);
    delete b.A
  }
  if(u(b.outFields)) {
    b.outFields = b.outFields.join(",")
  }
  b.outSR = 4326;
  I(a.url + "/findAddressCandidates", b, "", function(e) {
    if(e.candidates) {
      for(var g, i, o = 0;o < e.candidates.length;o++) {
        g = e.candidates[o];
        i = g.location;
        if(!isNaN(i.x) && !isNaN(i.y)) {
          i = [i.x, i.y];
          if(a.spatialReference) {
            i = a.spatialReference.q(i)
          }
          g.location = new k.LatLng(i[1], i[0])
        }
      }
    }
    c(e);
    d && e && e.error && d(e.error)
  })
}
function T(a) {
  this.P = a ? a.lods : null;
  this.F = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : n;
  if(!this.F) {
    throw new Error("unsupported Spatial Reference");
  }
  this.M = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.F.m() / this.M / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.P.length - 1 : 20;
  if(k.Size) {
    this.W = a ? new k.Size(a.cols, a.rows) : new k.Size(256, 256)
  }
  this.N = Math.pow(2, this.minZoom) * this.M;
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
}
T.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.F.forward([a.lng(), a.lat()]), d = b || new k.Point(0, 0);
  d.x = (c[0] - this.Q) / this.N;
  d.y = (this.R - c[1]) / this.N;
  return d
};
T.prototype.fromLatLngToPoint = T.prototype.fromLatLngToPoint;
new T;
new k.OverlayView;var U, V, W, X, Y;
function Z(a) {
  var b = "Matched Address:" + a.address + "<br/>Score:" + a.score + "<br/>";
  if(a.attributes) {
    var c = a.attributes;
    for(var d in c) {
      if(c.hasOwnProperty(d)) {
        b += d + c[d] + "<br/>"
      }
    }
  }
  var e = a.location;
  a = new google.maps.Marker({title:a.address, position:e});
  google.maps.event.addListener(a, "click", function() {
    W.setContent(Y + "<br/>" + b);
    W.setPosition(e);
    W.open(U)
  });
  return a
}
window.onload = function() {
  var a = {zoom:4, center:new google.maps.LatLng(40, -100), mapTypeId:google.maps.MapTypeId.ROADMAP};
  U = new google.maps.Map(document.getElementById("map_canvas"), a);
  V = new R("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer");
  google.maps.event.addListenerOnce(V, "load", function() {
    var b = V.addressFields;
    Y = "";
    for(var c = 0;c < b.length;c++) {
      Y += b[c].alias + ': <input type=text size=25 id="' + b[c].name + '"/><br/>'
    }
    Y += '<input type="button" onclick="geocode()" value="Geocode!"/>';
    W = new google.maps.InfoWindow({maxWidth:200, content:Y, position:U.getCenter()});
    W.open(U)
  })
};
window.geocode = function() {
  if(X) {
    for(var a = 0;a < X.length;a++) {
      X[a].setMap(null)
    }
    X.length = 0
  }
  var b = {}, c = V.addressFields;
  for(a = 0;a < c.length;a++) {
    b[c[a].name] = document.getElementById(c[a].name).value
  }
  S(V, {A:b}, function(d) {
    X = [];
    if(d.candidates) {
      for(var e = 0, g = d.candidates.length;e < g;e++) {
        var i = Z(d.candidates[e]);
        i.setMap(U);
        X.push(i);
        if(e == 0) {
          U.setCenter(i.getPosition());
          U.setZoom(15);
          google.maps.event.trigger(i, "click")
        }
      }
    }
  })
};})()
