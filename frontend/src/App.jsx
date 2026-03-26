import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const API_URL = 'http://localhost:5000/api/contacts';

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const addContact = async (contact) => {
    const isDuplicate = contacts.some(c => c.phone === contact.phone);
    if (isDuplicate) {
      // Return the error message instead of alerting
      return { success: false, message: "This phone number already exists in your contacts!" };
    }
    try {
      const response = await axios.post(API_URL, contact);
      setContacts([response.data, ...contacts]);
      return { success: true };
    } catch (error) {
      console.error("Error adding contact:", error);
      return { success: false, message: "Server error. Could not save contact." };
    }
  };

  const updateContact = async (id, updatedData) => {
    const isDuplicate = contacts.some(c => c.phone === updatedData.phone && c._id !== id);
    if (isDuplicate) {
      // Return the error message instead of alerting
      return { success: false, message: "Another contact is already using this phone number!" }; 
    }
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      setContacts(contacts.map(c => (c._id === id ? response.data : c)));
      return { success: true }; 
    } catch (error) {
       console.error("Error updating contact:", error);
       return { success: false, message: "Server error. Could not update contact." };
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <Router>
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Contact Manager</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600' }}>
              View Contacts
            </Link>
            <Link to="/add" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600' }}>
              Add New
            </Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={
            <div className="card">
              <ContactList contacts={contacts} deleteContact={deleteContact} />
            </div>
          } />
          
          <Route path="/add" element={
            <div className="card">
              <ContactForm addContact={addContact} />
            </div>
          } />

          <Route path="/edit" element={
            <div className="card">
              <ContactForm updateContact={updateContact} />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;