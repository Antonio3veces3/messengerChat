const { response, request, query } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');


const usersGET = async (req, res) => {
    const { limit = 5, until = 0 } = req.query;
    const query = { status: true }

    if (!parseInt(limit) || !parseInt(until) && until != 0) return res.status(400).json({
        error: "The params must be whole numbers"
    })

    //Realiza las 2 promesas simultaneamente, es mucho más rápido que hacer las promesas por separado.
    const result = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(until)
            .limit(limit)
    ]);

    res.status(200).json({
        total: result[0],
        users: result[1]
    });
    res.end();
};
const usersPUT = async (req, res = response) => {
    const { id } = req.params;

    const { _id, password, google, correo, ...rest } = req.body;
    //UPDATE ENCRYPTED PASSWORD
    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);
    const userUpdate = await User.findById(id);

    res.status(200).json({
        ok: true,
        msg: 'PUT API controller',
        id,
        user,
        userUpdate
    })
    res.end();
};
const usersPOST = async (req, res = response) => {

    const { name, mail, password, role, google } = req.body;

    const user = new User({ name, mail, password, role, google });


    //Encrypt pass
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Save on DB
    await user.save();

    res.json({
        ok: true,
        user
    })
    res.end();
};
const usersDELETE = async(req, res) => {
    const {id} = req.params;
    //Borrado fisico
    const user = await User.findByIdAndUpdate(id, {status: false});

    res.json({
        ok: true,
        msg: 'DELETE API controller',
        user,
        userValidated: req.user 
    })
    res.end();
};
const usersPATCH = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'PATCH API controller'
    })
    res.end();
};

module.exports = {
    usersGET,
    usersDELETE,
    usersPATCH,
    usersPOST,
    usersPUT
}