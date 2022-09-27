const { Role, User, Category, Product } = require('../models');

const isRoleExists = async (role= '') => {

    const existsRole = await Role.findOne({ role });

    if (!existsRole) { 
        throw new Error(`The role ${role} doesn't exists`)
    };
};


const emailExists= async(mail= '')=>{
    const existsMail = await User.findOne({mail});
    if(existsMail) throw new Error(`The mail: ${mail}, already exists`);
}

const existUserID= async(id)=>{
    const existsID = await User.findById(id);
    if(!existsID) throw new Error(`The ID: ${id}, doesn't exists`);
}

const existUsername= async(name='')=>{
    const username = await User.findOne({ name });
    console.log(username);
    if (username) throw new Error ( `The Username: ${name} already exists` );
}

const existsCategoryID = async (id='')=>{
    const exists = await Category.findById(id);

    if(!exists || !exists.status){
        throw new Error(`Category ID: ${id}, doesn't exists`);
    }
}


const existsProductID = async (id='')=>{
    const exists = await Product.findById(id);

    if(!exists || !exists.status){
        throw new Error(`Category ID: ${id}, doesn't exists`);
    }
};

const validCollections = (collection = '', collections = [])=>{
    const include = collections.includes(collection);
    if(!include){
        throw new Error(`The collection ${collection} is invalid - ${collections}`);
    }

    return true;
}

module.exports = {
    isRoleExists,
    emailExists,
    existUserID,
    existUsername,
    existsCategoryID,
    existsProductID,
    validCollections,

}