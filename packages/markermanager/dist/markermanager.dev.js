this.google = this.google || {};
this.google.maps = this.google.maps || {};
this.google.maps.plugins = this.google.maps.plugins || {};
this.google.maps.plugins.markermanager = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;
	var objectPropertyIsEnumerable = {
	  f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document) && isObject(document.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document.createElement(it) : {};
	};

	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};
	var objectGetOwnPropertyDescriptor = {
	  f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var objectDefineProperty = {
	  f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	  (module.exports = function (key, value) {
	    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: '3.6.4',
	    mode:  'global',
	    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	  var getInternalState = internalState.get;
	  var enforceInternalState = internalState.enforce;
	  var TEMPLATE = String(String).split('String');
	  (module.exports = function (O, key, value, options) {
	    var unsafe = options ? !!options.unsafe : false;
	    var simple = options ? !!options.enumerable : false;
	    var noTargetGet = options ? !!options.noTargetGet : false;

	    if (typeof value == 'function') {
	      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }

	    if (O === global_1) {
	      if (simple) O[key] = value;else setGlobal(key, value);
	      return;
	    } else if (!unsafe) {
	      delete O[key];
	    } else if (!noTargetGet && O[key]) {
	      simple = true;
	    }

	    if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  })(Function.prototype, 'toString', function toString() {
	    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	  });
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
	  f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;
	var objectGetOwnPropertySymbols = {
	  f: f$4
	};

	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	// https://tc39.github.io/ecma262/#sec-toobject

	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// https://tc39.github.io/ecma262/#sec-isarray

	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) {
	  throw it;
	};

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;
	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = {
	      length: -1
	    };
	    if (ACCESSORS) defineProperty(O, 1, {
	      enumerable: true,
	      get: thrower
	    });else O[1] = 1;
	    method.call(O, argument0, argument1);
	  });
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH = arrayMethodUsesToLength('splice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var max$1 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$1(toInteger(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }

	    A.length = actualDeleteCount;

	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }

	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }
	    }

	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }

	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	/**
	 * Copyright 2019 Google LLC. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * @ignore
	 *
	 * @param lng
	 */
	function lngToX(lng) {
	  return 1 + lng / 180;
	}
	/**
	 * @ignore
	 *
	 * @param {number} lat
	 * @returns {number}
	 */


	function latToY(lat) {
	  var sinofphi = Math.sin(lat * Math.PI / 180);
	  return 1 - 0.5 / Math.PI * Math.log((1 + sinofphi) / (1 - sinofphi));
	}
	/**
	 * @ignore
	 *
	 * @param latlng
	 * @param zoom
	 */


	function latLngToPixel(latlng, zoom) {
	  return new google.maps.Point(~~(0.5 + lngToX(latlng.lng()) * (2 << zoom + 6)), ~~(0.5 + latToY(latlng.lat()) * (2 << zoom + 6)));
	}

	/**
	 * Copyright 2019 Google LLC. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Helper class to create a bounds of INT ranges.
	 * @ignore
	 */
	var GridBounds = /*#__PURE__*/function () {
	  /**
	   *
	   * @param bounds
	   * @param z
	   */
	  function GridBounds(bounds, z) {
	    _classCallCheck(this, GridBounds);

	    // [sw, ne]
	    this.z = z;
	    this.minX = Math.min(bounds[0].x, bounds[1].x);
	    this.maxX = Math.max(bounds[0].x, bounds[1].x);
	    this.minY = Math.min(bounds[0].y, bounds[1].y);
	    this.maxY = Math.max(bounds[0].y, bounds[1].y);
	  }
	  /**
	   * Returns true if this bounds equal the given bounds.
	   * @param {GridBounds} gridBounds GridBounds The bounds to test.
	   * @return {Boolean} This Bounds equals the given GridBounds.
	   */


	  _createClass(GridBounds, [{
	    key: "equals",
	    value: function equals(gridBounds) {
	      if (this.maxX === gridBounds.maxX && this.maxY === gridBounds.maxY && this.minX === gridBounds.minX && this.minY === gridBounds.minY) {
	        return true;
	      } else {
	        return false;
	      }
	    }
	    /**
	     * Returns true if this bounds (inclusively) contains the given point.
	     * @param {Point} point  The point to test.
	     * @return {Boolean} This Bounds contains the given Point.
	     */

	  }, {
	    key: "containsPoint",
	    value: function containsPoint(point) {
	      return this.minX <= point.x && this.maxX >= point.x && this.minY <= point.y && this.maxY >= point.y;
	    }
	  }]);

	  return GridBounds;
	}();

	/**
	 * Creates a new MarkerManager that will show/hide markers on a map.
	 */

	var MarkerManager = /*#__PURE__*/function () {
	  /**
	   * @constructor
	   * @param map The map to manage.
	   * @param {Options} options
	   */
	  function MarkerManager(map, _ref) {
	    var _this = this;

	    var _ref$maxZoom = _ref.maxZoom,
	        maxZoom = _ref$maxZoom === void 0 ? 19 : _ref$maxZoom,
	        trackMarkers = _ref.trackMarkers,
	        _ref$shown = _ref.shown,
	        shown = _ref$shown === void 0 ? true : _ref$shown,
	        _ref$borderPadding = _ref.borderPadding,
	        borderPadding = _ref$borderPadding === void 0 ? 100 : _ref$borderPadding;

	    _classCallCheck(this, MarkerManager);

	    this._tileSize = 1024;
	    this._map = map;
	    this._mapZoom = map.getZoom();
	    this._maxZoom = maxZoom;
	    this._trackMarkers = trackMarkers; // The padding in pixels beyond the viewport, where we will pre-load markers.

	    this._swPadding = new google.maps.Size(-borderPadding, borderPadding);
	    this._nePadding = new google.maps.Size(borderPadding, -borderPadding);
	    this._gridWidth = {};
	    this._grid = [];
	    this._grid[this._maxZoom] = [];
	    this._numMarkers = {};
	    this._numMarkers[this._maxZoom] = 0;
	    this.shownMarkers = 0;
	    this.shown = shown;
	    google.maps.event.addListenerOnce(map, "idle", function () {
	      _this._initialize();
	    });
	  }

	  _createClass(MarkerManager, [{
	    key: "_initialize",
	    value: function _initialize() {
	      var mapTypes = this._map.mapTypes; // Find max zoom level

	      for (var sType in mapTypes) {
	        if (sType in mapTypes && mapTypes.get(sType) && mapTypes.get(sType).maxZoom === "number") {
	          var mapTypeMaxZoom = this._map.mapTypes.get(sType).maxZoom;
	        }
	      }

	      google.maps.event.addListener(this._map, "dragend", this._onMapMoveEnd.bind(this));
	      google.maps.event.addListener(this._map, "idle", this._onMapMoveEnd.bind(this));
	      google.maps.event.addListener(this._map, "zoom_changed", this._onMapMoveEnd.bind(this));
	      this.resetManager();
	      this._shownBounds = this._getMapGridBounds();
	      google.maps.event.trigger(this, "loaded");
	    }
	    /**
	     * This closure provide easy access to the map.
	     * They are used as callbacks, not as methods.
	     * @param marker Marker to be removed from the map
	     */

	  }, {
	    key: "_removeOverlay",
	    value: function _removeOverlay(marker) {
	      marker.setMap(null);
	      this.shownMarkers--;
	    }
	    /**
	     * This closure provide easy access to the map.
	     * They are used as callbacks, not as methods.
	     * @param marker Marker to be added to the map
	     */

	  }, {
	    key: "_addOverlay",
	    value: function _addOverlay(marker) {
	      if (this.shown) {
	        marker.setMap(this._map);
	        this.shownMarkers++;
	      }
	    }
	    /**
	     * Initializes MarkerManager arrays for all zoom levels
	     * Called by constructor and by clearAllMarkers
	     */

	  }, {
	    key: "resetManager",
	    value: function resetManager() {
	      var mapWidth = 256;

	      for (var zoom = 0; zoom <= this._maxZoom; ++zoom) {
	        this._grid[zoom] = [];
	        this._numMarkers[zoom] = 0;
	        this._gridWidth[zoom] = Math.ceil(mapWidth / this._tileSize);
	        mapWidth <<= 1;
	      }
	    }
	    /**
	     * Removes all markers in the manager, and
	     * removes any visible markers from the map.
	     */

	  }, {
	    key: "clearMarkers",
	    value: function clearMarkers() {
	      this._processAll(this._shownBounds, this._removeOverlay.bind(this));

	      this.resetManager();
	    }
	    /**
	     * Gets the tile coordinate for a given latlng point.
	     *
	     * @param {LatLng} latlng The geographical point.
	     * @param {Number} zoom The zoom level.
	     * @param {google.maps.Size} padding The padding used to shift the pixel coordinate.
	     *               Used for expanding a bounds to include an extra padding
	     *               of pixels surrounding the bounds.
	     * @return {GPoint} The point in tile coordinates.
	     *
	     */

	  }, {
	    key: "_getTilePoint",
	    value: function _getTilePoint(latlng, zoom, padding) {
	      var pixelPoint = latLngToPixel(latlng, zoom);
	      var point = new google.maps.Point(Math.floor((pixelPoint.x + padding.width) / this._tileSize), Math.floor((pixelPoint.y + padding.height) / this._tileSize));
	      return point;
	    }
	    /**
	     * Finds the appropriate place to add the marker to the grid.
	     * Optimized for speed; does not actually add the marker to the map.
	     * Designed for batch-_processing thousands of markers.
	     *
	     * @param {Marker} marker The marker to add.
	     * @param {Number} minZoom The minimum zoom for displaying the marker.
	     * @param {Number} maxZoom The maximum zoom for displaying the marker.
	     */

	  }, {
	    key: "_addMarkerBatch",
	    value: function _addMarkerBatch(marker, minZoom, maxZoom) {
	      var mPoint = marker.getPosition();
	      marker.set("__minZoom", minZoom); // Tracking markers is expensive, so we do this only if the
	      // user explicitly requested it when creating marker manager.

	      if (this._trackMarkers) {
	        google.maps.event.addListener(marker, "changed", function (a, b, c) {
	          this._onMarkerMoved(a, b, c);
	        });
	      }

	      var gridPoint = this._getTilePoint(mPoint, maxZoom, new google.maps.Size(0, 0));

	      for (var zoom = maxZoom; zoom >= minZoom; zoom--) {
	        var cell = this._getGridCellCreate(gridPoint.x, gridPoint.y, zoom);

	        cell.push(marker);
	        gridPoint.x = gridPoint.x >> 1;
	        gridPoint.y = gridPoint.y >> 1;
	      }
	    }
	    /**
	     * Returns whether or not the given point is visible in the shown bounds. This
	     * is a helper method that takes care of the corner case, when shownBounds have
	     * negative minX value.
	     *
	     * @param {Point} point a point on a grid.
	     * @return {Boolean} Whether or not the given point is visible in the currently
	     * shown bounds.
	     */

	  }, {
	    key: "_isGridPointVisible",
	    value: function _isGridPointVisible(point) {
	      var vertical = this._shownBounds.minY <= point.y && point.y <= this._shownBounds.maxY;
	      var minX = this._shownBounds.minX;
	      var horizontal = minX <= point.x && point.x <= this._shownBounds.maxX;

	      if (!horizontal && minX < 0) {
	        // Shifts the negative part of the rectangle. As point.x is always less
	        // than grid width, only test shifted minX .. 0 part of the shown bounds.
	        var width = this._gridWidth[this._shownBounds.z];
	        horizontal = minX + width <= point.x && point.x <= width - 1;
	      }

	      return vertical && horizontal;
	    }
	    /**
	     * Reacts to a notification from a marker that it has moved to a new location.
	     * It scans the grid all all zoom levels and moves the marker from the old grid
	     * location to a new grid location.
	     *
	     * @param {Marker} marker The marker that moved.
	     * @param {LatLng} oldPoint The old position of the marker.
	     * @param {LatLng} newPoint The new position of the marker.
	     */

	  }, {
	    key: "_onMarkerMoved",
	    value: function _onMarkerMoved(marker, oldPoint, newPoint) {
	      // NOTE: We do not know the minimum or maximum zoom the marker was
	      // added at, so we start at the absolute maximum. Whenever we successfully
	      // remove a marker at a given zoom, we add it at the new grid coordinates.
	      var zoom = this._maxZoom;
	      var changed = false;

	      var oldGrid = this._getTilePoint(oldPoint, zoom, new google.maps.Size(0, 0));

	      var newGrid = this._getTilePoint(newPoint, zoom, new google.maps.Size(0, 0));

	      while (zoom >= 0 && (oldGrid.x !== newGrid.x || oldGrid.y !== newGrid.y)) {
	        var cell = this._getGridCellNoCreate(oldGrid.x, oldGrid.y, zoom);

	        if (cell) {
	          if (this._removeMarkerFromCell(cell, marker)) {
	            this._getGridCellCreate(newGrid.x, newGrid.y, zoom).push(marker);
	          }
	        } // For the current zoom we also need to update the map. Markers that no
	        // longer are visible are removed from the map. Markers that moved into
	        // the shown bounds are added to the map. This also lets us keep the count
	        // of visible markers up to date.


	        if (zoom === this._mapZoom) {
	          if (this._isGridPointVisible(oldGrid)) {
	            if (!this._isGridPointVisible(newGrid)) {
	              this._removeOverlay(marker);

	              changed = true;
	            }
	          } else {
	            if (this._isGridPointVisible(newGrid)) {
	              this._addOverlay(marker);

	              changed = true;
	            }
	          }
	        }

	        oldGrid.x = oldGrid.x >> 1;
	        oldGrid.y = oldGrid.y >> 1;
	        newGrid.x = newGrid.x >> 1;
	        newGrid.y = newGrid.y >> 1;
	        --zoom;
	      }

	      if (changed) {
	        this._notifyListeners();
	      }
	    }
	    /**
	     * Removes marker from the manager and from the map
	     * (if it's currently visible).
	     * @param {GMarker} marker The marker to delete.
	     */

	  }, {
	    key: "removeMarker",
	    value: function removeMarker(marker) {
	      var zoom = this._maxZoom;
	      var changed = false;
	      var point = marker.getPosition();

	      var grid = this._getTilePoint(point, zoom, new google.maps.Size(0, 0));

	      while (zoom >= 0) {
	        var cell = this._getGridCellNoCreate(grid.x, grid.y, zoom);

	        if (cell) {
	          this._removeMarkerFromCell(cell, marker);
	        } // For the current zoom we also need to update the map. Markers that no
	        // longer are visible are removed from the map. This also lets us keep the count
	        // of visible markers up to date.


	        if (zoom === this._mapZoom) {
	          if (this._isGridPointVisible(grid)) {
	            this._removeOverlay(marker);

	            changed = true;
	          }
	        }

	        grid.x = grid.x >> 1;
	        grid.y = grid.y >> 1;
	        --zoom;
	      }

	      if (changed) {
	        this._notifyListeners();
	      }

	      this._numMarkers[marker.get("__minZoom")]--;
	    }
	    /**
	     * Add many markers at once.
	     * Does not actually update the map, just the internal grid.
	     *
	     * @param {Array of Marker} markers The markers to add.
	     * @param {Number} minZoom The minimum zoom level to display the markers.
	     * @param {Number} maxZoom The maximum zoom level to display the markers.
	     */

	  }, {
	    key: "addMarkers",
	    value: function addMarkers(markers, minZoom, maxZoom) {
	      maxZoom = this._getOptmaxZoom(maxZoom);

	      for (var i = markers.length - 1; i >= 0; i--) {
	        this._addMarkerBatch(markers[i], minZoom, maxZoom);
	      }

	      this._numMarkers[minZoom] += markers.length;
	    }
	    /**
	     * Returns the value of the optional maximum zoom. This method is defined so
	     * that we have just one place where optional maximum zoom is calculated.
	     *
	     * @param {Number} maxZoom The optinal maximum zoom.
	     * @return The maximum zoom.
	     */

	  }, {
	    key: "_getOptmaxZoom",
	    value: function _getOptmaxZoom(maxZoom) {
	      return maxZoom || this._maxZoom;
	    }
	    /**
	     * Calculates the total number of markers potentially visible at a given
	     * zoom level.
	     *
	     * @param {Number} zoom The zoom level to check.
	     */

	  }, {
	    key: "getMarkerCount",
	    value: function getMarkerCount(zoom) {
	      var total = 0;

	      for (var z = 0; z <= zoom; z++) {
	        total += this._numMarkers[z];
	      }

	      return total;
	    }
	    /**
	     * Returns a marker given latitude, longitude and zoom. If the marker does not
	     * exist, the method will return a new marker. If a new marker is created,
	     * it will NOT be added to the manager.
	     *
	     * @param {Number} lat - the latitude of a marker.
	     * @param {Number} lng - the longitude of a marker.
	     * @param {Number} zoom - the zoom level
	     * @return {GMarker} marker - the marker found at lat and lng
	     */

	  }, {
	    key: "getMarker",
	    value: function getMarker(lat, lng, zoom) {
	      var mPoint = new google.maps.LatLng(lat, lng);

	      var gridPoint = this._getTilePoint(mPoint, zoom, new google.maps.Size(0, 0));

	      var marker = new google.maps.Marker({
	        position: mPoint
	      });

	      var cell = this._getGridCellNoCreate(gridPoint.x, gridPoint.y, zoom);

	      if (cell !== undefined) {
	        for (var i = 0; i < cell.length; i++) {
	          if (lat === cell[i].getPosition().lat() && lng === cell[i].getPosition().lng()) {
	            marker = cell[i];
	          }
	        }
	      }

	      return marker;
	    }
	    /**
	     * Add a single marker to the map.
	     *
	     * @param {Marker} marker The marker to add.
	     * @param {Number} minZoom The minimum zoom level to display the marker.
	     * @param {Number} maxZoom The maximum zoom level to display the marker.
	     */

	  }, {
	    key: "addMarker",
	    value: function addMarker(marker, minZoom, maxZoom) {
	      maxZoom = this._getOptmaxZoom(maxZoom);

	      this._addMarkerBatch(marker, minZoom, maxZoom);

	      var gridPoint = this._getTilePoint(marker.getPosition(), this._mapZoom, new google.maps.Size(0, 0));

	      if (this._isGridPointVisible(gridPoint) && minZoom <= this._shownBounds.z && this._shownBounds.z <= maxZoom) {
	        this._addOverlay(marker);

	        this._notifyListeners();
	      }

	      this._numMarkers[minZoom]++;
	    }
	    /**
	     * Get a cell in the grid, creating it first if necessary.
	     *
	     * Optimization candidate
	     *
	     * @param {Number} x The x coordinate of the cell.
	     * @param {Number} y The y coordinate of the cell.
	     * @param {Number} z The z coordinate of the cell.
	     * @return {Array} The cell in the array.
	     */

	  }, {
	    key: "_getGridCellCreate",
	    value: function _getGridCellCreate(x, y, z) {
	      // TODO(jpoehnelt) document this
	      if (x < 0) {
	        x += this._gridWidth[z];
	      }

	      if (!this._grid[z]) {
	        this._grid[z] = [];
	      }

	      if (!this._grid[z][x]) {
	        this._grid[z][x] = [];
	      }

	      if (!this._grid[z][x][y]) {
	        this._grid[z][x][y] = [];
	      }

	      return this._grid[z][x][y];
	    }
	    /**
	     * Get a cell in the grid, returning undefined if it does not exist.
	     *
	     * NOTE: Optimized for speed -- otherwise could combine with _getGridCellCreate.
	     *
	     * @param {Number} x The x coordinate of the cell.
	     * @param {Number} y The y coordinate of the cell.
	     * @param {Number} z The z coordinate of the cell.
	     * @return {Array} The cell in the array.
	     */

	  }, {
	    key: "_getGridCellNoCreate",
	    value: function _getGridCellNoCreate(x, y, z) {
	      if (x < 0) {
	        x += this._gridWidth[z];
	      }

	      if (!this._grid[z]) {
	        return null;
	      }

	      if (!this._grid[z][x]) {
	        return null;
	      }

	      if (!this._grid[z][x][y]) {
	        return null;
	      }

	      return this._grid[z][x][y];
	    }
	    /**
	     * Turns at geographical bounds into a grid-space bounds.
	     *
	     * @param {LatLngBounds} bounds The geographical bounds.
	     * @param {Number} zoom The zoom level of the bounds.
	     * @param {google.maps.Size} swPadding The padding in pixels to extend beyond the
	     * given bounds.
	     * @param {google.maps.Size} nePadding The padding in pixels to extend beyond the
	     * given bounds.
	     * @return {GridBounds} The bounds in grid space.
	     */

	  }, {
	    key: "_getGridBounds",
	    value: function _getGridBounds(bounds, zoom, swPadding, nePadding) {
	      zoom = Math.min(zoom, this._maxZoom);
	      var bl = bounds.getSouthWest();
	      var tr = bounds.getNorthEast();

	      var sw = this._getTilePoint(bl, zoom, swPadding);

	      var ne = this._getTilePoint(tr, zoom, nePadding);

	      var gw = this._gridWidth[zoom]; // Crossing the prime meridian requires correction of bounds.

	      if (tr.lng() < bl.lng() || ne.x < sw.x) {
	        sw.x -= gw;
	      }

	      if (ne.x - sw.x + 1 >= gw) {
	        // Computed grid bounds are larger than the world; truncate.
	        sw.x = 0;
	        ne.x = gw - 1;
	      }

	      var gridBounds = new GridBounds([sw, ne], zoom);
	      gridBounds.z = zoom;
	      return gridBounds;
	    }
	    /**
	     * Gets the grid-space bounds for the current map viewport.
	     *
	     * @return {Bounds} The bounds in grid space.
	     */

	  }, {
	    key: "_getMapGridBounds",
	    value: function _getMapGridBounds() {
	      return this._getGridBounds(this._map.getBounds(), this._mapZoom, this._swPadding, this._nePadding);
	    }
	    /**
	     * Event listener for map:movend.
	     * NOTE: Use a timeout so that the user is not blocked
	     * from moving the map.
	     *
	     * Removed this because a a lack of a scopy override/callback function on events.
	     */

	  }, {
	    key: "_onMapMoveEnd",
	    value: function _onMapMoveEnd() {
	      window.setTimeout(this._updateMarkers.bind(this), 0);
	    }
	    /**
	     * Is this layer visible?
	     *
	     * Returns visibility setting
	     *
	     * @return {Boolean} Visible
	     */

	  }, {
	    key: "visible",
	    value: function visible() {
	      return this.shown ? true : false;
	    }
	    /**
	     * Returns true if the manager is hidden.
	     * Otherwise returns false.
	     * @return {Boolean} Hidden
	     */

	  }, {
	    key: "isHidden",
	    value: function isHidden() {
	      return !this.shown;
	    }
	    /**
	     * Shows the manager if it's currently hidden.
	     */

	  }, {
	    key: "show",
	    value: function show() {
	      this.shown = true;
	      this.refresh();
	    }
	    /**
	     * Hides the manager if it's currently visible
	     */

	  }, {
	    key: "hide",
	    value: function hide() {
	      this.shown = false;
	      this.refresh();
	    }
	    /**
	     * Toggles the visibility of the manager.
	     */

	  }, {
	    key: "toggle",
	    value: function toggle() {
	      this.shown = !this.shown;
	      this.refresh();
	    }
	    /**
	     * Refresh forces the marker-manager into a good state.
	     * <ol>
	     *   <li>If never before initialized, shows all the markers.</li>
	     *   <li>If previously initialized, removes and re-adds all markers.</li>
	     * </ol>
	     */

	  }, {
	    key: "refresh",
	    value: function refresh() {
	      if (this.shownMarkers > 0) {
	        this._processAll(this._shownBounds, this._removeOverlay.bind(this));
	      } // An extra check on this.show to increase performance (no need to _processAll_)


	      if (this.show) {
	        this._processAll(this._shownBounds, this._addOverlay.bind(this));
	      }

	      this._notifyListeners();
	    }
	    /**
	     * After the viewport may have changed, add or remove markers as needed.
	     */

	  }, {
	    key: "_updateMarkers",
	    value: function _updateMarkers() {
	      this._mapZoom = this._map.getZoom();

	      var newBounds = this._getMapGridBounds(); // If the move does not include new grid sections,
	      // we have no work to do:


	      if (newBounds.equals(this._shownBounds) && newBounds.z === this._shownBounds.z) {
	        return;
	      }

	      if (newBounds.z !== this._shownBounds.z) {
	        this._processAll(this._shownBounds, this._removeOverlay.bind(this));

	        if (this.show) {
	          // performance
	          this._processAll(newBounds, this._addOverlay.bind(this));
	        }
	      } else {
	        // Remove markers:
	        this._rectangleDiff(this._shownBounds, newBounds, this._removeCellMarkers.bind(this)); // Add markers:


	        if (this.show) {
	          // performance
	          this._rectangleDiff(newBounds, this._shownBounds, this._addCellMarkers.bind(this));
	        }
	      }

	      this._shownBounds = newBounds;

	      this._notifyListeners();
	    }
	    /**
	     * Notify listeners when the state of what is displayed changes.
	     */

	  }, {
	    key: "_notifyListeners",
	    value: function _notifyListeners() {
	      google.maps.event.trigger(this, "changed", this._shownBounds, this.shownMarkers);
	    }
	    /**
	     * Process all markers in the bounds provided, using a callback.
	     *
	     * @param {Bounds} bounds The bounds in grid space.
	     * @param {Function} callback The function to call for each marker.
	     */

	  }, {
	    key: "_processAll",
	    value: function _processAll(bounds, callback) {
	      for (var x = bounds.minX; x <= bounds.maxX; x++) {
	        for (var y = bounds.minY; y <= bounds.maxY; y++) {
	          this._processCellMarkers(x, y, bounds.z, callback);
	        }
	      }
	    }
	    /**
	     * Process all markers in the grid cell, using a callback.
	     *
	     * @param {Number} x The x coordinate of the cell.
	     * @param {Number} y The y coordinate of the cell.
	     * @param {Number} z The z coordinate of the cell.
	     * @param {Function} callback The function to call for each marker.
	     */

	  }, {
	    key: "_processCellMarkers",
	    value: function _processCellMarkers(x, y, z, callback) {
	      var cell = this._getGridCellNoCreate(x, y, z);

	      if (cell) {
	        for (var i = cell.length - 1; i >= 0; i--) {
	          callback(cell[i]);
	        }
	      }
	    }
	    /**
	     * Remove all markers in a grid cell.
	     *
	     * @param {Number} x The x coordinate of the cell.
	     * @param {Number} y The y coordinate of the cell.
	     * @param {Number} z The z coordinate of the cell.
	     */

	  }, {
	    key: "_removeCellMarkers",
	    value: function _removeCellMarkers(x, y, z) {
	      this._processCellMarkers(x, y, z, this._removeOverlay.bind(this));
	    }
	    /**
	     * Add all markers in a grid cell.
	     *
	     * @param {Number} x The x coordinate of the cell.
	     * @param {Number} y The y coordinate of the cell.
	     * @param {Number} z The z coordinate of the cell.
	     */

	  }, {
	    key: "_addCellMarkers",
	    value: function _addCellMarkers(x, y, z) {
	      this._processCellMarkers(x, y, z, this._addOverlay.bind(this));
	    }
	    /**
	     * Use the _rectangleDiffCoords function to process all grid cells
	     * that are in bounds1 but not bounds2, using a callback, and using
	     * the current MarkerManager object as the instance.
	     *
	     * Pass the z parameter to the callback in addition to x and y.
	     *
	     * @param {Bounds} bounds1 The bounds of all points we may _process.
	     * @param {Bounds} bounds2 The bounds of points to exclude.
	     * @param {Function} callback The callback function to call
	     *                   for each grid coordinate (x, y, z).
	     */

	  }, {
	    key: "_rectangleDiff",
	    value: function _rectangleDiff(bounds1, bounds2, callback) {
	      this._rectangleDiffCoords(bounds1, bounds2, function (x, y) {
	        callback(x, y, bounds1.z);
	      });
	    }
	    /**
	     * Calls the function for all points in bounds1, not in bounds2
	     *
	     * @param {Bounds} bounds1 The bounds of all points we may process.
	     * @param {Bounds} bounds2 The bounds of points to exclude.
	     * @param {Function} callback The callback function to call
	     *                   for each grid coordinate.
	     */

	  }, {
	    key: "_rectangleDiffCoords",
	    value: function _rectangleDiffCoords(bounds1, bounds2, callback) {
	      var minX1 = bounds1.minX;
	      var minY1 = bounds1.minY;
	      var maxX1 = bounds1.maxX;
	      var maxY1 = bounds1.maxY;
	      var minX2 = bounds2.minX;
	      var minY2 = bounds2.minY;
	      var maxX2 = bounds2.maxX;
	      var maxY2 = bounds2.maxY;
	      var x, y;

	      for (x = minX1; x <= maxX1; x++) {
	        // All x in R1
	        // All above:
	        for (y = minY1; y <= maxY1 && y < minY2; y++) {
	          // y in R1 above R2
	          callback(x, y);
	        } // All below:


	        for (y = Math.max(maxY2 + 1, minY1); // y in R1 below R2
	        y <= maxY1; y++) {
	          callback(x, y);
	        }
	      }

	      for (y = Math.max(minY1, minY2); y <= Math.min(maxY1, maxY2); y++) {
	        // All y in R2 and in R1
	        // Strictly left:
	        for (x = Math.min(maxX1 + 1, minX2) - 1; x >= minX1; x--) {
	          // x in R1 left of R2
	          callback(x, y);
	        } // Strictly right:


	        for (x = Math.max(minX1, maxX2 + 1); // x in R1 right of R2
	        x <= maxX1; x++) {
	          callback(x, y);
	        }
	      }
	    }
	    /**
	     * Removes marker from cell. O(N).
	     */

	  }, {
	    key: "_removeMarkerFromCell",
	    value: function _removeMarkerFromCell(cell, marker) {
	      var shift = 0;

	      for (var i = 0; i < cell.length; ++i) {
	        if (cell[i] === marker) {
	          cell.splice(i--, 1);
	          shift++;
	        }
	      }

	      return shift;
	    }
	  }]);

	  return MarkerManager;
	}();

	exports.MarkerManager = MarkerManager;

	return exports;

}({}));
