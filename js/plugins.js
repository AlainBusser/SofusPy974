// Generated by CoffeeScript 1.11.1
var Message, Print, Println, builtinRead, effacerMessage, effacerOutput, getPythonText, modifierCss, outf, ouvrirClick, ouvrirClickEdit, ouvrirFichier, ouvrirFichierEdit, plierDeplierEditeur, runBlockly, runPython, sauverFichier, sauverFichierEdit, tabuler;

window.alert = function(texte) {
  var mypre, txt;
  txt = typeof texte !== 'undefined' ? texte : '';
  mypre = document.getElementById('output');
  mypre.innerHTML = mypre.innerHTML + txt + '\n';
};

window.getText = function() {
  return editor.getValue();
};

window.setText = function(texte) {
  return editor.setValue(texte, -1);
};

window.insererText = function(txt) {
  return editor.insert(txt);
};

window.getSelectedText = function() {
  return editor.session.getTextRange(editor.getSelectionRange());
};

window.getCursorPos = function() {
  var pos;
  pos = editor.getCursorPosition();
  return editor.getSession().getDocument().positionToIndex(pos, Number(0));
};

ouvrirClick = function() {
  var fileinput;
  fileinput = document.getElementById('fileToLoad');
  return fileinput.click();
};

ouvrirFichier = function() {
  var fileReader, fileToLoad;
  fileToLoad = document.getElementById('fileToLoad').files[0];
  fileReader = new FileReader;
  fileReader.onload = function(fileLoadedEvent) {
    var block, e, i, json, k, liste, textFromFileLoaded, zip;
    textFromFileLoaded = fileLoadedEvent.target.result;
    if (fileToLoad.name.indexOf('.sb2') >= 0) {
      try {
        zip = new JSZip(textFromFileLoaded);
        textFromFileLoaded = zip.file('project.json').asText();
        json = JSON.parse(textFromFileLoaded);
        effacerOutput();
        Blockly.mainWorkspace.clear();
        if (textFromFileLoaded.indexOf('forward:') > 0 || textFromFileLoaded.indexOf('turnLeft:') > 0 || textFromFileLoaded.indexOf('turnRight:') > 0) {
          block = creerBloc('reset');
          lierNextSelected(block);
        }
        i = 0;
        while (i < json.children.length) {
          if (!json.children[i].scripts) {
            i++;
            continue;
          }
          liste = json.children[i].scripts[0][2];
          k = 0;
          while (k < liste.length) {
            sb2_commande(liste[k]);
            k++;
          }
          i++;
        }
      } catch (error) {
        e = error;
        alert('ce fichier Scratch ne semble pas être lisible');
        alert(e.message);
      }
    } else {
      try {
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(textFromFileLoaded));
      } catch (error) {
        e = error;
        alert('ce fichier ne semble pas être lisible par Blockly');
      }
    }
  };
  if (fileToLoad.name.indexOf('.sb2') >= 0) {
    fileReader.readAsArrayBuffer(fileToLoad);
  } else {
    fileReader.readAsText(fileToLoad, 'UTF-8');
  }
};

sauverFichier = function() {
  var downloadLink, fileNameToSaveAs, textFileAsBlob, textToWrite;
  textToWrite = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
  textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  fileNameToSaveAs = prompt('Nom du fichier (sauvé dans le dossier de téléchargements) ?', 'fichier.bly');
  if (fileNameToSaveAs === null) {
    return;
  }
  downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = function(event) {
      document.body.removeChild(event.target);
    };
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
};


/*
Utilitaire pour grossir les entrées-sorties :
	- les affichages sont redirigés vers la balise "output"
	- la question posée dans une boite de saisie standard est redirigée vers la balise "output"
Cet utilitaire permet également de gérer le pliage et le dépliage de Blockly
Instructions (adaptables) pour créer ensuite les balises (voir demo_affichage.html par exemple) :
	<pre id="message" class="message"></pre>
	<pre id="output"  class="output"></pre>
	<style>
		.output { font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 20pt ;font-weight:normal; color:blue}
		.message { font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 20pt ;font-weight:normal; color:red}
	</style>
Attention : ...
 */

