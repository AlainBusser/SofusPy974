
// -----------------------------------------------
// Menu Liste complété
// ------------------------------------------------

Blockly.Msg.VECTORS_GET_TITLE = "%1 [ %2 ]";
Blockly.Msg.VECTORS_GET_TOOLTIP = "renvoie un element d'une liste.";
Blockly.Blocks['vectors_getIndex'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VECTORS_GET_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": "Variable"
        },
        {
          "type": "input_value",
          "name": "AT"
        }
      ],
      //"output": 'Number',
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setOutput(true);
	this.setInputsInline(true);
    this.getInput('VALUE').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('AT').setAlign(Blockly.ALIGN_RIGHT);
    this.setTooltip(function() {
		return Blockly.Msg.VECTORS_GET_TOOLTIP;
    });
  }
};

Blockly.Msg.VECTORS_SET_TITLE = "fixer %1 [ %2 ] à %3";
Blockly.Msg.VECTORS_SET_TOOLTIP = "met une valeur dans une liste.";
Blockly.Blocks['vectors_setIndex'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VECTORS_SET_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": "Variable"
        },
        {
          "type": "input_value",
          "name": "AT",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "TO"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setInputsInline(true);
    this.getInput('VALUE').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('AT').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('TO').setAlign(Blockly.ALIGN_RIGHT);
    this.setTooltip(function() {
		return Blockly.Msg.VECTORS_SET_TOOLTIP;
    });
  }
};

Blockly.Msg.VECTORS_AUGMENTER_TITLE = "augmenter %1 [ %2 ] de %3";
Blockly.Msg.VECTORS_AUGMENTER_TOOLTIP = "ajoute un nombre à un élément d'une liste.";
Blockly.Blocks['vectors_augmenter'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VECTORS_AUGMENTER_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": "Variable"
        },
        {
          "type": "input_value",
          "name": "AT",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "DELTA"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setInputsInline(true);
    this.getInput('VALUE').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('AT').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('DELTA').setAlign(Blockly.ALIGN_RIGHT);
    this.setTooltip(function() {
		return Blockly.Msg.VECTORS_AUGMENTER_TOOLTIP;
    });
  }
};

Blockly.Msg.VECTORS_DIMINUER_TITLE = "diminuer %1 [ %2 ] de %3";
Blockly.Msg.VECTORS_DIMINUER_TOOLTIP = "soustrait un nombre à un élément d'une liste.";
Blockly.Blocks['vectors_diminuer'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VECTORS_DIMINUER_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": "Variable"
        },
        {
          "type": "input_value",
          "name": "AT",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "DELTA"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setInputsInline(true);
    this.getInput('VALUE').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('AT').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('DELTA').setAlign(Blockly.ALIGN_RIGHT);
    this.setTooltip(function() {
		return Blockly.Msg.VECTORS_DIMINUER_TOOLTIP;
    });
  }
};


Blockly.Msg.VECTORS_APPEND_TITLE = "en fin de %1 ajouter %2";
Blockly.Msg.VECTORS_APPEND_TOOLTIP = "ajoute une valeur en fin de liste.";
Blockly.Blocks['vectors_append'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.VECTORS_APPEND_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": "Variable"
        },
        {
          "type": "input_value",
          "name": "TO"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setInputsInline(true);
    this.getInput('VALUE').setAlign(Blockly.ALIGN_RIGHT);
    this.getInput('TO').setAlign(Blockly.ALIGN_RIGHT);
    this.setTooltip(function() {
		return Blockly.Msg.VECTORS_APPEND_TOOLTIP;
    });
  }
};

Blockly.Msg.SCRATCH_DEMANDER_TITLE = "demander %2 et mettre dans %1";
Blockly.Msg.SCRATCH_DEMANDER_TOOLTIP = "Demander un nombre à l’utilisateur";
Blockly.Blocks['scratch_demander'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.SCRATCH_DEMANDER_TITLE,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          'variable': "reponse"
        },
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setInputsInline(true);
    this.setTooltip(function() {
		return Blockly.Msg.SCRATCH_DEMANDER_TOOLTIP;
    });
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  }
};


Blockly.Msg.SCRATCH_DIRE_TITLE = "dire %1";
Blockly.Msg.SCRATCH_DIRE_TOOLTIP = "Afficher le texte, le nombre ou une autre valeur spécifiée";
Blockly.Blocks['scratch_dire'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.SCRATCH_DIRE_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.lists.HUE
    });
    var thisBlock = this;
	this.setInputsInline(true);
    this.setTooltip(function() {
		return Blockly.Msg.SCRATCH_DIRE_TOOLTIP;
    });
  }
};
