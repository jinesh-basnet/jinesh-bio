import React, { useState, useMemo } from 'react';
import { FaPlus, FaStar, FaRegStar } from 'react-icons/fa';
import BlogForm from './BlogForm';
import AdminList from './AdminList';
import AdminItem from './AdminItem';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

const BlogsSection = ({
  blogs,
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsPerPage = 10;

  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = searchTerm === '' ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
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

  const handleToggleFeatured = async (blog) => {
    const updatedBlog = { ...blog, featured: !blog.featured, type: 'blog' };
    await onSave(updatedBlog);
  };

  const handleAdd = () => {
    setNewItem({
      title: '',
      content: '',
      excerpt: '',
      category: 'Technology',
      author: 'Admin',
      tags: [],
      featuredImage: '',
      published: false,
      featured: false,
      type: 'blog'
    });
  };

  const handleEdit = (blog) => {
    setEditingItem({ ...blog, type: 'blog' });
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
          <h3>Blog Posts</h3>
          <p className="subtitle">Share your thoughts and tutorials</p>
        </div>
        <button onClick={handleAdd} className="btn primary" disabled={loading}>
          <FaPlus /> Add Blog Post
        </button>
      </div>

      {newItem && newItem.type === 'blog' && (
        <BlogForm
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
          placeholder="Search blogs..."
        />
        <FilterDropdown
          options={['All', 'Technology', 'Tutorial', 'Personal', 'Development', 'Design']}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Filter by category..."
        />
      </div>

      <AdminList
        items={paginatedBlogs}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        renderItem={(blog) => (
          editingItem && editingItem._id === blog._id && editingItem.type === 'blog' ? (
            <BlogForm
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
              item={blog}
              onEdit={handleEdit}
              onDelete={(id) => onDelete(id, 'blog')}
              loading={loading}
              extraActions={
                <button
                  className={`action-btn featured-toggle ${blog.featured ? 'active' : ''}`}
                  onClick={() => handleToggleFeatured(blog)}
                  title={blog.featured ? "Unmark as Featured" : "Mark as Featured"}
                >
                  {blog.featured ? <FaStar /> : <FaRegStar />}
                </button>
              }
            >
              <div className="item-main">
                <div className="item-title-row">
                  <h4>{blog.title}</h4>
                  {blog.featured && <span className="featured-badge"><FaStar /> Featured</span>}
                  {blog.published ? <span className="status-badge published">Published</span> : <span className="status-badge draft">Draft</span>}
                </div>
                <p>{blog.excerpt || blog.content?.substring(0, 100) + '...'}</p>
                <div className="item-footer">
                  <span className="item-meta">📁 {blog.category}</span>
                  <span className="item-meta">🏷️ {blog.tags ? blog.tags.join(', ') : 'No tags'}</span>
                  <span className="info-badge">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </AdminItem>
          )
        )}
      />

      <BulkActions
        selectedItems={selectedItems}
        totalItems={filteredBlogs.length}
        data={filteredBlogs}
        onSelectAll={(e) => {
          if (e.target.checked) {
            setSelectedItems(filteredBlogs);
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

export default BlogsSection;
