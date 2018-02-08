/*
Utilitaire pour gérer un éditeur Python :
	- reprend editeur.js en prenant en compte des zones de dessin pour les tortues si elles existent
	- gère l'exécution d'un programme Python avec Skulpt
*/

function plierDeplierEditeur() {
	var obj=document.getElementById("editor"); 
	if(obj.style.height != "0px") {
		obj.style.height="0px";
		obj.style.visibility = 'hidden';
	}  else {
		obj.style.visibility = 'visible';
		obj.style.height=(window.innerHeight-200) + "px";
		editor.resize();
	}
}

function tabuler(code) {
	tabus="";
	for(k=1; k<=10; k++) {
		code = code.split("\n" + tabus + "  ").join("\n" + tabus + "\t");
		tabus += "\t";
	}
	return code;
}

function blocklyToEditor(editor, texte) {
// montrer editeur
	document.getElementById("editor").style.visibility = 'visible';
	document.getElementById("editor").style.height = (window.innerHeight-200) + "px";
	editor.resize();
	editor.setValue(tabuler(texte),-1);
	editor.focus();
	document.getElementById("boutons_editor").style.visibility = 'visible';
	document.getElementById("boutons_editor").style.height = '60px';
	if (document.getElementById("mycanvas")) {	// le graphique tortue de Python
		document.getElementById("mycanvas").style.visibility = 'visible';
		document.getElementById("mycanvas").style.height = '480px';
	}
// masquer Blockly
	document.getElementById("blocklyDiv").style.visibility = 'hidden';
	document.getElementById("blocklyDiv").style.height="0px";
	Blockly.svgResize(Blockly.mainWorkspace);
	document.getElementById("boutons_blockly").style.visibility = 'hidden';
	document.getElementById("boutons_blockly").style.height = '0px';
	if (document.getElementById("mycanvas")) {	// le graphique tortue de Blockly 
		document.getElementById("graphique").style.visibility = 'hidden';
		document.getElementById("graphique").style.height = '0px';
	}
}

function editeurToBlockly() {
// masquer editeur
	document.getElementById("editor").style.visibility = 'hidden';
	document.getElementById("editor").style.height="0px";
	document.getElementById("boutons_editor").style.visibility = 'hidden';
	document.getElementById("boutons_editor").style.height = '0px';
	if (document.getElementById("mycanvas")) {	// le graphique tortue de Python
		document.getElementById("mycanvas").style.visibility = 'hidden';
		document.getElementById("mycanvas").style.height = '0px';
	}
// montrer Blockly
	document.getElementById("blocklyDiv").style.visibility = 'visible';
	document.getElementById("blocklyDiv").style.height=(window.innerHeight-200) + "px";
	Blockly.svgResize(Blockly.mainWorkspace);
	document.getElementById("boutons_blockly").style.visibility = 'visible';
	document.getElementById("boutons_blockly").style.height = '60px';
	if (document.getElementById("graphique")) {	// le graphique tortue de Blockly
		document.getElementById("graphique").style.visibility = 'visible';
		document.getElementById("graphique").style.height = '480px';
	}
}

// ---------------------------------------------------------------------------
// Exécution de programmes Python
// ---------------------------------------------------------------------------


	function outf(text) {
		var mypre = document.getElementById("output");
		mypre.innerHTML = mypre.innerHTML + text;
	}
	function builtinRead(x) {
		if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
		throw "File not found: '" + x + "'";
		return Sk.builtinFiles["files"][x];
	}
	function runPython(editor) {
		effacerOutput();
		prog = editor.getValue();
		var mypre = document.getElementById("output");
		mypre.innerHTML = '';
		Sk.canvas = "mycanvas";
		Sk.pre = "output";
		Sk.configure({output:outf, read:builtinRead});
		try {
			eval(Sk.importMainWithBody("<stdin>",false,prog));
		}
		catch(e) {
			Println(e.toString());
			try {
				var lig = e.lineno;
				Println("erreur ligne " + lig);
				editor.gotoLine(lig);
			}
			catch(e1) {
			}
		}
	}
