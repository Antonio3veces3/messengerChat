const verifyInputs = require('../middlewares/validate-inputs');
const verifyJWT = require('../middlewares/validate-jwt');
const verifyRole = require('../middlewares/validate-role');
const verifyFileUpload = require('../middlewares/validate-fileUpload')

module.exports= {
    ...verifyInputs,
    ...verifyJWT,
    ...verifyRole,
    ...verifyFileUpload,
}

