const fs = require('fs');

const files = [
  'frontend/src/app/admin/enquiries/page.tsx',
  'frontend/src/app/admin/payments/page.tsx',
  'frontend/src/app/admin/customers/page.tsx',
  'frontend/src/app/admin/quotes/page.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // Find the handleExport block that was wrongly inserted
  const regex = /\s*const handleExport = \(\) => \{[\s\S]*?exportToCSV\([^)]+\);\s*\};\s*return \(\n\)(\s*=>\s*.*?;?)/;
  
  const match = code.match(regex);
  if (match) {
    const handleExportCode = match[0].split('return (\n)')[0]; // The handleExport part
    const returnCleanup = 'return ' + match[1]; // The rest of the return () => unsub() part
    
    // Replace the bad block with just the return cleanup in the useEffect
    code = code.replace(regex, `\n      ${returnCleanup}`);

    // Now insert handleExport just before the final return (
    const lastReturnRegex = /return \(\s*<div className="flex flex-col/;
    code = code.replace(lastReturnRegex, `${handleExportCode}\n  return (\n    <div className="flex flex-col`);
    
    fs.writeFileSync(file, code);
    console.log('Fixed', file);
  } else {
    console.log('Could not find wrong export pattern in', file);
  }
}
