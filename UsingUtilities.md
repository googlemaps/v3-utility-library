In the util folder under trunk, there is an ant script (build.xml) that can be used for common tasks by developers of the library. Below is a description of the targets that can be specified:

  * all-pack: This will go through all the non-packed JS files, run jslint on them, and then run them through Dean Edwards' packer. You should fix JsLint errors if you expect your file to be packed correctly. If you want to pack quickly and ignore lint errors, then remove the depends=lint in the pack target.

  * all-docs: This will go through all the non-packed JS files, and use JsDoc-toolkit to generate an HTML reference for them. Make sure that your top of the file has proper comments (see JavascriptCodingConventions), otherwise you'll get a warning about "comment" and be unable to generate docs.

  * all-setalltypes: This will go through all the files and run "svn propset svn:mime-type MIME\_TYPE\_HERE" on each file that's either CSS, JS, XML, or HTML. This is done so that our docs and examples are rendered correctly when viewed in the repository.

  * all: This will do all of the above (warning: may take a while).


**Running ant locally (windows)**

The following steps are needed to run the antscript locally. To do this you need JRE (Java runtime enviroment) installed.

  * Step 1: [Download Apache ANT](http://ant.apache.org/bindownload.cgi)

  * Step 2: Extract the package to a directory ( e.g. c:\ )

  * Step 3: Start a command prompt ( Click Start, then run, then type 'cmd' without quotes and press enter.

  * Step 4: Navigate to your local copy of the utility library's util directory ( e.g. c:\google-util-dev\util\ )

  * Step 5: Run ant by entering ant at the directory named bin ( e.g. 'type c:\apache-ant-1.7.1\bin\ant' without the quotes )

This will run the script for each directory in your local copy of the library. I recommend to only have the script you are working on locally, and ofcourse, the util directory.

Took me a while at start to figure this out. Hopefully this clears some things up.