# Avoid `console` errors in browsers that lack a console.
# Place any jQuery/helper plugins in here.

window.alert = (texte) ->
  txt = if typeof texte != 'undefined' then texte else ''
  mypre = document.getElementById('output')
  mypre.innerHTML = mypre.innerHTML + txt + '\n'
  return

window.getText = -> editor.getValue()
window.setText = (texte) -> editor.setValue texte, -1
window.insererText = (txt) ->  editor.insert txt

window.getSelectedText = -> editor.session.getTextRange editor.getSelectionRange()
window.getCursorPos = ->
  pos = editor.getCursorPosition()
  editor.getSession().getDocument().positionToIndex pos, Number(0)

ouvrirClick = ->
  fileinput = document.getElementById('fileToLoad')
  fileinput.click()

ouvrirFichier = ->
  fileToLoad = document.getElementById('fileToLoad').files[0]
  fileReader = new FileReader
  fileReader.onload = (fileLoadedEvent) ->
    textFromFileLoaded = fileLoadedEvent.target.result
    if fileToLoad.name.indexOf('.sb2') >= 0
      try
        zip = new JSZip(textFromFileLoaded)
        textFromFileLoaded = zip.file('project.json').asText()
        json = JSON.parse(textFromFileLoaded)
        effacerOutput()
        Blockly.mainWorkspace.clear()
        if textFromFileLoaded.indexOf('forward:') > 0 or textFromFileLoaded.indexOf('turnLeft:') > 0 or textFromFileLoaded.indexOf('turnRight:') > 0
          block = creerBloc('reset')
          lierNextSelected block
        i = 0
        while i < json.children.length
          if !json.children[i].scripts
            i++
            continue
          #Println(i);
          liste = json.children[i].scripts[0][2]
          k = 0
          while k < liste.length
            #Println(liste[k][0]);
            sb2_commande liste[k]
            k++
          i++
      catch e
        alert 'ce fichier Scratch ne semble pas être lisible'
        alert e.message
    else
      try
        Blockly.mainWorkspace.clear()
        Blockly.Xml.domToWorkspace Blockly.mainWorkspace, Blockly.Xml.textToDom(textFromFileLoaded)
      catch e
        alert 'ce fichier ne semble pas être lisible par Blockly'
    return

  if fileToLoad.name.indexOf('.sb2') >= 0
    fileReader.readAsArrayBuffer fileToLoad
  else
    fileReader.readAsText fileToLoad, 'UTF-8'
  return

sauverFichier = ->
  textToWrite = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace))
  textFileAsBlob = new Blob([ textToWrite ], type: 'text/plain')
  fileNameToSaveAs = prompt('nom du fichier (sauvé dans le dossier de téléchargements) ?', 'fichier.bly')
  if fileNameToSaveAs == null
    return
  downloadLink = document.createElement('a')
  downloadLink.download = fileNameToSaveAs
  downloadLink.innerHTML = 'Download File'
  if window.webkitURL != null
    # Chrome allows the link to be clicked
    # without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
  else
    # Firefox requires the link to be added to the DOM
    # before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob)

    downloadLink.onclick = (event) ->
      document.body.removeChild event.target
      return

    downloadLink.style.display = 'none'
    document.body.appendChild downloadLink
  downloadLink.click()
  return

###
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
###

Print = (texte) ->
  txt = if typeof texte != 'undefined' then texte else ''
  mypre = document.getElementById('output')
  mypre.innerHTML = mypre.innerHTML + txt
  return

Println = (texte) ->
  txt = if typeof texte != 'undefined' then texte else ''
  mypre = document.getElementById('output')
  mypre.innerHTML = mypre.innerHTML + txt + '\n'
  return

effacerOutput = ->
  mypre = document.getElementById('output')
  mypre.innerHTML = ''
  return

Message = (texte) ->
  txt = if typeof texte != 'undefined' then texte else ''
  mypre = document.getElementById('message')
  mypre.innerHTML = txt
  return

effacerMessage = ->
  mypre = document.getElementById('message')
  mypre.innerHTML = ''
  return

###
prompt_bak = window.prompt;
window.prompt= function(msg) {
	Message("question : " + msg + "\n"+ "---> tapez votre réponse au clavier, puis validez (touche Entrée ou bouton OK)");
	var rep = prompt_bak(msg);
	//if(navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
		effacerMessage();
	//}
	return rep;
}
###

###
Utilitaire pour gérer un éditeur Python :
	- reprend editeur.js en prenant en compte des zones de dessin pour les tortues si elles existent
	- gère l'exécution d'un programme Python avec Skulpt
###
tabuler = (code) ->
  tabus = ''
  k = 1
  while k <= 10
    code = code.split('\n' + tabus + '  ').join('\n' + tabus + '\u0009')
    tabus += '\u0009'
    k++
  code

# ---------------------------------------------------------------------------
# Exécution de programmes Python
# ---------------------------------------------------------------------------

outf = (text) ->
  mypre = document.getElementById('output')
  mypre.innerHTML = mypre.innerHTML + text
  return

builtinRead = (x) ->
  if Sk.builtinFiles == undefined or Sk.builtinFiles['files'][x] == undefined
    throw 'File not found: \'' + x + '\''
  Sk.builtinFiles['files'][x]

runPython = (editor) ->
  `var lig`
  effacerOutput()
  prog = editor.getValue()
  mypre = document.getElementById('output')
  mypre.innerHTML = ''
  Sk.canvas = 'mycanvas'
  Sk.pre = 'output'
  Sk.configure
    output: outf
    read: builtinRead
  try
    eval Sk.importMainWithBody('<stdin>', false, prog)
  catch e
    Println e.toString()
    try
      lig = e.lineno
      Println 'erreur ligne ' + lig
      editor.gotoLine lig
    catch e1
  return