Print = function(texte) {
  var mypre, txt;
  txt = typeof texte !== 'undefined' ? texte : '';
  mypre = document.getElementById('output');
  mypre.innerHTML = mypre.innerHTML + txt;
};

Println = function(texte) {
  var mypre, txt;
  txt = typeof texte !== 'undefined' ? texte : '';
  mypre = document.getElementById('output');
  mypre.innerHTML = mypre.innerHTML + txt + '\n';
};

effacerOutput = function() {
  var mypre;
  mypre = document.getElementById('output');
  mypre.innerHTML = '';
};

Message = function(texte) {
  var mypre, txt;
  txt = typeof texte !== 'undefined' ? texte : '';
  mypre = document.getElementById('message');
  mypre.innerHTML = txt;
};

effacerMessage = function() {
  var mypre;
  mypre = document.getElementById('message');
  mypre.innerHTML = '';
};


/*
prompt_bak = window.prompt;
window.prompt= function(msg) {
	Message("question : " + msg + "\n"+ "---> tapez votre réponse au clavier, puis validez (touche Entrée ou bouton OK)");
	var rep = prompt_bak(msg);
	//if(navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
		effacerMessage();
	//}
	return rep;
}
 */


/*
Utilitaire pour gérer un éditeur Python :
	- reprend editeur.js en prenant en compte des zones de dessin pour les tortues si elles existent
	- gère l'exécution d'un programme Python avec Skulpt
 */

tabuler = function(code) {
  var k, tabus;
  tabus = '';
  k = 1;
  while (k <= 10) {
    code = code.split('\n' + tabus + '  ').join('\n' + tabus + '\u0009');
    tabus += '\u0009';
    k++;
  }
  return code;
};

outf = function(text) {
  var mypre;
  mypre = document.getElementById('output');
  mypre.innerHTML = mypre.innerHTML + text;
};

builtinRead = function(x) {
  if (Sk.builtinFiles === void 0 || Sk.builtinFiles['files'][x] === void 0) {
    throw 'File not found: \'' + x + '\'';
  }
  return Sk.builtinFiles['files'][x];
};

runPython = function(editor) {
  var lig;
  var e, e1, lig, mypre, prog;
  effacerOutput();
  prog = editor.getValue();
  mypre = document.getElementById('output');
  mypre.innerHTML = '';
  Sk.canvas = 'mycanvas';
  Sk.pre = 'output';
  Sk.configure({
    output: outf,
    read: builtinRead
  });
  try {
    eval(Sk.importMainWithBody('<stdin>', false, prog));
  } catch (error) {
    e = error;
    Println(e.toString());
    try {
      lig = e.lineno;
      Println('erreur ligne ' + lig);
      editor.gotoLine(lig);
    } catch (error) {
      e1 = error;
    }
  }
};


/*
Utilitaire pour gerer un editeur
 */

plierDeplierEditeur = function() {
  var obj;
  obj = document.getElementById('editor');
  if (obj.style.height !== '0px') {
    obj.style.height = '0px';
    obj.style.visibility = 'hidden';
  } else {
    obj.style.visibility = 'visible';
    obj.style.height = window.innerHeight - 200 + 'px';
    editor.resize();
  }
};

tabuler = function(code) {
  var k, tabus;
  tabus = '';
  k = 1;
  while (k <= 10) {
    code = code.split('\n' + tabus + '  ').join('\n' + tabus + '\u0009');
    tabus += '\u0009';
    k++;
  }
  return code;
};


/*
Utilitaire pour ouvrir ou sauver des fichiers textes avec l'éditeur.
Instructions pour créer ensuite les boutons (voir demo_fichiers.html par exemple):
	<input type="file" id="fileToLoadEdit" style="display: none" onchange="ouvrirFichierEdit(editor);" />
	<input type="button" value="Ouvrir" onclick="ouvrirClickEdit();"/>
	<button type="button" onclick="sauverFichierEdit(editor)">Sauver</button>
 */

ouvrirClickEdit = function() {
  var fileinput;
  fileinput = document.getElementById('fileToLoadEdit');
  fileinput.click();
};

