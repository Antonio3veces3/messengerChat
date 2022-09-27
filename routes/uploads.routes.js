const { Router } = require('express');
const { check } = require('express-validator');

const {
    ValidateInputs, validateFilesUpload,
} = require('../middlewares');


const { uploadFiles, showImage, updateImageCloudinary } = require('../controllers/uploads.controller');
const { validCollections } = require('../helpers');
const router = Router();

router.post('/', validateFilesUpload ,uploadFiles);

router.put('/:collection/:id',[
    validateFilesUpload,
    check('id','The ID must be a Mongo ObjectID ').isMongoId(),
    check('collection').custom(c => validCollections(c, ['users', 'products'])),
    ValidateInputs
], updateImageCloudinary)

router.get('/:collection/:id', [
    check('id','The ID must be a Mongo ObjectID ').isMongoId(),
    check('collection').custom(c => validCollections(c, ['users', 'products'])),
    ValidateInputs
], showImage)
module.exports = router;