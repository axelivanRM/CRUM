
import getDataLocation from './getDataLocation.handler.js'

function onconnection(socket){
    console.log('usuario conectado con id:', socket.id);

    //only test delete this line
    socket.emit('socket_connected', socket.id);

    socket.on('update_position', (payload) => getDataLocation(socket, payload));

    socket.on('disconnect', (reason) => {
        console.log(`usuario desconectado con id: ${socket.id}, razón: ${reason}`);
    })

}

export default function (io){
    io.on('connection', onconnection)
};