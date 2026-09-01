const fs = require('fs');

// 1. Fix AdminSidebar.tsx
let sidebarCode = fs.readFileSync('frontend/src/components/AdminSidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  'if (payload && payload.sub) {',
  'if (payload && payload.email) {'
);
sidebarCode = sidebarCode.replace(
  'setAdminEmail(payload.sub);',
  'setAdminEmail(payload.email);'
);
fs.writeFileSync('frontend/src/components/AdminSidebar.tsx', sidebarCode);

// 2. Fix Enquire page new messages
let enquireCode = fs.readFileSync('frontend/src/app/enquire/page.tsx', 'utf8');
enquireCode = enquireCode.replace(
  'message: message || `Enquiry for ${projectSelected} project template.`,',
  'message: message || `Enquiry for ${projectOptions.find(p => p.slug === projectSelected)?.title || projectSelected} project template.`,'
);
fs.writeFileSync('frontend/src/app/enquire/page.tsx', enquireCode);

// 3. Fix Admin Enquiries page existing messages
let adminEnqCode = fs.readFileSync('frontend/src/app/admin/enquiries/page.tsx', 'utf8');
adminEnqCode = adminEnqCode.replace(
  'selectedEnquiry.message || "No additional message"',
  'selectedEnquiry.message ? selectedEnquiry.message.replace(`Enquiry for ${selectedEnquiry.project_id} project template.`, `Enquiry for ${projectsMap[selectedEnquiry.project_id] || selectedEnquiry.project_id} project template.`) : "No additional message"'
);
fs.writeFileSync('frontend/src/app/admin/enquiries/page.tsx', adminEnqCode);

console.log('Fixed message and auth bugs.');
