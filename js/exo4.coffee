workspace = undefined
editor = ace.edit("editor")
editor.getSession().setUseSoftTabs false
editor.getSession().setMode 'ace/mode/python'

exo1 = 
  titre  : "Pentagone"
  enonce : "Votre mission si vous l'acceptez, est de programmer la tortue pour qu'elle dessine un pentagone régulier convexe."
exo2 = 
  titre  : "Pentagone étoilé"
  enonce : "Maintenant la tortue devra dessiner une étoile à 5 branches. I didn't shoot the sheriff !"
exo3 = 
  titre  : "Pentagramme"
  enonce : "Et maintenant les deux: Une étoile à 5 branches dans un pentagone"
exo4 = 
  titre  : "Solution"
  enonce : "Voici un exemple de programme de pentagramme"

$ ->
  $.ajax
    type: "GET"
    url: "xml/exo4-toolbox.xml"
    dataType: "xml"
    success: (xml) ->
      workspace = Blockly.inject 'blocklyDiv',
        media: "js/vendor/blockly/media/"
        zoom:
          controls: true
          wheel: true
          startScale: 1.1
          maxScale: 3
          minScale: 0.5
          scaleSpeed: 1.2
        toolbox: $(xml).find("#toolbox")[0]
     
      Blockly.Msg.VARIABLES_SET = 'mettre %2 dans %1'
      Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = 'regrouper'
  
  # Toggle Blockly / Python
  divsPython  = "#pythonMode,  #boutons_editor"
  divsBlockly = "#blocklyMode, #boutons_blockly, .blocklyToolboxDiv"
  
  $( ".toggleMode" ).on "click", ->  
    $( divsPython ).toggle()
    $( divsBlockly).toggle()
    if $( "#pythonMode" ).is( ":visible" )
      texte = getPythonText()
      editor.setValue tabuler(texte), -1
      editor.focus()
    
  # Blockly events
  $( "#runBlocks"  ).on "click", -> runBlockly()
  $( "#saveBlocks" ).on "click", -> sauverFichier()
  $( "#openBlocks" ).on "click", -> ouvrirClick()
  $( "#fileToLoad" ).on "change",-> ouvrirFichier()
  
  # Python events
  $( "#executer"  ).on  "click", -> runPython(editor)
  $( "#sauverFichierEdit" ).on "click",  -> sauverFichierEdit(editor)
  $( "#ouvrirClickEdit"   ).on "click",  -> ouvrirClickEdit()
  $( "#fileToLoadEdit"    ).on "change", -> ouvrirFichierEdit()
  $( "#py2algo"           ).on "click",  -> afficherPseudocode()
  
  # Charger un fichier blockly depuis le repertoire xml/name.xml
  loadSample = (name, exo) ->
    $( divsPython ).hide()
    $( divsBlockly).show()
    $( "#enonce h2" ).html exo.titre
    $( "#enonce p" ).html exo.enonce
    $( "#enonce").show()
    workspace.clear()
    $.ajax
      type: "GET"
      url: "xml/#{name}.xml"
      dataType: "xml"
      success: (xml) -> 
        Blockly.Xml.domToWorkspace $(xml).find("##{name}")[0], workspace
    
  $( "#t0" ).on "click", -> loadSample( "turtle0", exo1 )
  $( "#t1" ).on "click", -> loadSample( "pentagone1", exo2 )
  $( "#t2" ).on "click", -> loadSample( "pentagone2", exo3 )
  $( "#t3" ).on "click", -> loadSample( "pentagramme", exo4 )
  
  
  
