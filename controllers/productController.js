const Product = require('../models/product');
const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');

const formidable = require('formidable');
const product = require('../models/product');

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm({
    multiples: true,
    keepExtensions:true
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload!',
      });
    }

    const product = new Product(fields);

    if (files.photo && files.photo.length) {
      const photoBuffers = [] 
      for (const photo of files.photo) {
        if(photo.size > Math.pow(10, 6 )){
          return res.status(400).json({
            error: 'One of the images is too big!'
          })
        }
        const photoBuffer = {
          data: fs.readFileSync(photo.filepath),
          contentType: photo.mimetype,
        };
        photoBuffers.push(photoBuffer)
      }
      product.photo = photoBuffers;
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.string().required(),
      category: Joi.string().required(),
      Surface: Joi.required(),
      city: Joi.string().allow(),
      sellorrent: Joi.required()
    }) 

    const{error} = schema.validate(fields);

    if(error){
      return res.status(400).json({
        error: error.details[0].message
      })
    }

    product.save((err, product) => {

      if (err) {
        return res.status(400).json({
          err: 'Persist failed.'
        });
      }
      res.json({
        product,
      });
    });
  });
};

exports.productById = (req, res, next, id) => {

  Product.findById(id).exec((err, product) => {
   
      if(err || !product) {
        return res.status(404).json({
          error:  'Product no found!'
        })
      }
 
      req.product = product;
      next()



  })
}

exports.showProduct = (req, res ) => {

  req.product.photo = undefined;

  res.json({
    product: req.product
  })
}

exports.removeProduct = (req,res) => {

  let product = req.product

  product.remove((err, product) => {
    if(err){
      return res.status(404).json({
        error: "Product not deleted !"
      })
    }
    res.status(204).json({})

  })
}



exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload!',
      });
    }

    let product = req.product;

 product = _.extend(product, fields);


    if (files.photo) {
               
          if(files.photo.size > Math.pow(1000000, 1000000 )){
            return res.status(400).json({
              error: 'Image too big!'
            })
          }
      
      const photoBuffer = {
        data: fs.readFileSync(files.photo.filepath),
        contentType: files.photo.mimetype,
      };
      product.photo = photoBuffer;
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.required(),
     
    })

    const{error} = schema.validate(fields);

    if(error){
      return res.status(400).json({
        error: error.details[0].message
      })
    }

    product.save((err, product) => {

      if (err) {
        return res.status(400).json({
          err: 'Product not updated!'
        });
      }
      res.json({
        product
      });
    });
  });
};


exports.allProducts = (req, res) => {

  let sortBy = req.query.sortBy ?  req.query.sortBy : '_id';
  let order = req.query.order ?  req.query.order : 'asc';
  let limit = req.query.limit ?  parseInt(req.query.limit) : 100 ;

  let query = {}
  let{search, category} = req.query;

  if(search){
    query.name = {  $regex: search, $options: 'i'};
      }

  if(category) {
     query.category = category
  }

   Product.find(query)
          .select("-photo")
          .populate('category')
          .sort([[sortBy, order]])
          .limit(limit)
          .exec((err, products) => {

               if(err) {
                 return res.status(404).json({
                   err: "Listing doesn't exist"
                 })
               }


               res.json({
                 products
               })

          })
        }


        exports.relatedProduct = (req, res) => { 

          let limit = req.query.limit ?  req.query.limit : 6 ;

          Product.find({category: req.product.category, _id: { $ne: req.product._id}})
                 .limit(limit)
                 .select('-photo')
                 .populate('category', '_id nae')
                 .exec((err, products) => {
 
                          if(err) {
                            return res.status(404).json({
                              error: "Listing not found."
                            })
                          }

                          res.json({
                            products
                          })
                 })
        }


        exports.searchProduct = (req, res) => {


        let sortBy = req.query.sortBy ?  req.query.sortBy : '_id';
        let order = req.query.order ?  req.query.order : 'asc';
        let limit = req.body.limit ?  req.body.limit : 100 ;
        let skip = parseInt(req.body.skip);
        let findArgs = {};
         
          console.log(req.body.filters)    

                 for(let key in req.body.filters) { 
                   if(req.body.filters[key].length > 0) {
                     if (key === "price"){
                       // gte - greater than price [0 - 10]
                       //let - less than 
                       findArgs[key] = {
                         $gte: req.body.filters[key][0],
                         $lte: req.body.filters[key][1],
                       };
                     } else {
                       findArgs[key] = req.body.filters[key];
                     }
                   }
                 }
      
         Product.find(findArgs)
                .select("-photo")
                .populate('category')
                .sort([[sortBy, order]])
                .limit(limit)
                .skip(skip)
                .exec((err, products) => {
      
                     if(err) {
                       return res.status(404).json({
                         err: "Listing doesn't exist"
                       })
                     }
      
      
                     res.json({
                       products
                     })
      
                })
              }
      

              exports.photoProduct = (req , res) => {

                const {data , contentType} = req.product.photo  

                if(data) {

                  res.set('Content-Type', contentType)

                  return res.send(data)

                }
              }