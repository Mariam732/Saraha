const express = require('express');
const app = express();
const path = require('path');

app.listen(process.env.POR || 3000, () => {
  console.log("server is running now .....");
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//to convert buffer into string
app.use(express.urlencoded({ extended: false }));

app.use(require('./routes/index.routes'));
app.use(require('./routes/login.routes'));
app.use(require('./routes/register.routes'));
app.use(require('./routes/user.routes'));
app.use(require('./routes/messages.routes'));
const validation = require('./validation/SignUp.validation');

//connnect flash
const flash = require('connect-flash');
app.use(flash())

//connection with DB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:admin@cluster0.mahqslt.mongodb.net/sarahaProjectDB', {
    useNewUrlParser: true, useUnifiedTopology: true
},)
    .then(() => console.log("Connected successfully"))
    .catch((err) => { console.error(err) });

//validation

const { check, validationResult } = require('express-validator');

//session
var session = require('express-session')

// to store session in db not in memory
//mongodb+srv://admin:admin@cluster0.mahqslt.mongodb.net/sarahaProjectDB
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
    uri: 'mongodb+srv://admin:admin@cluster0.mahqslt.mongodb.net/sarahaProjectDB',
    collection: 'mySessions'
});
//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store

}))

const userModel = require('./models/user.model');
const bcrypt = require('bcrypt');

//login

app.post('/handleLogin', async (req, res) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email });
        // console.log(user);
        if (user == null) {
            res.redirect('/login');
        } else {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                //login
                req.session.isLoggedIn = true;
                req.session.userID = user._id;
                console.log(req.session.id);
                req.session.name = user.name;
                res.redirect('/messages');
            }
            else {
                console.log("wrong password");
                res.redirect('/login');
            }
        }

    } catch (error) {
        console.log(error);
    }


})


//message

const messagesModel = require('./models/message.model')
app.get('/messages', async (req, res) => {
    try {
        if (req.session.isLoggedIn == true) {
            const messages = await messagesModel.find({ userID: req.session.userID });
            console.log(req.session.userID);
            console.log(messages);
            // console.log(req.protocol);
            const fullURL = req.protocol + '://' + req.headers.host
                + '/user/' + req.session.userID
            res.render('messages.ejs',
                {
                    messages, name: req.session.name, fullURL, isLoggedIn: req.session.isLoggedIn
                });
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
})


app.get('/', (req, res) => {
    res.render('index.ejs', { isLoggedIn: req.session.isLoggedIn });
})

app.get('/login', (req, res) => {
    res.render('login.ejs', { isLoggedIn: req.session.isLoggedIn });
})

app.get('/register', (req, res) => {
    // console.log(req.flash('errors'));

    res.render('register.ejs', { errors: req.flash('errors'), isLoggedIn: req.session.isLoggedIn });
})

app.post('/handleRegister', validation, async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);
        console.log(errors.array());
        console.log(errors.isEmpty());
        const { name, email, password } = req.body;
        if (errors.isEmpty() == true) {
            bcrypt.hash(password, 7, async function (err, hash) {
                await userModel.insertMany({ name, email, password: hash });
                res.redirect('/register');
            });
        } else {
            //connect flash
            req.flash('errors', errors.array())
            res.redirect('/register');

        }

    } catch (error) {
        console.log(error);
    }


});
let userID;
app.get('/user/:id', async (req, res) => {
    try {
        userID = req.params.id
        const user = await userModel.findOne({ _id: userID })
        console.log('user is ' + user);
        res.render('user.ejs', { name: user.name, isLoggedIn: req.session.isLoggedIn });
    } catch (error) {
        console.log(error);
    }
})

const messageModel = require('./models/message.model');

app.post('/handleMessage', async (req, res) => {
    try {
        console.log(req.body);
        const { message } = req.body;
        await messageModel.insertMany
            ({ message, userID });
        res.redirect('/user/' + userID);
    } catch (error) {
        console.log(error);
    }
})



app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})



