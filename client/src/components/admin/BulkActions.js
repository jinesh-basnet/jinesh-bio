import React from 'react';
import { FaTrash, FaDownload } from 'react-icons/fa';

const BulkActions = ({ selectedItems = [], totalItems = 0, onSelectAll, onBulkDelete, onExportCSV, data = [] }) => {
  if (totalItems === 0 && data.length === 0) return null;

  const actualTotalItems = totalItems || data.length;
  const isAllSelected = selectedItems.length === actualTotalItems && actualTotalItems > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < actualTotalItems;

  const handleExportCSV = () => {
    if (selectedItems.length === 0) return;

    // Use data prop for filtering if provided, otherwise use selectedItems directly
    // since AdminList passes full objects in selectedItems.
    const selectedData = data.length > 0
      ? data.filter(item => selectedItems.some(s => s._id === item._id))
      : selectedItems;

    if (selectedData.length === 0) return;

    const headers = Object.keys(selectedData[0]).filter(key =>
      !['_id', '__v', 'createdAt', 'updatedAt', 'type', 'timelineType'].includes(key)
    );

    const csvContent = [
      headers.join(','),
      ...selectedData.map(row =>
        headers.map(header => {
          const value = row[header];
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onExportCSV) onExportCSV();
  };

  return (
    <div className="bulk-actions">
      <div className="select-all">
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(el) => el && (el.indeterminate = isIndeterminate)}
          onChange={onSelectAll}
        />
        <label>Select All ({selectedItems.length} selected)</label>
      </div>

      {selectedItems.length > 0 && (
        <div className="action-buttons">
          <button onClick={handleExportCSV} className="btn primary small">
            <FaDownload /> Export CSV ({selectedItems.length})
          </button>
          <button onClick={onBulkDelete} className="btn danger small">
            <FaTrash /> Delete Selected ({selectedItems.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkActions;
