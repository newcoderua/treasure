let mongoose = require('mongoose');

// customers schema

let customerSchema = mongoose.Schema({
  first_name:{
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  age:{
    type: Number
  }
});

let Customer = module.exports = mongoose.model('Customer', customerSchema);
