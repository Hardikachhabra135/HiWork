import React, { useState, useEffect, useMemo } from 'react';
import {
  getSubmissions,
  updateSubmission,
  deleteSubmission,
  clearAllSubmissions,
  resetSampleSubmissions,
  exportToCSV,
  exportToJSON,
} from '../services/submissionStorage';
import './AdminPanel.css';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'status-new' },
  in_review: { label: 'In Review', color: 'status-review' },
  contacted: { label: 'Contacted', color: 'status-contacted' },
  closed: { label: 'Closed', color: 'status-closed' },
};

function formatTimestamp(isoString) {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

export default function AdminPanel({ onBack }) {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Load and subscribe to live changes
  useEffect(() => {
    const load = () => {
      setSubmissions(getSubmissions());
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener('hiwork_submissions_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('hiwork_submissions_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = submissions.length;
    const newCount = submissions.filter((s) => s.status === 'new').length;
    const reviewCount = submissions.filter((s) => s.status === 'in_review').length;
    const contactedCount = submissions.filter((s) => s.status === 'contacted').length;
    const closedCount = submissions.filter((s) => s.status === 'closed').length;
    return { total, newCount, reviewCount, contactedCount, closedCount };
  }, [submissions]);

  // Filtering and searching
  const filteredSubmissions = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return submissions.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      if (!matchesStatus) return false;

      if (!q) return true;
      const haystack = [
        item.name,
        item.email,
        item.phone,
        item.role,
        item.location,
        item.message,
        item.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [submissions, statusFilter, searchTerm]);

  // Actions
  const handleStatusChange = (id, newStatus) => {
    updateSubmission(id, { status: newStatus });
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the enquiry from "${name}"?`)) {
      deleteSubmission(id);
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(null);
      }
      showToast('Enquiry deleted successfully');
    }
  };

  const handleSaveNotes = () => {
    if (!selectedSub) return;
    updateSubmission(selectedSub.id, { notes: noteDraft });
    setSelectedSub((prev) => ({ ...prev, notes: noteDraft }));
    showToast('Admin notes saved');
  };

  const handleOpenDetail = (sub) => {
    setSelectedSub(sub);
    setNoteDraft(sub.notes || '');
  };

  return (
    <div className="admin-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast" role="status">
          <span className="admin-toast__icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <div className="admin-brand__logo">
            <span className="wordmark__dot"></span>
            hiwork
          </div>
          <span className="admin-header__tag">ADMIN PORTAL</span>
          <span className="admin-live-badge" title="Live sync with browser storage">
            <span className="live-dot"></span> Live Store
          </span>
        </div>

        <div className="admin-header__actions">
          <button
            type="button"
            className="btn btn-back-site"
            onClick={onBack}
            aria-label="Return to Hiwork public website"
          >
            ← Back to Website
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="admin-main">
        {/* Section Heading */}
        <div className="admin-title-row">
          <div>
            <h1 className="admin-title">Contact Enquiries</h1>
            <p className="admin-subtitle">
              Manage candidate enquiries, contact applicants directly, track follow-ups, and export data.
            </p>
          </div>

          <div className="admin-export-btns">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                exportToCSV(filteredSubmissions);
                showToast('Downloaded submissions CSV');
              }}
              disabled={filteredSubmissions.length === 0}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                exportToJSON(filteredSubmissions);
                showToast('Downloaded submissions JSON');
              }}
              disabled={filteredSubmissions.length === 0}
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* KPI Metrics Banner */}
        <section className="admin-kpis" aria-label="Submission metrics">
          <div
            className={`kpi-card ${statusFilter === 'all' ? 'kpi-card--active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            <span className="kpi-label">Total Enquiries</span>
            <span className="kpi-value">{metrics.total}</span>
          </div>

          <div
            className={`kpi-card kpi-card--lime ${statusFilter === 'new' ? 'kpi-card--active' : ''}`}
            onClick={() => setStatusFilter('new')}
          >
            <span className="kpi-label">New / Action Needed</span>
            <span className="kpi-value">{metrics.newCount}</span>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'in_review' ? 'kpi-card--active' : ''}`}
            onClick={() => setStatusFilter('in_review')}
          >
            <span className="kpi-label">In Review</span>
            <span className="kpi-value">{metrics.reviewCount}</span>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'contacted' ? 'kpi-card--active' : ''}`}
            onClick={() => setStatusFilter('contacted')}
          >
            <span className="kpi-label">Contacted</span>
            <span className="kpi-value">{metrics.contactedCount}</span>
          </div>

          <div
            className={`kpi-card ${statusFilter === 'closed' ? 'kpi-card--active' : ''}`}
            onClick={() => setStatusFilter('closed')}
          >
            <span className="kpi-label">Closed / Placed</span>
            <span className="kpi-value">{metrics.closedCount}</span>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by name, email, phone, role, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="admin-status-filters" role="tablist" aria-label="Filter by status">
            {['all', 'new', 'in_review', 'contacted', 'closed'].map((statusKey) => (
              <button
                key={statusKey}
                type="button"
                role="tab"
                aria-selected={statusFilter === statusKey}
                className={`filter-pill ${statusFilter === statusKey ? 'filter-pill--active' : ''}`}
                onClick={() => setStatusFilter(statusKey)}
              >
                {statusKey === 'all' ? 'All' : STATUS_CONFIG[statusKey]?.label}
                <span className="filter-count">
                  {statusKey === 'all'
                    ? metrics.total
                    : statusKey === 'new'
                    ? metrics.newCount
                    : statusKey === 'in_review'
                    ? metrics.reviewCount
                    : statusKey === 'contacted'
                    ? metrics.contactedCount
                    : metrics.closedCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table / List Container */}
        {filteredSubmissions.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-icon">📫</div>
            <h3>No enquiries found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or status filter.'
                : 'No contact form submissions exist in local storage yet.'}
            </p>
            <div className="empty-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  resetSampleSubmissions();
                  showToast('Reset to demo candidate enquiries');
                }}
              >
                Load Sample Enquiries
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={onBack}
              >
                Go to Contact Form
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table" aria-label="Candidate enquiries">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Phone & Outreach</th>
                  <th>Target Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => {
                  const initials = sub.name
                    ? sub.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : '?';

                  const waPhone = cleanPhoneForWhatsApp(sub.phone);

                  return (
                    <tr
                      key={sub.id}
                      className={`admin-row ${selectedSub?.id === sub.id ? 'admin-row--selected' : ''}`}
                      onClick={() => handleOpenDetail(sub)}
                    >
                      {/* Candidate Name & Email */}
                      <td>
                        <div className="candidate-cell">
                          <div className="avatar-initials">{initials}</div>
                          <div>
                            <div className="candidate-name">{sub.name}</div>
                            <a
                              href={`mailto:${sub.email}`}
                              className="candidate-email"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {sub.email}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Direct Outreach Links */}
                      <td>
                        <div className="phone-cell" onClick={(e) => e.stopPropagation()}>
                          <a href={`tel:${sub.phone}`} className="phone-link">
                            {sub.phone || '—'}
                          </a>
                          {waPhone && (
                            <a
                              href={`https://wa.me/${waPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="wa-pill"
                              title="Direct WhatsApp chat"
                            >
                              WhatsApp ↗
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span className="role-badge">{sub.role || 'Not specified'}</span>
                      </td>

                      {/* Location */}
                      <td>
                        <span className="location-text">{sub.location || '—'}</span>
                      </td>

                      {/* Status Dropdown */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className={`status-select ${STATUS_CONFIG[sub.status]?.color || ''}`}
                          value={sub.status}
                          onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                          aria-label={`Update status for ${sub.name}`}
                        >
                          <option value="new">● New</option>
                          <option value="in_review">● In Review</option>
                          <option value="contacted">● Contacted</option>
                          <option value="closed">● Closed</option>
                        </select>
                      </td>

                      {/* Received Date */}
                      <td>
                        <span className="time-text" title={new Date(sub.submittedAt).toLocaleString()}>
                          {formatTimestamp(sub.submittedAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-action btn-action--view"
                            onClick={() => handleOpenDetail(sub)}
                            title="View Full Details"
                          >
                            Details
                          </button>
                          <a
                            href={`mailto:${sub.email}?subject=Hiwork%20Follow-up&body=Hi%20${encodeURIComponent(sub.name)},%0A%0AThank%20you%20for%20reaching%20out%20to%20Hiwork.`}
                            className="btn-action btn-action--mail"
                            title="Send email"
                          >
                            Email
                          </a>
                          <button
                            type="button"
                            className="btn-action btn-action--delete"
                            onClick={() => handleDelete(sub.id, sub.name)}
                            title="Delete enquiry"
                            aria-label={`Delete enquiry from ${sub.name}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info bar */}
        <div className="admin-footer-bar">
          <span>
            Showing <strong>{filteredSubmissions.length}</strong> of <strong>{submissions.length}</strong> enquiries
          </span>
          <div className="admin-footer-actions">
            <button
              type="button"
              className="text-link"
              onClick={() => {
                resetSampleSubmissions();
                showToast('Reset sample candidate submissions');
              }}
            >
              Reset Demo Data
            </button>
            <span className="sep">•</span>
            <button
              type="button"
              className="text-link text-link--danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all stored submissions? This cannot be undone.')) {
                  clearAllSubmissions();
                  showToast('All submissions cleared');
                }
              }}
            >
              Clear All Data
            </button>
          </div>
        </div>
      </main>

      {/* Detail Modal / Drawer */}
      {selectedSub && (
        <div className="admin-modal-overlay" onClick={() => setSelectedSub(null)}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-candidate-name"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal__header">
              <div>
                <span className="admin-modal__eyebrow">ENQUIRY DETAILS</span>
                <h2 id="modal-candidate-name" className="admin-modal__title">
                  {selectedSub.name}
                </h2>
                <span className="modal-date">
                  Received {new Date(selectedSub.submittedAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setSelectedSub(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="admin-modal__body">
              {/* Quick Contact & Info Grid */}
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="info-item-label">PHONE NUMBER</span>
                  <div className="info-item-val">{selectedSub.phone || 'Not provided'}</div>
                  <div className="info-item-actions">
                    {selectedSub.phone && (
                      <>
                        <a href={`tel:${selectedSub.phone}`} className="btn-modal-action">
                          📞 Call
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhoneForWhatsApp(selectedSub.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-modal-action btn-modal-action--wa"
                        >
                          WhatsApp ↗
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="modal-info-item">
                  <span className="info-item-label">EMAIL ADDRESS</span>
                  <div className="info-item-val">{selectedSub.email}</div>
                  <div className="info-item-actions">
                    <a
                      href={`mailto:${selectedSub.email}?subject=Hiwork%20Career%20Guidance&body=Hi%20${encodeURIComponent(selectedSub.name)},`}
                      className="btn-modal-action"
                    >
                      ✉ Send Email
                    </a>
                  </div>
                </div>

                <div className="modal-info-item">
                  <span className="info-item-label">TARGET ROLE</span>
                  <div className="info-item-val font-semibold">{selectedSub.role || 'Not specified'}</div>
                </div>

                <div className="modal-info-item">
                  <span className="info-item-label">PREFERRED LOCATION</span>
                  <div className="info-item-val font-semibold">{selectedSub.location || 'Not specified'}</div>
                </div>
              </div>

              {/* Status Update Banner */}
              <div className="modal-status-bar">
                <span className="info-item-label">CURRENT STATUS</span>
                <div className="modal-status-pills">
                  {['new', 'in_review', 'contacted', 'closed'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`status-pill-btn ${selectedSub.status === key ? 'status-pill-btn--active ' + STATUS_CONFIG[key].color : ''}`}
                      onClick={() => handleStatusChange(selectedSub.id, key)}
                    >
                      {STATUS_CONFIG[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Message */}
              <div className="modal-message-box">
                <span className="info-item-label">CANDIDATE GOALS & MESSAGE</span>
                <p className="modal-message-text">
                  {selectedSub.message || 'No additional message was provided by the candidate.'}
                </p>
              </div>

              {/* Internal Admin Notes */}
              <div className="modal-notes-box">
                <div className="notes-header">
                  <span className="info-item-label">INTERNAL ADMIN NOTES</span>
                  <span className="notes-hint">Saved to local storage</span>
                </div>
                <textarea
                  className="modal-notes-input"
                  rows={3}
                  placeholder="Add notes about candidate background, follow-up calls, recommended plan..."
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-dark btn-save-notes"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="admin-modal__footer">
              <button
                type="button"
                className="btn-text-danger"
                onClick={() => handleDelete(selectedSub.id, selectedSub.name)}
              >
                Delete Enquiry
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedSub(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
