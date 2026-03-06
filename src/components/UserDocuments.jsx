import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import documentService from '../services/documentService';
import '../styles/MyInvestments.css';
import '../styles/UserDocuments.css';

const UserDocuments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('COMMON');
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentService.getMyDocuments();
      if (res.success) setAllDocuments(res.data);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      toast.loading('Downloading...', { id: `dl-doc-${doc.id}` });
      const response = await documentService.downloadDocument(doc.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.file_name || `document-${doc.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded!', { id: `dl-doc-${doc.id}` });
    } catch {
      toast.error('Download failed', { id: `dl-doc-${doc.id}` });
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const getFileLabel = (fileName) => {
    if (!fileName) return 'Document';
    const ext = fileName.split('.').pop()?.toUpperCase();
    if (ext && ext.length <= 4) return ext;
    return 'File';
  };

  const byType = allDocuments.filter(d => d.document_type === activeTab);
  const filtered = searchQuery.trim()
    ? byType.filter(d =>
        d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : byType;

  return (
    <div className="documents-page">
      <div className="documents-container">

        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className="page-header">
          <div>
            <h1 className="page-title">Documents</h1>
            <p className="page-subtitle">View and download documents shared with you</p>
          </div>
        </div>

        <div className="investment-tabs">
          {[
            { id: 'COMMON', label: 'Common Documents' },
            { id: 'PROJECT', label: 'Project Documents' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`investment-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">
                {allDocuments.filter(d => d.document_type === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="search-section">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="button" className="filter-btn" aria-label="Filter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="investments-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">Loading documents...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>{searchQuery ? 'No documents found' : `No ${activeTab === 'COMMON' ? 'common' : 'project'} documents yet`}</h3>
              <p>{searchQuery ? 'Try adjusting your search' : 'Documents shared with you will appear here'}</p>
            </div>
          ) : (
            <div className="investments-grid documents-grid">
              {filtered.map(doc => (
                <div key={doc.id} className="investment-card document-card">
                  <div className="document-card-inner">
                    <div className="document-card-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="document-card-body">
                      <h4 className="document-card-title">{doc.title}</h4>
                      {doc.description && (
                        <p className="document-card-desc">{doc.description}</p>
                      )}
                      <div className="document-card-meta">
                        <span className="document-file-type">{getFileLabel(doc.file_name)}</span>
                        <span className="document-filename" title={doc.file_name}>{doc.file_name}</span>
                        <span className="document-date">{formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-explore document-download-btn"
                      onClick={() => handleDownload(doc)}
                      title="Download"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDocuments;
