/*
Utilitaire pour ouvrir ou sauver des fichiers Blockly.

Instructions pour créer ensuite les boutons (voir demo_fichiers.html par exemple):

	<input type="file" id="fileToLoad" style="display: none" onchange="ouvrirFichier();" />
	<input type="button" value="Ouvrir" onclick="ouvrirClick();"/>
	<button type="button" onclick="sauverFichier()">Sauver</button>
	
Attention : ne pas inclure fichiers.js avant blockly_compressed.js

*/


function ouvrirClick() {
    var fileinput = document.getElementById("fileToLoad");
    fileinput.click();
}
function ouvrirFichier() {
	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		var textFromFileLoaded = fileLoadedEvent.target.result;
		if (fileToLoad.name.indexOf(".sb2")>=0) {
			try {
				var zip = new JSZip(textFromFileLoaded);
				textFromFileLoaded = zip.file("project.json").asText();
				var json = JSON.parse(textFromFileLoaded);
				effacerOutput();
				//var editor = ace.edit("editor");
				//blocklyToEditor(editor, textFromFileLoaded);
				Blockly.mainWorkspace.clear();			
				if (textFromFileLoaded.indexOf('forward:')>0 || textFromFileLoaded.indexOf('turnLeft:')>0 || textFromFileLoaded.indexOf('turnRight:')>0) {
					var block = creerBloc('reset');
					lierNextSelected(block);
				}
				for(var i=0; i<(json.children.length); i++) {
					if (! json.children[i].scripts) continue;
					//Println(i);
					var liste = json.children[i].scripts[0][2];
					for(var k=0; k<liste.length; k++) {
						//Println(liste[k][0]);
						sb2_commande(liste[k]);
					}
				}
			} catch (e) {
				alert("ce fichier Scratch ne semble pas être lisible");
				alert(e.message);
			};
		}
		else {
			try {
				Blockly.mainWorkspace.clear();
				Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(textFromFileLoaded));
			} catch (e) {
				alert("ce fichier ne semble pas être lisible par Blockly");
			};
		}
	}
	if (fileToLoad.name.indexOf(".sb2")>=0) {
		fileReader.readAsArrayBuffer(fileToLoad);
	}
	else {
		fileReader.readAsText(fileToLoad, "UTF-8");
	}
}
function sauverFichier() {
	var textToWrite = Blockly.Xml.domToPrettyText( Blockly.Xml.workspaceToDom(Blockly.mainWorkspace) );
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = prompt("nom du fichier (sauvé dans le dossier de téléchargements) ?", "fichier.bly");
	if (fileNameToSaveAs==null) {
		return;
	}
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = function destroyClickedElement(event) {
									document.body.removeChild(event.target);
								};
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}
	downloadLink.click();
}

