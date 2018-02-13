

//////////////////////////////////////////////////////
// Exécution d'une commande (une ligne de programme) ou d'un programme
//////////////////////////////////////////////////////

function commande(mots) {
	Println("commande : " +mots);
	if (mots.length==0) return null;
	// renommage
	if (mots[0] == "if") { mots[0] = "si"; }
	else if (mots[0] == "while") { mots[0] = "tantque"; }
	else if (mots[0] == "repeter") { mots[0] = "répéter"; }
	else if (mots[0] == "else") { mots[0] = "sinon"; }
	else if (mots[0] == "elif") { mots[0] = "sinonsi"; }
	else if (mots[0] == "print") { mots[0] = "afficher";	}
	else if (mots[0] == "forward") {	mots[0] = "avancer"; }
	else if (mots[0] == "backward") { mots[0] = "reculer"; }
	else if (mots[0] == "left") { mots[0] = "gauche"; }
	else if (mots[0] == "rigth") { mots[0] = "droite"; }
	// on applique les commandes
	try {
		if (mots[0]=="variable") {
			return commandeVariable(mots);
		}
		//if (mots[0]=='+' || mots[0]=='-' || mots[0]=='*' || mots[0]=='x' || mots[0]=='/' || nomDeFonction(mots[0])) {
		if (mots[0]=='+' || mots[0]=='-' || mots[0]=='*'|| mots[0]=='/' || nomDeFonction(mots[0])) {
			return commandeTransformerCalcul(mots);
		}
		if (mots[0]=='et' || mots[0]=='ou') {
			return commandeTransformerCondition(mots);
		}
		if (mots[0]=="afficher") {
			return commandeAfficher(mots);
		}
		if (mots[0]=="lire") {
			return commandeLire(mots);
		}
		if (mots[0]=="tantque" || (mots[0]=="tant" && mots.indexOf("que")==1)) { 
			return commandeTantque(mots);
		}
		if (mots[0]=="pour") { 
			return commandePour(mots);
		}
		if (mots[0]=="for") { 
			return commandeFor(mots);
		}
		if (mots[0]=="répéter") { 
			return commandeRepeter(mots);
		}
		if (mots[0]=="si") {
			return commandeSi(mots);
		}
		if (mots[0]=="faire") {
			return commandeFaire(mots);
		}
		if (mots[0]=='avancer' || mots[0]=='reculer' || mots[0]=='gauche' || mots[0]=='droite') {
			return commandeTortue(mots);
		}
		if (mots.length<=2) return null;
		if (mots[1] == "=" && mots.indexOf("input")>=2) {
			return commandeLire(["lire", mots[0]]);
		}
		if (mots[1] == "=" || mots[1]=="+" || mots[1]=="-" || mots[1]=="/" || mots[1]=="*") {
			mots.unshift("variable");
			//Println(mots);
			return commandeVariable(mots);
		}
		return null;
	} catch(e) {
		alert("commande non interpretee : " +mots);
		alert(e.message);
		return null;
	}
}

	function texteToBlockly(commandes) {
		//var commandes = getText();
		commandes = commandes.split("<=").join("@LTE@");
		commandes = commandes.split(">=").join("@GTE@");
		commandes = commandes.split("!=").join("@NEQ@");
		commandes = commandes.split("**").join("@POWER@");
		commandes = commandes.split("!=").join("=");
		commandes = commandes.split("==").join("=");
		commandes = commandes.split("<---").join("=");
		commandes = commandes.split("<--").join("=");
		commandes = commandes.split("(").join(" ( ");
		commandes = commandes.split(")").join(" ) ");
		commandes = commandes.split(",").join(" , ");
		commandes = commandes.split(":").join(" : ");
		commandes = commandes.split("+").join(" + ");
		commandes = commandes.split("-").join(" - ");
		commandes = commandes.split("*").join(" * ");
		commandes = commandes.split("/").join(" / ");
		commandes = commandes.split("=").join(" = ");
		commandes = commandes.split("<").join(" < ");
		commandes = commandes.split(">").join(" > ");
		commandes = commandes.split("@LTE@").join(" <= ");
		commandes = commandes.split("@GTE@").join(" >= ");
		commandes = commandes.split("@NEQ@").join(" != ");
		commandes = commandes.split("@POWER@").join(" ** ");
		//Println("com={" + commandes + "}");
		commandes = commandes.replace(/  +/g, ' '); // remplace des espaces consécutifs par un seul
		commandes = commandes.split("\n");
		var ligne;
		var mots;
		var bloc;
		var indent;
		var blocs = [null, null, null, null, null];
		var blocs_faire = [true, true, true, true, true];
		var blocs_pos = 0;
		for(var i=0; i<(commandes.length); i++) {
			ligne = commandes[i];
			if (ligne == null) continue;
			indent = 1+ligne.lastIndexOf("\t");
			//Println("indent:"+indent);
			ligne = ligne.trim();	// enleve aussi les tabulations
			ligne = ligne.toLowerCase();
			var mots = ligne.split(" ");
			if (mots.length==0) continue;
			if (mots.length==1) continue;
			if (mots[mots.length-1] == "none") continue;
			try {
				if (indent>blocs_pos) {
					if (blocs_faire[indent-1]==true) {
						blocs_faire[indent-1] = false;
						mots.unshift("faire");
					}
				}
				if (indent<=blocs_pos) {
					if (blocs[indent]!=null) {
						blocs[indent].select();
					}
				}
				bloc = commande(mots);
				if (bloc==null && mots[0] != "sinon" && mots[0] != "sinonsi") { 
					continue;
				}
				if (mots[0] == "sinon") { 
					if (blocs[indent]!=null) {
						blocs_pos = indent;
						blocs_faire[indent] = true;
						if (blocs[indent].type=="controls_if") {					
							blocs[indent].elseCount_ = 1;
							blocs[indent].appendStatementInput('ELSE')
								.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
							//Blockly.getMainWorkspace().traceOn(true);
							//Blockly.getMainWorkspace().highlightBlock(blocs[indent].id);
						}
					}
					continue;
				}
				if (mots[0] == "sinonsi") { 
					if (blocs[indent]!=null) {
						blocs_pos = indent;
						blocs_faire[indent] = true;
						if (blocs[indent].type=="controls_if") {
							blocs[indent].elseifCount_ = blocs[indent].elseifCount_ + 1;
							blocs[indent].appendValueInput('IF' + blocs[indent].elseifCount_)
								.setCheck('Boolean')
								.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
							blocs[indent].appendStatementInput('DO' + blocs[indent].elseifCount_)
								.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
							var childBlock = interpreterCondition(mots.slice(1));
							lierOutput(blocs[indent], "IF"+blocs[indent].elseifCount_, childBlock);
							//Blockly.getMainWorkspace().traceOn(true);
							//Blockly.getMainWorkspace().highlightBlock(blocs[indent].id);
							//blocs[indent].select();
						}
					}
					continue;
				}
				// Println(bloc.type);
				if (bloc.type=="controls_if" || bloc.type=="controls_for" || bloc.type=="controls_whileUntil" || bloc.type=="controls_repeat_ext") {
					blocs_pos = indent;
					blocs[indent] = bloc;
					blocs_faire[indent] = true;					
				}
			} catch (e) {
				alert(e);
			}
		}
	}
	
