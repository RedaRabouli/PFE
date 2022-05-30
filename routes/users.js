const express = require('express');
const {ctrlmeth} = require('../controllers/userController')
const router = express.Router();


router.get('/' , ctrlmeth );

module.exports = router;