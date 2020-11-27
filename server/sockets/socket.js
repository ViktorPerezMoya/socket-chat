const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuario = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat',(data,callback) => {
        
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                message: "El nombre/sala es noecesario."
            });
        }

        client.join(data.sala);

        let personas = usuario.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', usuario.getPersonasPorSala(data.sala));
        console.log(personas);
        callback(personas);
        
    });

    client.on('crearMensaje',(data) => {
        let persona = usuario.getPersona(client.id);
        client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje(persona.nombre, data.mensaje));
    });

    client.on('mensajePrivado',(data)=>{
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre,data.mensaje)
        client.broadcast.to(data.iddestino).emit('mensajePrivado',mensaje);
    });

    client.on('disconnect', () => {
        let persBorrada = usuario.borrarPersona(client.id);
        console.log(persBorrada);

        client.broadcast.to(persBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`El usaurio ${persBorrada.nombre} se ha desconectado.`));
        client.broadcast.to(persBorrada.sala).emit('listaPersonas', usuario.getPersonasPorSala(persBorrada.sala));
        
        console.log(`Usuario ${persBorrada.nombre} desconectado`);
    });

});