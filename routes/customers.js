const express = require('express');
const router = express.Router();
// bring in Cutomer Model
let Customer = require('../models/customers')



//Edit customer
router.get('/edit/:id', (req, res) => {
  // debugger
  Customer.findById(req.params.id, (err, customer) => {
    res.render('edit_customer', {
      customer: customer
    });
  });
});

//Update Submit Post route
router.post('/edit/:id', (req, res) => {
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
router.get('/add', (req, res) => {
  res.render('add_customer', {
    customer: "Add Customer"
  });
});

//Add Submit POST route
router.post('/add', (req, res) => {
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

// Get single customer
router.get('/:id', (req, res) => {
  // debugger
  Customer.findById(req.params.id, (err, customer) => {
    res.render('customer', {
      customer: customer
    });
  });
});

//Deleting customer
router.delete('/:id', (req, res) => {
  let query = { _id: req.params.id };
  Customer.remove(query, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send('Success'); // by default it sends 200
    }
  });
});

module.exports = router;
