
#include "lib_system.jsx";

//documentation

// resize canvas : https://stackoverflow.com/questions/17580923/photoshop-javascript-to-resize-image-and-canvas-to-specific-not-square-sizes

///
/// https://stackoverflow.com/questions/69743787/photoshop-script-to-crop-into-square-based-on-active-selection
/// crop to selection
///
function cropToSelection()
{
  executeAction( charIDToTypeID( "Crop" ), new ActionDescriptor(), DialogModes.NO );
}

///
/// https://stackoverflow.com/questions/47664350/select-visible-pixels-in-a-layer
///
function selectVisibleLayer()
{
    var id1268 = charIDToTypeID( "setd" );
    var desc307 = new ActionDescriptor();
    var id1269 = charIDToTypeID( "null" );
    var ref257 = new ActionReference();
    var id1270 = charIDToTypeID( "Chnl" );
    var id1271 = charIDToTypeID( "fsel" );
    ref257.putProperty( id1270, id1271 );
    desc307.putReference( id1269, ref257 );
    var id1272 = charIDToTypeID( "T   " );
    var ref258 = new ActionReference();
    var id1273 = charIDToTypeID( "Chnl" );
    var id1274 = charIDToTypeID( "Chnl" );
    var id1275 = charIDToTypeID( "Trsp" );
    ref258.putEnumerated( id1273, id1274, id1275 );
    desc307.putReference( id1272, ref258 );
    executeAction( id1268, desc307, DialogModes.NO )
}

function setLayersVisibility(ctx, visible)
{
    for(var i = 0; i < ctx.layers.length; i++)
    {
        ctx.layers[i].visible = visible;
    }
}

function mergeLayer(doc, layer)
{
    log("merging : "+layer);

    doc.activeLayer = layer;
    mergeDown();
}

function searchAndHide(doc, layerName)
{
    var lyr = searchLayer(doc, layerName);
    if(lyr != null)
    {
        lyr.visible = false;
    }
}

function searchLayerAndDelete(doc, layerName)
{
    var lyr = searchLayer(doc, layerName);

    if(lyr != null)
    {
        //alert("deleting : "+lyr.name);
        lyr.remove();
    }

}

function searchLayer(doc, layerName)
{
    for(var i = 0; i < doc.layers.length; i++)
    {
        var lyr = doc.layers[i];
        if(lyr.name == layerName)
            return lyr;
    }

    alert("couldn't find : "+layerName);

    return null;
}

// return : array of layer around the given one
//
function fetchNeighborLayers(layer)
{
    var layers = [];
    var parent = layer.parent;

    //alert(layer+" < "+parent);

    for(var i = 0; i < parent.layers.length; i++)
    {
        var lyr = parent.layers[i];
        if(!lyr.visible) continue;
        if(lyr == layer) continue;

        layers.push(lyr);
    }

    return layers;
}

function resizeCanvas(doc, padding)
{
    doc.trim();

    //give room around
    doc.resizeCanvas(UnitValue(doc.width + padding,"px"),UnitValue(doc.height + padding,"px"));
}

var deadEnds = [];

function gatherAllEndLayers(base, hideEachLayer)
{

    //alert(base.name);

    //if(win != null) win.text = "gathering dead ends ("+deadEnds.length+")";

    //hide everything
    if(hideEachLayer)
    {
        //alert("hiding "+base.name);
        base.visible = false;
    }

    //don't add '![name]' layers
    if(base.name[0] == "!") return;

    if(isLayerDeadEnd(base))
    {
        //alert("added "+base.name);
        deadEnds.push(base);
        return;
    }

    var lys = base.layers;

    //alert(base.name+" has "+lys.length+" children");

    for(var i = 0; i < lys.length; i++)
    {

        //alert("  L ("+i+") "+base.name);

        gatherAllEndLayers(lys[i], hideEachLayer);
    }

    return deadEnds;
}

function gatherAllLayersFrom(base, onlyVisible)
{
    var list = [];

    //folder !
    if(base.layers != null)
    {
        //alert("found folder "+base.name+" checking children ...");

        //each elements of folder
        for(i = 0; i < base.layers.length; i++)
        {
            var result = gatherAllLayersFrom(base.layers[i], onlyVisible);

            //adding each found layers to original array
            for(j = 0; j < result.length; j++){
                list.push(result[j]);
            }
        }

        //alert(" ... folder "+base.name+" gave "+list.length+" layers");
    }
    else
    {

        var toAdd = true;

        //do not include document
        if(base == app.activeDocument)
        {
            toAdd = false;
        }

        if(onlyVisible && !base.visible)
        {
            toAdd = false;
        }

        if(toAdd)
        {
            //alert(" ... adding layer : "+base.name);
            list.push(base);
        }
        else
        {
            //alert(" ... skipping layer : "+base.name)
        }

    }

    return list;
}






