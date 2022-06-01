const express = require('express');
const {ctrlmeth, signup, signin, signout} = require('../controllers/authController');
const{userSignUpValidator} = require('../middlewares/userValidator');
const{requireSignIn} = require('../middlewares/auth');
const router = express.Router();


router.get('/' , ctrlmeth );

router.post('/signup', userSignUpValidator , signup)
router.post('/signin',  signin)
router.get('/signout',  signout)

router.get("/hello", requireSignIn, (req,res)=> {
    res.send('Welcome to MariaImmo'); 
})

module.exports = router;