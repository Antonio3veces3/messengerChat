const {request, response}= require('express');
const { User } = require('../models');


const isAdminRole = async(req = request, res= response, next)=>{
    if(!req.user){
        return res.status(500).json({
            error: `Try validate role before validate the token`
        });
    }

    const { role, name} = req.user;
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            error: `${name} isn't Admin || UNAUTHORIZED `
        });
    }

    next();

};

const haveRole = (...roles)=>{
    return async(req = request, res= response, next)=>{
        if(!req.user){
            return res.status(500).json({
                error: `Try validate role before validate the token`
            });
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                error: `Only are allow this roles: ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    haveRole
}