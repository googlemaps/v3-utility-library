function publish(symbolSet) {
  // semi-required configuration options
  publish.conf = {
    ext: "",
    outDir: JSDOC.opt.d,
    templatesDir: JSDOC.opt.t,
    symbolsDir: "reference.html#"
  };

  // used to check the details of things being linked to
  Link.symbolSet = symbolSet;

  // Populate the library-wide properties
  function isaFile($) {return $.is("FILE");}
  var file = symbolSet.toArray().filter(isaFile)[0];
  var templateValues = {
    "library" : {
      "name": file.comment.getTag("name"),
      "version": file.version,
      "desc": file.desc
    },
    "objects": []
  };

  // Find the top-level objects - class, enum, function, interface, namespace
  function isaTopLevelObject($) {return (
    ($.is("CONSTRUCTOR") && $.name.match(/^[A-Z][A-Za-z]+/)) ||
    ($.is("FUNCTION") && $.name.match(/^[A-Z][A-Za-z]+/)) ||
    $.comment.getTag("enum")[0] ||
    $.comment.getTag("interface")[0] ||
    $.isNamespace
  );}

  // Find the second-level objects - Properties, Constructor, Methods, Constants, Events
  function isaSecondLevelObject ($) {return (
    $.comment.getTag("property").length ||
    ($.is("CONSTRUCTOR") && $.name.match(/^[A-Z][A-Za-z]+$/)) ||
    ($.is("FUNCTION") && $.name.match(/^[a-z][A-Za-z]+$/)) ||
    $.isConstant ||
    ($.type == "Function" && $.is("OBJECT"))
  );}
  function hasProperties ($) {
    return ($.comment.getTag("property").length);
  }
  function isaConstructor ($) {
    return ($.is("CONSTRUCTOR") && $.name.match(/^[A-Z][A-Za-z]+$/));
  }
  function isaMethod ($) {
    return (
      $.is("FUNCTION") &&
      $.name.match(/^[a-z][A-Za-z]+$/) &&
      !$.isEvent &&
      !$.isPrivate
    );
  }
  function isaConstant ($) {
    return $.isConstant;
  }
  function isaEvent ($) {
    return $.isEvent;
  }

  var topLevelObjects = symbolSet.toArray().filter(function ($) {return !(
    $.srcFile.match(/_packed/) ||
    $.name === "_global_"
  );}).filter(isaTopLevelObject).sort(makeSortby("alias"));
  for (var i = 0; i < topLevelObjects.length; i++) {
    var topLevelObject = topLevelObjects[i];
    var constructedTopLevelObject = {
      "name": topLevelObject.name,
      "desc": topLevelObject.classDesc,
      "anchor": topLevelObject.alias,
      "properties": []
    };
    // Determine the type of top-level object - class, enum, function, interface, or namespace
    if (topLevelObject.is("CONSTRUCTOR") && topLevelObject.name.match(/^[A-Z][A-Za-z]+$/)) {
      constructedTopLevelObject.type = "class";
      if (topLevelObject.augments.length) {
        for (ancestor in topLevelObject.augments) {
          constructedTopLevelObject.desc += "  This class extends {@link " + topLevelObject.augments[ancestor] + "}.";
        }
      }
      if (constructedTopLevelObject.name.match(/Options$/)) {
        constructedTopLevelObject.desc += "  There is no constructor for this class.  Instead, this class is instantiated as a javascript object literal.";
      }
    } else if (topLevelObject.isNamespace) {
      constructedTopLevelObject.type = "namespace"
      constructedTopLevelObject.name = topLevelObject.alias
    } else {
      constructedTopLevelObject.type = "class"; // unknown
    }

    // Find the nested Constructor
    var constructorSymbol = symbolSet.toArray().filter(function ($) {
      return ($.alias.replace(/^([^#]+)#.*$/, "$1") === topLevelObject.name);
    }).filter(isaConstructor).sort(makeSortby("alias"))[0];
    if (constructorSymbol && !constructorSymbol.name.match(/Options$/) && constructorSymbol.desc) {
      var constructedProperty = {
        "type": "Constructor",
        "columns": [],
        "instances": []
      };
      var instance = {
        "Constructor": constructorSymbol.name,
        "desc": constructorSymbol.desc
      };
      var constructorArguments = [];
      for (var k = 0; k < constructorSymbol.params.length; k++) {
        var constructorParameter = constructorSymbol.params[k];
        var argumentString = '<span class="type">';
        argumentString += htmlEscape(constructorParameter.name);
        argumentString += constructorParameter.isOptional ? "?" : "";
        argumentString += ':' + htmlEscape(constructorParameter.type);
        argumentString += '</span>';
        constructorArguments.push(argumentString);
      }
      instance.Constructor += "(" + constructorArguments.join(", ") + ")";
      constructedProperty.instances.push(instance);
      constructedTopLevelObject.properties.push(constructedProperty);
    }

    // Find the nested Properties
    var propertySymbol = symbolSet.toArray().filter(function ($) {
      return ($.alias.replace(/^([^#]+)#.*$/, "$1") === topLevelObject.name);
    }).filter(hasProperties).sort(makeSortby("alias"))[0];
    if (propertySymbol) {
      var constructedProperty = {
        "type": "Properties",
        "columns": ["Type"],
        "instances": []
      };
      var properties = propertySymbol.comment.getTag("property").sort(makeSortby("name"));
      for (var j = 0; j < properties.length; j++) {
        var thisProperty = properties[j];
        var instance = {
          "Type": thisProperty.type,
          "desc": thisProperty.desc
        };
        if (thisProperty.defaultValue) {
          instance.desc += "  The default value is <code>" + thisProperty.defaultValue + "</code>.";
        }
        instance[constructedProperty.type] = thisProperty.name;
        constructedProperty.instances.push(instance);
      }
      constructedTopLevelObject.properties.push(constructedProperty);
    }

    // Find the nested Methods
    var methodSymbols = symbolSet.toArray().filter(function ($) {
      return ($.memberOf === topLevelObject.alias);
    }).filter(isaMethod).sort(makeSortby("alias"));
    if (methodSymbols.length) {
      var otherMethodType = "";
      if (methodSymbols[0].isStatic) {
        otherMethodType = "Static ";
      }
      var constructedProperty = {
        "type": (otherMethodType + "Methods"),
        "columns": ["Return Value"],
        "instances": []
      };
      for (var l = 0; l < methodSymbols.length; l++) {
        var methodSymbol = methodSymbols[l];
        var instance = {
          "Return Value": "None",
          "desc": methodSymbol.desc
        };
        if (methodSymbol.returns.length) {
          instance["Return Value"] = methodSymbol.returns[0].type;
        }
        instance[otherMethodType + "Methods"] = methodSymbol.name;
        var methodArguments = [];
        for (var m = 0; m < methodSymbol.params.length; m++) {
          var methodParameter = methodSymbol.params[m]
          var argumentString = '<span class="type">';
          argumentString += htmlEscape(methodParameter.name);
          argumentString += methodParameter.isOptional ? "?" : "";
          argumentString += ":" + htmlEscape(methodParameter.type);
          argumentString += '</span>';
          methodArguments.push(argumentString);
        }
        instance[otherMethodType + "Methods"] += "(" + methodArguments.join(", ") + ")";
        constructedProperty.instances.push(instance);
      }
      constructedTopLevelObject.properties.push(constructedProperty);
    }

    // Find the nested Events
    var eventSymbols = symbolSet.toArray().filter(function ($) {
      return ($.memberOf === topLevelObject.alias);
    }).filter(isaEvent).sort(makeSortby("alias"));
    if (eventSymbols.length) {
      var constructedProperty = {
        "type": "Events",
        "columns": ["Arguments"],
        "instances": []
      };
      for (var l = 0; l < eventSymbols.length; l++) {
        var thisEvent = eventSymbols[l];
        var eventArguments = [];
        for (var m = 0; m < thisEvent.params.length; m++) {
          var thisArgument = thisEvent.params[m];
          var argumentString = '<span class="type">'
          argumentString += htmlEscape(thisArgument.name);
          argumentString += ':' + htmlEscape(thisArgument.type) + '</span>';
          eventArguments.push(argumentString);
        }
        var instance = {
          "Arguments": eventArguments.join(", ") || "None",
          "desc": thisEvent.desc
        };
        instance[constructedProperty.type] = thisEvent.name;
        constructedProperty.instances.push(instance);
      }
      constructedTopLevelObject.properties.push(constructedProperty);
    }

    templateValues.objects.push(constructedTopLevelObject);
  }

  var referenceTemplate = new JSDOC.JsPlate(publish.conf.templatesDir + "reference.tmpl");
  var output = "";
  output = referenceTemplate.process(templateValues);
  IO.saveFile(publish.conf.outDir, "reference.html", output);
}

/** make a symbol sorter by some attribute */
function makeSortby(attribute) {
  return function(a, b) {
    if (a[attribute] != undefined && b[attribute] != undefined) {
      a = a[attribute].toLowerCase();
      b = b[attribute].toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }
  }
}

/** Find symbol {@link ...} strings in text and turn into html links */
function resolveLinks (str, from) {
  str = str.replace(/\{@link ([^} ]+) ?\}/gi,
    function(match, symbolName) {
      return "<code>" + new Link().toClass(symbolName) + "</code>";
    }
  );
  return str;
}

function htmlEscape(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
}