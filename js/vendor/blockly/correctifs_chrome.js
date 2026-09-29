// Correctifs pour faire tourner ce Blockly (2016) dans les navigateurs récents.
// À charger juste après blockly_compressed.js.

(function() {
  'use strict';

  // 1) Glisser-déposer impossible dans Chrome (bug signalé en septembre 2026).
  // Au survol d'un bloc de la palette, addSelect() le passait au premier plan en
  // le retirant puis en le réinsérant dans le DOM (appendChild). Chrome envoie
  // désormais le mousedown suivant au parent (g.blocklyBlockCanvas) au lieu du
  // bloc : Blockly ne voit jamais le clic et le bloc ne suit pas la souris.
  // Firefox n'est pas concerné.
  // Le survol se contente maintenant de surligner le bloc ; le passage au
  // premier plan se fait quand le bloc est sélectionné, comme dans les versions
  // récentes de Blockly.
  Blockly.BlockSvg.prototype.addSelect = function() {
    Blockly.addClass_(this.svgGroup_, 'blocklySelected');
  };

  var select = Blockly.BlockSvg.prototype.select;
  Blockly.BlockSvg.prototype.select = function() {
    select.call(this);
    if (Blockly.selected == this) {
      var root = this.getSvgRoot();
      if (root.parentNode && root.parentNode.lastChild != root) {
        root.parentNode.appendChild(root);
      }
    }
  };

  // 2) Sons : Blockly précharge ses sons au premier mouvement de souris, avant
  // tout clic. Chrome refuse alors de jouer un son (politique d'autoplay) et
  // play() renvoie une promesse rejetée, affichée en rouge dans la console :
  // « play() failed because the user didn't interact with the document first ».
  // Sans conséquence, mais trompeur quand on cherche un bug : on ignore ce refus.
  var ignorerRefus = function(promesse) {
    if (promesse && promesse.catch) {
      promesse.catch(function() {});
    }
  };

  Blockly.WorkspaceSvg.prototype.preloadAudio_ = function() {
    for (var nom in this.SOUNDS_) {
      var son = this.SOUNDS_[nom];
      son.volume = 0.01;
      ignorerRefus(son.play());
      son.pause();
      if (goog.userAgent.IPAD || goog.userAgent.IPHONE) {
        break;
      }
    }
  };

  Blockly.WorkspaceSvg.prototype.playAudio = function(nom, volume) {
    var son = this.SOUNDS_[nom];
    if (son) {
      if (!(goog.userAgent.DOCUMENT_MODE && goog.userAgent.DOCUMENT_MODE === 9 ||
            goog.userAgent.IPAD || goog.userAgent.ANDROID)) {
        son = son.cloneNode();
      }
      son.volume = volume === undefined ? 1 : volume;
      ignorerRefus(son.play());
    } else if (this.options.parentWorkspace) {
      this.options.parentWorkspace.playAudio(nom, volume);
    }
  };
})();
