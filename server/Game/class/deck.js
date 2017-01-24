
/**
 * Export.
 */

module.exports = deck;

/**
 * Constructeur.
 */

function deck () {
    this.values = [1,2,3,4,5,6,7,8,9,10,11,12,13];  //toutes les valeurs de cartes
    this.suits = ['S','C','H','D']; //toutes les couleurs de cartes

    this.cards = [];
    this.newSet();
}

/**
 * Nouveau jeu de cartes trié.
 */

deck.prototype.newSet = function() {
    this.cards.length = 0;
    var s = this.suits, v = this.values; 
    for (var j, i = 0; i < s.length; i++)
        for (j = 0; j < v.length; j++)
            this.cards.push(new Card(v[j], s[i]));
    return this;
};

/**
 * Mélange les cartes.
 */

deck.prototype.shuffle = function() {
    var shuff = this.cards;
    this.cards = [];
    while (shuff.length > 0) {
        this.cards.push(shuff.splice(Math.floor(Math.random() * shuff.length), 1)[0]);
    }
    return this;
};

/**
 * Distribue une carte.
 */

deck.prototype.deal = function() {
    return this.cards.pop();
};

/**
 * Classe: une carte.
 */

function Card (v,s) {
    this.s = s;
    this.v = v;
}