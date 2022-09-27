const { Router } = require('express');
const { check } = require('express-validator');

const { createCategory, GETcategories, GETcategoryByID, PUTcategory, DELETEcategory } = require('../controllers/categories.controller');
const { existsCategoryID, existsProductID } = require('../helpers/db-validators');

const {
    validateJWT, ValidateInputs, isAdminRole,
} = require('../middlewares');

const router = Router();

//GET all categories  | public
router.get('/', GETcategories)

//GET ONLY ONE CATEGORIE | public
router.get('/:id', [
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(existsCategoryID),
    ValidateInputs
], GETcategoryByID)

//CREATE CATEGORY | public || valid token
router.post('/', [
    check('name', 'The category name is required').notEmpty(),
    validateJWT,
    ValidateInputs
], createCategory)

//UPDATE category | public || valid token
router.put('/:id', [
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(existsProductID),
    check('name', `The name is required`).notEmpty(),
    validateJWT,
    ValidateInputs
], PUTcategory)

//DELETE category  | private || ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(existsCategoryID),
    ValidateInputs
], DELETEcategory);

module.exports = router;