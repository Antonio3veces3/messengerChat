const {v4: uuidv4, v4} = require('uuid');
const path =require('path');


const uploadFile = (files, validExtensions = ["png", "jpg", "jpeg", "gif","JPG"], folder='') => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const nameCutted = file.name.split(".");
    console.log(nameCutted);
    console.log("req.files >>>", files); // eslint-disable-line

    
    //VALIDAR EXTENSION
    const extension = nameCutted[nameCutted.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(`.${extension} is an invalid extension, the allow extensions are  ${validExtensions} `);
    }

    const nameTemp = uuidv4() + "." + extension;

    //Creamos la ruta para guardar el archivo
    const uploadPath = path.join(__dirname, "../uploads/",folder, nameTemp);

    //Funcion para mover el archivo subido a la carpeta deseada | mv = move
    file.mv(uploadPath, function (err) {
      if (err) {
        reject(err);
      }

      resolve(nameTemp);
    });
  });
};

module.exports = {
  uploadFile,
};
