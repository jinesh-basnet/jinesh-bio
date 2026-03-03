import { useState, useEffect, useCallback } from 'react';

export const useAdminData = (activeSection) => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [home, setHome] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  const handleApiError = useCallback((error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      setError('Session expired. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    } else {
      setError(error.response?.data?.error || 'An error occurred');
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/projects', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/testimonials', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchAbout = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/about', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch about content');
      const data = await response.json();
      setAbout(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/blogs', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchHome = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/home', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch home content');
      const data = await response.json();
      setHome(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/contacts', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  const fetchTimeline = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/timeline', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch timeline');
      const data = await response.json();
      setTimeline(data);
    } catch (error) {
      handleApiError(error);
    }
  }, [getAuthHeaders, handleApiError]);

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchStats();
    } else if (activeSection === 'projects') {
      fetchProjects();
    } else if (activeSection === 'testimonials') {
      fetchTestimonials();
    } else if (activeSection === 'about') {
      fetchAbout();
    } else if (activeSection === 'blogs') {
      fetchBlogs();
    } else if (activeSection === 'home') {
      fetchHome();
    } else if (activeSection === 'users') {
      fetchUsers();
    } else if (activeSection === 'contacts') {
      fetchContacts();
    } else if (activeSection === 'timeline') {
      fetchTimeline();
    }
  }, [activeSection, fetchStats, fetchProjects, fetchTestimonials, fetchAbout, fetchBlogs, fetchHome, fetchUsers, fetchContacts, fetchTimeline]);

  const fetchData = useCallback((type) => {
    if (type === 'projects') fetchProjects();
    else if (type === 'testimonials') fetchTestimonials();
    else if (type === 'about') fetchAbout();
    else if (type === 'blogs') fetchBlogs();
    else if (type === 'home') fetchHome();
    else if (type === 'timeline') fetchTimeline();
    else if (type === 'users') fetchUsers();
    else if (type === 'contacts') fetchContacts();
  }, [fetchProjects, fetchTestimonials, fetchAbout, fetchBlogs, fetchHome, fetchTimeline, fetchUsers, fetchContacts]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return {
    data: {
      users,
      projects,
      testimonials,
      about,
      blogs,
      home,
      timeline,
      contacts,
      stats
    },
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,

    fetchProjects,
    fetchTestimonials,
    fetchAbout,
    fetchBlogs,
    fetchStats,
    fetchHome,
    fetchUsers,
    fetchContacts,
    fetchTimeline,
    fetchData,

    getAuthHeaders,
    handleApiError
  };
};