//////////////////////////////////////////////////////
// Utilitaires
//////////////////////////////////////////////////////

function creerBloc(prototypeName) {
	var block = Blockly.Block.obtain(Blockly.getMainWorkspace(), prototypeName);
	//var block = workspace.newBlock(prototypeName);
	block.initSvg();
	block.render();
	return block;
}

/*
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
*/

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

function nomDeVariable(nom) {
	// return (Blockly.mainWorkspace.variableIndexOf(mots[0])>=0);
	var variableList = Blockly.Variables.allVariables(workspace);
	for (var i = 0, varname; varname = variableList[i]; i++) {
			if (varname==nom) return true;
	}
	return false;
}

function nomDeFonction(nom) {
	if (nom=="racine" || nom=="sqrt" || nom=="math.sqrt") return "ROOT";
	if (nom=="absolu") return "ABS";
	if (nom=="NEG") return "NEG";  // c'est un - détecté par interpréterCalcul, transformé en NEG pour ne pas être confondu avec une soustraction
	return false;
}


//////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////
	
function commandeVariable(mots) {
	Println("variable:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		if (mots.length==2) {
			//block = creerBloc('variables_get');
			block = Blockly.Block.obtain(Blockly.getMainWorkspace(), 'variables_get');
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
			return block;
		}
		if (mots[2]=="=") {
			block = creerBloc('variables_set');
			// Blockly.mainWorkspace.createVariable(mots[1]);
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
			childBlock = interpreterCalcul(mots.slice(3));
			lierOutput(block, "VALUE", childBlock);
		}
		else if (mots[2]=="+" || mots[2]=="-" || mots[2]=="/" || mots[2]=="*") {
			var nom_bloc = "sophus_augmenter"; 
			if (mots[2]=="-") nom_bloc = "sophus_diminuer"; 
			if (mots[2]=="/") nom_bloc = "sophus_diviser";  
			if (mots[2]=="*") nom_bloc = "sophus_multiplier"; 
			block = creerBloc(nom_bloc);
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[1]);
			childBlock = interpreterCalcul(mots.slice(3));
			lierOutput(block, "DELTA", childBlock);
		}
		else {
			return null;
		}
		lierNextSelected(block);
		return block;
}

