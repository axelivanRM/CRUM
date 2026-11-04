import service from '../services/auth.service.js';

async function authenticateSocket(socket, next){

    try {

        //get the token from the socket handshake
        const token = socket.handshake.auth?.token;
        if (!token){
            return next(new Error("Token no proporcionado"));
        }
        //check if the token is valid and get the user data
        const user = await service.validateToken(token);
        //attach the user data to the socket object
        socket.user = user;
        
        next();

    }catch(error){
        next(new Error(error.message));
    }
}

export default function(io){
    io.use(authenticateSocket);
}