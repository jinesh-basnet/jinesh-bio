import React, { useState, useMemo } from 'react';
import './AdminProjects.css';
import { 
  FaPlus, FaGithub, FaSync, FaStar, FaRegStar, FaCode,
  FaExternalLinkAlt, FaFolderOpen
} from 'react-icons/fa';
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
  validationErrors = {}
}) => {
  const [newItem, setNewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const itemsPerPage = 8;

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

  const featuredCount = useMemo(() => projects.filter(p => p.featured).length, [projects]);

  return (
    <div className="admin-projects-layout">
      <div className="section-header-modern">
        <div className="header-content">
          <h3>Project Portfolio</h3>
          <div className="header-stats-pills">
            <span className="stat-pill">
              <strong>{projects.length}</strong> Total Projects
            </span>
            <span className="stat-pill featured">
              <strong>{featuredCount}</strong> Featured active
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={handleSyncGitHub}
            className="btn-modern secondary"
            disabled={loading || isSyncing}
          >
            <FaSync className={isSyncing ? 'spinning' : ''} />
            <span>{isSyncing ? 'Sync GitHub' : 'Sync GitHub'}</span>
          </button>
          <button onClick={handleAdd} className="btn-modern primary" disabled={loading}>
            <FaPlus />
            <span>New Project</span>
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

      <div className="search-filter-modern glass-card" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', padding: '1.25rem' }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Quick search projects..."
          />
        </div>
        <div style={{ width: '200px' }}>
          <FilterDropdown
            options={['All', 'JavaScript', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'React', 'Node.js', 'TypeScript']}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            placeholder="Language..."
          />
        </div>
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
                  style={{ color: project.featured ? '#f59e0b' : '#94a3b8' }}
                  title={project.featured ? "Unmark as Featured" : "Mark as Featured"}
                >
                  {project.featured ? <FaStar /> : <FaRegStar />}
                </button>
              }
            >
              <div className="project-item-card">
                <div className="project-title-area">
                   {project.featured ? <FaFolderOpen style={{ color: '#f59e0b', fontSize: '1.2rem'}} /> : <FaCode style={{ color: '#6366f1'}} />}
                  <h4>{project.name}</h4>
                  <span className={`lang-badge ${project.language?.toLowerCase()}`}>
                    {project.language}
                  </span>
                </div>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {project.description || 'No description available for this project.'}
                </p>
                <div className="project-meta-row">
                  <span className="meta-item"><FaRegStar /> {project.stargazers_count || 0} Stars</span>
                  {project.html_url && (
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="meta-link">
                      <FaGithub /> Source
                    </a>
                  )}
                  {project.homepage && (
                    <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="meta-link">
                      <FaExternalLinkAlt /> Live
                    </a>
                  )}
                </div>
              </div>
            </AdminItem>
          )
        )}
      />

      <div style={{ marginTop: 'auto' }}>
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
      </div>
    </div>
  );
};

export default ProjectsSection;

