import React from 'react';
import { FaTrash } from 'react-icons/fa';
import AdminList from './AdminList';

const ContactsSection = ({ contacts, loading, onDelete, fetchContacts }) => {
  return (
    <>
      <div className="section-header">
        <h3>Contact Messages</h3>
        <button onClick={fetchContacts} className="btn secondary" disabled={loading}>
          Refresh
        </button>
      </div>

      <AdminList
        items={contacts}
        renderItem={(contact) => (
          <div className="admin-item">
            <div className="item-info">
              <h4>{contact.name}</h4>
              <p>{contact.message}</p>
              <span className="item-meta">
                {contact.email} • {new Date(contact.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="item-actions">
              <button onClick={() => onDelete(contact._id, 'contact')} className="btn small danger" disabled={loading}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        )}
      />
      {contacts.length === 0 && <p>No contact messages yet.</p>}
    </>
  );
};

export default ContactsSection;
