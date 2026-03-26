const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    match: [/^$|^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid @gmail.com address']
  },
  phone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);