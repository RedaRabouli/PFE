exports.userSignUpValidator = (req , res , next) => {

    req.check('name' , 'Name is required !').notEmpty()


    req.check('email')
       .notEmpty()
       .isEmail();


    req.check('password', 'Password is required!')
       .notEmpty()
       .isLength({min: 6 , max: 10})
       .withMessage('Password must be inbetween 6 and 10 characters')


       const errors = req.validationErrors() 

       if(errors){
           return res.status(400).json({error : errors[0].msg})
       }

       next()

}