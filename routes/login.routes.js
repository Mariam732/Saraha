const app = require('express').Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');



// app.get('/login', (req, res) => {
//     res.render('login.ejs' , {isLoggedIn:req.session.isLoggedIn});
// })



// app.post('/handleLogin', async (req, res) => {
//     // console.log(req.body);
//     try {
//         const { email, password } = req.body;
//         let user = await userModel.findOne({ email });
//         // console.log(user);
//         if (user == null) {
//             res.redirect('/login');
//         } else {
//             const match = await bcrypt.compare(password, user.password);

//             if (match) {
//                 //login
//                 req.session.isLoggedIn = true;
//                 req.session.id = user._id;
//                 console.log(req.session.id);
//                 req.session.name = user.name;
//                 res.redirect('/messages');
//             }
//             else {
//                 console.log("wrong password");
//                 res.redirect('/login');
//             }
//         }

//     } catch (error) {
//         console.log(error);
//     }


// })


module.exports = app