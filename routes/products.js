const express = require('express');

const { userById } = require('../middlewares/user');

const router = express.Router();

const{
  allProducts,
  relatedProduct,
  createProduct,
      showProduct,
      productById,
      removeProduct,
      updateProduct,
      searchProduct,
      photoProduct,
      photoProductCount
    } = require('../controllers/productController');

const {requireSignIn, isAuth, isAdmin} = require('../middlewares/auth');

router.get('/', allProducts);

router.get('/:productId', showProduct);   

router.get('/related/:productId', relatedProduct);

router.post('/create/:userId', [requireSignIn, isAuth, isAdmin], createProduct);

router.post('/search', searchProduct);

router.get('/photo/:productId', photoProductCount);
router.get('/photo/:productId/:idx', photoProduct);

router.put('/:productId/:userId', [requireSignIn, isAuth, isAdmin], updateProduct);

router.delete('/:productId/:userId', [requireSignIn, isAuth, isAdmin], removeProduct);

router.param('userId',userById);

router.param('productId',productById);

module.exports = router;