const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
app.use(express.static(path.join(__dirname, 'public')))

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

//Add route
app.get('/customers/add', (req, res) => {
  res.render('add_customer', {
    customer: "Add Customer"
  });
});

//Add Submit POST route
app.post('/customers/add', (req, res) => {
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
      res.redirect('/');
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
