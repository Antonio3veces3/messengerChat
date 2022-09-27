const jwt = require('jsonwebtoken');
const {User} = require('../models');

const generateJWT= async( uid = '')=>{
    return new Promise((resolve, reject)=>{
        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '7d'
        }, (err,token)=>{
            if(err){
                console.log(err);
                reject(`We can't generate the JWT`)
            }else{
                resolve(token);
            }
        })
    })
}


const verifyJWT = async(token = ' ')=>{
    try {
        if(token < 10){
            return null;
        }

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById( uid );
        if(user && user.status){
            return user;
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}
module.exports = {
    generateJWT,
    verifyJWT
}