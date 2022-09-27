const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renovarToken } = require('../controllers/auth.controller');
// const { ValidateInputs } = require('../middlewares/validate-inputs');
// const { validateJWT } = require('../middlewares/validate-jwt');
const {
    ValidateInputs, validateJWT,
} = require('../middlewares');
const router = Router();

router.post('/login',[
    check('mail', 'The mail is required').isEmail(),
    check('password', 'The password is required').notEmpty(),
    ValidateInputs
], login);

router.post('/google', [
    check('id_token', 'The id_token is required').notEmpty(),
    ValidateInputs
], googleSignIn);

router.get('/', validateJWT, renovarToken);
module.exports = router;