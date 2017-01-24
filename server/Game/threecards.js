
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
    this.deck = new deck();
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

    return true;
};

/**
 * Gestion des requêtes client.
 * @PARAM: requête
 * @PARAM: données de la requête
 */

threecards.prototype.handler = function(req, data) {
    return true;
};