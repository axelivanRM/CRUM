import {query} from '../config/dataBase.js';
import jwt from 'jsonwebtoken';

async function authenticateUser({user, userPassword}){

    const textQuery = `SELECT id_usuario, rol, contrasena 
                        FROM usuarios 
                        WHERE usuario = $1 AND contrasena = $2 
                        LIMIT 1`;
    const paramsQuery = [user, userPassword];
    const resultQuery = await query(textQuery, paramsQuery);

    if(resultQuery.rows.length === 0){

        throw new Error('Verifica tus credenciales o pide a tu administrador que te registre');
    }else{

        const payload = {
            id: resultQuery.rows[0].id_usuario,
            rol: resultQuery.rows[0].rol,
            shiftStartTime: Date.now()
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2h'});

        return {
            token: token,
            user: payload
        }
    }
}



export{
    authenticateUser,
}