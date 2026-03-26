import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ContactForm({ addContact, updateContact }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  
  // NEW: State to hold our error messages
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentContact = location.state?.contact || null;

  useEffect(() => {
    if (currentContact) {
      setFormData({
        name: currentContact.name || '',
        email: currentContact.email || '',
        phone: currentContact.phone || ''
      });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [currentContact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors when they try to submit again
    setErrorMsg('');
    
    // 1. Validate Name
    if (!formData.name) return setErrorMsg("Please enter a name.");
    
    // 2. Validate Phone
    if (!formData.phone || formData.phone.length !== 10) {
      return setErrorMsg("Please enter a valid 10-digit phone number.");
    }

    // 3. Validate Gmail
    if (formData.email && !formData.email.endsWith('@gmail.com')) {
      return setErrorMsg("If providing an email, it must be a valid @gmail.com address.");
    }
    
    let result;
    
    if (currentContact) {
      result = await updateContact(currentContact._id, formData);
    } else {
      result = await addContact(formData);
    }
    
    // Check if the App.jsx functions returned success or an error message
    if (result.success) {
      navigate('/');
    } else {
      // If it failed (like a duplicate number), show the error on the screen
      setErrorMsg(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{currentContact ? 'Edit Contact' : 'Add New Contact'}</h3>
      
      {/* NEW: This will only render if there is an error message */}
      {errorMsg && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          padding: '10px 15px', 
          borderRadius: '6px', 
          marginBottom: '15px',
          border: '1px solid #f87171',
          fontSize: '0.95rem'
        }}>
          <strong>Wait:</strong> {errorMsg}
        </div>
      )}
      
      <div className="form-group">
        <input
          type="text"
          placeholder="Full Name (Required)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          maxLength="25"
          required
        />
        <input
          type="email"
          placeholder="Email Address (e.g., user@gmail.com)"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number (Required, 10 digits)"
          value={formData.phone}
          maxLength="10"
          required
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, '');
            setFormData({ ...formData, phone: onlyNumbers });
          }}
        />
      </div>

      <div className="btn-group">
        <button type="submit" className="btn-primary">
          {currentContact ? 'Update Contact' : 'Save Contact'}
        </button>
        
        <button 
          type="button" 
          className="btn-secondary"
          onClick={() => navigate('/')} 
        >
          Cancel
        </button>
      </div>
    </form>
  );
}