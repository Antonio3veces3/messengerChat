const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Category, User, Product } = require('../models');
const user = require('../models/user');

const collections = [
    'categories',
    'products',
    'users',
    'roles'
];

const searchUser = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const user = await User.findById(term);
        console.log('User',user);
        return res.json({
            results: (user) ? [user] : [],
        })
    }

    const regExp = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{name: regExp}, {mail: regExp}],
        $and: [{status: true}]
    });
    res.status(200).json({
        results: users
    })
}

const searchCategory = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : [],
        })
    }

    const regExp = new RegExp(term, 'i');

    const categories = await Category.find({
        name: regExp, 
        status: true,
    });

    res.status(200).json({
        results: categories
    })
}

const searchProduct = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const product = await Product.findById(term)
                        .populate('category', 'name');
        return res.json({
            results: (product) ? [product] : [],
        })
    }

    const regExp = new RegExp(term, 'i');

    const products = await Product.find({name: regExp, status: true})
    .populate('category', 'name');

    res.status(200).json({
        results: products
    })
}

const search = (req = request, res = response) => {
    const { collection, term } = req.params;

    if (!collections.includes(collection)) {
        res.status(400).json({
            msg: 'Error....',
            info: `The valid collections are: ${collections}`
        })
    }

    switch (collection) {
        case 'categories':
            searchCategory(term, res);
            break;
        case 'products':
            searchProduct(term, res);
            break;
        case 'users':
            searchUser(term, res);
            break;
        default:
            res.status(500).json({
                error: 'Error....',
                info: 'There is not roles searching'
            })
    }
}

module.exports = {
    search,
}