function parentheseFermante(mots) {
	var compteur = 0;
	for(var k=0; k<(mots.length); k++) {
		if (mots[k]=="(") {
			compteur = compteur+1;
		}
		else if (mots[k]==")") {
			compteur = compteur-1;
			if (compteur==0) return k;
		}
	}
	return mots.length;
}


function interpreterCalcul(mots) {
	Println("interpreterCalcul:"+mots);
	if (mots.length==0)  return null;
	var block = null;
	var pos;
	if (mots[0]=='(') {
		pos = parentheseFermante(mots);
		block = interpreterCalcul(mots.slice(1,pos));
		if (pos>=mots.length-1) return block;
		return appliquerCalcul(block, mots.slice(pos+1));
	}
	if (nomDeFonction(mots[0]) || mots[0]=='-') {
		if (mots.length==1)  return null;
		if (mots[0]=='-') {
			if (!isNaN(mots[1])) {
				mots[1] = "-" + mots[1];
				return interpreterCalcul(mots.slice(1));
			}
			if (nomDeVariable(mots[1])) {
				block = interpreterCalcul([mots[1]]);
				block = appliquerCalcul(block, ["NEG"]);
				if (mots.length==2) return block;
				return appliquerCalcul(block, mots.slice(2));
			}
			mots[0] = "NEG";
		}
		if (mots[1]=='(') {
			pos = parentheseFermante(mots);
			block = interpreterCalcul(mots.slice(2,pos));
			block = appliquerCalcul(block, [mots[0]]);
			if (pos>=mots.length-1) return block;
			return appliquerCalcul(block, mots.slice(pos+1));
		}
		block = interpreterCalcul(mots.slice(1));
		return appliquerCalcul(block,[mots[0]]);
	}
	if (isNaN(mots[0])) {
		//if (Blockly.mainWorkspace.variableIndexOf(mots[0])>=0) {
		if (nomDeVariable(mots[0])) {
			block = creerBloc('variables_get');
			block.renameVar(Blockly.Msg.VARIABLES_DEFAULT_NAME,mots[0]);
		}
		else {
			block = creerBloc('text');
			block.setFieldValue(mots[0], 'TEXT');
		}
	}
	else {
		block = creerBloc('math_number');
		block.setFieldValue(mots[0], 'NUM');
	}
	if (mots.length==1)  return block;
	return appliquerCalcul(block, mots.slice(1));
}

