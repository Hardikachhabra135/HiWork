# HiWork — Admin Panel

The **Admin Panel** provides enquiry management and follow-up tools for the HiWork career search support platform.

---

## 📁 Included Files

- **`AdminPanel.jsx`**: Main admin dashboard component containing:
  - Real-time KPI metric overview (Total, New, In Review, Contacted, Closed)
  - Interactive multi-field search and status filter tabs
  - Enquiries data table with direct outreach shortcuts (WhatsApp, Email, Phone)
  - Detail drawer modal with candidate specifics and internal admin notes editor
  - Export utilities for CSV and JSON
- **`AdminPanel.css`**: Styling matching HiWork's premium dark ink, sage, and lime design system with full mobile responsiveness.
- **`submissionStorage.js`**: Client-side persistence and event dispatching service managing browser `localStorage` (`hiwork_submissions`).
- **`index.js`**: Module exports for seamless importing.

---

## 🚀 How to Access

- **Direct URL:** Navigate to `http://localhost:5173/#admin` (or `/#admin` in production).
- **Navigation:** Click the **Admin** link in the Header navigation bar or the Footer.
- **Exit:** Click **← Back to Website** at the top of the Admin Panel.