// hide/show active layer and ALL parents
//
function setLayerVisible(layer, visible)
{
    if(layer == null)
    {
        alert("no layer ?");
        return;
    }

    layer.visible = visible;
    var parent = layer.parent;
    while(parent != null)
    {
        parent.visible = visible;
        parent = parent.parent;
    }
}

// return : array of layers (selected in editor)
//
function getSelectedLayers()
{
    var idGrp = stringIDToTypeID( "groupLayersEvent" );
    var descGrp = new ActionDescriptor();
    var refGrp = new ActionReference();
    refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
    descGrp.putReference(charIDToTypeID( "null" ), refGrp );
    executeAction( idGrp, descGrp, DialogModes.ALL );
    var resultLayers=new Array();
    for (var ix=0;ix<app.activeDocument.activeLayer.layers.length;ix++){resultLayers.push(app.activeDocument.activeLayer.layers[ix])}
    var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
    var ref2 = new ActionReference();
    var id10 = charIDToTypeID( "HstS" );
    var id11 = charIDToTypeID( "Ordn" );
    var id12 = charIDToTypeID( "Prvs" );
    ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
    executeAction( id8, desc5, DialogModes.NO );
    return resultLayers;
}


// return true : has no other layer in children
//
function isLayerDeadEnd(base)
{
    //une layer qui a pas d'enfant est un calque
    if(base.layers == null) return true;

    var output = true;

    //si on trouve une layer enfant qui n'en a pas elle même c'est qu'on est au bout
    //si un des enfants a des enfants c'est qu'on est pas au bout
    for (i = 0; i < base.layers.length; i++)
    {
        if(base.layers[i].layers != null) output = false;
    }

    return output;
}





// https://github.com/LeZuse/photoshop-scripts/blob/master/default/Flatten%20All%20Layer%20Effects.jsx

///////////////////////////////////////////////////////////////////////////////
// 
// Function: makeLayerBelow
// Usage: Creates a new layer below with the target layers name
// Input: targetName. the name of the layer we want to create a new layer below
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function makeLayerBelow(targetName) {
    try {
        var id829 = charIDToTypeID( "Mk  " );
            var desc169 = new ActionDescriptor();
            var id830 = charIDToTypeID( "null" );
                var ref105 = new ActionReference();
                var id831 = charIDToTypeID( "Lyr " );
                ref105.putClass( id831 );
            desc169.putReference( id830, ref105 );
            var id832 = stringIDToTypeID( "below" );
            desc169.putBoolean( id832, true );
            var id833 = charIDToTypeID( "Usng" );
                var desc170 = new ActionDescriptor();
                var id834 = charIDToTypeID( "Nm  " );
                desc170.putString( id834, targetName );
            var id835 = charIDToTypeID( "Lyr " );
            desc169.putObject( id833, id835, desc170 );
        executeAction( id829, desc169, DialogModes.NO );
    }catch(e) {
        ; // do nothing
    }
}

///////////////////////////////////////////////////////////////////////////////
// Function: selectPreviousLayer
// Usage: Selects the layer above the selected layer, adding that layer to the current layer selection
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function selectPreviousLayer() {
    try {
        var idslct = charIDToTypeID( "slct" );
            var desc9 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref8 = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                var idOrdn = charIDToTypeID( "Ordn" );
                var idFrwr = charIDToTypeID( "Frwr" );
                ref8.putEnumerated( idLyr, idOrdn, idFrwr );
            desc9.putReference( idnull, ref8 );
            var idselectionModifier = stringIDToTypeID( "selectionModifier" );
            var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
            var idaddToSelection = stringIDToTypeID( "addToSelection" );
            desc9.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
            var idMkVs = charIDToTypeID( "MkVs" );
            desc9.putBoolean( idMkVs, false );
        executeAction( idslct, desc9, DialogModes.NO );
    }catch(e) {
        ; // do nothing
    }
}

///////////////////////////////////////////////////////////////////////////////
// Function: mergeDown
// Usage: merges the currently selected layers into one layer. If only one layer is selected it merges the current layer down into the layer below
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function mergeDown() {
    try {
        var id828 = charIDToTypeID( "Mrg2" );
            var desc168 = new ActionDescriptor();
        executeAction( id828, desc168, DialogModes.NO );
    }catch(e) {
        ; // do nothing
    }
}