###
Utilitaire pour gerer un editeur
###

plierDeplierEditeur = ->
  obj = document.getElementById('editor')
  if obj.style.height != '0px'
    obj.style.height = '0px'
    obj.style.visibility = 'hidden'
  else
    obj.style.visibility = 'visible'
    obj.style.height = window.innerHeight - 200 + 'px'
    editor.resize()
  return

tabuler = (code) ->
  tabus = ''
  k = 1
  while k <= 10
    code = code.split('\n' + tabus + '  ').join('\n' + tabus + '\u0009')
    tabus += '\u0009'
    k++
  code


###
Utilitaire pour ouvrir ou sauver des fichiers textes avec l'éditeur.
Instructions pour créer ensuite les boutons (voir demo_fichiers.html par exemple):
	<input type="file" id="fileToLoadEdit" style="display: none" onchange="ouvrirFichierEdit(editor);" />
	<input type="button" value="Ouvrir" onclick="ouvrirClickEdit();"/>
	<button type="button" onclick="sauverFichierEdit(editor)">Sauver</button>
###

ouvrirClickEdit = ->
  fileinput = document.getElementById('fileToLoadEdit')
  fileinput.click()
  return

ouvrirFichierEdit = (editor) ->
  fileToLoad = document.getElementById('fileToLoadEdit').files[0]
  fileReader = new FileReader

  fileReader.onload = (fileLoadedEvent) ->
    textFromFileLoaded = fileLoadedEvent.target.result
    try
      editor.setValue textFromFileLoaded, -1
      editor.focus()
    catch e
      alert 'ce fichier ne semble pas être lisible'
    return

  fileReader.readAsText fileToLoad, 'UTF-8'
  return

sauverFichierEdit = (editor) ->
  textToWrite = editor.getValue()
  textFileAsBlob = new Blob([ textToWrite ], type: 'text/plain')
  fileNameToSaveAs = prompt('nom du fichier (sauvé dans le dossier de téléchargements) ?', 'script.py')
  if fileNameToSaveAs == null
    return
  downloadLink = document.createElement('a')
  downloadLink.download = fileNameToSaveAs
  downloadLink.innerHTML = 'Download File'
  if window.webkitURL != null
    # Chrome allows the link to be clicked
    # without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
  else
    # Firefox requires the link to be added to the DOM
    # before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob)

    downloadLink.onclick = (event) ->
      document.body.removeChild event.target
      return

    downloadLink.style.display = 'none'
    document.body.appendChild downloadLink
  downloadLink.click()
  return

###
Fichier permettant de changer les styles par défaut de Blockly, en particulier :
	- taille du menu principal
	- taille des bulles d'aide
	- taille et couleur des menus contextuels

Cet utilitaire évite de modifier directement le fichier css.js des sources de Blockly.
###

# modifierCss('.blocklyTreeLabel {', 'font-size:', 'font-size: 25pt;');	
# taille de la police : ici 25
# modifierCss('.blocklyTreeRow {', 'height:', 'height: 28pt;');	
# taille du rectangle englobant (un peu supérieure à celle de la police) : ici 28
# fonction modifiant le tableau de style Blockly.Css.CONTENT  #---------------------------------------------------------------------------------------

modifierCss = (style, attribut, valeur) ->
  content = Blockly.Css.CONTENT
  pos = content.indexOf(style)
  if pos < 0
    return
  k = pos
  while k < content.length
    if content[k].indexOf(attribut) == 0
      content[k] = valeur
      return
    if content[k] == '}'
      content.splice k, 0, valeur
      return
    k++
  return

###

# bulle d'aide
modifierCss '.blocklyTooltipDiv {', 'font-size:', 'font-size: 15pt;'
# taille de la police : ici 25
# menu contextuel
modifierCss '.blocklyWidgetDiv .goog-menuitem-content {', 'font:', 'font: bold 15px Arial, sans-serif;'
# taille de la police : ici 15
modifierCss '.blocklyWidgetDiv .goog-menuitem-content {', 'background:', 'background: #0f0;'
# fond de chaque commande : ici vert
modifierCss '.blocklyWidgetDiv .goog-menuitem {', 'background:', 'background: #ff0;'

###

runBlockly = ->
  effacerOutput()
  window.LoopTrap = 20000
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Nombre d\'iterations limité à 20000 : passez à Python (bouton Editeur)";\n'
  code = Blockly.JavaScript.workspaceToCode(workspace)
  try
    eval code
  catch e
    alert e
  return

getPythonText = ->
  Blockly.Python.tortues = 0
  try
    code_js = Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace)
    if code_js.indexOf('totos[') > 0
      Blockly.Python.tortues = 1
    if code_js.indexOf('new Tortue(') > 0
      Blockly.Python.tortues = 2
    code = Blockly.Python.workspaceToCode(Blockly.mainWorkspace)
    if Blockly.Python.tortues == 1
      code = 'from turtle import * \n' + code
    else if Blockly.Python.tortues == 2
      code = 'from turtle import * \n\n' + 'tortues={}  # pour stocker toutes les tortues (sauf celle par défaut)\n\n' + code + '\nhideturtle()  # pour masquer la tortue par défaut'
    # code = "# code Python cree par Blockly \n\n" + code;
  catch e
    code = '# Blockly n\'a pu etre traduit en Python'
  code

###
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
###


