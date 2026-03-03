import { useCallback } from 'react';

export const useAdminActions = ({
  getAuthHeaders,
  handleApiError,
  setLoading,
  setError,
  setSuccess,
  fetchData
}) => {

  const handleSave = useCallback(async (editingItem) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const getEndpoint = (item) => {
        if (item.type === 'about') return 'about';
        if (item.type === 'home') return 'home';
        if (item.type === 'project') return 'projects';
        if (item.type === 'testimonial') return 'testimonials';
        if (item.type === 'blog') return 'blogs';
        if (item.type === 'user') return 'users';
        if (item.timelineType === 'timeline' || item.type === 'work' || item.type === 'education' || item.type === 'life' || item.type === 'achievement' || item.type === 'certification') return 'timeline';
        return 'blogs'; // Default fallback
      };

      const endpoint = getEndpoint(editingItem);

      let url;
      if (endpoint === 'about' || endpoint === 'home') {
        url = `http://localhost:5000/api/admin/${endpoint}`;
      } else {
        url = `http://localhost:5000/api/admin/${endpoint}/${editingItem._id}`;
      }
      let body;
      let headers = getAuthHeaders();

      if ((editingItem.profileImageFile && (editingItem.type === 'about' || editingItem.type === 'home')) || (editingItem.imageFile && (editingItem.type === 'timeline' || editingItem.timelineType === 'timeline' || editingItem.type === 'project' || editingItem.type === 'testimonial' || editingItem.type === 'blog'))) {
        const formData = new FormData();
        Object.keys(editingItem).forEach(key => {
          if (key === 'image' || key === 'profileImage' || key === 'featuredImage') return;
          if (editingItem[key] === undefined || editingItem[key] === null) return;

          if (key === 'profileImageFile' || key === 'imageFile') {
            let fieldName = 'image';
            if (endpoint === 'about' || endpoint === 'home') fieldName = 'profileImage';
            else if (endpoint === 'blogs') fieldName = 'featuredImage';

            formData.append(fieldName, editingItem[key]);
          } else if (typeof editingItem[key] === 'object' && editingItem[key] !== null) {
            formData.append(key, JSON.stringify(editingItem[key]));
          } else {
            formData.append(key, editingItem[key]);
          }
        });
        body = formData;
        delete headers['Content-Type'];
      } else {
        body = JSON.stringify(editingItem);
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: body
      });

      if (!response.ok) throw new Error('Failed to update item');

      setSuccess('Item updated successfully!');

      fetchData(endpoint === 'timeline' ? 'timeline' : editingItem.type);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleApiError, setLoading, setError, setSuccess, fetchData]);

  const handleDelete = useCallback(async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = type === 'project' ? 'projects' : type === 'testimonial' ? 'testimonials' : type === 'blog' ? 'blogs' : type === 'timeline' ? 'timeline' : type === 'user' ? 'users' : type === 'contact' ? 'contacts' : 'blogs';
      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setSuccess('Item deleted successfully!');

      fetchData(type);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleApiError, setLoading, setError, setSuccess, fetchData]);

  const handleSaveNew = useCallback(async (newItem) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const getEndpoint = (item) => {
        if (item.type === 'project') return 'projects';
        if (item.type === 'testimonial') return 'testimonials';
        if (item.type === 'blog') return 'blogs';
        if (item.timelineType === 'timeline' || item.type === 'work' || item.type === 'education' || item.type === 'life' || item.type === 'achievement' || item.type === 'certification') return 'timeline';
        return 'blogs';
      };

      const endpoint = getEndpoint(newItem);

      let body;
      let headers = getAuthHeaders();

      if (newItem.imageFile || newItem.profileImageFile) {
        const formData = new FormData();
        Object.keys(newItem).forEach(key => {
          if (key === 'image' || key === 'profileImage' || key === 'featuredImage') return;
          if (newItem[key] === undefined || newItem[key] === null) return;

          if (key === 'profileImageFile' || key === 'imageFile') {
            let fieldName = 'image';
            if (endpoint === 'blogs') fieldName = 'featuredImage';

            formData.append(fieldName, newItem[key]);
          } else if (typeof newItem[key] === 'object' && newItem[key] !== null) {
            formData.append(key, JSON.stringify(newItem[key]));
          } else {
            formData.append(key, newItem[key]);
          }
        });
        body = formData;
        delete headers['Content-Type'];
      } else {
        body = JSON.stringify(newItem);
      }

      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (!response.ok) throw new Error('Failed to create item');

      setSuccess('Item created successfully!');

      fetchData(endpoint === 'timeline' ? 'timeline' : newItem.type);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleApiError, setLoading, setError, setSuccess, fetchData]);

  const handleApproveAdmin = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to approve this admin user?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to approve admin user');

      setSuccess('Admin user approved successfully!');
      fetchData('users');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleApiError, setLoading, setError, setSuccess, fetchData]);

  const handleRejectAdmin = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to reject this admin user?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to reject admin user');

      setSuccess('Admin user rejected successfully!');
      fetchData('users');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleApiError, setLoading, setError, setSuccess, fetchData]);

  return {
    handleSave,
    handleDelete,
    handleSaveNew,
    handleApproveAdmin,
    handleRejectAdmin
  };
};
