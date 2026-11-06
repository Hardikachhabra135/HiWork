import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  getSubmissions,
  updateSubmission,
  deleteSubmission,
  exportToExcel,
  exportToCSV,
  exportToJSON,
} from './submissionStorage';
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

export default function AdminPanel() {
  // Auth state
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(() => Boolean(supabase));
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rlsError, setRlsError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSub, setSelectedSub] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Check initial auth session & listen to auth changes
  useEffect(() => {
    let localSess = null;
    try {
      const saved = localStorage.getItem('hiwork_admin_session');
      if (saved) {
        localSess = JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    if (!supabase || !isSupabaseConfigured) {
      if (localSess) {
        setSession(localSess);
      }
      setAuthChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession || localSess);
      setAuthChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession || localSess);
      setAuthChecking(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fetch submissions from Supabase public.contact_submissions (or local fallback)
  const loadSubmissions = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    setRlsError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error, status } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[HiWork Admin] Fetch enquiries failed:', {
            code: error.code,
            message: error.message,
            hint: error.hint,
            status,
          });
          setRlsError(
            error.message ||
              'Access denied by Supabase Row-Level Security (RLS). Please ensure an authorized SELECT policy exists on public.contact_submissions.'
          );
          setSubmissions([]);
          return;
        }

        console.info(`[HiWork Admin] Query successful (status ${status}). Loaded ${data?.length || 0} enquiry record(s).`);

        const mapped = (data || []).map((row) => ({
          id: row.id,
          name: row.name || 'Anonymous',
          email: row.email || '',
          phone: row.phone || '',
          role: row.role || 'Not specified',
          location: row.location || 'Not specified',
          message: row.message || '',
          status: ['new', 'in_review', 'contacted', 'closed'].includes(row.status)
            ? row.status
            : 'new',
          notes: row.notes || '',
          submittedAt: row.created_at || new Date().toISOString(),
          created_at: row.created_at,
        }));

        setSubmissions(mapped);
      } catch (err) {
        console.error('[HiWork Admin] Unexpected error fetching submissions:', err?.message || err);
        setRlsError('An unexpected error occurred while communicating with Supabase.');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const localSubs = getSubmissions();
        setSubmissions(localSubs);
      } catch (err) {
        console.error('[HiWork Admin] Error loading local submissions:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  // Trigger load when authenticated session becomes available
  useEffect(() => {
    let ignore = false;
    if (session) {
      // Defer execution out of the synchronous effect body to avoid cascading renders
      queueMicrotask(() => {
        if (!ignore) {
          loadSubmissions();
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [session, loadSubmissions]);

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

  // Handle Sign In with Supabase Auth or Standalone Admin
  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthError('');

    const trimmed = authEmail.trim();
    if (!trimmed) {
      setAuthError('Please enter your username or email.');
      return;
    }
    if (!authPassword) {
      setAuthError('Please enter your password.');
      return;
    }

    setAuthLoading(true);
    try {
      const emailToUse = trimmed.includes('@') ? trimmed : `${trimmed}@hiwork.com`;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: authPassword,
        });

        if (error) {
          setAuthError(error.message || 'Invalid email or password.');
          return;
        } else if (data?.session) {
          setSession(data.session);
          setAuthPassword('');
          return;
        }
      }

      // Standalone / Local administrator session fallback
      const localSession = {
        user: {
          id: 'admin_local',
          email: emailToUse,
          user_metadata: { role: 'admin', name: trimmed },
        },
        access_token: 'local_admin_token',
      };
      try {
        localStorage.setItem('hiwork_admin_session', JSON.stringify(localSession));
      } catch {
        // ignore
      }
      setSession(localSession);
      setAuthPassword('');
      showToast('Signed in successfully');
    } catch (err) {
      console.error('Sign in error:', err);
      setAuthError('Sign in failed. Please check your credentials and try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
    try {
      localStorage.removeItem('hiwork_admin_session');
    } catch {
      // ignore
    }
    setSession(null);
    setSubmissions([]);
    setSelectedSub(null);
    showToast('Signed out of Admin Portal');
  };

  // Update Status in Supabase or local store
  const handleStatusChange = async (id, newStatus) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          showToast(`Failed to update status: ${error.message}`);
          return;
        }

        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub((prev) => ({ ...prev, status: newStatus }));
        }
        showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      } catch (err) {
        console.error('Status update error:', err);
        showToast('Error updating status in Supabase.');
      }
    } else {
      try {
        updateSubmission(id, { status: newStatus });
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub((prev) => ({ ...prev, status: newStatus }));
        }
        showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      } catch (err) {
        console.error('Status update error:', err);
        showToast('Error updating status.');
      }
    }
  };

  // Delete Enquiry in Supabase or local store
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the enquiry from "${name}"?`)) {
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', id);

        if (error) {
          showToast(`Failed to delete enquiry: ${error.message}`);
          return;
        }

        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub(null);
        }
        showToast('Enquiry deleted successfully from Supabase');
      } catch (err) {
        console.error('Delete error:', err);
        showToast('Error deleting enquiry.');
      }
    } else {
      try {
        deleteSubmission(id);
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (selectedSub && selectedSub.id === id) {
          setSelectedSub(null);
        }
        showToast('Enquiry deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        showToast('Error deleting enquiry.');
      }
    }
  };

  // Save Notes in Supabase or local store
  const handleSaveNotes = async () => {
    if (!selectedSub) return;

    setSavingNotes(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('contact_submissions')
          .update({ notes: noteDraft })
          .eq('id', selectedSub.id);

        if (error) {
          showToast(`Failed to save notes: ${error.message}`);
          return;
        }

        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSub.id ? { ...s, notes: noteDraft } : s))
        );
        setSelectedSub((prev) => ({ ...prev, notes: noteDraft }));
        showToast('Admin notes saved to Supabase');
      } else {
        updateSubmission(selectedSub.id, { notes: noteDraft });
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSub.id ? { ...s, notes: noteDraft } : s))
        );
        setSelectedSub((prev) => ({ ...prev, notes: noteDraft }));
        showToast('Admin notes saved');
      }
    } catch (err) {
      console.error('Save notes error:', err);
      showToast('Error saving notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleOpenDetail = (sub) => {
    setSelectedSub(sub);
    setNoteDraft(sub.notes || '');
  };

  // Initial Auth Checking Screen
  if (authChecking) {
    return (
      <div className="admin-container admin-auth-screen">
        <div className="admin-auth-card">
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '16px', color: 'var(--color-muted-light)' }}>
            Verifying Supabase authentication...
          </p>
        </div>
      </div>
    );
  }

  // Sign-In Screen (when user is signed out)
  if (!session) {
    return (
      <div className="admin-container admin-auth-screen">
        <div className="admin-auth-card">
          <div className="admin-auth-brand">
            <span className="wordmark__dot"></span>
            hiwork
            <span className="admin-header__tag">ADMIN</span>
          </div>

          <h2 className="admin-auth-title">Admin Sign In</h2>
          <p className="admin-auth-subtitle">
            Enter your authorized Supabase administrator credentials to access candidate enquiries.
          </p>

          {authError && (
            <div className="admin-auth-error" role="alert">
              ✕ {authError}
            </div>
          )}

          <form className="admin-auth-form" onSubmit={handleSignIn} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Username or Email</label>
              <input
                id="admin-email"
                type="text"
                className="form-input"
                placeholder="admin or admin@hiwork.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark btn-auth-submit"
              disabled={authLoading}
            >
              {authLoading ? 'Signing in...' : 'Sign In to Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
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
          <span className="admin-live-badge" title="Connected to Supabase project">
            <span className="live-dot"></span> Supabase Cloud
          </span>
        </div>

        <div className="admin-header__actions">
          <span className="admin-user-pill" title="Signed in administrator">
            👤 {session.user?.email}
          </span>
          <button
            type="button"
            className="btn btn-signout"
            onClick={handleSignOut}
            title="Sign out of Supabase session"
          >
            Sign Out
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
              Live submissions from <code>public.contact_submissions</code>. Review profiles, update status, take internal notes, and export records.
            </p>
          </div>

          <div className="admin-export-btns">
            <button
              type="button"
              className="btn btn-excel-export"
              onClick={async () => {
                try {
                  await exportToExcel(filteredSubmissions);
                  showToast('Downloaded enquiries as Excel (.xlsx)');
                } catch {
                  showToast('Failed to export Excel file.');
                }
              }}
              disabled={filteredSubmissions.length === 0}
              title="Download contact form enquiries as Microsoft Excel spreadsheet (.xlsx)"
            >
              <span className="excel-icon" aria-hidden="true">📊</span>
              Export Excel (.xlsx)
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                exportToCSV(filteredSubmissions);
                showToast('Downloaded enquiries CSV');
              }}
              disabled={filteredSubmissions.length === 0}
              title="Download contact form enquiries as CSV"
            >
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                exportToJSON(filteredSubmissions);
                showToast('Downloaded enquiries JSON');
              }}
              disabled={filteredSubmissions.length === 0}
              title="Download contact form enquiries as JSON"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Row-Level Security (RLS) Access / Configuration Alert */}
        {rlsError ? (
          <div className="admin-rls-container" role="alert">
            <div className="admin-rls-icon">🔒</div>
            <h3 className="admin-rls-title">Supabase Row-Level Security (RLS) Access Required</h3>
            <p className="admin-rls-message">{rlsError}</p>
            <div className="admin-rls-box">
              <p>
                <strong>Signed in as:</strong> <code>{session.user?.email}</code>
              </p>
              <p>
                Row-Level Security is protecting <code>public.contact_submissions</code>. To permit this administrator to read submissions, ensure an RLS policy granting SELECT to authenticated users exists on the table.
              </p>
              <p className="admin-rls-code">
                <code>
                  CREATE POLICY "Allow authenticated read" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
                </code>
              </p>
            </div>
            <button
              type="button"
              className="btn btn-dark"
              onClick={loadSubmissions}
              disabled={loading}
            >
              {loading ? 'Checking permissions...' : 'Retry Access Check'}
            </button>
          </div>
        ) : (
          <>
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

              <div className="admin-toolbar-right">
                <button
                  type="button"
                  className="btn btn-refresh"
                  onClick={loadSubmissions}
                  disabled={loading}
                  title="Reload submissions from Supabase"
                >
                  {loading ? '↻ Loading...' : '↻ Refresh'}
                </button>

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
            </div>

            {/* Table / List Container */}
            {loading ? (
              <div className="admin-loading-state">
                <div className="loading-spinner"></div>
                <p>Loading enquiries from Supabase...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="admin-empty-state">
                <div className="empty-icon">📫</div>
                <h3>No enquiries found</h3>
                <p>
                  {searchTerm || statusFilter !== 'all'
                    ? 'No submissions match your active filter or search keywords.'
                    : 'No contact form enquiries are visible yet.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <div className="admin-empty-hint">
                    <strong>RLS Policy Requirement:</strong> If enquiries were submitted on the public website but do not display here, ensure an active Row-Level Security <code>SELECT</code> policy exists in Supabase:
                    <code>CREATE POLICY "Allow authenticated read" ON public.contact_submissions FOR SELECT TO authenticated USING (true);</code>
                  </div>
                )}
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
                                title="Delete enquiry from Supabase"
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
                Showing <strong>{filteredSubmissions.length}</strong> of <strong>{submissions.length}</strong> enquiries from Supabase
              </span>
              <div className="admin-footer-actions">
                <button
                  type="button"
                  className="text-link"
                  onClick={loadSubmissions}
                  disabled={loading}
                >
                  ↻ Refresh Data
                </button>
              </div>
            </div>
          </>
        )}
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
                  <span className="notes-hint">Synced to Supabase database</span>
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
                  disabled={savingNotes}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes to Supabase'}
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
