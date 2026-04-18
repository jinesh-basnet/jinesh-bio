import React from 'react';
import SkeletonLoader from '../common/SkeletonLoader';

const AdminList = ({ items, categories = [], selectedItems = [], onSelectionChange, renderItem, loading = false, type = 'list' }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(items);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (item, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, item]);
    } else {
      onSelectionChange(selectedItems.filter(selected => selected._id !== item._id));
    }
  };

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < items.length;

  if (loading) {
    return (
      <div className="admin-list">
        <SkeletonLoader type="list-item" count={5} />
      </div>
    );
  }

  return (
    <div className={`admin-list-container ${type}`}>
      {onSelectionChange && items.length > 0 && (
        <div className="select-all-header">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => el && (el.indeterminate = isIndeterminate)}
              onChange={handleSelectAll}
            />
            <span className="checkmark"></span>
            <span className="label-text">Select All ({selectedItems.length}/{items.length})</span>
          </label>
        </div>
      )}

      {items.length === 0 ? (
        <div className="no-items-message">
          <p>No items found. Create your first one!</p>
        </div>
      ) : (
        <div className="admin-items-grid">
          {items.map(item => {
            const isSelected = selectedItems.some(selected => selected._id === item._id);
            return (
              <div key={item._id} className={`admin-item-wrapper ${isSelected ? 'selected' : ''}`}>
                {onSelectionChange && (
                  <label className="item-checkbox-container">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectItem(item, e.target.checked)}
                    />
                    <span className="checkmark"></span>
                  </label>
                )}
                <div className="item-content">
                  {renderItem(item)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminList;
