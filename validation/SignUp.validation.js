const { check } = require('express-validator');
module.exports = //thierd step to validator 
    [
         check('name').matches(/^[A-Za-z]+([\ A-Za-z-]+)*$/),

        check('email').isEmail(),
        check('password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        //chek on confirmpassword if equal passwod or no
        check('PasswordConfirmation').custom((value, { req }) => {
            if (value !== req.body.password) {
                return false
            }
            // Indicates the success of this synchronous custom validator
            return true;
        }),
    ]