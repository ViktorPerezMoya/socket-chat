var socket = io();
var params = new URLSearchParams(window.location.search)

if(!params.has('nombre') || !params.has('sala')){
    window.location = "index.html";
    throw new Error("El nombre/sala es requerido.");
}

var usuario  =  {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat',usuario, function(resp){
        console.log("Usuarios conectados: ",resp);
    });
});

//escuchar un mensaje
socket.on('crearMensaje',function(mensaje){
    console.log(mensaje);
});

//escucha nuevo listado de personas
socket.on('listaPersonas',function(data){
    console.log(data);
});

socket.on('mensajePrivado',function(mensaje){
    console.log("Mensaje privado: ",mensaje);
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});