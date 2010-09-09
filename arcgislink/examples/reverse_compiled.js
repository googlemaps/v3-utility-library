(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var f, h = Math.PI / 180, i = 0;
window.ags_jsonp = window.ags_jsonp || {};
var j = google.maps, k, l, n, o = {K:null, J:false}, p = {}, q = {};
function r(a, b, c) {
  var d = b === "" ? 0 : a.indexOf(b);
  return a.substring(d + b.length, c === "" ? a.length : a.indexOf(c, d + b.length))
}
function s() {
  j.event.trigger.apply(this, arguments)
}
function u() {
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
var v = "esriGeometryPoint", w = "esriGeometryMultipoint", x = "esriGeometryPolyline", y = "esriGeometryPolygon", z = "esriGeometryEnvelope";
function A(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof j.LatLng || b instanceof j.Marker) {
    return a && a.splice && a.length > 1 ? w : v
  }else {
    if(b instanceof j.Polyline) {
      return x
    }else {
      if(b instanceof j.Polygon) {
        return y
      }else {
        if(b instanceof j.LatLngBounds) {
          return z
        }else {
          if(b.x !== undefined && b.y !== undefined) {
            return v
          }else {
            if(b.points) {
              return w
            }else {
              if(b.paths) {
                return x
              }else {
                if(b.rings) {
                  return y
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
function B(a) {
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
function C(a, b) {
  for(var c = [], d, e = 0, g = a.getLength();e < g;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function D(a) {
  var b, c, d, e = "{";
  switch(A(a)) {
    case v:
      b = a && a.splice ? a[0] : a;
      if(b instanceof j.Marker) {
        b = b.getPosition()
      }
      e += "x:" + b.lng() + ",y:" + b.lat();
      break;
    case w:
      d = [];
      for(c = 0;c < a.length;c++) {
        b = a[c] instanceof j.Marker ? a[c].getPosition() : a[c];
        d.push("[" + b.lng() + "," + b.lat() + "]")
      }
      e += "points: [" + d.join(",") + "]";
      break;
    case x:
      d = [];
      a = a && a.splice ? a : [a];
      for(c = 0;c < a.length;c++) {
        d.push("[" + C(a[c].getPath()) + "]")
      }
      e += "paths:[" + d.join(",") + "]";
      break;
    case y:
      d = [];
      b = a && a.splice ? a[0] : a;
      a = b.getPaths();
      for(c = 0;c < a.getLength();c++) {
        d.push("[" + C(a.getAt(c), true) + "]")
      }
      e += "rings:[" + d.join(",") + "]";
      break;
    case z:
      b = a && a.splice ? a[0] : a;
      e += "xmin:" + b.getSouthWest().lng() + ",ymin:" + b.getSouthWest().lat() + ",xmax:" + b.getNorthEast().lng() + ",ymax:" + b.getNorthEast().lat();
      break
  }
  e += ", spatialReference:{wkid:4326}";
  e += "}";
  return e
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
      if(B(a)) {
        return D(a)
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
function F(a) {
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
function G(a, b, c, d) {
  var e = "ags_jsonp_" + i++ + "_" + Math.floor(Math.random() * 1E6), g = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = F(b);
  var I = document.getElementsByTagName("head")[0];
  if(!I) {
    throw new Error("document must have header tag");
  }
  window.ags_jsonp[e] = function() {
    window.ags_jsonp[e] && delete window.ags_jsonp[e];
    g && I.removeChild(g);
    g = null;
    d.apply(null, arguments);
    s(q, "jsonpend", e)
  };
  if((b + a).length < 2E3 && !o.J) {
    g = document.createElement("script");
    g.src = a + (a.indexOf("?") === -1 ? "?" : "&") + b;
    g.id = e;
    I.appendChild(g)
  }else {
    c = window.location;
    c = c.protocol + "//" + c.hostname + (!c.port || c.port === 80 ? "" : ":" + c.port + "/");
    var t = true;
    if(a.toLowerCase().indexOf(c.toLowerCase()) !== -1) {
      t = false
    }
    if(o.J) {
      t = true
    }
    if(t && !o.K) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var m = u();
    m.onreadystatechange = function() {
      if(m.readyState === 4) {
        if(m.status === 200) {
          eval(m.responseText)
        }else {
          throw new Error("Error code " + m.status);
        }
      }
    };
    m.open("POST", t ? o.K + "?" + a : a, true);
    m.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    m.send(b)
  }
  s(q, "jsonpstart", e);
  return e
}
q.S = function(a, b, c, d) {
  G(a, b, c, d)
};
q.I = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        q.I(a, c)
      }else {
        B(c) && c.setMap(a)
      }
    }
  }
};
q.U = function(a, b) {
  q.I(null, a);
  if(b) {
    a.length = 0
  }
};
function H(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
H.prototype.forward = function(a) {
  return a
};
H.prototype.q = function(a) {
  return a
};
H.prototype.m = function() {
  return 360
};
H.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function J(a) {
  a = a || {};
  H.call(this, a)
}
J.prototype = new H;
function K(a) {
  a = a || {};
  H.call(this, a);
  var b = a.A, c = a.F * h, d = a.G * h, e = a.B * h;
  this.a = a.n / a.unit;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  e = L(this, e, this.d);
  c = L(this, c, this.d);
  d = L(this, d, this.d);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.u = a / (this.b * Math.pow(c, this.b));
  this.g = this.p(this.a, this.u, e, this.b)
}
K.prototype = new H;
K.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function L(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
f = K.prototype;
f.p = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
f.o = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
f.C = function(a, b, c) {
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
  a = this.p(this.a, this.u, L(this, a[1] * h, this.d), this.b);
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
f.q = function(a) {
  var b = a[0] - this.h, c = a[1] - this.i;
  a = Math.atan(b / (this.g - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.g - c) * (this.g - c)) / (this.a * this.u), 1 / this.b);
  return[(a / this.b + this.e) / h, this.C(b, this.d, Math.PI / 2 - 2 * Math.atan(b)) / h]
};
f.m = function() {
  return Math.PI * 2 * this.a
};
function M(a) {
  a = a || {};
  H.call(this, a);
  this.a = a.n / a.unit;
  var b = a.A;
  this.s = a.R;
  var c = a.B * h;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / b;
  this.c = 2 * a - a * a;
  this.r = this.c * this.c;
  this.v = this.r * this.c;
  this.k = this.c / (1 - this.c);
  this.H = this.j(c, this.a, this.c, this.r, this.v)
}
M.prototype = new H;
M.prototype.j = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
M.prototype.forward = function(a) {
  var b = a[1] * h, c = a[0] * h;
  a = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.k * Math.pow(Math.cos(b), 2);
  c = (c - this.e) * Math.cos(b);
  var g = this.j(b, this.a, this.c, this.r, this.v);
  return[this.h + this.s * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.k) * Math.pow(c, 5) / 120), this.i + this.s * (g - this.H) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.k) * Math.pow(c, 6) / 720)]
};
M.prototype.q = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.c)) / (1 + Math.sqrt(1 - this.c));
  c = (this.H + (c - this.i) / this.s) / (this.a * (1 - this.c / 4 - 3 * this.r / 64 - 5 * this.v / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.k * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.c * Math.pow(Math.sin(a), 2)), g = this.a * (1 - this.c) / Math.pow(1 - this.c * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.h) / (e * this.s);
  e = a - e * Math.tan(a) / g * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.k) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.k - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.e + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.k + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / h, e / h]
};
M.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  H.call(this, a);
  this.a = (a.n || 6378137) / (a.unit || 1);
  this.e = (a.l || 0) * h
}
N.prototype = new H;
N.prototype.forward = function(a) {
  var b = a[1] * h;
  return[this.a * (a[0] * h - this.e), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
N.prototype.q = function(a) {
  return[(a[0] / this.a + this.e) / h, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / h]
};
N.prototype.m = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  H.call(this, a);
  var b = a.A, c = a.F * h, d = a.G * h, e = a.B * h;
  this.a = a.n / a.unit;
  this.e = a.l * h;
  this.h = a.w;
  this.i = a.z;
  a = 1 / b;
  b = 2 * a - a * a;
  this.d = Math.sqrt(b);
  a = this.j(c, b);
  b = this.j(d, b);
  c = P(this, c, this.d);
  d = P(this, d, this.d);
  e = P(this, e, this.d);
  this.b = (a * a - b * b) / (d - c);
  this.t = a * a + this.b * c;
  this.g = this.p(this.a, this.t, this.b, e)
}
O.prototype = new H;
O.prototype.j = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function P(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
f = O.prototype;
f.p = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
f.o = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
f.C = function(a, b, c) {
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
  a = this.p(this.a, this.t, this.b, P(this, a[1] * h, this.d));
  b = this.b * (b - this.e);
  return[this.h + a * Math.sin(b), this.i + this.g - a * Math.cos(b)]
};
f.q = function(a) {
  var b = a[0] - this.h;
  a = a[1] - this.i;
  var c = Math.sqrt(b * b + (this.g - a) * (this.g - a)), d = this.b > 0 ? 1 : -1;
  c = (this.t - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.g - d * a)) / this.b + this.e) / h, this.C(c, this.d, Math.asin(c / 2)) / h]
};
f.m = function() {
  return Math.PI * 2 * this.a
};
f.m = function() {
  return Math.PI * 2 * this.a
};
k = new J({wkid:4326});
l = new J({wkid:4269});
n = new N({wkid:102113, n:6378137, l:0, unit:1});
p = {"4326":k, "4269":l, "102113":n, "102100":new N({wkid:102100, n:6378137, l:0, unit:1})};
q.T = function(a, b) {
  var c = p["" + a];
  if(c) {
    return c
  }
  if(b instanceof H) {
    c = p["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = r(c, 'PROJECTION["', '"]'), g = r(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(r(r(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.n = parseFloat(g[1]);
      d.A = parseFloat(g[2]);
      d.B = parseFloat(r(c, '"Latitude_Of_Origin",', "]"));
      d.l = parseFloat(r(c, '"Central_Meridian",', "]"));
      d.w = parseFloat(r(c, '"False_Easting",', "]"));
      d.z = parseFloat(r(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new H(d);
        break;
      case "Lambert_Conformal_Conic":
        d.F = parseFloat(r(c, '"Standard_Parallel_1",', "]"));
        d.G = parseFloat(r(c, '"Standard_Parallel_2",', "]"));
        c = new K(d);
        break;
      case "Transverse_Mercator":
        d.R = parseFloat(r(c, '"Scale_Factor",', "]"));
        c = new M(d);
        break;
      case "Albers":
        d.F = parseFloat(r(c, '"Standard_Parallel_1",', "]"));
        d.G = parseFloat(r(c, '"Standard_Parallel_2",', "]"));
        c = new O(d);
        break;
      default:
        throw new Error(e + "  not supported");
    }
    if(c) {
      p["" + a] = c
    }
  }
  return c
};
function Q(a) {
  this.url = a;
  this.N = false;
  var b = this;
  G(a, {}, "", function(c) {
    if(c && b) {
      var d;
      for(d in c) {
        d in b || (b[d] = c[d])
      }
    }
    if(c.spatialReference) {
      b.spatialReference = p[c.spatialReference.wkid || c.spatialReference.wkt] || k
    }
    b.N = true;
    s(b, "load")
  })
}
function R(a, b, c, d) {
  if(!(b.location && typeof b.location === "string")) {
    b.location = D(b.location)
  }
  b.outSR = 4326;
  G(a.url + "/reverseGeocode", b, "", function(e) {
    if(e.location) {
      var g = e.location;
      if(!isNaN(g.x) && !isNaN(g.y)) {
        g = [g.x, g.y];
        if(a.spatialReference) {
          g = a.spatialReference.q(g)
        }
        e.location = new j.LatLng(g[1], g[0])
      }
    }
    c(e);
    d && e && e.error && d(e.error)
  })
}
function S(a) {
  this.O = a ? a.lods : null;
  this.D = a ? p[a.spatialReference.wkid || a.spatialReference.wkt] : n;
  if(!this.D) {
    throw new Error("unsupported Spatial Reference");
  }
  this.L = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.D.m() / this.L / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.O.length - 1 : 20;
  if(j.Size) {
    this.V = a ? new j.Size(a.cols, a.rows) : new j.Size(256, 256)
  }
  this.M = Math.pow(2, this.minZoom) * this.L;
  this.P = a ? a.origin.x : -2.0037508342787E7;
  this.Q = a ? a.origin.y : 2.0037508342787E7;
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
  var c = this.D.forward([a.lng(), a.lat()]), d = b || new j.Point(0, 0);
  d.x = (c[0] - this.P) / this.M;
  d.y = (this.Q - c[1]) / this.M;
  return d
};
S.prototype.fromLatLngToPoint = S.prototype.fromLatLngToPoint;
new S;
new j.OverlayView;var T, U, V;
function W(a) {
  a && R(U, {location:a, distance:100}, function(b) {
    if(b.address) {
      var c = "", d = b.address;
      for(var e in d) {
        if(d.hasOwnProperty(e)) {
          c += e + ": " + d[e] + "<br/>"
        }
      }
      marker.setPosition(b.location);
      V.setContent(c);
      V.open(T)
    }else {
      alert("can not find address for point:" + a.toString())
    }
  })
}
window.onload = function() {
  var a = {zoom:17, center:new google.maps.LatLng(35.23, -80.84), mapTypeId:google.maps.MapTypeId.ROADMAP};
  T = new google.maps.Map(document.getElementById("map_canvas"), a);
  U = new Q("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer");
  marker = new google.maps.Marker({position:T.getCenter(), draggable:true});
  marker.setMap(T);
  google.maps.event.addListener(T, "click", function(b) {
    W(b.latLng)
  });
  google.maps.event.addListener(marker, "dragend", function(b) {
    W(b.latLng)
  });
  google.maps.event.addListener(marker, "dragstart", function() {
    V.close()
  });
  V = new google.maps.InfoWindow({maxWidth:180, content:"Click map or drag marker to get the address of the location"});
  V.bindTo("position", marker, "position");
  V.open(T)
};})()
