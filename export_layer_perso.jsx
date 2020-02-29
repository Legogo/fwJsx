#include "lib_system.jsx";
#include "lib_layers.jsx";

//duplicate document and keep original context
var docuOriginal = app.activeDocument;
app.activeDocument.duplicate();

//now use duplicate
var docuCopy = app.activeDocument;
docu = docuCopy;

var folderPath = setupOutputFolder(docuOriginal);

//setup stuff
var defaultRulerUnits = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

process(docu);

docu.close(SaveOptions.DONOTSAVECHANGES);

alert("export layer perso : done");








function process(base)
{
  var layers = base.layers;

  //alert("processing "+base.name+" | layer(s) count ?  "+layers.length);

	for(var i = layers.length - 1; i >= 0; i--)
  {
		processPersoLayer(layers[i], (layers.length-1-i));
	}
}

