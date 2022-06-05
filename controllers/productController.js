const Product = require('../models/product');
const fs = require('fs');

const formidable = require('formidable');

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload!',
      });
    }

    const product = new Product(fields);

    if (files.photo) {
      const photoBuffer = {
        data: fs.readFileSync(files.photo.filepath),
        contentType: files.photo.mimetype,
      };
      product.photo = photoBuffer;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          err,
        });
      }
      res.json({
        product,
      });
    });
  });
};