function appliquerCalcul(block, mots) {
	Println("appliquerCalcul:"+mots);
	if (block==null) return null;
	if (mots.length==0) return block;
	var parentConnection, childConnection;
	var suite = null;
	//if (mots[0]=='+' || mots[0]=='-' || mots[0]=='*' || mots[0]=='x' || mots[0]=='/') {
	if (mots[0]=='+' || mots[0]=='-' || mots[0]=='*' || mots[0]=='/' || mots[0]=='**') {
		var oper = creerBloc('math_arithmetic');
		if (mots[0]=='-') { oper.getField('OP').setValue('MINUS'); }
		if (mots[0]=='*') { oper.getField('OP').setValue('MULTIPLY'); }
		//if (mots[0]=='x') { oper.getField('OP').setValue('MULTIPLY'); }
		if (mots[0]=='/') { oper.getField('OP').setValue('DIVIDE'); }
		if (mots[0]=='**') { oper.getField('OP').setValue('POWER'); }
		lierOutput(oper, "A", block);
		suite = interpreterCalcul(mots.slice(1));
		lierOutput(oper, "B", suite);
		return oper;
	}
	if (nomDeFonction(mots[0])) {
		var nomFonct = nomDeFonction(mots[0]);
		if (nomFonct=='ROOT' || nomFonct=='ABS' || nomFonct=='NEG') {
			var fonct = creerBloc('math_single');
			if (nomFonct=='ABS') { fonct.getField('OP').setValue('ABS'); }
			if (nomFonct=='NEG') { fonct.getField('OP').setValue('NEG'); }
			lierOutput(fonct, "NUM", block);
			return fonct;
		}
	}
	return block;
}

//////////////////////////////////////////////////////
// Conditions
//////////////////////////////////////////////////////

function indexOf(choix, mots) {
	var res = -1;
	var pos;
	for(var k=0; k<(choix.length); k++) {
		pos = mots.indexOf(choix[k]);
		if ((pos>=0) && (res<0 || pos<res)) res = pos;
	}
	return res;
}

function interpreterCondition(mots) {
	Println("interpreterCondition:"+mots);
	var oper = creerBloc('logic_compare');
	var pos1, pos2;
	var valeur;
	pos1 = indexOf( ["et","ou"], mots );
	pos2 = indexOf( ["<",">","=","<=",">=","!="], mots );
	if (pos2>0 && pos2<mots.length-1) {
		if (mots[pos2]=="<") { oper.getField('OP').setValue('LT'); }
		else if (mots[pos2]==">") { oper.getField('OP').setValue('GT'); }
		else if (mots[pos2]==">=") { oper.getField('OP').setValue('GTE'); }
		else if (mots[pos2]=="<=") { oper.getField('OP').setValue('LTE'); }
		else if (mots[pos2]=="!=") { oper.getField('OP').setValue('NEQ'); }
		valeur = interpreterCalcul(mots.slice(0,pos2));
		lierOutput(oper, "A", valeur);
		valeur = interpreterCalcul(mots.slice(pos2+1));
		lierOutput(oper, "B", valeur);
	}
	if (pos1>0 && pos1<mots.length-1) {
		return appliquerCondition(oper, mots.slice(pos1));
	}
	return oper;
}

function appliquerCondition(block, mots) {
	Println("appliquerCondition:"+mots);
	if (block==null) return null;
	if (mots.length==0) return block;
	var parentConnection, childConnection;
	var suite = null;
	if (mots[0]=='et' || mots[0]=='ou') {
		var oper = creerBloc('logic_operation');
		if (mots[0]=='ou') { oper.getField('OP').setValue('OR'); }
		lierOutput(oper, "A", block);
		suite = interpreterCondition(mots.slice(1));
		lierOutput(oper, "B", suite);
		return oper;
	}
	return block;
}

