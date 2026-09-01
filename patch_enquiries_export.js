const fs = require('fs');
const file = 'frontend/src/app/admin/enquiries/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
if (!code.includes("exportToCSV")) {
  code = code.replace(
    /import \{ getDocs, collection, query, orderBy, doc, updateDoc, setDoc, serverTimestamp \} from "firebase\/firestore";/,
    'import { getDocs, collection, query, orderBy, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";\nimport { exportToCSV } from "@/lib/exportUtils";'
  );
}

// Add handleExport function
const exportFn = `
  const handleExport = () => {
    const headers = [
      "Enquiry ID", "Name", "Email", "WhatsApp", "College", "Department", "Year",
      "Project Selected", "Preferred Tech", "Budget", "Deadline",
      "Deployment Reqd", "Demo Reqd", "Referral", "Message", "Additional Req", "Status", "Date"
    ];
    
    const rows = enquiries.map(e => [
      e.id, e.name, e.email, e.whatsapp, e.college, e.department, e.year,
      e.project_selected, e.preferred_tech, e.budget, e.deadline,
      e.deployment_required ? "Yes" : "No", e.demo_required ? "Yes" : "No",
      e.referral, e.message, e.add_requirements, e.status,
      e.created_at ? new Date(e.created_at.seconds * 1000).toLocaleString() : ""
    ]);
    
    exportToCSV("elaxora_enquiries.csv", [headers, ...rows]);
  };

  return (
`;

code = code.replace(/  return \(/, exportFn);

// Add button UI
const headerUI = `<div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Enquiries</h1>
            <p className="text-slate-400 text-xs mt-1">Review student project requirements and create quotations.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export to Excel/CSV
          </button>
        </div>`;

code = code.replace(
  /<div>\n\s*<h1 className="text-2xl font-extrabold text-white tracking-tight">Student Enquiries<\/h1>\n\s*<p className="text-slate-400 text-xs mt-1">Review student project requirements and create quotations\.<\/p>\n\s*<\/div>/,
  headerUI
);

fs.writeFileSync(file, code);
console.log('patched enquiries export');
