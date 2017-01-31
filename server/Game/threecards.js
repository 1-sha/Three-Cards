
/**
 * Dépendences.
 */
var deck = require('./class/deck.js');
var player = require('./class/player.js');

/**
 * Export.
 */

module.exports = new threecards;

/**
 * Constructeur.
 */

function threecards() {
    this.players = [];
    this.discard = [];
    this.stack = [];
    this.deck = new deck();

    this.inProgress = false;
}

/**
 * Initialize une nouvelle partie.
 * @PARAM: nombre de joueurs
 */

threecards.prototype.init = function(nb_players) {
    if (nb_players < 2)
        return false;

    for (var i=0; i<nb_players; i++) {
        this.players.push(new player());
    }

    this.handler = handler;

    this.inProgress = true;
    return this.inProgress;
};

/**
 * Gestion des requêtes client.
 * @PARAM: données de la requête
 */
threecards.prototype.handler = function() {return 'err_not_initialized'};
function handler(data) {
    console.log('[ThreeCards] : Player ' + data.player + ' played.');
    return 'next_player';
};