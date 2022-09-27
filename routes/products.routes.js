const { Router } = require('express');
const { check } = require('express-validator');

const { createProduct, GETproducts, GETproductByID, PUTproduct, DELETEproduct } = require('../controllers/products.controller');
const { existsCategoryID, existUserID, existsProductID } = require('../helpers/db-validators');

const {
    validateJWT, ValidateInputs, isAdminRole,
} = require('../middlewares');

const router = Router();

//GET all products  | public
router.get('/', GETproducts)

//GET ONLY ONE CATEGORIE | public
router.get('/:id', [
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(existsProductID),
    ValidateInputs
], GETproductByID);

//CREATE PRODUCT | public || valid token
router.post('/', [
    validateJWT,
    check('name', 'The product name is required').notEmpty(),
    check('category', 'The category is required').notEmpty(),
    check('category', 'Invalid ID').isMongoId(),
    check('category').custom(existsCategoryID),
    ValidateInputs
], createProduct);

//UPDATE product | public || valid token
router.put('/:id', [
    validateJWT,
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(existsProductID),
    ValidateInputs
], PUTproduct);

//DELETE product  | private || ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(existsProductID),
    ValidateInputs
], DELETEproduct);

module.exports = router;