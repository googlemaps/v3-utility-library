// rhino.js
// 2007-02-19
/*
Copyright (c) 2002 Douglas Crockford  (www.JSLint.com) Rhino Edition
*/

// This is the Rhino companion to fulljslint.js.

(function (a) {
    /*extern JSLINT */
    importPackage(java.lang);

    var pwd = "util/lint/";
    load(pwd + "fulljslint.js");

    if (!a[0]) {
        print("Usage: jslint.js file.js");
        quit(1);
    }
    filesArray = a[0].split(";");
    for (var i = 0; i < filesArray.length; i++) {
      var currentFile = filesArray[i];
      print(currentFile);
      var input = readFile(currentFile);
      if (!input) {
        print("jslint: Couldn't open file '" + currentFile + "'.");
        quit(1);
      }
      load(pwd + "jslint.conf");
      if (!JSLINT(input, JSLINT_OPTIONS)) {
        for (var i = 0; i < JSLINT.errors.length; i += 1) {
            var e = JSLINT.errors[i];
            if (e) {
                print('Lint at line ' + (e.line + 1) + ' character ' +
                        (e.character + 1) + ': ' + e.reason);
                print((e.evidence || '').
                        replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                print('');
            }
        }
      } else {
        print("jslint: No problems found in " + a[0]);
        quit();
      }
    }
})(arguments);

