import {query} from '../config/database.js'
import crypto from 'crypto';

async function login({user, password, role}){

    const textQueryUsuarios = `SELECT (usuario, rol) FROM usuarios
                       WHERE user = $1 AND password = $2 AND rol = $3`;
    const paramsQueryUsuarios = [user, password, role];
    const resultQueryUsuarios = await query(textQueryUsuarios, paramsQueryUsuarios);

    if(resultQueryUsuarios.rows[0] === 0){
        throw new Error('Verifica tus credenciales o pide a tu administrador que te registre');
    }else{
        const token = crypto.randomBytes(32).toString('hex');
        const DateOfIssue = new Date().now();
        const expirationDate = new Date(DateOfIssue.getTime() + 2 * 60 * 60 * 1000); // 2 horas
        const textQuerySesiones = `INSERT INTO sesiones (token, fecha_emision, fecha_expiracion, id_usuario)
                            VALUES ($1, $2,$3, $40)`
        const paramsQuerySesiones = [token, DateOfIssue, expirationDate, resultQueryUsuarios.rows[0].id_usuario];
        const resultQuerySesiones = await query(textQuerySesiones, paramsQuerySesiones);

        return {
            id: resultQueryUsuarios.rows[0].id_usuario,
            user: resultQueryUsuarios.rows[0].usuario,
            token: resultQuerySesiones.rows[0].token,
        }
    }

}