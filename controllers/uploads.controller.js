const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

const uploadFiles = async (req = request, res = response) => {
  //La request se manda desde body, form-data

  try {
    // Para guardar txt y md
    // const filename = await uploadFile(req.files, ['txt','md'], 'texts');

    // Para guardar imagenes
    const filename = await uploadFile(req.files, undefined, "img");

    res.json({
      filename,
    });
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          error: `The user ID: ${id} does not exist`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          error: `The product ID: ${id} does not exist`,
        });
      }
      break;

    default:
      return res.status(500).json({
        error: `Missing validation`,
      });
  }

  //Limpiar imagen previa
  if(model.img){
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImage)){
      fs.unlinkSync(pathImage);
    }
  }
  const name = await uploadFile(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json({
    model,
  });
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          error: `The user ID: ${id} does not exist`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          error: `The product ID: ${id} does not exist`,
        });
      }
      break;

    default:
      return res.status(500).json({
        error: `Missing validation`,
      });
  }

  //Limpiar imagen previa
  if(model.img){
    const nameArray = model.img.split('/');
    const nameImg   = nameArray[ nameArray.length - 1];
    const [ public_id ] = nameImg.split('.');
    
    cloudinary.uploader.destroy(public_id);
  }
  //Subir imagen a CLOUDINARY
  const {tempFilePath} = req.files.file;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();
  res.json({
    model
  })
};

const showImage = async(req = request, res = response)=>{
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          error: `The user ID: ${id} does not exist`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          error: `The product ID: ${id} does not exist`,
        });
      }
      break;

    default:
      return res.status(500).json({
        error: `Missing validation`,
      });
  }

  //Limpiar imagen previa
  if(model.img){
    //AQUI TENGO QUE RETORNAR LA IMAGEN QUE ESTA EN CLOUDINARY
    /* PARA GUARDAR EL ARCHIVO SUBIDO EN UNA CARPETA 
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if(fs.existsSync(pathImage)){
      return res.sendFile(pathImage);
    }*/
    return res.send(model.img);
  }
  const notImage = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(notImage);
}

module.exports = {
  uploadFiles,
  updateImage,
  showImage,
  updateImageCloudinary
};
