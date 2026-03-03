import React from 'react';
import SkeletonLoader from '../SkeletonLoader';

const AdminList = ({ items, selectedItems = [], onSelectionChange, renderItem, loading = false }) => {
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
    <div className="admin-list">
      {onSelectionChange && items.length > 0 && (
        <div className="select-all">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => el && (el.indeterminate = isIndeterminate)}
            onChange={handleSelectAll}
          />
          <label>Select All</label>
        </div>
      )}
      {items.map(item => {
        const isSelected = selectedItems.some(selected => selected._id === item._id);
        return (
          <div key={item._id} className={`admin-item ${isSelected ? 'selected' : ''}`}>
            {onSelectionChange && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleSelectItem(item, e.target.checked)}
                className="item-checkbox"
              />
            )}
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
};

export default AdminList;
