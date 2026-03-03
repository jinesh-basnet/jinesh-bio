import React, { useState, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';
import TimelineForm from './TimelineForm';
import AdminList from './AdminList';
import AdminItem from './AdminItem';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

const TimelineSection = ({
  timelines,
  loading,
  onEdit,
  onDelete,
  onSaveNew,
  onSave,
  validationErrors
}) => {
  const [newItem, setNewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  const filteredTimelines = useMemo(() => {
    return timelines.filter(timeline => {
      const matchesSearch = searchTerm === '' ||
        timeline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timeline.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesYear = selectedYear === 'All' || (timeline.period && timeline.period.includes(selectedYear));

      return matchesSearch && matchesYear;
    });
  }, [timelines, searchTerm, selectedYear]);

  const totalPages = Math.ceil(filteredTimelines.length / itemsPerPage);
  const paginatedTimelines = filteredTimelines.slice(
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

  const handleAdd = () => {
    setNewItem({
      type: 'work',
      title: '',
      company: 'Company Name',
      location: 'City, Country',
      period: 'Month YYYY - Present',
      description: '',
      technologies: [],
      timelineType: 'timeline',
      featured: true
    });
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item, timelineType: 'timeline' });
  };

  const handleSave = async () => {
    if (!editingItem.title || !editingItem.company || !editingItem.period || !editingItem.description) {
      alert('Please fill in all required fields (Title, Company, Period, Description)');
      return;
    }
    await onSave(editingItem);
    setEditingItem(null);
  };

  const handleSaveNew = async () => {
    if (!newItem.title || !newItem.company || !newItem.period || !newItem.description) {
      alert('Please fill in all required fields (Title, Company, Period, Description)');
      return;
    }
    await onSaveNew(newItem);
    setNewItem(null);
  };

  return (
    <>
      <div className="section-header">
        <h3>Timeline</h3>
        <button onClick={handleAdd} className="btn primary" disabled={loading}>
          <FaPlus /> Add Timeline Item
        </button>
      </div>

      {newItem && newItem.timelineType === 'timeline' && (
        <TimelineForm
          item={newItem}
          isNew={true}
          onChange={setNewItem}
          onSave={handleSaveNew}
          onCancel={() => setNewItem(null)}
          validationErrors={validationErrors}
          loading={loading}
        />
      )}

      <div className="search-filter-container">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search timelines..."
        />
        <FilterDropdown
          options={['All', '2023', '2022', '2021', '2020', '2019']}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Filter by year..."
        />
      </div>

      <AdminList
        items={paginatedTimelines}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        renderItem={(item) => (
          editingItem && editingItem._id === item._id && editingItem.timelineType === 'timeline' ? (
            <TimelineForm
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
              item={item}
              onEdit={handleEdit}
              onDelete={(id) => onDelete(id, 'timeline')}
              loading={loading}
            >
              <h4>{item.title} {item.featured !== false && <span title="Featured in CV" style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>⭐</span>}</h4>
              <p>{item.description}</p>
              <span className="item-meta">{item.type} • {item.company} • {item.period}</span>
            </AdminItem>
          )
        )}
      />

      <BulkActions
        selectedItems={selectedItems}
        totalItems={filteredTimelines.length}
        data={filteredTimelines}
        onSelectAll={(e) => {
          if (e.target.checked) {
            setSelectedItems(filteredTimelines);
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
    </>
  );
};

export default TimelineSection;
