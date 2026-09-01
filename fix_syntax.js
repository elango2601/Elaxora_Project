const fs = require('fs');

const files = [
  'frontend/src/app/admin/enquiries/page.tsx',
  'frontend/src/app/admin/payments/page.tsx',
  'frontend/src/app/admin/quotes/page.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  
  // replace "return  => {" with "return () => {"
  code = code.replace(/return\s*=>\s*\{/g, 'return () => {');
  
  // replace "return  => unsubscribe();" with "return () => unsubscribe();"
  code = code.replace(/return\s*=>\s*unsubscribe/g, 'return () => unsubscribe');
  
  fs.writeFileSync(file, code);
  console.log('Syntax fixed for', file);
}
