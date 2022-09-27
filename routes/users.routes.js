const { Router } = require('express');
const { check } = require('express-validator');

//MIDDLEWARES
const {
        ValidateInputs,
        validateJWT,
        isAdminRole,
        haveRole
} = require('../middlewares');

const { isRoleExists, emailExists, existUserID, existUsername } = require('../helpers/db-validators');

const { usersGET,
        usersPUT, usersPOST,
        usersDELETE,
        usersPATCH } = require('../controllers/users.controller');
const router = Router();

router.get('/', usersGET);

router.put('/:id',[
        check('id', `Isn't a valid ID`).isMongoId(),
        check('id').custom(existUserID),
        check('name').custom(existUsername),
        check('role').custom(isRoleExists),
        ValidateInputs
] ,usersPUT);

router.post('/', [
        check('name', 'The name is required').notEmpty(),
        check('name').custom(existUsername),
        check('mail', 'Email invalid').isEmail(),
        check('mail').custom(emailExists),
        check('password', 'The password must be over 6 characters').isLength({ min: 7 }),
        check('role').custom(isRoleExists),
        ValidateInputs
]//Middelware de terceros
        , usersPOST)

router.delete('/:id', [
        validateJWT,
        //Para uso estricto de ADMIN -> isAdminRole,
        haveRole('ADMIN_ROLE', 'SALES_ROLE'),
        check('id', `Isn't a valid ID`).isMongoId(),
        check('id').custom(existUserID),
        ValidateInputs
], usersDELETE);

router.patch('/', usersPATCH);






module.exports = router;