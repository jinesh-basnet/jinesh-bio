import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminItem = ({ item, onEdit, onDelete, loading, extraActions, children }) => {
  return (
    <div className="admin-item">
      <div className="item-info">
        {children}
      </div>
      <div className="item-actions">
        {extraActions}
        <button onClick={() => onEdit(item)} className="btn small" disabled={loading} title="Edit Item">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(item._id, item.type || 'item')} className="btn small danger" disabled={loading} title="Delete Item">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default AdminItem;
