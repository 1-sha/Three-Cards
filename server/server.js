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
    if (threecards.inProgress) {
        var empty;
        if ((empty = clientList.indexOf(null)) != -1) { //reconnexion 

            clientList[empty] = socket;

            for(var cmd in commands)
            {
                socket.on(cmd, commands[cmd]);
            }

            socket.emit('update:starting', getThisClient(socket)+1);    //renvoie de l'état de la partie
            if (isActiveClient(socket)) socket.emit('update:active');   //si le client était actif, on le notifie
            if (getThisClient(socket) == 0) socket.emit('update:players', clientList.length);   //si le client était admin, on le notifie

            console.log('Server: Client ' + (empty+1) + ' reconnects');
        }

    } else {

        clientList.push(socket);    //nouveau joueur

        for(var cmd in commands)
        {
            socket.on(cmd, commands[cmd]);
        }

        clientList[0].emit('update:players', clientList.length);

        console.log('Server: New client - ' + clientList.length);
    }

    if (getThisClient(socket) == 0) {   //1er connecté est admin

        console.log('   got admin rights');

        for(var cmd in adminCommands)
        {
            socket.on(cmd, adminCommands[cmd]);
        }
    }
});

// Listeners
adminCommands = {
    'cmd:start' : cmdStart
};

commands = {
    'cmd:play'  : cmdPlay,
    'disconnect' : cmdDisconnect
};

//dans ces fonctions, "this" est le socket qui reçoit la commande.
function cmdStart() {
    if (clientList.length > 1)
    if (threecards.inProgress) {
        console.log('Game already initialized.');
    } else if (!threecards.init(clientList.length)) {
        console.log('Game failed to initialize. Aborting...');
        process.exit(1);    //Quitte avec un code erreur de 1
    } else  {
        console.log('Game initialized correctly.');

        for (var i=0; i<clientList.length; i++)
            clientList[i].emit('update:starting', (i+1));

        //choix du 1er joueur
        activeClient == 0;
        clientList[activeClient].emit('update:active');
    }
}

function cmdDisconnect() {
    var c;
    if ((c = getThisClient(this)) != -1) {

        console.log('Server: Client ' + (c+1) + ' disconnected');

        if (threecards.inProgress) {
            clientList[c] = null;
        } else {
            clientList.splice(c,1);

            if (c == 0 && clientList.length > 0) { //si l'admin part, un nouvel admin est choisi
                for(var cmd in adminCommands)
                {
                    clientList[0].on(cmd, adminCommands[cmd]);
                }
            }
        }
        if (clientList.length > 0)
            if (clientList[0] != null) {
                clientList[0].emit('update:players', clientList.length);
            }
    }
}

function cmdPlay(data) {
    if (isActiveClient(this)) {

        data.player = getThisClient(this);

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
}

/**************************************/
/************* Function ***************/

//Renvoie True si le client passé en paramètre est le client actif.
function isActiveClient(socket) {
    return getThisClient(socket) == activeClient; 
}

//Renvoie le num client du socket passé en paramètre.
function getThisClient(socket) {
    return clientList.indexOf(socket); //.findIndex(e => e===socket)
    // return clientList.findIndex(function(e){return e===socket}); //.findIndex(e => e===socket)
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