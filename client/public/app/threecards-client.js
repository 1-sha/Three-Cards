var sio = io.connect(window.location.origin);

sio.on('update:starting', function(data) {
	$('#n').html(data);
	$('#btnStart').hide();
});

sio.on('update:active', function() {
	$('#btnPlay').show();
});

sio.on('update:players', function(data) {
	$('#btnStart').show();
	$('#p').html(data);
});

$('#btnStart').click(function(){sio.emit('cmd:start')});
$('#btnPlay').click(function(){sio.emit('cmd:play',{}); $('#btnPlay').hide();});