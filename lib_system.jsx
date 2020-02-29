//activedocument historyStates
//https://gist.github.com/nzhul/5ef666d5960423fed0de

//execute another script
//https://forums.adobe.com/thread/890873

// getting selected layer
//https://stackoverflow.com/questions/27255364/getting-selected-layer-or-group-layers-array-using-javascript-photoshop-cs4


function setupOutputFolder(refDocument)
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
