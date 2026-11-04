import {dataLocationSchema} from '../schemas/dataLocation.schema.js';

export default async function getDataLocation(socket, payload){

        try{

            const validateDataLocation = dataLocationSchema.safeParse(payload);

            if (!validateDataLocation.success) {
                return socket.emit('location_error', {
                    message: "Datos de ubicación inválidos",
                    errors: validateDataLocation.error.issues.map(({path, message}) => ({
                        field: path.join("."),
                        message
                    }))
                })
            }

            console.log({data: validateDataLocation.data, user: socket.user.idUser});

        }catch(error){
            socket.emit('location_error', {
                code: 'error del servidor',
                message: error.message
            });
        }
    }
