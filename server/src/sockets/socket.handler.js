
import {dataLocationSchema} from '../schemas/dataLocation.schemas.js';

async function getDataLocation(socket){

    //get the user data location from the socket object
    socket.on('update_position', async(payload)=>{
        try{

            const validateDataLocation = dataLocationSchema.safeParse(payload);

            if (!validateDataLocation.success) {
                return socket.emit('error', {
                    message: "Datos de ubicación inválidos",
                    errors: validateDataLocation.error.issues.map(({path, message}) => ({
                        field: path.join("."),
                        message
                    }))
                })
            }

            console.log({data: validateDataLocation.data, user: socket.user.id_user});

            socket.emit('update_position', {
                status: 'ok',
                message: 'Ubicación actualizada correctamente',
                data: {...validateDataLocation.data, user: socket.user.id_user}
            })
            

        }catch(error){
            socket.emit('error', {
                code: 'error del servidor',
                message: error.message
            });
        }
    })
}

export default function (io){
    io.on('connection', getDataLocation)
};