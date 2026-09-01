const fs = require('fs');
const file = 'frontend/src/app/admin/customers/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
if (!code.includes("exportToCSV")) {
  code = code.replace(
    /import \{ collection, query, onSnapshot \} from "firebase\/firestore";/,
    'import { collection, query, onSnapshot } from "firebase/firestore";\nimport { exportToCSV } from "@/lib/exportUtils";'
  );
}

// Add handleExport function
const exportFn = `
  const handleExport = () => {
    const headers = [
      "Customer UID", "Name", "Email", "Phone", "College", "Department",
      "Total Active Orders", "Total Spent (₹)", "Joined Date"
    ];
    
    const rows = filteredCustomers.map(c => [
      c.uid, c.name, c.email, c.phone, c.college, c.department,
      c.metrics.active_orders, c.metrics.total_spent,
      new Date(c.created_at).toLocaleDateString()
    ]);
    
    exportToCSV("elaxora_customers_directory.csv", [headers, ...rows]);
  };

  return (
`;

code = code.replace(/  return \(/, exportFn);

// Add button UI
const headerUI = `<div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Client Base</span>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Customer CRM Directory</h1>
            <p className="text-muted text-xs">Access student details, college profiles, orders metrics, and payment records.</p>
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
  /<div>\n\s*<span className="text-\[10px\] font-bold text-indigo-400 uppercase tracking-widest">Client Base<\/span>\n\s*<h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Customer CRM Directory<\/h1>\n\s*<p className="text-muted text-xs">Access student details, college profiles, orders metrics, and payment records\.<\/p>\n\s*<\/div>/,
  headerUI
);

fs.writeFileSync(file, code);
console.log('patched customers export');
