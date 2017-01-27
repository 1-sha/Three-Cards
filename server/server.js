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
//paths
var client_path = path.resolve(__dirname, '../client'); //adresse du dossier client
//gestion client socket.io
var clientList = [];    //liste des clients socket.io connectés
var activeClient = 0;
//gestion command socket.io
var commands;
var adminCommands;

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
/******** Socket.io listeners *********/

io.on('connection', function(socket) {

    var data = {};

    clientList.push(socket);

    if (clientList.length == 1) {   //premier connecté est admin

        data.leader = true;

        for(var cmd in adminCommands)
        {
            socket.on(cmd, adminCommands[cmd]);
        }
    }

    for(var cmd in commands)
    {
        socket.on(cmd, commands[cmd]);
    }

    data.n = clientList.length;

    socket.emit('update:connect', data); 
});

// Listeners
adminCommands = {
    'cmd:start' : cmdStart
};

commands = {
    'cmd:play'  : cmdPlay
};

//dans ces fonctions, "this" est le socket qui reçoit la commande.
function cmdStart() {
    if (threecards.inProgress) {
        console.log('Game already initialized.');
    } else if (!threecards.init(clientList.length)) {
        console.log('Game failed to initialize. Aborting...');
        process.exit(1);    //Quitte avec un code erreur de 1
    } else  {
        console.log('Game initialized correctly.');

        //choix du 1er joueur
        activeClient == 0;
        clientList[activeClient].emit('update:active');
    }
}

function cmdPlay(data) {
    if (isActiveClient(this)) 
        switch (threecards.handler(data)) {
            case 'next_player':
                activeClient = cycle(++activeClient,clientList.length);
                clientList[activeClient].emit('update:active');
                break;
            case 'err_not_initialized':
                break;
            default: break;
        }
}

/**************************************/
/************* Function ***************/

//Renvoie True si le client passé en paramètre est le client actif.
function isActiveClient(socket) {
    return getThisClient(socket) == activeClient; 
}

//Renvoie le num client du socket passé en paramètre.
function getThisClient(socket) {
    return clientList.findIndex(function(e){return e===socket}); //.findIndex(e => e===socket)
}

//Repositionne l'entier passé en paramètre entre les bornes min et max.
function cycle(a, min, max) {
    if (!max) {
        max = min;
        min = 0;
    }
    return (a%max) + min;
}
/**************************************/
/************** SERVER ****************/

http.listen(80, function() {
    console.log('listening on *:80');

    

});

/**************************************/