ouvrirFichierEdit = function(editor) {
  var fileReader, fileToLoad;
  fileToLoad = document.getElementById('fileToLoadEdit').files[0];
  fileReader = new FileReader;
  fileReader.onload = function(fileLoadedEvent) {
    var e, textFromFileLoaded;
    textFromFileLoaded = fileLoadedEvent.target.result;
    try {
      editor.setValue(textFromFileLoaded, -1);
      editor.focus();
    } catch (error) {
      e = error;
      alert('ce fichier ne semble pas être lisible');
    }
  };
  fileReader.readAsText(fileToLoad, 'UTF-8');
};

sauverFichierEdit = function(editor) {
  var downloadLink, fileNameToSaveAs, textFileAsBlob, textToWrite;
  textToWrite = editor.getValue();
  textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  fileNameToSaveAs = prompt('nom du fichier (sauvé dans le dossier de téléchargements) ?', 'script.py');
  if (fileNameToSaveAs === null) {
    return;
  }
  downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  if (window.webkitURL !== null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = function(event) {
      document.body.removeChild(event.target);
    };
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
};


/*
Fichier permettant de changer les styles par défaut de Blockly, en particulier :
	- taille du menu principal
	- taille des bulles d'aide
	- taille et couleur des menus contextuels

Cet utilitaire évite de modifier directement le fichier css.js des sources de Blockly.
 */

modifierCss = function(style, attribut, valeur) {
  var content, k, pos;
  content = Blockly.Css.CONTENT;
  pos = content.indexOf(style);
  if (pos < 0) {
    return;
  }
  k = pos;
  while (k < content.length) {
    if (content[k].indexOf(attribut) === 0) {
      content[k] = valeur;
      return;
    }
    if (content[k] === '}') {
      content.splice(k, 0, valeur);
      return;
    }
    k++;
  }
};


/*

 * bulle d'aide
modifierCss '.blocklyTooltipDiv {', 'font-size:', 'font-size: 15pt;'
 * taille de la police : ici 25
 * menu contextuel
modifierCss '.blocklyWidgetDiv .goog-menuitem-content {', 'font:', 'font: bold 15px Arial, sans-serif;'
 * taille de la police : ici 15
modifierCss '.blocklyWidgetDiv .goog-menuitem-content {', 'background:', 'background: #0f0;'
 * fond de chaque commande : ici vert
modifierCss '.blocklyWidgetDiv .goog-menuitem {', 'background:', 'background: #ff0;'
 */

runBlockly = function() {
  var code, e;
  effacerOutput();
  window.LoopTrap = 20000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Nombre d\'iterations limité à 20000 : passez à Python (bouton Editeur)";\n';
  code = Blockly.JavaScript.workspaceToCode(workspace);
  try {
    eval(code);
  } catch (error) {
    e = error;
    alert(e);
  }
};

getPythonText = function() {
  var code, code_js, e;
  Blockly.Python.tortues = 0;
  try {
    code_js = Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace);
    if (code_js.indexOf('totos[') > 0) {
      Blockly.Python.tortues = 1;
    }
    if (code_js.indexOf('new Tortue(') > 0) {
      Blockly.Python.tortues = 2;
    }
    code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace);
    if (Blockly.Python.tortues === 1) {
      code = 'from turtle import * \n' + code;
    } else if (Blockly.Python.tortues === 2) {
      code = 'from turtle import * \n\n' + 'tortues={}  # pour stocker toutes les tortues (sauf celle par défaut)\n\n' + code + '\nhideturtle()  # pour masquer la tortue par défaut';
    }
  } catch (error) {
    e = error;
    code = "# Blockly n\'a pu etre traduit en Python";
  }
  return code = code.replace(/\n*.*= None\n/g, '');
};


/*
	function interpreterVoix(transcript) {
		Println(transcript);
		if (mots[mots.length-1] == "none") return null;
		transcript = transcript.replace(/  +/g, ' '); // cmd = cmd.replace(/\s\s+/g, ' ');
		transcript = transcript.trim();
		transcript = transcript.toLowerCase();
		var mots = transcript.split(" ");
		if (mots.length==0) return null;
		if (mots.length==1) return null;
		if (mots[mots.length-1] == "none") return null;
		if (mots[1] == "=" || mots[1]=="+" || mots[1]=="-" || mots[1]=="/" || mots[1]=="*") {
			mots.unshift("variable");
		}
		return commande(mots);
	}
 */
