const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new contact
router.post('/', async (req, res) => {
  try {
    const existingContact = await Contact.findOne({ phone: req.body.phone });
    if (existingContact) {
      return res.status(400).json({ message: "This phone number already exists!" });
    }

    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a contact
router.put('/:id', async (req, res) => {
  try {
    const existingContact = await Contact.findOne({ 
      phone: req.body.phone, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingContact) {
      return res.status(400).json({ message: "This phone number already exists for another contact!" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
    );
    
    if (!updatedContact) return res.status(404).json({ message: "Contact not found" });
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a contact
router.delete('/:id', async (req, res) => {
  try {
    const removedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!removedContact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;