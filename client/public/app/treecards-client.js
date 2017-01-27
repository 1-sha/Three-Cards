var sio = io.connect(window.location.origin);
var n;

sio.on('update:connect', function(data) {
	n = data.n;
	$('#n').html(n);
});

$('#btnStart').click(function(){sio.emit('cmd:start')});
$('#btnPlay').click(function(){sio.emit('cmd:play',{n:n})});