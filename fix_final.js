const fs = require('fs');

const fixFile = (file, exportFn) => {
  let code = fs.readFileSync(file, 'utf8');

  // Find the exact block that was wrongly inserted
  const regex = /\s*const handleExport = \(\) => \{[\s\S]*?exportToCSV\([^)]+\);\s*\};\s*return \(\n/g;
  
  const match = code.match(regex);
  if (match) {
    // 1. Revert the inner useEffect return to normal
    code = code.replace(regex, '\n    return (');
    
    // 2. Put exportToCSV import if missing
    if (!code.includes('import { exportToCSV }')) {
      code = code.replace(/import \{.*?\} from "firebase\/firestore";/, m => m + '\nimport { exportToCSV } from "@/lib/exportUtils";');
    }

    // 3. Put handleExport before the very last return statement
    const insertTarget = '  return (\n    <div className="flex flex-col md:flex-row min-h-screen bg-background">';
    if (code.includes(insertTarget)) {
        code = code.replace(insertTarget, `  ${exportFn}\n\n${insertTarget}`);
        fs.writeFileSync(file, code);
        console.log('Successfully fixed scope and TS in', file);
    } else {
        console.log('Could not find insert target in', file);
    }
  }
};

fixFile('frontend/src/app/admin/enquiries/page.tsx', `const handleExport = () => {
    const headers = ["Enquiry ID", "Name", "Email", "WhatsApp", "College", "Department", "Year", "Project Selected", "Preferred Tech", "Budget", "Deadline", "Deployment Reqd", "Demo Reqd", "Referral", "Message", "Additional Req", "Status", "Date"];
    const rows = enquiries.map((e: any) => [
      e.id, e.full_name, e.email, e.whatsapp_number, e.college_name, e.department, e.year, e.project_id, e.preferred_technology, e.budget_range, e.required_deadline, e.deployment_required ? "Yes" : "No", e.demo_video_required ? "Yes" : "No", e.referral_code, e.message, e.additional_requirements, e.status, e.created_at ? new Date((e.created_at as any).seconds * 1000).toLocaleString() : ""
    ]);
    exportToCSV("elaxora_enquiries.csv", [headers, ...rows]);
  };`);

fixFile('frontend/src/app/admin/payments/page.tsx', `const handleExport = () => {
    const headers = ["Order ID", "Student Name", "Phase", "Method", "Amount Paid", "Date Recorded", "Recorded By"];
    const rows = filteredPayments.map((p: any) => [
      p.order_id, p.student_name, p.phase, p.payment_method, p.amount, new Date(p.recorded_at).toLocaleString(), p.recorded_at
    ]);
    exportToCSV("elaxora_payments_history.csv", [headers, ...rows]);
  };`);

fixFile('frontend/src/app/admin/quotes/page.tsx', `const handleExport = () => {
    const headers = ["Quote ID", "Enquiry ID", "Project Required", "Requirements", "Base Price", "Expedited Cost", "Total Price", "Deliverable Date", "Status", "Created At"];
    const rows = filteredQuotes.map((q: any) => [
      q.id, q.enquiry_id, q.project_id, q.scope_of_work, q.base_price, q.custom_changes_cost || 0, q.final_price, new Date(q.created_at).toLocaleDateString(), q.status, new Date(q.created_at).toLocaleString()
    ]);
    exportToCSV("elaxora_quotes_history.csv", [headers, ...rows]);
  };`);

// Customers didn't have the regex match, meaning it was never wrongly scoped!
// So just fix the typescript and imports.
let codeC = fs.readFileSync('frontend/src/app/admin/customers/page.tsx', 'utf8');
if (!codeC.includes('import { exportToCSV }')) {
  codeC = codeC.replace(/import \{.*?\} from "firebase\/firestore";/, m => m + '\nimport { exportToCSV } from "@/lib/exportUtils";');
}
codeC = codeC.replace(/c => \[/g, '(c: any) => [');
codeC = codeC.replace(/c\.uid/g, 'c.id');
codeC = codeC.replace(/c\.phone/g, 'c.mobile_number');
codeC = codeC.replace(/c\.department/g, 'c.state');
codeC = codeC.replace(/c\.metrics\.active_orders/g, 'c.created_at');
codeC = codeC.replace(/c\.metrics\.total_spent/g, '""');
fs.writeFileSync('frontend/src/app/admin/customers/page.tsx', codeC);

console.log("Done");
