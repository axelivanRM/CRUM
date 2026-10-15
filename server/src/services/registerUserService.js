import { query } from "../config/database.js";

async function validateUserAdmin(user, rol){

    const textQuery = `SELECT * FROM usuarios WHERE rol = $1 and usuario = $2`;
    const paramsQuery = [rol,user];
    const resultQuery = await query(textQuery, paramsQuery);

        if(resultQuery.rows.length > 0){
            return resultQuery.rows[0];
        } else {
            return false;
        }
}


async function validateUserCrum(user, rol){

    let textQuery = `SELECT * FROM usuarios WHERE rol = $1 and usuario = $2`;
    let paramsQuery = [rol,user];
    let resultQuery = await query(textQuery, paramsQuery);
    
    if(resultQuery.rows.length > 0){
        const idUser = resultQuery.rows[0].id_usuario;

        textQuery = `SELECT * FROM operadores WHERE id_operador = $1`;
        paramsQuery = [idUser];
        resultQuery = await query(textQuery, paramsQuery);

        if(resultQuery.rows.length > 0){
          return resultQuery.rows[0];
        }

    } else{
        return false;
    }
}

async function validateUserAmbulance(user, rol){

    let textQuery = `SELECT* FROM usuarios WHERE rol =$1 and usuario = $2`;
    let paramsQuery = [rol, user];
    let resultQuery = await query(textQuery, paramsQuery);

    if(resultQuery.rows.length > 0){

        const idUser = resultQuery.rows[0].id_usuario;

        console.log('idUser:', idUser);

        textQuery = `SELECT * FROM ambulancias WHERE id_ambulancia = $1`;
        paramsQuery = [idUser];
        resultQuery = await query(textQuery, paramsQuery);

        console.log('resultQuery:', resultQuery.rows[0]);

        if(resultQuery.rows.length > 0){
          return resultQuery.rows[0];
        }
    } else{
        return false;
    }

}

async function registerUserAdmin({user, userPassword, rol, accessPassword}) {

    if(accessPassword === process.env.ACCESS_PASSWORD){

        const userExists = await validateUserAdmin(user, rol);

        if(userExists){
            throw new Error('ya existe un administrador registrado');
        }else{

            const textQueryUsuarios = `INSERT INTO usuarios (usuario, contrasena, rol) 
                                       VALUES ($1, $2, $3) RETURNING id_usuario AS id, 
                                       usuario AS user, rol`;

            const paramsQueryUasuarios = [user, userPassword, rol];
            const resultQuery = await query(textQueryUsuarios, paramsQueryUasuarios);
            return resultQuery.rows[0];

        }
    }else{
        throw new Error('clave de acceso incorrecta');
    }
}

async function registerUserCrum({user, userPassword, rol, userName, headquartersCrum}){
    
    console.log(userName, headquartersCrum);
    
    const userExists = await validateUserCrum(user, rol);

    if(userExists){
        throw new Error('ya existe este usuario');
    }else{
            const textQueryUsuarios = `INSERT INTO usuarios (usuario, contrasena, rol) 
                                       VALUES ($1, $2, $3) RETURNING id_usuario AS id, 
                                       usuario AS user, rol`;
            const paramsQueryUsuarios = [user, userPassword, rol];
            const resultQueryUsuarios = await query(textQueryUsuarios, paramsQueryUsuarios);
            
            const idUser = resultQueryUsuarios.rows[0].id;

            const textQueryOperadores = `INSERT INTO operadores (id_operador, nombre, sede_crum)
                                        VALUES ($1, $2, $3) RETURNING id_operador AS id, 
                                        nombre AS userName, sede_crum AS headquartersCrum`;
            const paramsQueryOperadores = [idUser, userName, headquartersCrum];
            const resultQueryOperadores = await query(textQueryOperadores, paramsQueryOperadores);

            return {
                id: resultQueryUsuarios.rows[0].id,
                user: resultQueryUsuarios.rows[0].user,
                name: resultQueryOperadores.rows[0].userName,
                headquartersCrum: resultQueryOperadores.rows[0].headquartersCrum
            };
    }
}


async function registerUserAmbulance({user, userPassword, rol, licensePlates, typeOfAmbulance, operationalBase}){

    const userExists = await validateUserAmbulance(user, rol);

    if(userExists){
        throw new Error('ya existe este usuario');
    }else {

        const textQueryUsuarios = `INSERT INTO usuarios (usuario, contrasena, rol)
                                       VALUES ($1, $2, $3) RETURNING id_usuario AS id,
                                       usuario AS user, rol`;
        const paramsQueryUsuarios = [user, userPassword, rol];
        const resultQueryUsuarios = await query (textQueryUsuarios, paramsQueryUsuarios);

        const idUser = resultQueryUsuarios.rows[0].id;

        const textQueryAmbulancias = `INSERT INTO ambulancias (id_ambulancia, placas, tipo_ambulancia, base_operativa)
                                        VALUES ($1, $2, $3, $4) RETURNING id_ambulancia AS id,
                                        placas, tipo_ambulancia AS typeOfAmbulance, base_operativa AS operationalBase`;
        const paramasQueryAmbulancias = [idUser, licensePlates, typeOfAmbulance, operationalBase];
        const resultQueryAmbulancias = await query(textQueryAmbulancias, paramasQueryAmbulancias);

        return {
            id: resultQueryUsuarios.rows[0].id,
            user: resultQueryUsuarios.rows[0].user,
            licensePlates: resultQueryAmbulancias.rows[0].placas,
            typeOfAmbulance: resultQueryAmbulancias.rows[0].typeOfAmbulance,
            operationalBase: resultQueryAmbulancias.rows[0].operationalBase
        }
    }
}

export {
    registerUserAdmin,
    registerUserCrum,
    registerUserAmbulance
};
