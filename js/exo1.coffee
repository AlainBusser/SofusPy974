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
  
  divsEditor  = "#pythonMode,  #boutons_editor"
  divsBlockly = "#blocklyMode, #boutons_blockly, .blocklyToolboxDiv"
  
  $( ".toggleMode" ).on "click", ->  
    $( divsEditor).toggle()
    $( divsBlockly).toggle()
    if $( "#pythonMode" ).is( ":visible" )
      texte = getPythonText()
      editor.setValue tabuler(texte), -1
      editor.focus()
    
  $( "#executer"  ).on  "click", -> runPython(editor)
  $( "#runBlocks"  ).on "click", -> runBlockly()
  $( "#saveBlocks" ).on "click", -> sauverFichier()
  $( "#openBlocks" ).on "click", -> ouvrirClick()
  $( "#fileToLoad" ).on "change",-> ouvrirFichier()

  $( "#sauverFichierEdit" ).on "click",  -> sauverFichierEdit(editor)
  $( "#ouvrirClickEdit"   ).on "click",  -> ouvrirClickEdit()
  $( "#fileToLoadEdit"    ).on "change", -> ouvrirFichierEdit()
  
  
  loadSample = (name) ->
    $( divsEditor ).hide()
    $( divsBlockly ).show()
    workspace.clear()
    $.ajax
      type: "GET"
      url: "xml/#{name}.xml"
      dataType: "xml"
      success: (xml) -> Blockly.Xml.domToWorkspace $(xml).find("##{name}")[0], workspace
    
  $( "#d0" ).on "click", -> loadSample( "seuil0" )
  $( "#d1" ).on "click", -> loadSample( "seuil1" )
  $( "#d2" ).on "click", -> loadSample( "seuil2" )
  $( "#d3" ).on "click", -> loadSample( "seuil3" )

  Println '1) Il y a quelques exemples Blockly à tester...'
  Println '2) Pour passer de Blockly à Python, cliquez sur le bouton Editeur...'
  
  