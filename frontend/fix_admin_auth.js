const fs = require('fs');

const files = [
  'src/app/admin/quotes/page.tsx',
  'src/app/admin/enquiries/page.tsx',
  'src/app/admin/orders/page.tsx',
  'src/app/admin/payments/page.tsx',
  'src/app/admin/projects/page.tsx',
  'src/app/admin/customers/page.tsx',
  'src/app/admin/referrals/page.tsx',
  'src/app/admin/settings/page.tsx',
  'src/app/admin/page.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Remove the double check that forces a redirect
    code = code.replace(/\/\/ Double check auth\n\s*if \(\!auth\.currentUser\) \{\n\s*router\.push\("\/admin\/login"\);\n\s*return;\n\s*\}/g, '');
    
    fs.writeFileSync(file, code);
    console.log("Fixed " + file);
  }
}
