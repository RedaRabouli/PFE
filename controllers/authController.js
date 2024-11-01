const res = require('express/lib/response');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
exports.ctrlmeth =  (req,res) => {
    res.send({ message : 'user module'})
}

exports.signup = (req , res) =>{

    const user = new User(req.body);

user.save((err,user) => {

    if (err){
        return res.status(400).send(err)
    }
    user.hashed_password = undefined
    user.salt = undefined 
    
res.send(user)
})
}


exports.signin = (req,res) => { 

const {email , password} = req.body ; 

   User.findOne({email}, (err,user) => {
       if (err || !user) {
           return res.status(400).json({
               error: 'User not found with this email, Please SignUP!'
           })
       }

   if(!user.authenticate(password) ) {
       return res.status(401).json({
           error: 'Email and password dont match !'
       })
   }

  const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET );
 
     res.cookie('token', token, {expire : new Date() + 8062000})

     const { _id , name , email, role} = user;

     return  res.json({

        token, user: {_id, name , email , role}
     })

   })

}

exports.signout = (req, res ) => {
    res.clearCookie('token');

    res.json({
        message: "User Signout"
    })
}