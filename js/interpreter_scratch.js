

//////////////////////////////////////////////////////
// Execution d'une commande
//////////////////////////////////////////////////////

function sb2_commande(mots) {
		//alert("sb2_commande : " +mots);
		var bloc=null;
		try {
			if (mots.length==0) return null;
			if (mots[0]=="changeVar:by:" || mots[0]=="setVar:to:") {
				bloc = sb2_commandeVariable(mots);
				return bloc;
			}
			if (mots[0]=="doAsk") {
				bloc = sb2_commandeDemander(mots);
				return bloc;
			}
			if (mots[0].indexOf("say:")==0) {
				bloc = sb2_commandeAfficher(mots);
				return bloc;
			}
			if (mots[0]=="doUntil") { 
				bloc = sb2_commandeTantque(mots);
				return bloc;
			}
			if (mots[0]=="doRepeat") { // répéter simple ou répéter pour ou répéter tant(que)
				bloc = sb2_commandeRepeter(mots);
				return bloc;
			}
			if (mots[0]=="doIf" || mots[0]=="doIfElse") {
				bloc = sb2_commandeSi(mots);
				return bloc;
			}
			if (mots[0]=='forward:' || mots[0]=='backward:' || mots[0]=='turnLeft:' || mots[0]=='turnRight:') {
				bloc = sb2_commandeTortue(mots);
				return bloc;
			}
		} catch (e) {
			alect("commande non interpretee : " +mots);
			alert(e.message);
		};
		return null;
}

//////////////////////////////////////////////////////
// Utilitaires
//////////////////////////////////////////////////////

function creerBloc(prototypeName) {
	//var block = Blockly.Block.obtain(Blockly.getMainWorkspace(), prototypeName);
	var block = workspace.newBlock(prototypeName);
	block.initSvg();
	block.render();
	return block;
}

Blockly.Block.prototype.renameVar = function(oldName, newName) {
  for (var i = 0, input; input = this.inputList[i]; i++) {
    for (var j = 0, field; field = input.fieldRow[j]; j++) {
      if (field instanceof Blockly.FieldVariable &&
          Blockly.Names.equals(oldName, field.getValue())) {
        field.setValue(newName);
      }
    }
  }
};

function nomDeVariable(nom) {
	// return (Blockly.mainWorkspace.variableIndexOf(mots[0])>=0);
	var variableList = Blockly.Variables.allVariables(workspace);
	for (var i = 0, varname; varname = variableList[i]; i++) {
			if (varname==nom) return true;
	}
	return false;
}

function lierOutput(block, inputName, childBlock) {
	if (block==null) return;
	if (childBlock==null) return;
	var parentConnection = block.getInput(inputName).connection;
	var childConnection = childBlock.outputConnection;
	parentConnection.connect(childConnection);
}

function lierNextSelected(block) {
	if (block==null) return;
	if (Blockly.selected) {
		if (Blockly.selected.nextConnection) {
			block.previousConnection.connect(Blockly.selected.nextConnection);
		}
	}
	Blockly.getMainWorkspace().traceOn(true);
	Blockly.getMainWorkspace().highlightBlock(block.id);
}

function lierTarget(block, inputName, childBlock) {
	if (block==null) return;
	if (childBlock==null) return;
	var parentConnection = block.getInput(inputName).connection;
	var childConnection = childBlock.previousConnection;
	parentConnection.connect(childConnection);
}

//////////////////////////////////////////////////////
// Commandes : variables
//////////////////////////////////////////////////////
	
function sb2_commandeVariable(mots) {
	// alert("variable:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		if (mots.length==2) {
			//block = creerBloc('variables_get');
			block = Blockly.Block.obtain(Blockly.getMainWorkspace(), 'variables_get');
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
			return block;
		}
		if (mots[0]=="setVar:to:") {
			block = creerBloc('variables_set');
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
			childBlock = sb2_interpreterCalcul(mots[2]);
			lierOutput(block, "VALUE", childBlock);
		}
		else if (mots[0]=="changeVar:by:") {
			block = creerBloc('sophus_augmenter');
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
			childBlock = sb2_interpreterCalcul(mots[2]);
			lierOutput(block, "DELTA", childBlock);
		}
		else {
			return null;
		}
		lierNextSelected(block);
		return block;
}