//////////////////////////////////////////////////////
// Entrees-sorties
//////////////////////////////////////////////////////

function commandeAfficher(mots) {
	//Println("commandeAfficher:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('text_print');
		childBlock = interpreterCalcul(mots.slice(1));
		lierOutput(block, "TEXT", childBlock);
		lierNextSelected(block);
		return block;
}

function commandeLire(mots) {
	//Println("commandeLire:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('scratch_demander');
		block.setFieldValue(mots[1], 'VAR');
		//block.renameVar(reponse,mots[1]);
		childBlock = interpreterCalcul([mots[1] + " ?"]);
		lierOutput(block, "TEXT", childBlock);
		lierNextSelected(block);
		return block;
}

//////////////////////////////////////////////////////
// si et boucles
//////////////////////////////////////////////////////

function commandeRepeter(mots) {
	//Println("commandeRepeter:"+mots);
		if (mots.indexOf("pour")==1) return commandePour(mots.slice(1));
		if (mots.indexOf("tantque")==1) return commandeTantque(mots.slice(1));
		if (mots.indexOf("tant")==1) return commandeTantque(mots.slice(1));
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('controls_repeat_ext');
		childBlock = interpreterCalcul(mots.slice(1));
		lierOutput(block, "TIMES", childBlock);
		lierNextSelected(block);
		return block;
}

function commandeSi(mots) {
	//Println("commandeSi:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('controls_if');
		//block.elseCount_=1;
		//block.elseifCount_=4;
		//block.updateShape_();
		childBlock = interpreterCondition(mots.slice(1));
		lierOutput(block, "IF0", childBlock);	
		lierNextSelected(block);
		return block;
}

function commandeTantque(mots) {
	//Println("commandeTantque:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		block = creerBloc('controls_whileUntil');
		if (mots[0]=="tantque") {
			childBlock = interpreterCondition(mots.slice(1));
		} 
		else {
			childBlock = interpreterCondition(mots.slice(2));
		}
		lierOutput(block, "BOOL", childBlock);	
		lierNextSelected(block);
		return block;
}
	
function commandePour(mots) {
	//Println("commandePour:"+mots);
		var block = null;
		var valeur;
		if (mots.length==1) return null;
		block = creerBloc('controls_for');
		block.renameVar(block.getFieldValue('VAR'),mots[1]);
		var pos2 = mots.indexOf("et");
		if (pos2>3 && pos2<mots.length-1) {
			valeur = interpreterCalcul(mots.slice(3,pos2));
			lierOutput(block, "FROM", valeur);
			valeur = interpreterCalcul(mots.slice(pos2+1));
			lierOutput(block, "TO", valeur);
			valeur = interpreterCalcul([1]);
			lierOutput(block, "BY", valeur);
		}
		lierNextSelected(block);
		return block;
}

function commandeFaire(mots) {
	Println("commandeFaire:"+mots);
		if (mots.length==1) return null;
		if (!Blockly.selected) return null;
		var block = Blockly.selected;
		var input = block.getInput('DO'); 
		var input_elseif;
		if (block.type=="controls_if") {
			// on cherche la première branche sans descendants
			input = block.getInput('DO0');
			if (input.connection.targetConnection!=null) {
				for(var k=1; k<=block.elseifCount_; k++) {
					input_elseif = block.getInput('DO'+k);
					if (input_elseif!=null) {
						if (input_elseif.connection.targetConnection==null) {
							input = input_elseif;
							break;
						}
					}
				}
			}
			if (input.connection.targetConnection!=null) {
				if (block.getInput('ELSE')!=null) {
					input = block.getInput('ELSE');
				}
			}
		}
		if (block.type=="controls_whileUntil") {
			input = block.getInput('DO');
		}
		if (block.type=="controls_for") {
			input = block.getInput('DO');
		}
		if (input==null) return null;
		var childBlock = null;
		block.unselect(); 	// evite que childBlock soit attaché comme fils de block
		childBlock = commande(mots.slice(1));
		if (childBlock==null) {
			block.select();
			return null;
		}
		var parentConnection = input.connection;
		var childConnection = childBlock.previousConnection;
		if (parentConnection.targetConnection==null) {
			parentConnection.connect(childConnection);
		}
		else {
			//confirm("not null:" +input.name);
			var nextBlock = parentConnection.targetBlock();
			//nextBlock.setParent(null);
			parentConnection.connect(childConnection);
			nextBlock.previousConnection.connect(childBlock.nextConnection);
		}
		/*
		workspace.traceOn(true);
		workspace.highlightBlock(block.id);
		return block;
		*/
		childBlock.select();
		return childBlock;
}
	
