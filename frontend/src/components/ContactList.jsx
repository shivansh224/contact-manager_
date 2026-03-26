import { useNavigate } from 'react-router-dom';

export default function ContactList({ contacts, deleteContact }) {
  const navigate = useNavigate();

  // New helper function to handle the confirmation logic
  const handleDeleteClick = (id, name) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    
    if (isConfirmed) {
      deleteContact(id);
    }
  };

  if (contacts.length === 0) {
    return <p className="empty-state">No contacts available. Click 'Add New' above!</p>;
  }

  return (
    <>
      <h3>Your Contacts</h3>
      <ul className="contact-list">
        {contacts.map(contact => (
          <li key={contact._id} className="contact-item">
            <div className="contact-info">
              <strong style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {contact.name}
              </strong>
              <span style={{ display: 'block', marginTop: '4px', fontSize: '0.9rem', color: '#666' }}>
                {contact.email ? `${contact.email} • ` : ''}{contact.phone}
              </span>
            </div>
            <div className="btn-group">
              <button 
                onClick={() => navigate('/edit', { state: { contact } })} 
                className="btn-edit"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteClick(contact._id, contact.name)} 
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}