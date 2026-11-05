/**
 * HiWork Submissions Storage Service
 * Manages storage, retrieval, status updates, and export of contact form enquiries.
 */

const STORAGE_KEY = 'hiwork_submissions';

export const SAMPLE_SUBMISSIONS = [
  {
    id: 'sub_101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'Product Manager',
    location: 'Bengaluru / Remote',
    message: 'Looking for guidance transitioning from technical consulting to APM or PM roles in fast-growing fintech startups.',
    status: 'new',
    notes: 'Strong technical background, needs resume tailoring and interview prep.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
  },
  {
    id: 'sub_102',
    name: 'Priya Venkatesh',
    email: 'priya.v@example.com',
    phone: '+91 98112 34567',
    role: 'Frontend Engineer',
    location: 'Hyderabad / Bengaluru',
    message: 'Recent graduate (B.Tech CS 2025). Need support identifying roles matching React and TypeScript skills, and optimizing my portfolio.',
    status: 'in_review',
    notes: 'Reviewed GitHub profile. Good projects. Need to schedule initial 15-min discovery call.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
  },
  {
    id: 'sub_103',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 74283 11662',
    role: 'Data Analyst',
    location: 'Delhi NCR',
    message: '3 years experience in analytics. Looking for senior roles with competitive compensation in product-based companies.',
    status: 'contacted',
    notes: 'Sent WhatsApp intro and email. Awaiting reply on preferred time slots.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'sub_104',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 99201 88723',
    role: 'UX/UI Designer',
    location: 'Mumbai / Remote',
    message: 'Want to switch from agency design to in-house product design. Need feedback on case studies.',
    status: 'closed',
    notes: 'Completed Growth Tier onboarding. Paired with design career mentor.',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
];

/**
 * Retrieve all submissions from localStorage.
 * Seeds with sample data if the store is empty.
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization with sample data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SUBMISSIONS));
      return SAMPLE_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }
    // Normalize any legacy or manually entered fields
    return parsed.map((item, index) => ({
      id: item.id || `sub_${Date.now()}_${index}`,
      name: item.name || 'Anonymous',
      email: item.email || '',
      phone: item.phone || '',
      role: item.role || 'Not specified',
      location: item.location || 'Not specified',
      message: item.message || '',
      status: item.status || 'new',
      notes: item.notes || '',
      submittedAt: item.submittedAt || item.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to load submissions from localStorage:', error);
    return SAMPLE_SUBMISSIONS;
  }
}

/**
 * Add a new submission to the store.
 */
export function saveSubmission(formData) {
  try {
    const current = getSubmissions();
    const newEntry = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: formData.name ? formData.name.trim() : '',
      email: formData.email ? formData.email.trim() : '',
      phone: formData.phone ? formData.phone.trim() : '',
      role: formData.role ? formData.role.trim() : 'Not specified',
      location: formData.location ? formData.location.trim() : 'Not specified',
      message: formData.message ? formData.message.trim() : '',
      status: 'new',
      notes: '',
      submittedAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hiwork_submissions_updated', { detail: updated }));
    return newEntry;
  } catch (error) {
    console.error('Failed to save submission:', error);
    return null;
  }
}

/**
 * Update an existing submission (e.g. status or notes).
 */
export function updateSubmission(id, patch) {
  try {
    const current = getSubmissions();
    const updated = current.map((sub) => {
      if (sub.id === id) {
        return { ...sub, ...patch };
      }
      return sub;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hiwork_submissions_updated', { detail: updated }));
    return updated;
  } catch (error) {
    console.error('Failed to update submission:', error);
    return null;
  }
}

/**
 * Delete a submission by ID.
 */
export function deleteSubmission(id) {
  try {
    const current = getSubmissions();
    const updated = current.filter((sub) => sub.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('hiwork_submissions_updated', { detail: updated }));
    return updated;
  } catch (error) {
    console.error('Failed to delete submission:', error);
    return null;
  }
}

/**
 * Clear all submissions.
 */
export function clearAllSubmissions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('hiwork_submissions_updated', { detail: [] }));
    return [];
  } catch (error) {
    console.error('Failed to clear submissions:', error);
    return [];
  }
}

/**
 * Reset back to sample submissions.
 */
export function resetSampleSubmissions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SUBMISSIONS));
    window.dispatchEvent(new CustomEvent('hiwork_submissions_updated', { detail: SAMPLE_SUBMISSIONS }));
    return SAMPLE_SUBMISSIONS;
  } catch (error) {
    console.error('Failed to reset sample submissions:', error);
    return SAMPLE_SUBMISSIONS;
  }
}

/**
 * Export submissions as CSV download.
 */
export function exportToCSV(submissions) {
  if (!submissions || submissions.length === 0) return;

  const headers = ['ID', 'Date', 'Status', 'Name', 'Email', 'Phone', 'Role', 'Location', 'Message', 'Notes'];
  const rows = submissions.map((s) => [
    s.id,
    new Date(s.submittedAt).toLocaleString(),
    s.status,
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.phone || '').replace(/"/g, '""')}"`,
    `"${(s.role || '').replace(/"/g, '""')}"`,
    `"${(s.location || '').replace(/"/g, '""')}"`,
    `"${(s.message || '').replace(/"/g, '""')}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hiwork_contact_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export submissions as JSON download.
 */
export function exportToJSON(submissions) {
  if (!submissions || submissions.length === 0) return;

  const jsonStr = JSON.stringify(submissions, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hiwork_contact_submissions_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
