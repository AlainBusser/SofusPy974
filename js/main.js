// Generated by CoffeeScript 1.10.0
var editor, workspace;

workspace = void 0;

editor = ace.edit("editor");

editor.getSession().setUseSoftTabs(false);

editor.getSession().setMode('ace/mode/python');

$(function() {
  $.ajax({
    type: "GET",
    url: "js/vendor/blockly/keys/toolbox.xml",
    dataType: "xml",
    success: function(xml) {
      workspace = Blockly.inject('blocklyDiv', {
        media: "js/vendor/blockly/keys/media/",
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.1,
          maxScale: 3,
          minScale: 0.5,
          scaleSpeed: 1.2
        },
        toolbox: $(xml).find("#toolbox")[0]
      });
      Blockly.Msg.VARIABLES_SET = 'mettre %2 dans %1';
      return Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = 'regrouper';
    }
  });
  $(".divToggle").on("click", function() {
    if ($("#pythonMode").is(":visible")) {
      return $("#pythonMode").toggle();
    } else {
      return $("#blocklyMode, .blocklyToolboxDiv").toggle();
    }
  });
  $(".toggleMode").on("click", function() {
    var texte;
    $("#pythonMode, #blocklyMode, .blocklyToolboxDiv").toggle();
    if ($("#pythonMode").is(":visible")) {
      texte = getPythonText();
      editor.setValue(tabuler(texte), -1);
      return editor.focus();
    }
  });
  $("#blocklyToCommandes").on("click", function() {
    $("#pythonMode, #blocklyMode, .blocklyToolboxDiv").toggle();
    effacerOutput();
    Println('Entrez vos commandes, puis cliquez sur le bouton Commandes...');
    Println('Remarque : le bouton Blockly permet de retourner à Blockly sans exécuter les commandes');
  });
  $("#commandes").on("click", function() {
    $("#pythonMode, #blocklyMode, .blocklyToolboxDiv").toggle();
    effacerOutput();
    texteToBlockly(getText());
    effacerOutput();
  });
  $("#executer").on("click", function() {
    return runPython(editor);
  });
  $("button#d1").on("click", function() {
    workspace.clear();
    return $.ajax({
      type: "GET",
      url: "xml/demo1.xml",
      dataType: "xml",
      success: function(xml) {
        return Blockly.Xml.domToWorkspace($(xml).find("#demo1")[0], workspace);
      }
    });
  });
  Println('1) Il y a un exemple Blockly à tester...');
  return Println('2) Pour passer de Blockly à Python, cliquez sur le bouton Editeur...');
});
