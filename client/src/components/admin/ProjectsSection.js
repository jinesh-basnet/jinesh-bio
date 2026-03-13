import React, { useState, useMemo } from 'react';
import { FaPlus, FaGithub, FaSync, FaStar, FaRegStar } from 'react-icons/fa';
import ProjectForm from './ProjectForm';
import AdminList from './AdminList';
import AdminItem from './AdminItem';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import Pagination from './Pagination';
import BulkActions from './BulkActions';

const ProjectsSection = ({
  projects,
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
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const itemsPerPage = 10;

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLanguage = selectedLanguage === 'All' || project.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [projects, searchTerm, selectedLanguage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const handleSyncGitHub = async () => {
    setIsSyncing(true);
    try {
      const username = 'jinesh-basnet';
      const response = await fetch(`http://localhost:5000/api/github/repos/${username}`);
      if (!response.ok) throw new Error('Failed to fetch repos');
      const repos = await response.json();

      let createdCount = 0;
      // Use a local set of URLs to track what we've already synced during this session
      const existingUrls = new Set(projects.map(p => p.html_url));

      for (const repo of repos) {
        if (!existingUrls.has(repo.html_url)) {
          const projectData = {
            name: repo.name,
            description: repo.description || 'No description provided',
            language: repo.language || 'JavaScript',
            html_url: repo.html_url,
            homepage: repo.homepage || '',
            stargazers_count: repo.stargazers_count,
            topics: repo.topics || [],
            type: 'project',
            featured: false
          };
          
          await onSaveNew(projectData);
          existingUrls.add(repo.html_url);
          createdCount++;
        }
      }
      
      if (createdCount > 0) {
        alert(`Successfully synced ${createdCount} new projects!`);
      } else {
        alert('All projects are already up to date.');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync GitHub repositories');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleFeatured = async (project) => {
    const updatedProject = { ...project, featured: !project.featured, type: 'project' };
    await onSave(updatedProject);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length > 0) {
      for (const item of selectedItems) {
        await onDelete(item._id, 'project');
      }
      setSelectedItems([]);
    }
  };

  const handleBulkUpdate = async () => {
    setSelectedItems([]);
  };

  const handleAdd = () => {
    setNewItem({
      name: '',
      description: '',
      language: 'JavaScript',
      html_url: '',
      homepage: '',
      stargazers_count: 0,
      topics: [],
      type: 'project',
      featured: false
    });
  };

  const handleEdit = (project) => {
    setEditingItem({ ...project, type: 'project' });
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
          <h3>Projects</h3>
          <p className="subtitle">Manage and highlight your best work</p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleSyncGitHub}
            className="btn secondary sync-btn"
            disabled={loading || isSyncing}
          >
            <FaSync className={isSyncing ? 'spinning' : ''} /> {isSyncing ? 'Syncing...' : 'Sync GitHub'}
          </button>
          <button onClick={handleAdd} className="btn primary" disabled={loading}>
            <FaPlus /> Add Project
          </button>
        </div>
      </div>

      {newItem && newItem.type === 'project' && (
        <ProjectForm
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
          placeholder="Search projects..."
        />
        <FilterDropdown
          options={['All', 'JavaScript', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'React', 'Node.js', 'TypeScript']}
          value={selectedLanguage}
          onChange={setSelectedLanguage}
          placeholder="Filter by language..."
        />
      </div>

      <AdminList
        items={paginatedProjects}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        renderItem={(project) => (
          editingItem && editingItem._id === project._id && editingItem.type === 'project' ? (
            <ProjectForm
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
              item={project}
              onEdit={handleEdit}
              onDelete={(id) => onDelete(id, 'project')}
              loading={loading}
              extraActions={
                <button
                  className={`action-btn featured-toggle ${project.featured ? 'active' : ''}`}
                  onClick={() => handleToggleFeatured(project)}
                  title={project.featured ? "Unmark as Featured" : "Mark as Featured"}
                >
                  {project.featured ? <FaStar /> : <FaRegStar />}
                </button>
              }
            >
              <div className="item-main">
                <div className="item-title-row">
                  <h4>{project.name}</h4>
                  {project.featured && <span className="featured-badge"><FaStar /> Featured</span>}
                </div>
                <p>{project.description}</p>
                <div className="item-footer">
                  <span className="item-meta">
                    <span className={`lang-dot ${project.language?.toLowerCase()}`}></span>
                    {project.language}
                  </span>
                  <span className="item-meta">⭐ {project.stargazers_count}</span>
                  <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="github-link">
                    <FaGithub /> View Source
                  </a>
                </div>
              </div>
            </AdminItem>
          )
        )}
      />

      <BulkActions
        selectedItems={selectedItems}
        totalItems={filteredProjects.length}
        data={filteredProjects}
        onSelectAll={(e) => {
          if (e.target.checked) {
            setSelectedItems(filteredProjects);
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

export default ProjectsSection;
