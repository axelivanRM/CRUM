import {validateFeaturesAdmin, 
        validateFeaturesCrum, 
        validateFeaturesAmbulance} 
        from '../middlewares/ValidateCredencialsRegisterMiddleware.js';

import {getCredentialAdmin, 
        getCredentialCrum, 
        getCredentialAmbulance} 
        from '../controllers/registerUserController.js';


import {Router} from 'express';
const router = Router();

router.post('/admin', validateFeaturesAdmin, getCredentialAdmin);
router.post('/crum', validateFeaturesCrum, getCredentialCrum);
router.post('/ambulance', validateFeaturesAmbulance, getCredentialAmbulance);

export default router;