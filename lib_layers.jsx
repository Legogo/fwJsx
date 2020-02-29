
//documentation

// resize canvas : https://stackoverflow.com/questions/17580923/photoshop-javascript-to-resize-image-and-canvas-to-specific-not-square-sizes


//globals
var deadEnds = [];

function processPersoLayer(layer, zorder)
{
  if(layer == null)
  {
    alert("no layer ?");
    return;
  }
  
  //get neighbors
  var neighbors = fetchNeighborLayers(layer);

  //hide all neighbors
  for(var i = 0; i < neighbors.length; i++) neighbors[i].visible = false;

  //crop & save current active layer (+2px padding on each side)
  prepareLayerAndExport(layer, "_"+zorder, 4);

  //show all neighbors
  for(var i = 0; i < neighbors.length; i++) neighbors[i].visible = true;
}

function solveLayer(layer)
{
  if(layer == null)
  {
    alert("no layer ?");
    return;
  }

	setLayerVisible(layer, true); // setup current layer as visible
	
  prepareLayerAndExport(layer); // crop, save, undo

	setLayerVisible(layer, false); // hide layer
}




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




function prepareLayerAndExport(layer, suffix, padding)
{
  var doc = app.activeDocument;

  var bounds = layer.bounds;
  
  var historyCount = 2;

  if(padding != null)
  {
    //trim with padding
    prepareCanvasPadding(doc, padding);
    historyCount = 3; // +1 action here
  }
  else
  {
    //just trim
    prepareCanvas(doc);
  }
  
  var x = bounds[0].as("px");
  var y = bounds[1].as("px");
  
  var nm = layer.name;
  nm += "__"+x+"x"+y;

  if(suffix != null)
  {
    if(suffix.length > 0)
    {
      nm += suffix;
    }
  }

  //folderPath is defined out of scope

  savePNG(folderPath+nm); // save to png
  
  //undo
  docu.activeHistoryState = docu.historyStates[docu.historyStates.length - historyCount];
}

function prepareCanvas(doc)
{
  //crop,trim
  doc.trim();
}

function prepareCanvasPadding(doc, padding)
{
  prepareCanvas(doc); // trim to exacte pixel border

  //give room around
  doc.resizeCanvas(UnitValue(doc.width + padding,"px"),UnitValue(doc.height + padding,"px"));
}

function gatherAllEndLayers(base, hideEachLayer){

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

	for(var i = 0; i < lys.length; i++){

		//alert("  L ("+i+") "+base.name);

		gatherAllEndLayers(lys[i], hideEachLayer);
	}

}

function gatherAllLayersFrom(base, onlyVisible){
  var list = [];

  //folder !
  if(base.layers != null){
    //alert("found folder "+base.name+" checking children ...");

    //each elements of folder
    for(i = 0; i < base.layers.length; i++){
      var result = gatherAllLayersFrom(base.layers[i], onlyVisible);

      //adding each found layers to original array
      for(j = 0; j < result.length; j++){
        list.push(result[j]);
      }
    }
    
    //alert(" ... folder "+base.name+" gave "+list.length+" layers");
  }else{

    var toAdd = true;

    //do not include document
    if(base == app.activeDocument){
      toAdd = false;
    }

    if(onlyVisible && !base.visible){
      toAdd = false;
    }

    if(toAdd){
      //alert(" ... adding layer : "+base.name);
      list.push(base);
    }else{
      //alert(" ... skipping layer : "+base.name)
    }

  }
  
  return list;
}






// hide/show active layer and ALL parents
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

function getSelectedLayers(){
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

