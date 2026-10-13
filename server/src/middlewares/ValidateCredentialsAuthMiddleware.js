import * as z from 'zod';

const propertiesAuthUser = z.object({

    user: z.string({required_error: 'El correo electronico ess requerido'})
           .trim()
           .toLowerCase
           .email({message: 'El correo electronico no es valido'}),

    userPassword: z.string({required_error: 'La contraseña es requerida'})
                   .min(8, {message: 'La contraseña debe contar con minimo 8 caracteres'})
                   .max(20, {message: 'La contraseña debe contar con maximo 20 caracteres'}),

});

function validateCredentialUser(req, res, next){

    const validatedResult = propertiesAuthUser.safeParse(req.body);

    if(!validatedResult.success){
        const issues = validatedResult.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message
        }));

        return res.status(400).json({
            status: 'error',
            message: 'Error de validación de credenciales',
            issues: issues
        });
    }

    req.body = validatedResult.data;

    next();
} 

export {validateCredentialUser};