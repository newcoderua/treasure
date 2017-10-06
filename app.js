const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//check for db erros
db.on('error', (err) => {
  console.log(err);
});

// check connection
db.once('open', () => {
  console.log("connected to MongoDB");
})


const app = express();
// bring in models
let Customer = require('./models/customers');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  },
   customValidators: {
    isPsd1EqPsd2: function(psd1,psd2) {
        console.log(psd1===psd2);
        return psd1===psd2;
    }
 }
}));

//passport config
require('./config/passport')(passport);
//passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

//Home route
app.get('/', (req, res) => {
  let customers = Customer.find({}, (err, customers) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        customer: 'Customers',
        customers: customers
      });
    }
  });
});

//Route Files
let customers = require('./routes/customers');
let users = require('./routes/users');
app.use('/customers', customers);
app.use('/users', users);

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
