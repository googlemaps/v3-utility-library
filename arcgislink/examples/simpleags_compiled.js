(function(){/*
 http://google-maps-utility-library-v3.googlecode.com
*/
var i, k = Math.PI / 180, aa = 0;
window.ags_jsonp = window.ags_jsonp || {};
var m = google.maps, n, ba, o, p = {ea:null, Z:false}, r = {}, t = {};
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
  m.event.trigger.apply(this, arguments)
}
function da(a, b) {
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
function ea(a) {
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
function fa() {
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
var z = "esriGeometryPoint", A = "esriGeometryMultipoint", B = "esriGeometryPolyline", C = "esriGeometryPolygon", ga = "esriGeometryEnvelope";
function ha(a) {
  var b = a;
  if(a && a.splice && a.length > 0) {
    b = a[0]
  }
  if(b instanceof m.LatLng || b instanceof m.Marker) {
    return a && a.splice && a.length > 1 ? A : z
  }else {
    if(b instanceof m.Polyline) {
      return B
    }else {
      if(b instanceof m.Polygon) {
        return C
      }else {
        if(b instanceof m.LatLngBounds) {
          return ga
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
function ia(a) {
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
function ja(a, b) {
  for(var c = [], d, e = 0, f = a.getLength();e < f;e++) {
    d = a.getAt(e);
    c.push("[" + d.lng() + "," + d.lat() + "]")
  }
  b && c.length > 0 && c.push("[" + a.getAt(0).lng() + "," + a.getAt(0).lat() + "]");
  return c.join(",")
}
function D(a) {
  var b, c, d, e = "{";
  switch(ha(a)) {
    case z:
      b = a && a.splice ? a[0] : a;
      if(b instanceof m.Marker) {
        b = b.getPosition()
      }
      e += "x:" + b.lng() + ",y:" + b.lat();
      break;
    case A:
      d = [];
      for(c = 0;c < a.length;c++) {
        b = a[c] instanceof m.Marker ? a[c].getPosition() : a[c];
        d.push("[" + b.lng() + "," + b.lat() + "]")
      }
      e += "points: [" + d.join(",") + "]";
      break;
    case B:
      d = [];
      a = a && a.splice ? a : [a];
      for(c = 0;c < a.length;c++) {
        d.push("[" + ja(a[c].getPath()) + "]")
      }
      e += "paths:[" + d.join(",") + "]";
      break;
    case C:
      d = [];
      b = a && a.splice ? a[0] : a;
      a = b.getPaths();
      for(c = 0;c < a.getLength();c++) {
        d.push("[" + ja(a.getAt(c), true) + "]")
      }
      e += "rings:[" + d.join(",") + "]";
      break;
    case ga:
      b = a && a.splice ? a[0] : a;
      e += "xmin:" + b.getSouthWest().lng() + ",ymin:" + b.getSouthWest().lat() + ",xmax:" + b.getNorthEast().lng() + ",ymax:" + b.getNorthEast().lat();
      break
  }
  e += ", spatialReference:{wkid:4326}";
  e += "}";
  return e
}
function ka(a) {
  var b = r[a.spatialReference.wkid || a.spatialReference.wkt];
  b = b || n;
  var c = b.s([a.xmin, a.ymin]);
  a = b.s([a.xmax, a.ymax]);
  return new m.LatLngBounds(new m.LatLng(c[1], c[0]), new m.LatLng(a[1], a[0]))
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
      if(ia(a)) {
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
function la(a) {
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
function ma(a, b) {
  for(var c = [], d = 2, e = arguments.length;d < e;d++) {
    c.push(arguments[d])
  }
  return function() {
    a.apply(b, c)
  }
}
function F(a, b, c) {
  b.o ? a.push(b.copyrightText) : m.event.addListenerOnce(b, "load", function() {
    G(c)
  })
}
function G(a) {
  var b = null;
  if(a) {
    var c = a.controls[m.ControlPosition.BOTTOM_RIGHT];
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
      a.controls[m.ControlPosition.BOTTOM_RIGHT].push(b);
      m.event.addListener(a, "maptypeid_changed", function() {
        G(a)
      })
    }
    var f = a.C;
    c = [];
    if(f) {
      d = 0;
      for(e = f.getLength();d < e;d++) {
        F(c, f.getAt(d).c, a)
      }
    }
    var j = a.overlayMapTypes;
    if(j) {
      d = 0;
      for(e = j.getLength();d < e;d++) {
        f = j.getAt(d);
        if(f instanceof I) {
          for(var h = 0, g = f.q.length;h < g;h++) {
            F(c, f.q[h].c, a)
          }
        }
      }
    }
    f = a.mapTypes.get(a.getMapTypeId());
    if(f instanceof I) {
      d = 0;
      for(e = f.q.length;d < e;d++) {
        F(c, f.q[d].c, a)
      }
      b.style.color = f.wa ? "#ffffff" : "#000000"
    }
    b.innerHTML = c.join("<br/>")
  }
}
function J(a, b, c, d) {
  var e = "ags_jsonp_" + aa++ + "_" + Math.floor(Math.random() * 1E6), f = null;
  b = b || {};
  b[c || "callback"] = "ags_jsonp." + e + " && ags_jsonp." + e;
  b = la(b);
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
  if((b + a).length < 2E3 && !p.Z) {
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
    if(p.Z) {
      h = true
    }
    if(h && !p.ea) {
      throw new Error("No proxyUrl property in Config is defined");
    }
    var g = fa();
    g.onreadystatechange = function() {
      if(g.readyState === 4) {
        if(g.status === 200) {
          eval(g.responseText)
        }else {
          throw new Error("Error code " + g.status);
        }
      }
    };
    g.open("POST", h ? p.ea + "?" + a : a, true);
    g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    g.send(b)
  }
  x(t, "jsonpstart", e);
  return e
}
t.va = function(a, b, c, d) {
  J(a, b, c, d)
};
t.Y = function(a, b) {
  if(b && b.splice) {
    for(var c, d = 0, e = b.length;d < e;d++) {
      if((c = b[d]) && c.splice) {
        t.Y(a, c)
      }else {
        ia(c) && c.setMap(a)
      }
    }
  }
};
t.Aa = function(a, b) {
  t.Y(null, a);
  if(b) {
    a.length = 0
  }
};
function K(a) {
  a = a || {};
  this.wkid = a.wkid;
  this.wkt = a.wkt
}
K.prototype.forward = function(a) {
  return a
};
K.prototype.s = function(a) {
  return a
};
K.prototype.u = function() {
  return 360
};
K.prototype.toJSON = function() {
  return"{" + (this.wkid ? " wkid:" + this.wkid : "wkt: '" + this.wkt + "'") + "}"
};
function na(a) {
  a = a || {};
  K.call(this, a)
}
na.prototype = new K;
function L(a) {
  a = a || {};
  K.call(this, a);
  var b = a.S, c = a.V * k, d = a.W * k, e = a.T * k;
  this.a = a.w / a.unit;
  this.h = a.t * k;
  this.k = a.Q;
  this.l = a.R;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.m(c, b);
  b = this.m(d, b);
  e = M(this, e, this.g);
  c = M(this, c, this.g);
  d = M(this, d, this.g);
  this.b = Math.log(a / b) / Math.log(c / d);
  this.O = a / (this.b * Math.pow(c, this.b));
  this.i = this.B(this.a, this.O, e, this.b)
}
L.prototype = new K;
L.prototype.m = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function M(a, b, c) {
  a = c * Math.sin(b);
  return Math.tan(Math.PI / 4 - b / 2) / Math.pow((1 - a) / (1 + a), c / 2)
}
i = L.prototype;
i.B = function(a, b, c, d) {
  return a * b * Math.pow(c, d)
};
i.A = function(a, b, c) {
  c = b * Math.sin(c);
  return Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - c) / (1 + c), b / 2))
};
i.U = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.A(a, b, c);Math.abs(e - c) > 1.0E-9 && d < 10;) {
    d++;
    c = e;
    e = this.A(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * k;
  a = this.B(this.a, this.O, M(this, a[1] * k, this.g), this.b);
  b = this.b * (b - this.h);
  return[this.k + a * Math.sin(b), this.l + this.i - a * Math.cos(b)]
};
i.s = function(a) {
  var b = a[0] - this.k, c = a[1] - this.l;
  a = Math.atan(b / (this.i - c));
  b = Math.pow((this.b > 0 ? 1 : -1) * Math.sqrt(b * b + (this.i - c) * (this.i - c)) / (this.a * this.O), 1 / this.b);
  return[(a / this.b + this.h) / k, this.U(b, this.g, Math.PI / 2 - 2 * Math.atan(b)) / k]
};
i.u = function() {
  return Math.PI * 2 * this.a
};
function N(a) {
  a = a || {};
  K.call(this, a);
  this.a = a.w / a.unit;
  var b = a.S;
  this.H = a.sa;
  var c = a.T * k;
  this.h = a.t * k;
  this.k = a.Q;
  this.l = a.R;
  a = 1 / b;
  this.d = 2 * a - a * a;
  this.F = this.d * this.d;
  this.P = this.F * this.d;
  this.r = this.d / (1 - this.d);
  this.X = this.m(c, this.a, this.d, this.F, this.P)
}
N.prototype = new K;
N.prototype.m = function(a, b, c, d, e) {
  return b * ((1 - c / 4 - 3 * d / 64 - 5 * e / 256) * a - (3 * c / 8 + 3 * d / 32 + 45 * e / 1024) * Math.sin(2 * a) + (15 * d / 256 + 45 * e / 1024) * Math.sin(4 * a) - 35 * e / 3072 * Math.sin(6 * a))
};
N.prototype.forward = function(a) {
  var b = a[1] * k, c = a[0] * k;
  a = this.a / Math.sqrt(1 - this.d * Math.pow(Math.sin(b), 2));
  var d = Math.pow(Math.tan(b), 2), e = this.r * Math.pow(Math.cos(b), 2);
  c = (c - this.h) * Math.cos(b);
  var f = this.m(b, this.a, this.d, this.F, this.P);
  return[this.k + this.H * a * (c + (1 - d + e) * Math.pow(c, 3) / 6 + (5 - 18 * d + d * d + 72 * e - 58 * this.r) * Math.pow(c, 5) / 120), this.l + this.H * (f - this.X) + a * Math.tan(b) * (c * c / 2 + (5 - d + 9 * e + 4 * e * e) * Math.pow(c, 4) / 120 + (61 - 58 * d + d * d + 600 * e - 330 * this.r) * Math.pow(c, 6) / 720)]
};
N.prototype.s = function(a) {
  var b = a[0], c = a[1];
  a = (1 - Math.sqrt(1 - this.d)) / (1 + Math.sqrt(1 - this.d));
  c = (this.X + (c - this.l) / this.H) / (this.a * (1 - this.d / 4 - 3 * this.F / 64 - 5 * this.P / 256));
  a = c + (3 * a / 2 - 27 * Math.pow(a, 3) / 32) * Math.sin(2 * c) + (21 * a * a / 16 - 55 * Math.pow(a, 4) / 32) * Math.sin(4 * c) + 151 * Math.pow(a, 3) / 6 * Math.sin(6 * c) + 1097 * Math.pow(a, 4) / 512 * Math.sin(8 * c);
  c = this.r * Math.pow(Math.cos(a), 2);
  var d = Math.pow(Math.tan(a), 2), e = this.a / Math.sqrt(1 - this.d * Math.pow(Math.sin(a), 2)), f = this.a * (1 - this.d) / Math.pow(1 - this.d * Math.pow(Math.sin(a), 2), 1.5);
  b = (b - this.k) / (e * this.H);
  e = a - e * Math.tan(a) / f * (b * b / 2 - (5 + 3 * d + 10 * c - 4 * c * c - 9 * this.r) * Math.pow(b, 4) / 24 + (61 + 90 * d + 28 * c + 45 * d * d - 252 * this.r - 3 * c * c) * Math.pow(b, 6) / 720);
  return[(this.h + (b - (1 + 2 * d + c) * Math.pow(b, 3) / 6 + (5 - 2 * c + 28 * d - 3 * c * c + 8 * this.r + 24 * d * d) * Math.pow(b, 5) / 120) / Math.cos(a)) / k, e / k]
};
N.prototype.u = function() {
  return Math.PI * 2 * this.a
};
function O(a) {
  a = a || {};
  K.call(this, a);
  this.a = (a.w || 6378137) / (a.unit || 1);
  this.h = (a.t || 0) * k
}
O.prototype = new K;
O.prototype.forward = function(a) {
  var b = a[1] * k;
  return[this.a * (a[0] * k - this.h), this.a / 2 * Math.log((1 + Math.sin(b)) / (1 - Math.sin(b)))]
};
O.prototype.s = function(a) {
  return[(a[0] / this.a + this.h) / k, (Math.PI / 2 - 2 * Math.atan(Math.exp(-a[1] / this.a))) / k]
};
O.prototype.u = function() {
  return Math.PI * 2 * this.a
};
function S(a) {
  a = a || {};
  K.call(this, a);
  var b = a.S, c = a.V * k, d = a.W * k, e = a.T * k;
  this.a = a.w / a.unit;
  this.h = a.t * k;
  this.k = a.Q;
  this.l = a.R;
  a = 1 / b;
  b = 2 * a - a * a;
  this.g = Math.sqrt(b);
  a = this.m(c, b);
  b = this.m(d, b);
  c = T(this, c, this.g);
  d = T(this, d, this.g);
  e = T(this, e, this.g);
  this.b = (a * a - b * b) / (d - c);
  this.N = a * a + this.b * c;
  this.i = this.B(this.a, this.N, this.b, e)
}
S.prototype = new K;
S.prototype.m = function(a, b) {
  var c = Math.sin(a);
  return Math.cos(a) / Math.sqrt(1 - b * c * c)
};
function T(a, b, c) {
  a = c * Math.sin(b);
  return(1 - c * c) * (Math.sin(b) / (1 - a * a) - 1 / (2 * c) * Math.log((1 - a) / (1 + a)))
}
i = S.prototype;
i.B = function(a, b, c, d) {
  return a * Math.sqrt(b - c * d) / c
};
i.A = function(a, b, c) {
  var d = b * Math.sin(c);
  return c + (1 - d * d) * (1 - d * d) / (2 * Math.cos(c)) * (a / (1 - b * b) - Math.sin(c) / (1 - d * d) + Math.log((1 - d) / (1 + d)) / (2 * b))
};
i.U = function(a, b, c) {
  var d = 0;
  c = c;
  for(var e = this.A(a, b, c);Math.abs(e - c) > 1.0E-8 && d < 10;) {
    d++;
    c = e;
    e = this.A(a, b, c)
  }
  return e
};
i.forward = function(a) {
  var b = a[0] * k;
  a = this.B(this.a, this.N, this.b, T(this, a[1] * k, this.g));
  b = this.b * (b - this.h);
  return[this.k + a * Math.sin(b), this.l + this.i - a * Math.cos(b)]
};
i.s = function(a) {
  var b = a[0] - this.k;
  a = a[1] - this.l;
  var c = Math.sqrt(b * b + (this.i - a) * (this.i - a)), d = this.b > 0 ? 1 : -1;
  c = (this.N - c * c * this.b * this.b / (this.a * this.a)) / this.b;
  return[(Math.atan(d * b / (d * this.i - d * a)) / this.b + this.h) / k, this.U(c, this.g, Math.asin(c / 2)) / k]
};
i.u = function() {
  return Math.PI * 2 * this.a
};
i.u = function() {
  return Math.PI * 2 * this.a
};
n = new na({wkid:4326});
ba = new na({wkid:4269});
o = new O({wkid:102113, w:6378137, t:0, unit:1});
r = {"4326":n, "4269":ba, "102113":o, "102100":new O({wkid:102100, w:6378137, t:0, unit:1})};
t.za = function(a, b) {
  var c = r["" + a];
  if(c) {
    return c
  }
  if(b instanceof K) {
    c = r["" + a] = b
  }else {
    c = b || a;
    var d = {wkt:a};
    if(a === parseInt(a, 10)) {
      d = {wkid:a}
    }
    var e = u(c, 'PROJECTION["', '"]'), f = u(c, "SPHEROID[", "]").split(",");
    if(e !== "") {
      d.unit = parseFloat(u(u(c, "PROJECTION", ""), "UNIT[", "]").split(",")[1]);
      d.w = parseFloat(f[1]);
      d.S = parseFloat(f[2]);
      d.T = parseFloat(u(c, '"Latitude_Of_Origin",', "]"));
      d.t = parseFloat(u(c, '"Central_Meridian",', "]"));
      d.Q = parseFloat(u(c, '"False_Easting",', "]"));
      d.R = parseFloat(u(c, '"False_Northing",', "]"))
    }
    switch(e) {
      case "":
        c = new K(d);
        break;
      case "Lambert_Conformal_Conic":
        d.V = parseFloat(u(c, '"Standard_Parallel_1",', "]"));
        d.W = parseFloat(u(c, '"Standard_Parallel_2",', "]"));
        c = new L(d);
        break;
      case "Transverse_Mercator":
        d.sa = parseFloat(u(c, '"Scale_Factor",', "]"));
        c = new N(d);
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
      r["" + a] = c
    }
  }
  return c
};
function oa(a) {
  this.url = a;
  this.definition = null
}
oa.prototype.load = function() {
  var a = this;
  this.o || J(this.url, {}, "", function(b) {
    w(b, a);
    a.o = true;
    x(a, "load")
  })
};
function U(a, b) {
  this.url = a;
  this.o = false;
  var c = a.split("/");
  this.name = c[c.length - 2].replace(/_/g, " ");
  b = b || {};
  if(b.ja) {
    var d = this;
    window.setTimeout(function() {
      sa(d)
    }, b.ja * 1E3)
  }else {
    sa(this)
  }
}
function sa(a) {
  J(a.url, {}, "", function(b) {
    a.G(b)
  })
}
U.prototype.G = function(a) {
  var b = this;
  w(a, this);
  this.spatialReference = a.spatialReference.wkt ? K.ya(a.spatialReference.wkt) : r[a.spatialReference.wkid];
  a.tables !== undefined ? J(this.url + "/layers", {}, "", function(c) {
    ta(b, c)
  }) : ta(b, a)
};
function ta(a, b) {
  var c = [], d = [];
  a.layers = c;
  if(b.tables) {
    a.tables = d
  }
  var e, f, j, h;
  f = 0;
  for(j = b.layers.length;f < j;f++) {
    h = b.layers[f];
    e = new oa(a.url + "/" + h.id);
    w(h, e);
    e.visible = e.defaultVisibility;
    c.push(e)
  }
  if(b.tables) {
    f = 0;
    for(j = b.tables.length;f < j;f++) {
      h = b.tables[f];
      e = new oa(a.url + "/" + h.id);
      w(h, e);
      d.push(e)
    }
  }
  f = 0;
  for(j = c.length;f < j;f++) {
    e = c[f];
    if(e.subLayerIds) {
      e.M = [];
      d = 0;
      for(h = e.subLayerIds.length;d < h;d++) {
        var g;
        a: {
          g = e.subLayerIds[d];
          var l = a.layers;
          if(l) {
            for(var s = 0, q = l.length;s < q;s++) {
              if(g === l[s].id) {
                g = l[s];
                break a
              }
              if(v(g) && l[s].name.toLowerCase() === g.toLowerCase()) {
                g = l[s];
                break a
              }
            }
          }
          g = null
        }
        e.M.push(g);
        g.ra = e
      }
    }
  }
  a.o = true;
  x(a, "load")
}
function ua(a) {
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
function va(a) {
  var b = [];
  if(a.layers) {
    var c, d, e;
    d = 0;
    for(e = a.layers.length;d < e;d++) {
      c = a.layers[d];
      if(c.M) {
        for(var f = 0, j = c.M.length;f < j;f++) {
          if(c.M[f].visible === false) {
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
function wa(a, b, c, d) {
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
      f = ua(a)
    }
    e.layerDefs = ea(f);
    f = b.layerIds;
    var j = b.layerOption || "show";
    if(f === undefined) {
      f = va(a)
    }
    if(f.length > 0) {
      e.layers = j + ":" + f.join(",")
    }else {
      if(a.o && c) {
        c({href:null});
        return
      }
    }
    e.transparent = b.transparent === false ? false : true;
    if(b.time) {
      e.time = da(b.time, b.ta)
    }
    e.ma = b.ma;
    if(e.f === "image") {
      return a.url + "/export?" + la(e)
    }else {
      J(a.url + "/export", e, "", function(h) {
        if(h.extent) {
          h.bounds = ka(h.extent);
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
function xa(a, b, c, d) {
  if(b) {
    var e = {};
    e.geometry = D(b.geometry);
    e.geometryType = ha(b.geometry);
    e.mapExtent = D(b.bounds);
    e.tolerance = b.tolerance || 2;
    e.sr = 4326;
    e.imageDisplay = "" + b.width + "," + b.height + "," + (b.dpi || 96);
    e.layers = b.layerOption || "all";
    if(b.layerIds) {
      e.layers += ":" + b.layerIds.join(",")
    }
    if(b.layerDefs) {
      e.layerDefs = ea(b.layerDefs)
    }
    e.oa = b.oa;
    e.returnGeometry = b.returnGeometry === false ? false : true;
    J(a.url + "/identify", e, "", function(f) {
      var j, h, g;
      if(f.results) {
        for(j = 0;j < f.results.length;j++) {
          h = f.results[j];
          a: {
            g = h.geometry;
            var l = b.overlayOptions, s = null, q = void 0, P = void 0, pa = void 0;
            q = void 0;
            var qa = void 0, Q = void 0, H = void 0, ca = void 0, R = void 0;
            l = l || {};
            if(g) {
              s = [];
              if(g.x) {
                q = new m.Marker(w(l.markerOptions || l, {position:new m.LatLng(g.y, g.x)}));
                s.push(q)
              }else {
                Q = g.points || g.paths || g.rings;
                if(!Q) {
                  g = s;
                  break a
                }
                var ra = [];
                P = 0;
                for(pa = Q.length;P < pa;P++) {
                  H = Q[P];
                  if(g.points) {
                    q = new m.Marker(w(l.markerOptions || l, {position:new m.LatLng(H[1], H[0])}));
                    s.push(q)
                  }else {
                    R = [];
                    q = 0;
                    for(qa = H.length;q < qa;q++) {
                      ca = H[q];
                      R.push(new m.LatLng(ca[1], ca[0]))
                    }
                    if(g.paths) {
                      q = new m.Polyline(w(l.polylineOptions || l, {path:R}));
                      s.push(q)
                    }else {
                      g.rings && ra.push(R)
                    }
                  }
                }
                if(g.rings) {
                  q = new m.Polygon(w(l.xa || l, {paths:ra}));
                  s.push(q)
                }
              }
            }
            g = s
          }
          h.la = {geometry:g, attributes:h.attributes};
          delete h.attributes
        }
      }
      c(f);
      d && f && f.error && d(f.error)
    })
  }
}
function V(a) {
  this.na = a ? a.lods : null;
  this.z = a ? r[a.spatialReference.wkid || a.spatialReference.wkt] : o;
  if(!this.z) {
    throw new Error("unsupported Spatial Reference");
  }
  this.fa = a ? a.lods[0].resolution : 156543.033928;
  this.minZoom = Math.floor(Math.log(this.z.u() / this.fa / 256) / Math.LN2 + 0.5);
  this.maxZoom = a ? this.minZoom + this.na.length - 1 : 20;
  if(m.Size) {
    this.ga = a ? new m.Size(a.cols, a.rows) : new m.Size(256, 256)
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
V.prototype.fromLatLngToPoint = function(a, b) {
  if(!a || isNaN(a.lat()) || isNaN(a.lng())) {
    return null
  }
  var c = this.z.forward([a.lng(), a.lat()]), d = b || new m.Point(0, 0);
  d.x = (c[0] - this.ca) / this.K;
  d.y = (this.da - c[1]) / this.K;
  return d
};
V.prototype.fromLatLngToPoint = V.prototype.fromLatLngToPoint;
V.prototype.fromPointToLatLng = function(a) {
  if(a === null) {
    return null
  }
  a = this.z.s([a.x * this.K + this.ca, this.da - a.y * this.K]);
  return new m.LatLng(a[1], a[0])
};
var ya = new V;
function W(a, b) {
  b = b || {};
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  w(b, this);
  this.c = a instanceof U ? a : new U(a);
  if(b.aa) {
    var c = u(this.c.url, "", "://");
    this.ha = c + "://" + b.aa + u(this.c.url, c + "://" + u(this.c.url, "://", "/"), "");
    this.ba = parseInt(u(b.aa, "[", "]"), 10)
  }
  this.name = b.name || this.c.name;
  this.maxZoom = b.maxZoom || 19;
  this.minZoom = b.minZoom || 0;
  this.$ = b.$ || this.maxZoom;
  if(this.c.o) {
    this.G(b)
  }else {
    var d = this;
    m.event.addListenerOnce(this.c, "load", function() {
      d.G(b)
    })
  }
  this.j = {};
  this.v = b.map
}
W.prototype.G = function(a) {
  if(this.c.tileInfo) {
    this.p = new V(this.c.tileInfo);
    this.minZoom = a.minZoom || this.p.minZoom;
    this.maxZoom = a.maxZoom || this.p.maxZoom
  }
};
W.prototype.getTileUrl = function(a, b) {
  var c = b - (this.p ? this.p.minZoom : this.minZoom), d = "";
  if(!isNaN(a.x) && !isNaN(a.y) && c >= 0 && a.x >= 0 && a.y >= 0) {
    d = this.c.url;
    if(this.ha) {
      d = this.ha.replace("[" + this.ba + "]", "" + (a.y + a.x) % this.ba)
    }
    if(this.c.singleFusedMapCache === false || b > this.$) {
      c = this.p || (this.v ? this.v.getProjection() : ya);
      if(!c instanceof V) {
        c = ya
      }
      d = c.ga;
      var e = 1 << b, f = new m.Point(a.x * d.width / e, (a.y + 1) * d.height / e);
      e = new m.Point((a.x + 1) * d.width / e, a.y * d.height / e);
      f = new m.LatLngBounds(c.fromPointToLatLng(f), c.fromPointToLatLng(e));
      e = {f:"image"};
      e.bounds = f;
      e.format = "png32";
      e.width = d.width;
      e.height = d.height;
      e.imageSR = c.z;
      d = wa(this.c, e)
    }else {
      d = d + "/tile/" + c + "/" + a.y + "/" + a.x
    }
  }
  return d
};
W.prototype.L = function(a) {
  this.e = a;
  var b = this.j;
  for(var c in b) {
    b.hasOwnProperty(c) && y(b[c], a)
  }
};
function I(a, b) {
  b = b || {};
  var c;
  if(b.opacity) {
    this.e = b.opacity;
    delete b.opacity
  }
  w(b, this);
  var d = a;
  if(v(a)) {
    d = [new W(a, b)]
  }else {
    if(a instanceof U) {
      d = [new W(a, b)]
    }else {
      if(a instanceof W) {
        d = [a]
      }else {
        if(a.length > 0 && v(a[0])) {
          d = [];
          for(c = 0;c < a.length;c++) {
            d[c] = new W(a[c], b)
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
    this.tileSize = new m.Size(256, 256)
  }
  if(!this.name) {
    this.name = d[0].name
  }
}
I.prototype.getTile = function(a, b, c) {
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
I.prototype.getTile = I.prototype.getTile;
I.prototype.releaseTile = function(a) {
  if(a.getAttribute("tid")) {
    a = a.getAttribute("tid");
    this.j[a] && delete this.j[a];
    for(var b = 0;b < this.q.length;b++) {
      var c = this.q[b];
      c.j[a] && delete c.j[a]
    }
  }
};
I.prototype.releaseTile = I.prototype.releaseTile;
I.prototype.L = function(a) {
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
function X(a, b) {
  b = b || {};
  this.c = a instanceof U ? a : new U(a);
  this.minZoom = b.minZoom;
  this.maxZoom = b.maxZoom;
  this.e = b.opacity || 1;
  this.ka = b.ua || {};
  this.I = this.D = false;
  this.n = null;
  b.map && this.setMap(b.map);
  this.v = null
}
X.prototype = new m.OverlayView;
X.prototype.onAdd = function() {
  var a = document.createElement("div");
  a.style.position = "absolute";
  a.style.border = "none";
  this.n = a;
  this.getPanes().overlayLayer.appendChild(a);
  this.e && y(a, this.e);
  this.ia = m.event.addListener(this.getMap(), "bounds_changed", ma(this.J, this));
  a = this.getMap();
  a.C = a.C || new m.MVCArray;
  a.C.push(this);
  G(a);
  this.v = a
};
X.prototype.onAdd = X.prototype.onAdd;
X.prototype.onRemove = function() {
  m.event.removeListener(this.ia);
  this.n.parentNode.removeChild(this.n);
  this.n = null;
  var a = this.v, b = a.C;
  if(b) {
    for(var c = 0, d = b.getLength();c < d;c++) {
      if(b.getAt(c) == this) {
        b.removeAt(c);
        break
      }
    }
  }
  G(a);
  this.v = null
};
X.prototype.onRemove = X.prototype.onRemove;
X.prototype.draw = function() {
  if(!this.D || this.I === true) {
    this.J()
  }
};
X.prototype.draw = X.prototype.draw;
X.prototype.L = function(a) {
  this.e = a = Math.min(Math.max(a, 0), 1);
  y(this.n, a)
};
X.prototype.J = function() {
  if(this.D === true) {
    this.I = true
  }else {
    var a = this.getMap(), b = a ? a.getBounds() : null;
    if(b) {
      var c = this.ka;
      c.bounds = b;
      b = o;
      var d = a.getDiv();
      c.width = d.offsetWidth;
      c.height = d.offsetHeight;
      if((a = a.getProjection()) && a instanceof V) {
        b = a.z
      }
      c.imageSR = b;
      x(this, "drawstart");
      var e = this;
      this.D = true;
      this.n.style.backgroundImage = "";
      wa(this.c, c, function(f) {
        e.D = false;
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
            e.L(e.e)
          }
          x(e, "drawend")
        }
      })
    }
  }
};
var za = U, Aa = t, Ba = X, Ca = I;var Y, Z, $, Da;
function Ea() {
  var a = document.getElementById("svc");
  a = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" + a.options[a.selectedIndex].text;
  if(Z != null) {
    if(Z instanceof Ba) {
      Z.setMap(null)
    }else {
      Z instanceof Ca && Y.overlayMapTypes.removeAt(0)
    }
    Z = null
  }
  $ = new za(a);
  google.maps.event.addListener($, "load", function() {
    var b;
    b = $.initialExtent ? ka($.initialExtent) : null;
    if(b) {
      if(b.getSouthWest().lng() > b.getNorthEast().lng()) {
        Y.setCenter(new google.maps.LatLng(40, -100));
        Y.setZoom(4)
      }else {
        b.contains(Y.getCenter()) || Y.fitBounds(b)
      }
    }
    b = document.getElementById("op").value;
    if($.singleFusedMapCache) {
      Z = new Ca($, {opacity:b});
      Y.overlayMapTypes.insertAt(0, Z)
    }else {
      Z = new Ba($, {opacity:b});
      Z.setMap(Y)
    }
    b = "This is a <b>dynamic</b> map svc. You can turn on/off individual layers using the check box.";
    if($.singleFusedMapCache) {
      b = "This is a <b>cached</b> map svc. You can <b>NOT</b> turn on/off individual layers."
    }
    document.getElementById("svcInfo").innerHTML = b;
    document.getElementById("svcDesc").innerHTML = $.description + "<br/>Copyright:" + $.copyrightText;
    b = ' <select id="clickOpts" style="font-size:9pt;width:200px" onchange="onClickOptionChanged()">';
    b += '<option value="top">&lt;Top-most layer&gt;</option>';
    b += '<option value="visible">&lt;Visible layers&gt;</option>';
    b += '<option value="all">&lt;All layers&gt;</option>';
    for(var c = $.layers, d = 0;d < c.length;d++) {
      var e = c[d];
      google.maps.event.addListenerOnce(e, "load", Fa);
      e.load();
      e.subLayerIds || (b += '<option value="all:' + d + '">' + e.name + "</option>")
    }
    document.getElementById("clickOptsDiv").innerHTML = b + "</select>"
  })
}
function Fa() {
  if(Z && $.o) {
    for(var a = "", b = 5.91657527591555E8 / Math.pow(2, Y.getZoom()), c = $.layers, d = 0;d < c.length;d++) {
      var e = c[d], f;
      f = e.pa && e.pa > b ? false : e.qa && e.qa < b ? false : true;
      a += '<div style="color:' + (f ? "black" : "gray") + '">';
      if(e.subLayerIds) {
        a += e.name + "(group)<br/>"
      }else {
        if(e.ra) {
          a += "&nbsp;&nbsp;&nbsp;&nbsp;"
        }
        a += '<input type="checkbox" id="layer' + e.id + '"';
        if(e.visible) {
          a += ' checked="checked"'
        }
        if(!f || $.singleFusedMapCache) {
          a += ' disabled="disabled"'
        }
        a += ' onclick="setLayerVisibility()">' + e.name + "<br/>"
      }
      a += "</div>"
    }
    document.getElementById("toc").innerHTML = a
  }
}
function Ga(a) {
  if(a) {
    var b = document.getElementById("clickOpts").value;
    if(Z && $.o) {
      xa($, {geometry:a, layerOption:b || "top", tolerance:5, bounds:Y.getBounds(), width:Y.getDiv().offsetWidth, height:Y.getDiv().offsetHeight, returnGeometry:false}, function(c, d) {
        if(d) {
          alert(d.message + "\n" + d.details.join("\n"))
        }else {
          if(c.results) {
            var e = "";
            if(c.results) {
              e += "Total # of Results:" + c.results.length;
              for(var f = 0, j = c.results.length;f < j;f++) {
                var h = c.results[f];
                if(f > 0) {
                  e += "<hr/>"
                }
                e += "<div>Result #" + (f + 1) + ": <i>" + h.value + "</i><br/><table>";
                e += "<tr><td>From layer: <b>" + h.layerName + "</b></td></tr>";
                e += '<tr><td > <table style="font-size:9pt">';
                h = h.la.attributes;
                for(var g in h) {
                  if(h.hasOwnProperty(g)) {
                    e += "<tr>";
                    e += '<td style="background-color:#DDDDDD;">' + g + "</td>";
                    var l = h[g];
                    e += "<td>" + (l === null || typeof l === "undefined" ? "" : "" + l) + "</td></tr>"
                  }
                }
                e += "</table></td></tr></table></div>"
              }
              document.getElementById("info").innerHTML = e;
              if(Da == null) {
                Da = new google.maps.Marker({position:a, map:Y})
              }else {
                Da.setPosition(a)
              }
            }
          }
        }
      })
    }
  }
}
window.onload = function() {
  var a = {zoom:4, center:new google.maps.LatLng(40, -100), mapTypeId:google.maps.MapTypeId.ROADMAP, draggableCursor:"default"};
  Y = new google.maps.Map(document.getElementById("map_canvas"), a);
  Ea();
  google.maps.event.addListener(Y, "click", function(b) {
    Ga(b.latLng)
  });
  google.maps.event.addListener(Y, "zoom_changed", Fa);
  google.maps.event.addListener(Aa, "jsonpstart", function() {
    document.getElementById("working").style.visibility = "visible"
  });
  google.maps.event.addListener(Aa, "jsonpend", function() {
    document.getElementById("working").style.visibility = "hidden"
  })
};
window.setLayerVisibility = function() {
  for(var a = $.layers, b = 0;b < a.length;b++) {
    var c = document.getElementById("layer" + a[b].id);
    if(c) {
      a[b].visible = c.checked === true
    }
  }
  Z.J()
};
window.loadMapService = Ea;
window.setOVOpacity = function(a) {
  Z && Z.L(a)
};})()