function sb2_interpreterCalcul(mots) {
	//alert("sb2_interpreterCalcul:"+mots);
	var block = null;
	if (!Array.isArray(mots)) {
		if (isNaN(mots)) {
			block = creerBloc('text');
			block.setFieldValue(mots, 'TEXT');
		}
		else {
			block = creerBloc('math_number');
			block.setFieldValue(mots, 'NUM');
		}
		return block;
	}
	if (mots[0]=="answer") {
		block = creerBloc('variables_get');
		block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,"reponse");
	}
	if (mots[0]=="readVariable") {
		block = creerBloc('variables_get');
		block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
	}
	if (mots[0]=='+' || mots[0]=='-' || mots[0]=='*' || mots[0]=='/') {
		var oper = creerBloc('math_arithmetic');
		if (mots[0]=='-') { oper.getField('OP').setValue('MINUS'); }
		if (mots[0]=='*') { oper.getField('OP').setValue('MULTIPLY'); }
		if (mots[0]=='/') { oper.getField('OP').setValue('DIVIDE'); }
		if (mots[0]=='???') { oper.getField('OP').setValue('POWER'); }
		var suite;
		suite = sb2_interpreterCalcul(mots[1]);
		lierOutput(oper, "A", suite);
		suite = sb2_interpreterCalcul(mots[2]);
		lierOutput(oper, "B", suite);
		return oper;
	}
	if (mots[0]=="computeFunction:of:") {
		var nomFonct = mots[1];
		if (nomFonct=='sqrt' || nomFonct=='abs' || nomFonct=='ln' || nomFonct=='log' || nomFonct=='e ^' || nomFonct=='10 ^') {
			var fonct = creerBloc('math_single');
			if (nomFonct=='abs') { fonct.getField('OP').setValue('ABS'); }
			if (nomFonct=='ln') { fonct.getField('OP').setValue('LN'); }
			if (nomFonct=='log') { fonct.getField('OP').setValue('LOG10'); }
			if (nomFonct=='e ^') { fonct.getField('OP').setValue('EXP'); }
			if (nomFonct=='10 ^') { fonct.getField('OP').setValue('POW10'); }
			var suite;
			suite = sb2_interpreterCalcul(mots[2]);
			lierOutput(fonct, "NUM", suite);
			return fonct;
		}
		if (nomFonct=='sin' || nomFonct=='cos' || nomFonct=='tan' || nomFonct=='asin' || nomFonct=='acos' || nomFonct=='atan') {
			var fonct = creerBloc('math_trig');
			fonct.getField('OP').setValue(nomFonct.toUpperCase());
			var suite;
			suite = sb2_interpreterCalcul(mots[2]);
			lierOutput(fonct, "NUM", suite);
			return fonct;
		}
		if (nomFonct=='floor' || nomFonct=='ceiling') {
			var fonct = creerBloc('math_round');
			if (nomFonct=='floor') { fonct.getField('OP').setValue('ROUNDDOWN'); }
			if (nomFonct=='ceiling') { fonct.getField('OP').setValue('ROUNDUP'); }
			var suite;
			suite = sb2_interpreterCalcul(mots[2]);
			lierOutput(fonct, "NUM", suite);
			return fonct;
		}
	}
	if (mots[0]=="rounded") {
		var fonct = creerBloc('math_round');
		var suite;
		suite = sb2_interpreterCalcul(mots[1]);
		lierOutput(fonct, "NUM", suite);
		return fonct;
	}
	if (mots[0]=="concatenate:with:") {
		var fonct = creerBloc('text_join');
		var suite;
		suite = sb2_interpreterCalcul(mots[1]);
		lierOutput(fonct, "ADD0", suite);
		suite = sb2_interpreterCalcul(mots[2]);
		lierOutput(fonct, "ADD1", suite);
		return fonct;
	}
	if (mots[0]=="%") {
		var fonct = creerBloc('math_modulo');
		var suite;
		suite = sb2_interpreterCalcul(mots[1]);
		lierOutput(fonct, "DIVIDEND", suite);
		suite = sb2_interpreterCalcul(mots[2]);
		lierOutput(fonct, "DIVISOR", suite);
		return fonct;
	}
	if (mots[0]=="randomFrom:to:") {
		var fonct = creerBloc('math_random_int');
		var suite;
		suite = sb2_interpreterCalcul(mots[1]);
		lierOutput(fonct, "FROM", suite);
		suite = sb2_interpreterCalcul(mots[2]);
		lierOutput(fonct, "TO", suite);
		return fonct;
	}
	return block;
}

//////////////////////////////////////////////////////
// Commandes : entrees-sorties
//////////////////////////////////////////////////////

function sb2_commandeDemander(mots) {
	//alert("sb2_commandeDemander:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('scratch_demander');
		childBlock = sb2_interpreterCalcul(mots[1]);
		lierOutput(block, "TEXT", childBlock);
		lierNextSelected(block);
		return block;
}

function sb2_commandeAfficher(mots) {
	//alert("sb2_commandeAfficher:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('text_print');
		childBlock = sb2_interpreterCalcul(mots[1]);
		lierOutput(block, "TEXT", childBlock);
		lierNextSelected(block)
		return block;
}

//////////////////////////////////////////////////////
// Commandes : conditionnelles et boucles
//////////////////////////////////////////////////////

