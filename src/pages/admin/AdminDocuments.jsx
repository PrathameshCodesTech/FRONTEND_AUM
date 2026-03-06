import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import '../../styles/admin/AdminDocuments.css';

const TABS = [
  { id: 'COMMON', label: 'Common Documents' },
  { id: 'INDIVIDUAL', label: 'Individual Documents' },
  { id: 'PROPERTY', label: 'Property Documents' },
];

const AdminDocuments = () => {
  const [activeTab, setActiveTab] = useState('COMMON');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    files: [],
    shared_with: [],   // for INDIVIDUAL
    property_id: '',   // for PROPERTY
  });

  useEffect(() => {
    fetchDocuments();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'INDIVIDUAL') fetchUsers();
    if (activeTab === 'PROPERTY') fetchProperties();
  }, [activeTab]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await adminService.getStorageDocuments(activeTab);
      if (res.success) setDocuments(res.data);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminService.getDocumentUsers();
      if (res.success) setUsers(res.data);
    } catch { console.error('Failed to fetch users'); }
  };

  const fetchProperties = async () => {
    try {
      const res = await adminService.getDocumentProperties();
      if (res.success) setProperties(res.data);
    } catch { console.error('Failed to fetch properties'); }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    setForm(prev => ({ ...prev, files: Array.from(e.target.files) }));
  };

  const toggleUser = (userId) => {
    setForm(prev => ({
      ...prev,
      shared_with: prev.shared_with.includes(userId)
        ? prev.shared_with.filter(id => id !== userId)
        : [...prev.shared_with, userId],
    }));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', files: [], shared_with: [], property_id: '' });
    setUserSearch('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowUploadForm(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (form.files.length === 0) return toast.error('Select at least one file');
    if (activeTab === 'INDIVIDUAL' && form.shared_with.length === 0)
      return toast.error('Select at least one user');
    if (activeTab === 'PROPERTY' && !form.property_id)
      return toast.error('Select a property');

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('description', form.description.trim());
      fd.append('document_type', activeTab);
      form.files.forEach(f => fd.append('files', f));
      if (activeTab === 'INDIVIDUAL')
        fd.append('shared_with', JSON.stringify(form.shared_with));
      if (activeTab === 'PROPERTY')
        fd.append('property_id', form.property_id);

      const res = await adminService.uploadStorageDocuments(fd);
      if (res.success) {
        toast.success(`${form.files.length} document(s) uploaded`);
        resetForm();
        fetchDocuments();
      }
    } catch (err) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const res = await adminService.deleteStorageDocument(id);
      if (res.success) {
        toast.success('Document deleted');
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch {
      toast.error('Failed to delete document');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="admin-documents-page">
      <div className="admin-documents-header">
        <div>
          <h1 className="admin-documents-title">Document Storage</h1>
          <p className="admin-documents-subtitle">Manage and share documents with users</p>
        </div>
        <button className="btn-add-doc" onClick={() => setShowUploadForm(v => !v)}>
          {showUploadForm ? 'Cancel' : '+ Upload Documents'}
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-doc-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-doc-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setShowUploadForm(false); resetForm(); }}
          >
            {tab.label}
            <span className="tab-badge">{tab.id === activeTab ? documents.length : ''}</span>
          </button>
        ))}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="admin-doc-upload-form-wrapper">
          <form className="admin-doc-upload-form" onSubmit={handleUpload}>
            <h3 className="upload-form-title">
              Upload {TABS.find(t => t.id === activeTab)?.label}
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input type="text" name="title" value={form.title} onChange={handleFormChange} placeholder="Document title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={form.description} onChange={handleFormChange} placeholder="Optional description" />
              </div>
            </div>

            <div className="form-group">
              <label>Files <span className="required">*</span></label>
              <input ref={fileInputRef} type="file" multiple onChange={handleFilesChange} />
              {form.files.length > 0 && <p className="files-selected">{form.files.length} file(s) selected</p>}
            </div>

            {/* INDIVIDUAL: user multi-select */}
            {activeTab === 'INDIVIDUAL' && (
              <div className="form-group user-select-group">
                <label>Share With Users <span className="required">*</span></label>
                <input
                  type="text"
                  className="user-search-input"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                />
                <div className="user-select-list">
                  {filteredUsers.length === 0 ? (
                    <p className="no-users-text">No users found</p>
                  ) : filteredUsers.map(u => (
                    <label key={u.id} className={`user-select-item${form.shared_with.includes(u.id) ? ' selected' : ''}`}>
                      <input type="checkbox" checked={form.shared_with.includes(u.id)} onChange={() => toggleUser(u.id)} />
                      <div className="user-select-info">
                        <span className="user-select-name">{u.name}</span>
                        <span className="user-select-email">{u.email}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {form.shared_with.length > 0 && (
                  <p className="users-selected-count">{form.shared_with.length} user(s) selected</p>
                )}
              </div>
            )}

            {/* PROPERTY: property dropdown */}
            {activeTab === 'PROPERTY' && (
              <div className="form-group">
                <label>Property <span className="required">*</span></label>
                <select name="property_id" value={form.property_id} onChange={handleFormChange}>
                  <option value="">Select property...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <p className="property-help-text">All investors of this property will see the document</p>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn-cancel-upload" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn-submit-upload" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="admin-doc-list-wrapper">
        {loading ? (
          <div className="admin-doc-loading">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="admin-doc-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No documents yet in this category</p>
          </div>
        ) : (
          <div className="admin-doc-grid">
            {documents.map(doc => (
              <div key={doc.id} className="admin-doc-card">
                <div className="admin-doc-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-doc-card-info">
                  <h4 className="admin-doc-title">{doc.title}</h4>
                  {doc.description && <p className="admin-doc-desc">{doc.description}</p>}
                  <div className="admin-doc-meta">
                    <span className="admin-doc-filename">{doc.file_name}</span>
                    <span className="admin-doc-date">{formatDate(doc.created_at)}</span>
                  </div>
                  {activeTab === 'INDIVIDUAL' && doc.shared_with_ids?.length > 0 && (
                    <p className="admin-doc-shared">Shared with {doc.shared_with_ids.length} user(s)</p>
                  )}
                  {activeTab === 'PROPERTY' && doc.property_name && (
                    <p className="admin-doc-shared">Property: {doc.property_name}</p>
                  )}
                </div>
                <div className="admin-doc-card-actions">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn-doc-view" title="View">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </a>
                  <button className="btn-doc-delete" onClick={() => handleDelete(doc.id)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1017 19.1493C18.0442 19.9019 17.4 20.5 16.6457 20.5H7.35432C6.59999 20.5 5.95579 19.9019 5.89833 19.1493L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;
