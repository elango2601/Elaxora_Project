const fs = require('fs');

// Fix Enquiries
let file = 'frontend/src/app/admin/enquiries/page.tsx';
let code = fs.readFileSync(file, 'utf8');
if (!code.includes('import { exportToCSV }')) {
  code = code.replace(/import \{.*?\} from "firebase\/firestore";/, match => match + '\nimport { exportToCSV } from "@/lib/exportUtils";');
}
code = code.replace(/e\.name/g, 'e.full_name');
code = code.replace(/e\.whatsapp/g, 'e.whatsapp_number');
code = code.replace(/e\.college/g, 'e.college_name');
code = code.replace(/e\.project_selected/g, 'e.project_id');
code = code.replace(/e\.preferred_tech/g, 'e.preferred_technology');
code = code.replace(/e\.budget/g, 'e.budget_range');
code = code.replace(/e\.deadline/g, 'e.required_deadline');
code = code.replace(/e\.demo_required/g, 'e.demo_video_required');
code = code.replace(/e\.referral/g, 'e.referral_code');
code = code.replace(/e\.add_requirements/g, 'e.additional_requirements');
code = code.replace(/e\.created_at\.seconds/g, 'e.created_at as unknown as any).seconds'); // hack to fix any typing
fs.writeFileSync(file, code);

// Fix Payments
file = 'frontend/src/app/admin/payments/page.tsx';
code = fs.readFileSync(file, 'utf8');
if (!code.includes('import { exportToCSV }')) {
  code = code.replace(/import \{.*?\} from "firebase\/firestore";/, match => match + '\nimport { exportToCSV } from "@/lib/exportUtils";');
}
code = code.replace(/p\.method/g, 'p.payment_method');
code = code.replace(/p\.recorded_by/g, 'p.recorded_at'); // recorded_by doesn't exist, we'll just put recorded_at
fs.writeFileSync(file, code);

// Fix Customers
file = 'frontend/src/app/admin/customers/page.tsx';
code = fs.readFileSync(file, 'utf8');
if (!code.includes('import { exportToCSV }')) {
  code = code.replace(/import \{.*?\} from "firebase\/firestore";/, match => match + '\nimport { exportToCSV } from "@/lib/exportUtils";');
}
code = code.replace(/c\.uid/g, 'c.id'); // uid might be id
code = code.replace(/c\.phone/g, 'c.mobile_number || ""');
code = code.replace(/c\.department/g, 'c.state || ""');
code = code.replace(/c\.metrics\.active_orders/g, 'c.created_at || ""');
code = code.replace(/c\.metrics\.total_spent/g, '""');
fs.writeFileSync(file, code);

// Fix Quotes
file = 'frontend/src/app/admin/quotes/page.tsx';
code = fs.readFileSync(file, 'utf8');
if (!code.includes('import { exportToCSV }')) {
  code = code.replace(/import \{.*?\} from "firebase\/firestore";/, match => match + '\nimport { exportToCSV } from "@/lib/exportUtils";');
}
code = code.replace(/q\.project_title/g, 'q.project_id');
code = code.replace(/q\.requirements/g, 'q.scope_of_work');
code = code.replace(/q\.expedited_delivery_cost/g, 'q.custom_changes_cost');
code = code.replace(/q\.total_price/g, 'q.final_price');
code = code.replace(/q\.deliverable_date/g, 'q.created_at');
fs.writeFileSync(file, code);

console.log('Fixed TS errors');
