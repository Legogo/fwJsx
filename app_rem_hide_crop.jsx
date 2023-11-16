#include "lib_system.jsx";
#include "lib_layers.jsx";

var original = app.activeDocument;

// duplicate
var docu = app.activeDocument;
docu.duplicate()
docu = app.activeDocument;

//setup stuff
var defaultRulerUnits = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

var win = new Window("window{text:'Progress',bounds:[100,100,400,150],bar:Progressbar{bounds:[20,20,280,31] , value:0,maxvalue:100}};");
win.show();

// APP

log("removing layers");

searchLayerAndDelete(docu, "NOTES");
searchLayerAndDelete(docu, "BG COLOR");

log("hiding layers");

searchAndHide(docu, "STB");
searchAndHide(docu, "CH");

var cartouche = searchLayer(docu, "CARTOUCHE");
if(cartouche != null)
    mergeLayer(docu, cartouche);

var bgLine = searchLayer(docu, "BG LINE");

if(bgLine != null)
{
    // https://medium.com/@andrew.rapo/using-adobes-javascript-based-extendscript-jsx-to-automate-photoshop-workflow-tasks-f3b6690650d9

    docu.activeLayer = bgLine;

    for(var i = 0; i < bgLine.layers.length; i++)
    {
        var lyr = bgLine.layers[i];

        var split = lyr.name.split('_');
        var prefix = split[0].toLowerCase();
        if(prefix == "bg")
        {
            mergeLayer(docu, lyr);
        }
    }

}

var crop = searchLayer(docu,"crop");
if(crop != null)
{
    log("cropping");
    docu.activeLayer = crop;
    selectVisibleLayer();
    cropToSelection();
    deselectLayers();

    crop.remove();

    //docu.trim();
}

// save a copy @origin path
//alert(original.path)


/// SAVE

// https://community.adobe.com/t5/photoshop-ecosystem-discussions/save-psd-file-with-the-selected-layers-name-script-help/m-p/12205543

var outputPath = original.name.replace(".psd", "");
outputPath += "_CONFO";
outputPath = original.path + "/" + outputPath;

//alert(original.path+" & "+original.name+" = "+outputPath)
//alert(outputPath)

// with(activeDocument) saveAs(File('~/desktop/' + activeLayer.name.slice(0, 8)))
with(original) saveAs(File(outputPath))

docu.close(SaveOptions.DONOTSAVECHANGES);

// !APP

win.close();
