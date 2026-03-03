import React, { useState, useMemo } from 'react';
import { FaPlus, FaStar, FaRegStar, FaCheckCircle, FaRegCheckCircle } from 'react-icons/fa';
import TestimonialForm from './TestimonialForm';
import AdminList from './AdminList';
import AdminItem from './AdminItem';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

const TestimonialsSection = ({
  testimonials,
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
  const [selectedRating, setSelectedRating] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(testimonial => {
      const matchesSearch = searchTerm === '' ||
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating = selectedRating === 'All' || testimonial.rating.toString() === selectedRating;

      return matchesSearch && matchesRating;
    });
  }, [testimonials, searchTerm, selectedRating]);

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const paginatedTestimonials = filteredTestimonials.slice(
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

  const handleToggleActive = async (testimonial) => {
    const updated = { ...testimonial, isActive: !testimonial.isActive, type: 'testimonial' };
    await onSave(updated);
  };

  const handleToggleFeatured = async (testimonial) => {
    const updated = { ...testimonial, featured: !testimonial.featured, type: 'testimonial' };
    await onSave(updated);
  };

  const handleAdd = () => {
    setNewItem({
      name: '',
      role: '',
      company: '',
      message: '',
      rating: 5,
      image: '',
      featured: false,
      isActive: true,
      type: 'testimonial'
    });
  };

  const handleEdit = (testimonial) => {
    setEditingItem({ ...testimonial, type: 'testimonial' });
  };

  const handleSave = async () => {
    await onSave(editingItem);
    setEditingItem(null);
  };

  const handleSaveNew = async () => {
    await onSaveNew(newItem);
    setNewItem(null);
  };

  return (
    <>
      <div className="section-header">
        <div className="header-left">
          <h3>Testimonials</h3>
          <p className="subtitle">Manage client feedback and endorsements</p>
        </div>
        <button onClick={handleAdd} className="btn primary" disabled={loading}>
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {newItem && newItem.type === 'testimonial' && (
        <TestimonialForm
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
          placeholder="Search testimonials..."
        />
        <FilterDropdown
          options={['All', '5', '4', '3', '2', '1']}
          value={selectedRating}
          onChange={setSelectedRating}
          placeholder="Filter by rating..."
        />
      </div>

      <AdminList
        items={paginatedTestimonials}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        renderItem={(testimonial) => (
          editingItem && editingItem._id === testimonial._id && editingItem.type === 'testimonial' ? (
            <TestimonialForm
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
              item={testimonial}
              onEdit={handleEdit}
              onDelete={(id) => onDelete(id, 'testimonial')}
              loading={loading}
              extraActions={
                <>
                  <button
                    className={`action-btn status-toggle ${testimonial.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleActive(testimonial)}
                    title={testimonial.isActive ? "Deactivate" : "Approve/Activate"}
                  >
                    {testimonial.isActive ? <FaCheckCircle /> : <FaRegCheckCircle />}
                  </button>
                  <button
                    className={`action-btn featured-toggle ${testimonial.featured ? 'active' : ''}`}
                    onClick={() => handleToggleFeatured(testimonial)}
                    title={testimonial.featured ? "Unmark as Featured" : "Mark as Featured"}
                  >
                    {testimonial.featured ? <FaStar /> : <FaRegStar />}
                  </button>
                </>
              }
            >
              <div className="item-main">
                <div className="item-title-row">
                  <h4>{testimonial.name}</h4>
                  <span className={`status-badge ${testimonial.isActive ? 'published' : 'draft'}`}>
                    {testimonial.isActive ? 'Approved' : 'Pending'}
                  </span>
                  {testimonial.featured && <span className="featured-badge"><FaStar /> Featured</span>}
                </div>
                <p className="testimonial-text-preview">"{testimonial.message.substring(0, 150)}{testimonial.message.length > 150 ? '...' : ''}"</p>
                <div className="item-footer">
                  <span className="item-meta">👤 {testimonial.role}</span>
                  {testimonial.company && <span className="item-meta">🏢 {testimonial.company}</span>}
                  <span className="rating-badge">⭐ {testimonial.rating}/5</span>
                </div>
              </div>
            </AdminItem>
          )
        )}
      />

      <BulkActions
        selectedItems={selectedItems}
        totalItems={filteredTestimonials.length}
        data={filteredTestimonials}
        onSelectAll={(e) => {
          if (e.target.checked) {
            setSelectedItems(filteredTestimonials);
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

export default TestimonialsSection;
