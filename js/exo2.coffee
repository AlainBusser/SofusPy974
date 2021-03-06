workspace = undefined
editor = ace.edit("editor")
editor.getSession().setUseSoftTabs false
editor.getSession().setMode 'ace/mode/python'

$ ->
  $.ajax
    type: "GET"
    url: "xml/exo2-toolbox.xml"
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
      
      updatePython = ->
        code = Blockly.Python.workspaceToCode()
        editor.setValue code
      Blockly.addChangeListener updatePython
  
  # Toggle Blockly / Python
  divsPython  = "#pythonMode,  #boutons_editor"
  divsBlockly = "#blocklyMode, #boutons_blockly, .blocklyToolboxDiv"
  $(divsPython).show()
  
  $( ".toggleMode" ).on "click", ->  
    $( divsPython ).show()
    $( divsBlockly).show()
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
  loadSample = (name) ->
    $( divsPython ).show()
    $( divsBlockly).show()
    workspace.clear()
    $.ajax
      type: "GET"
      url: "xml/#{name}.xml"
      dataType: "xml"
      success: (xml) -> 
        Blockly.Xml.domToWorkspace $(xml).find("##{name}")[0], workspace
    
  $( "#p0" ).on "click", -> loadSample( "affect2" )
  $( "#p1" ).on "click", -> loadSample( "pourcent1" )
  $( "#p2" ).on "click", -> loadSample( "pourcent2" )
  $( "#p3" ).on "click", -> loadSample( "pourcent3" )
  
  # Afficher un message dans output
  Println 'Ceci est la console de sortie'
  Println 'Les affichages "print" se feront ici'
  
  
