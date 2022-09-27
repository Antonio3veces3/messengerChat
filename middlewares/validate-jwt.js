const { request, response }= require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');


const validateJWT = async(req = request, res = response, next)=>{
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            error: 'The token is required'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);
        //Verify user
        if(!user){
            return res.status(401).json({
                error: `The user doesn't exists`
            });

        }
        //Verify user admin and active
        if(!user.status || !user.role == 'ADMIN_ROLE'){
            return res.status(401).json({
                error: `The user doesn't exists || The user isn't Admin`
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: 'Invalid token'
        })
    }
};

module.exports = {
    validateJWT
}