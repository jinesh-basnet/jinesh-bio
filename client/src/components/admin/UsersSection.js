import React, { useState, useMemo } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import UserForm from './UserForm';
import AdminList from './AdminList';
import AdminItem from './AdminItem';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

const UsersSection = ({
  users,
  loading,
  onEdit,
  onDelete,
  onApproveAdmin,
  onRejectAdmin,
  onSave,
  validationErrors,
  fetchUsers
}) => {
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'All' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length > 0) {
      for (const item of selectedItems) {
        await onDelete(item._id);
      }
      setSelectedItems([]);
    }
  };

  const handleBulkUpdate = async () => {
    setSelectedItems([]);
  };

  const handleEdit = (user) => {
    setEditingItem({ ...user, type: 'user' });
  };

  const handleSave = async () => {
    await onSave(editingItem);
    setEditingItem(null);
  };

  return (
    <>
      <div className="section-header">
        <h3>Users</h3>
        <button onClick={fetchUsers} className="btn secondary" disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="pending-approvals">
        <h4>Pending Admin Approvals</h4>
        <div className="pending-list">
          {users.filter(user => user.role === 'admin' && !user.isApproved && user.isActive).map(user => (
            <div key={`pending-${user._id}`} className="pending-item">
              <div className="item-info">
                <h5>{user.username}</h5>
                <p>{user.email}</p>
                <span className="item-meta">Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => onApproveAdmin(user._id)}
                  className="btn small success"
                  disabled={loading}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  onClick={() => onRejectAdmin(user._id)}
                  className="btn small danger"
                  disabled={loading}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          ))}
          {users.filter(user => user.role === 'admin' && !user.isApproved && user.isActive).length === 0 && (
            <p className="no-pending">No pending admin approvals</p>
          )}
        </div>
      </div>

      <div className="all-users">
        <h4>All Users</h4>
        <div className="search-filter-container">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />
          <FilterDropdown
            options={['All', 'user', 'admin']}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Filter by role..."
          />
        </div>
        <AdminList
          items={paginatedUsers}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          renderItem={(user) => (
            editingItem && editingItem._id === user._id && editingItem.type === 'user' ? (
              <UserForm
                item={editingItem}
                isNew={false}
                onChange={setEditingItem}
                onSave={handleSave}
                onCancel={() => setEditingItem(null)}
                validationErrors={validationErrors}
                loading={loading}
              />
            ) : (
              <AdminItem
                item={user}
                onEdit={handleEdit}
                onDelete={onDelete}
                loading={loading}
              >
                <h4>{user.username}</h4>
                <p>{user.email}</p>
                <span className="item-meta">
                  Role: {user.role} • Status: {user.isApproved ? 'Approved' : 'Pending'} • {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </AdminItem>
            )
          )}
        />
        <BulkActions
          selectedItems={selectedItems}
          totalItems={filteredUsers.length}
          data={filteredUsers}
          onSelectAll={(e) => {
            if (e.target.checked) {
              setSelectedItems(filteredUsers);
            } else {
              setSelectedItems([]);
            }
          }}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default UsersSection;