function commandeFor(mots) {
	Println("commandeFor:"+mots);
		var block = null;
		var valeur;
		if (mots.length==1) return null;
		block = creerBloc('controls_for');
		block.renameVar(block.getFieldValue('VAR'),mots[1]);
		var pos1 = mots.indexOf("(");
		var pos2 = mots.indexOf(",");
		if (pos1>=4) {
			valeur = interpreterCalcul(mots.slice(pos1));
			if (pos2>=0) {
				lierOutput(block, "FROM", valeur);
				valeur = interpreterCalcul(mots.slice(pos2+1));
				lierOutput(block, "TO", valeur);
			}
			else {
				lierOutput(block, "TO", valeur);
				valeur = interpreterCalcul([0]);
				lierOutput(block, "FROM", valeur);
			}
			valeur = interpreterCalcul([1]);
			lierOutput(block, "BY", valeur);
		}
		lierNextSelected(block);
		return block;
}

//////////////////////////////////////////////////////
// tortues
//////////////////////////////////////////////////////
	
function commandeTortue(mots) {
	//Println("commandeTortue:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==1) return null;
		var nom_bloc;
		var nom_child;
		if (mots[0]=="gauche") {
			nom_bloc = "var_gauche"; nom_child = "ANGLE";
		}
		if (mots[0]=="droite") {
			nom_bloc = "var_droite"; nom_child = "ANGLE";
		}
		if (mots[0]=="avancer") {
			nom_bloc = "avancer"; nom_child = "NAME";
		}
		if (mots[0]=="reculer") {
			nom_bloc = "reculer"; nom_child = "NAME";
		}
		block = creerBloc(nom_bloc);
		childBlock = interpreterCalcul(mots.slice(1));
		lierOutput(block, nom_child, childBlock);
		lierNextSelected(block);
		return block;
}

//////////////////////////////////////////////////////
// transformations du bloc courant
//////////////////////////////////////////////////////

function commandeTransformerCalcul(mots) {
	Println("transformerCalcul:"+mots);
		var block = null;
		var childBlock = null;
		if (mots.length==0) return null;
		if (Blockly.selected) {
			Println(Blockly.selected); 
			if (Blockly.selected.outputConnection) {
				var previousTarget = Blockly.selected.outputConnection.targetConnection;
				/*
				if (previousTarget) {
					Blockly.selected.setParent(null);
				}
				*/
				//Blockly.selected.unplug();
				block = appliquerCalcul(Blockly.selected, mots);
				if (previousTarget && block) {
					previousTarget.connect(block.outputConnection);
				}
			}
		}
}

function commandeTransformerCondition(mots) {
		var block = null;
		var childBlock = null;
		if (mots.length==0) return null;
		if (Blockly.selected) { 
			if (Blockly.selected.outputConnection) {
				var previousTarget = Blockly.selected.outputConnection.targetConnection;
				/*
				if (previousTarget) {
					Blockly.selected.setParent(null);
				}
				*/
				//Blockly.selected.unplug();
				block = appliquerCondition(Blockly.selected, mots);
				if (previousTarget && block) {
					previousTarget.connect(block.outputConnection);
				}
			}
		}
}

	