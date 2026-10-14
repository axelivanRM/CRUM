import {auth} from  '../services/auth.service.js'

export async function login(req, res){

  const {user, password, role} = req.body;

  const result = await login({user, password, role});

  if(result.error){
    res.status(400).json({error: result.error});
  }

  return res.status(201).json({message: "Usuario autenticado exitosamente"});

}
