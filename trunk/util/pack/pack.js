(function (a) {

  // load the supporting libraries
  var pwd = "util/pack/";
  load(pwd + "packer/rhino/lib/writeFile.js");
  load(pwd + "base2/src/base2.js");
  load(pwd + "packer/Packer.js");
  load(pwd + "packer/Words.js");

  baseDir = a[0];
  filesArray = a[1].split(";");
  for (var i = 0; i < filesArray.length; i++) {
    var currentFile = filesArray[i];

    // arguments
    var inFile = baseDir + "/" + currentFile;
    var outFile = inFile.replace(/\.js$/, "_packed.js");
    print("Packing " + inFile + " to output " + outFile);

    // options
    var base62 = true;
    var shrink = true;

    // do the packing
    var script = readFile(inFile);
    var packer = new Packer;
    var packedScript = packer.pack(script, base62, shrink);

    // write the output
    writeFile(outFile, packedScript);
  }
})(arguments);
