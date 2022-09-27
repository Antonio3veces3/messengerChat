const { request, response } = require('express');

const { Product } = require('../models');


//Obtener products

const GETproducts = async (req = request, res = response) => {
    let { limit = 2, until = 0 } = req.query;
    const query = { status: true };

    if (!parseInt(limit) || !parseInt(until) && until != 0) return res.status(400).json({
        error: "The params must be whole numbers"
    })

    const result = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate("user", 'name')
            .populate('category', 'name')
            .limit(limit)
            .skip(until)
    ]);

    res.status(200).json({
        total: result[0],
        categories: result[1]
    });

    res.end();
};

//Obtener producto by ID | populate
const GETproductByID = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user','name')
        .populate('category','name');

    res.status(200).json({
        product
    });
};


//CREAR PRODUCT
const createProduct = async (req = request, res = response) => {
    const { status, user, name, ...rest} = req.body;
    
     const productDB = await Product.findOne({name: req.body.name.toUpperCase()})

     if (productDB) {
         return res.status(400).json({
             error: `The product ${productDB.name} already exists`
         });
     }

    const data = {
        name: req.body.name.toUpperCase(),
        user: req.user._id,
        ...rest
    }
    const product = new Product(data);
    await product.save();

    res.status(201).json(data);
};


// ACTUALIZAR PRODUCTO
const PUTproduct = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...rest} = req.body

    if(rest.name){
        rest.name = req.body.name.toUpperCase();
    }

    rest.user = req.user.id;

    try {
        //Verificar que no exista otro name igual
        const existsName = await Product.findOne({name: rest.name});
        if(existsName){
            return res.status(400).json({
                error: `The name |${rest.name}| already exists`
            });
        }   
        
        const updatedProduct= await Product.findByIdAndUpdate(id, rest, {new: true})
        .populate('user','name')
        .populate('category', 'name');
    
        res.status(200).json({
            updatedProduct
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({error})
    }

};

//ELIMINAR PRODUCTO
const DELETEproduct = async (req = request, res = response) =>{
    const { id } = req.params;
    const query = {status: false};

    
    try {
        const deletedProduct = await Product.findByIdAndUpdate(id, query, {new:true})
        .populate('user','name');

        res.status(200).json({
            deletedProduct,
        })
    } catch (error) {
        res.status(400).json({error})
    }
};

module.exports = {
    createProduct,
    GETproducts,
    GETproductByID,
    PUTproduct,
    DELETEproduct,
}