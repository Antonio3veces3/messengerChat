const { request, response } = require("express");

const validateFilesUpload = (req = request, res = response, next) => {
  //verificaramos si hay files en la request
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).json({ error: "No files were uploaded." });
  }
  //verificamos que la key file exista
  if (!req.files.file) {
    return res
      .status(400)
      .json({ error: "the key name as file on the body is required." });
  }

  next();
};

module.exports= {
    validateFilesUpload,
}