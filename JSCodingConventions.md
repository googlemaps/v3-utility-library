# Introduction #

All Javascript files must follow these coding conventions before they can be committed to the release project.


# Language Rules #

  * Variable declarations must start with `var`
  * All JS expressions must end with a semi-colon
  * Method definitions should look like:
```
Foo.prototype.bar = function() {
  /* ... */
};
```

# Style Rules #

## Naming ##
  * Capitalization: functionNamesLikeThis, variableNamesLikeThis, ClassNamesLikeThis, and SYMBOLIC\_CONSTANTS\_LIKE\_THIS.
  * Be descriptive.
  * Private variables or functions should end in underscores (`func_`).
  * Optional arguments should start with `opt_`.

## Strings ##
  * Use single quotes, not double, e.g. `'i am a string'`
  * Use `Array.join` when concatenating large strings.  For example:
```
var myLongString = [
  '<div>',
  'This is my <b>long string</b> containing HTML markup!',
  '</div>'
].join('');
```

## Formatting ##
  * No tabs anywhere - 2 spaces indent for each level of scope.
  * Wrapped lines should be indented 4 spaces.
  * Object initialization looks like:
```
Obj = {
  key: "value",
  key2: "value2"
};
```
  * Inlined anonymous function look like:
```
document.getElementById('button').onclick = function() {
  // Code here
};

GEvent.addDomListener(buttonNode, 'click', function() {
  // Code here
});
```

## Comments ##
  * Should generally follow [JSDoc](http://jsdoc.sourceforge.net/) conventions.
  * Inline comments are useful if the code is unclear.
  * Each function must be commented (purpose, @param, @return):
```
/**
 * Creates a flat icon based on the specified options in the 
 *     {@link MarkerIconOptions} argument.
 *     Supported options are: width, height, primaryColor,
 *     shadowColor, label, labelColor, labelSize, and shape..
 * @param {MarkerIconOptions} [opts]
 * @return {GIcon}
 */
```
  * Copyright, author, license, plus short description of file at top of code:
```
/**
 * @name MapIconMaker
 * @version 1.1
 * @author Pamela Fox
 * @copyright (c) 2008 Pamela Fox
 * @fileoverview This gives you static functions for creating dynamically
 *     sized and colored marker icons using the Charts API marker output.
 */

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */
```