const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/treasure');
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
let Customer = require('./models/customers')

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

// Get single customer
app.get('/customer/:id', (req, res) => {
  // debugger
  Customer.findById(req.params.id, (err, customer) => {
    res.render('customer', {
      customer: customer
    });
  });
});

//Edit customer
app.get('/customer/edit/:id', (req, res) => {
  // debugger
  Customer.findById(req.params.id, (err, customer) => {
    res.render('edit_customer', {
      customer: customer
    });
  });
});

//Update Submit Post route
app.post('/customers/edit/:id', (req, res) => {
    let customer = {};
    customer.first_name = req.body.first_name;
    customer.last_name = req.body.last_name;
    customer.gender = req.body.gender;
    customer.age = req.body.age;

    let query = { _id: req.params.id }

    Customer.update(query, customer, (err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Customer info updated');
        res.redirect('/');
      }
    });
  });

//Add route
app.get('/customers/add', (req, res) => {
  res.render('add_customer', {
    customer: "Add Customer"
  });
});

//Add Submit POST route
app.post('/customers/add', (req, res) => {
  req.checkBody('first_name', 'First name is required').notEmpty(); // it is validator stuff,
  // if I need more I can check in documentation, express-validator
  req.checkBody('last_name', 'Last name is required').notEmpty();
  req.checkBody('gender', 'Gender is required').notEmpty();
  req.checkBody('age', 'Age is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render('add_customer', {
      errors: errors,
    });
  } else {
    let customer = new Customer();
    customer.first_name = req.body.first_name;
    customer.last_name = req.body.last_name;
    customer.gender = req.body.gender;
    customer.age = req.body.age;

    customer.save((err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Customer added');
        res.redirect('/');
      }
    });
  }
});

//Deleting customer
app.delete('/customer/:id', (req, res) => {
  let query = { _id: req.params.id };
  Customer.remove(query, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Success'); // by default it sends 200
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
