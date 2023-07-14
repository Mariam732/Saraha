const app = require('express').Router();
const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const validation = require('../validation/SignUp.validation');
//hash password
const bcrypt = require('bcrypt');

//connnect flash
const flash = require('connect-flash');
app.use(flash())

// app.get('/register', (req, res) => {
//   console.log(req.flash(errors));
//   res.render('register.ejs', { isLoggedIn: req.session.isLoggedIn });
// })



// app.post('/handleRegister', validation, async (req, res) => {
//   try {
//     console.log(req.body);
//     const errors = validationResult(req);
//     console.log(errors.array());
//     console.log(errors.isEmpty());
//     const { name, email, password } = req.body;
//     if (errors.isEmpty() == true) {
//       bcrypt.hash(password, 7, async function (err, hash) {
//         await userModel.insertMany({ name, email, password: hash });
//         res.redirect('/register');
//       });
//     } else {
//       //connect flash
//       req.flash('errors', errors.array())
//       res.redirect('/register');

//     }

//   } catch (error) {
//     console.log(error);
//   }


// });


module.exports = app