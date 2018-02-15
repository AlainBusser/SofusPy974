workspace = undefined
editor = ace.edit("editor")
editor.getSession().setUseSoftTabs false
editor.getSession().setMode 'ace/mode/python'

$ ->
  $.ajax
    type: "GET"
    url: "xml/exo1-toolbox.xml"
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
  
  # Charger un fichier blockly depuis le repertoire xml/name.xml
  loadSample = (name) ->
    $( divsPython ).hide()
    $( divsBlockly).show()
    workspace.clear()
    $.ajax
      type: "GET"
      url: "xml/#{name}.xml"
      dataType: "xml"
      success: (xml) -> 
        Blockly.Xml.domToWorkspace $(xml).find("##{name}")[0], workspace
    
  $( "#a1" ).on "click", -> loadSample( "affect2" )
  $( "#a2" ).on "click", -> loadSample( "affect1" )
  
  # Afficher un message dans output
  Println 'Ceci est la console de sortie'
  Println 'Les affichages "print" se feront ici'
  
  
