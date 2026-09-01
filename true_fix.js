const fs = require('fs');

const files = [
  'frontend/src/app/admin/enquiries/page.tsx',
  'frontend/src/app/admin/payments/page.tsx',
  'frontend/src/app/admin/customers/page.tsx',
  'frontend/src/app/admin/quotes/page.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // Find the exact block that was wrongly inserted
  const regex = /\s*const handleExport = \(\) => \{[\s\S]*?exportToCSV\([^)]+\);\s*\};\s*return \(\n/g;
  
  const match = code.match(regex);
  if (match) {
    // 1. Revert the inner useEffect return to normal
    code = code.replace(regex, '\n    return (');
    
    // 2. Put handleExport before the very last return statement of the component
    // The very last return statement is `return (` preceded by something else.
    // Let's find the last occurrence of `return (` or find the JSX root.
    const exportCode = match[0].replace(/return \(\n$/, '').trim();
    
    // Most admin components return `<div className="flex flex-col md:flex-row min-h-screen bg-background">`
    const insertTarget = '  return (\n    <div className="flex flex-col md:flex-row min-h-screen bg-background">';
    if (code.includes(insertTarget)) {
        code = code.replace(insertTarget, `  ${exportCode}\n\n${insertTarget}`);
        fs.writeFileSync(file, code);
        console.log('Successfully fixed scope in', file);
    } else {
        console.log('Could not find insert target in', file);
    }
  } else {
    console.log('Could not find wrong export pattern in', file);
  }
}
