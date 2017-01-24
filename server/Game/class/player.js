
/**
 * Export.
 */

module.exports = player;

/**
 * Constructeur.
 */
 
function player() {
    this.hand = [];     //cartes en main
    this.hidden = [];   //cartes face cachée
    this.upward = [];   //cartes dévoilées
}