function sb2_commandeRepeter(mots) {
	//alert("sb2_commandeRepeter:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('controls_repeat_ext');
		// le nombre de répétitions
		childBlock = sb2_interpreterCalcul(mots[1]);
		lierOutput(block, "TIMES", childBlock);
		// on insere le bloc répéter
		lierNextSelected(block);
		// les blocs internes
		var parentConnection = block.getInput('DO').connection;
		block.unselect();
		var enfants = mots[2];
		for(var k=0; k<enfants.length; k++) {
			childBlock = sb2_commande(enfants[k]);
			if (parentConnection.targetConnection==null) {
				lierTarget(block, "DO", childBlock);
			}
		}
		// le bloc répéter devient le bloc courant
		workspace.traceOn(true);
		workspace.highlightBlock(block.id);
		return block;
}

function sb2_interpreterCondition(mots) {
	// alert("sb2_interpreterCondition:"+mots);
	if (!Array.isArray(mots)) return null;
	if (mots[0]=='&' || mots[0]=='|') {
		var oper = creerBloc('logic_operation');
		if (mots[0]=='|') { oper.getField('OP').setValue('OR'); }
		var suite;
		suite = sb2_interpreterCondition(mots[1]);
		lierOutput(oper, "A", suite);
		suite = sb2_interpreterCondition(mots[2]);
		lierOutput(oper, "B", suite);
		return oper;
	}
	if (mots[0]=='not') {
		var oper = creerBloc('logic_negate');
		var suite;
		suite = sb2_interpreterCondition(mots[1]);
		lierOutput(oper, "BOOL", suite);
		return oper;
	}
	if (mots[0]=='<' || mots[0]=='=' || mots[0]=='>') {
		var oper = creerBloc('logic_compare');
		if (mots[0]=='<') { oper.getField('OP').setValue('LT'); }
		if (mots[0]=='>') { oper.getField('OP').setValue('GT'); }
		var suite;
		suite = sb2_interpreterCalcul(mots[1]);
		lierOutput(oper, "A", suite);
		suite = sb2_interpreterCalcul(mots[2]);
		lierOutput(oper, "B", suite);
		return oper;
	}
	return null;
}

function sb2_commandeSi(mots) {
	//alert("sb2_commandeSi:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('controls_if');
		// on insere le bloc si
		lierNextSelected(block);
		// la condition du si
		childBlock = sb2_interpreterCondition(mots[1]);
		lierOutput(block, "IF0", childBlock);
		// les blocs internes du Si
		var parentConnection = block.getInput('DO0').connection;
		block.unselect();
		var enfants = mots[2];
		for(var k=0; k<enfants.length; k++) {
			childBlock = sb2_commande(enfants[k]);
			if (parentConnection.targetConnection==null) {
				lierTarget(block, "DO0", childBlock);
			}
		}
		// les blocs internes du Sinon
		if (mots[0]=="doIfElse") {
			block.elseCount_ = 1;
			block.updateShape_();
			parentConnection = block.getInput('ELSE').connection;
			enfants = mots[3];
			for(var k=0; k<enfants.length; k++) {
				childBlock = sb2_commande(enfants[k]);
				if (parentConnection.targetConnection==null) {
					lierTarget(block, "ELSE", childBlock);
				}
			}
		}
		// le bloc répéter devient le bloc courant
		workspace.traceOn(true);
		workspace.highlightBlock(block.id);
		return block;
}

function sb2_commandeTantque(mots) {
	//alert("sb2_commandeTantque:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('controls_whileUntil');
		block.getField('MODE').setValue('UNTIL');
		// la condition
		childBlock = sb2_interpreterCondition(mots[1]);
		lierOutput(block, "BOOL", childBlock);
		// on insere le bloc répéter
		lierNextSelected(block);
		// les blocs internes
		var parentConnection = block.getInput('DO').connection;
		block.unselect();
		var enfants = mots[2];
		for(var k=0; k<enfants.length; k++) {
			childBlock = sb2_commande(enfants[k]);
			if (parentConnection.targetConnection==null) {
				lierTarget(block, "DO", childBlock);
			}
		}
		// le bloc répéter devient le bloc courant
		workspace.traceOn(true);
		workspace.highlightBlock(block.id);
		return block;
}

//////////////////////////////////////////////////////
// Commandes : tortues
//////////////////////////////////////////////////////
	
function sb2_commandeTortue(mots) {
	//alert("sb2_commandeTortue:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		var nom_bloc;
		var nom_child;
		if (mots[0]=="turnLeft:") {
			nom_bloc = "var_gauche"; nom_child = "ANGLE";
		}
		if (mots[0]=="turnRight:") {
			nom_bloc = "var_droite"; nom_child = "ANGLE";
		}
		if (mots[0]=="forward:") {
			nom_bloc = "avancer"; nom_child = "NAME";
		}
		if (mots[0]=="backward:") {
			nom_bloc = "reculer"; nom_child = "NAME";
		}
		block = creerBloc(nom_bloc);
		childBlock = sb2_interpreterCalcul(mots[1] );
		lierOutput(block, nom_child, childBlock);
		lierNextSelected(block);
		return block;
}

