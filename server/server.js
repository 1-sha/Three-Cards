'use strict';
/******* Require et dépendences *******/

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

var threecards = require('./Game/threecards.js');

/**************************************/
/********* Globales et config *********/

var client_path = path.resolve(__dirname, '../client'); //adresse du dossier client

/**************************************/
/************** Routing ***************/

app.use(express.static(client_path + '/public'));

//get
app.get('/', ctrlIndex);

/**************************************/
/************* Controller *************/

//Renvoie la page d'accueil
function ctrlIndex(req, res) {
    res.sendFile(client_path+'/index.html');
}

/**************************************/
/************** SERVER ****************/

http.listen(80, function() {
    console.log('listening on *:80');

    if (!threecards.init(process.argv[2])) {
        console.log('Game failed to initialized. Aborting');
        process.exit(1);    //Quitte avec un code erreur de 1
    } else {
        console.log('Game initialized correctly');
        console.log(threecards.players.length);
        console.log(threecards.deck.shuffle().cards);
    }

});

/**************************************/