workspace = undefined
editor = ace.edit("editor")
editor.getSession().setUseSoftTabs false
editor.getSession().setMode 'ace/mode/python'
  
$ ->
  $.ajax
    type: "GET"
    url: "js/vendor/blockly/keys/toolbox.xml"
    dataType: "xml"
    success: (xml) ->
      workspace = Blockly.inject 'blocklyDiv',
        media: "js/vendor/blockly/keys/media/"
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
   
  $( ".toggleMode" ).on "click", ->  
    $( "#pythonMode, #blocklyMode, .blocklyToolboxDiv" ).toggle()
    if $( "#pythonMode" ).is( ":visible" )
      texte = getPythonText()
      editor.setValue tabuler(texte), -1
      editor.focus()
   
  $( "#blocklyToCommandes" ).on "click", ->
     $( "#pythonMode, #blocklyMode, .blocklyToolboxDiv" ).toggle()
     effacerOutput()
     Println 'Entrez vos commandes, puis cliquez sur le bouton Commandes...'
     Println 'Remarque : le bouton Blockly permet de retourner à Blockly sans exécuter les commandes'
     return
   
  $( "#commandes" ).on "click", -> 
    $( "#pythonMode, #blocklyMode, .blocklyToolboxDiv" ).toggle()
    effacerOutput()
    texteToBlockly getText()
    effacerOutput()
    return
    
  $( "#executer"  ).on "click", -> runPython(editor)
   
  $( "button#d1" ).on "click", ->
    workspace.clear()
    $.ajax
      type: "GET"
      url: "xml/demo1.xml"
      dataType: "xml"
      success: (xml) -> Blockly.Xml.domToWorkspace $(xml).find("#demo1")[0], workspace
        
  Println '1) Il y a un exemple Blockly à tester...'
  Println '2) Pour passer de Blockly à Python, cliquez sur le bouton Editeur...'
  
  
