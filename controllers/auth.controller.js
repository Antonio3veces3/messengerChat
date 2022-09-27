const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {User} = require('../models')
const { generateJWT } = require('../helpers/generate-JWT');
const { googleVerify } = require('../helpers/google-verify');



const login = async (req = request,res = response)=>{
    const { mail, password } = req.body;

    try {
        //Verify mail
        const user = await User.findOne({mail});
        if(!user) return res.status(400).json({
            error: `The mail ${mail} | doesn't exists`
        })

        //verify if the user is active
        if(!user.status) return res.status(400).json({
            error: `User ${user.name} doesn't exists | status: false`
        })
        
        //verify pass
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) return res.status(400).json({
            error: `Invalid password`
        });

        //Generate JWT
        const token = await generateJWT(user.id);
        res.json({
            msg: 'Login OK',
            user,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Contact the Admin"
        });
    }    
};


const googleSignIn = async(req = request, res= response)=>{
    const {id_token} = req.body;

    try {
        const {name, img, mail} = await googleVerify(id_token);

        // Verify if the user exists.

        let existsUser = await User.findOne({mail});

        if(!existsUser){
            const data = {
                name, 
                img,
                mail,
                google: true,
                password: ':)'
            };

            existsUser = new User( data );
            await existsUser.save();
        }

        //Verify if the user is active
        if(!existsUser.status){
            return res.status(401).json({
                error: "The user is locked"
            }); 
        }

        const token = await generateJWT(existsUser.id);
        console.log(existsUser);
        res.json({
            status: 'OK',
            token,
            googleUser: existsUser
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            error: "Incorrect account"
        });
    }

};

const renovarToken = async(req, res=response)=>{
    const user = req.user;
    const token = await generateJWT(user.id);

    res.json({
        user,
        token
    });
}
module.exports= {
    login,
    googleSignIn,
    renovarToken
}