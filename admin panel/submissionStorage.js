/**
 * HiWork Submissions Storage Service
 * Manages storage, retrieval, status updates, and export of contact form enquiries.
 */

import zipcelx from 'zipcelx';

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
 * Export submissions as genuine Microsoft Excel spreadsheet (.xlsx).
 */
export async function exportToExcel(submissions) {
  if (!submissions || submissions.length === 0) return;

  const filename = `hiwork_contact_enquiries_${new Date().toISOString().slice(0, 10)}`;

  const headerRow = [
    { value: 'ID', type: 'string' },
    { value: 'Date Received', type: 'string' },
    { value: 'Status', type: 'string' },
    { value: 'Candidate Name', type: 'string' },
    { value: 'Email', type: 'string' },
    { value: 'Phone', type: 'string' },
    { value: 'Target Role', type: 'string' },
    { value: 'Preferred Location', type: 'string' },
    { value: 'Candidate Message', type: 'string' },
    { value: 'Internal Admin Notes', type: 'string' },
  ];

  const dataRows = submissions.map((s) => [
    { value: String(s.id || ''), type: 'string' },
    {
      value: new Date(s.submittedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      type: 'string',
    },
    { value: String(s.status || 'new').toUpperCase(), type: 'string' },
    { value: String(s.name || ''), type: 'string' },
    { value: String(s.email || ''), type: 'string' },
    { value: String(s.phone || ''), type: 'string' },
    { value: String(s.role || 'Not specified'), type: 'string' },
    { value: String(s.location || 'Not specified'), type: 'string' },
    { value: String(s.message || ''), type: 'string' },
    { value: String(s.notes || ''), type: 'string' },
  ]);

  try {
    await zipcelx({
      filename,
      sheet: {
        data: [headerRow, ...dataRows],
      },
    });
  } catch (error) {
    console.warn('zipcelx export error, downloading Excel XML:', error);
    exportToExcelXml(submissions, filename);
  }
}

/**
 * Fallback Excel XML Spreadsheet (.xls) format
 */
function exportToExcelXml(submissions, filename) {
  const headers = ['ID', 'Date Received', 'Status', 'Candidate Name', 'Email', 'Phone', 'Target Role', 'Preferred Location', 'Candidate Message', 'Internal Admin Notes'];
  const xmlRows = submissions.map((s) => `
    <Row>
      <Cell><Data ss:Type="String">${s.id || ''}</Data></Cell>
      <Cell><Data ss:Type="String">${new Date(s.submittedAt).toLocaleString('en-IN')}</Data></Cell>
      <Cell><Data ss:Type="String">${(s.status || '').toUpperCase()}</Data></Cell>
      <Cell><Data ss:Type="String">${(s.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell>
      <Cell><Data ss:Type="String">${s.email || ''}</Data></Cell>
      <Cell><Data ss:Type="String">${s.phone || ''}</Data></Cell>
      <Cell><Data ss:Type="String">${(s.role || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell>
      <Cell><Data ss:Type="String">${(s.location || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell>
      <Cell><Data ss:Type="String">${(s.message || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell>
      <Cell><Data ss:Type="String">${(s.notes || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</Data></Cell>
    </Row>`).join('');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Enquiries">
  <Table>
    <Row>
      ${headers.map((h) => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}
    </Row>
    ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

