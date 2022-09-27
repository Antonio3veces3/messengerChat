const { request, response } = require('express');
const { Category } = require('../models');

//Obtener Categorias

const GETcategories = async (req = request, res = response) => {
    let { limit = 2, until = 0 } = req.query;
    const query = { status: true };

    if (!parseInt(limit) || !parseInt(until) && until != 0) return res.status(400).json({
        error: "The params must be whole numbers"
    })

    const result = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate("user", 'name')
            .limit(limit)
            .skip(until)
    ]);

    res.status(200).json({
        total: result[0],
        categories: result[1]
    });

    res.end();
};

//Obtener categoria | populate
const GETcategoryByID = async (req = request, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id)
        .populate('user','name');

    res.status(200).json({
        category
    });
};


//CREAR CATEGORIA
const createCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            error: `The category ${categoryDB.name} already exists`
        });
    }

    const data = {
        name,
        user: req.user._id
    }
    const category = new Category(data);

    await category.save();

    res.status(201).json(category)
};

const PUTcategory = async (req = request, res = response) => {
    const { id } = req.params;
    const name = req.body.name.toUpperCase();
    const user = req.user._id;

    try {
        const updatedCategory= await Category.findByIdAndUpdate(id, {name, user}, {new: true})
        .populate('user','name');
    
        res.status(200).json({
            updatedCategory
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error})
    }

};

const DELETEcategory = async (req = request, res = response) =>{
    const { id } = req.params;
    const query = {status: false};

    
    try {
        const deletedCategory = await Category.findByIdAndUpdate(id, query, {new:true})
        .populate('user','name');

        res.status(200).json({
            deletedCategory,
        })
    } catch (error) {
        res.status(400).json({error})
    }
};

module.exports = {
    createCategory,
    GETcategories,
    GETcategoryByID,
    PUTcategory,
    DELETEcategory,
}