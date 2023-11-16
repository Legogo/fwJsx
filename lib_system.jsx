//activedocument historyStates
//https://gist.github.com/nzhul/5ef666d5960423fed0de

//execute another script
//https://forums.adobe.com/thread/890873

// getting selected layer
//https://stackoverflow.com/questions/27255364/getting-selected-layer-or-group-layers-array-using-javascript-photoshop-cs4

/// true = will alert() logs
///
var USE_ALERT = false;

function deselectLayers()
{

    var desc01 = new ActionDescriptor(); 

        var ref01 = new ActionReference(); 

        ref01.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') ); 

    desc01.putReference( charIDToTypeID('null'), ref01 ); 

    executeAction( stringIDToTypeID('selectNoLayers'), desc01, DialogModes.NO ); 

}

function log(content)
{
    if(!USE_ALERT)
        return;

    alert(content);
}

/// create a new folder with document name
/// and returns the path
///
function solveOutputFolder(refDocument)
{
    if(refDocument == null)
    {
        alert("no document ?");
        return;
    }

    //alert("document name ? "+refDocument.name);

    var folderName = refDocument.name.replace(".psd", "");
    var folderPath = refDocument.path+"/"+folderName+"/";

    //alert("output folder : "+folderPath);

    //create output folder
    var folder = Folder(folderPath);
    if(!folder.exists) folder.create();

    return folderPath;
}


function savePNG(fileName)
{

    var pngOpts = new ExportOptionsSaveForWeb;
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = 100;

    var path = fileName+".png";

    //alert("saved to file : "+path);

    var file = new File(path);

    app.activeDocument.exportDocument(file, ExportType.SAVEFORWEB, pngOpts);


}
