const fs = require('fs');
const glob = require('glob');

const badBlock = `      // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, user => {
            unsub();
            resolve(user);
          });
        });
      }`;

const goodBlock = `      // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        const user = await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, u => {
            unsub();
            resolve(u);
          });
        });
        if (!user) {
          document.cookie = "admin_token=; path=/; max-age=0";
          router.push("/admin/login");
          return;
        }
      }`;

const files = glob.sync('frontend/src/app/admin/**/page.tsx');
files.push('frontend/src/app/admin/page.tsx');

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('await new Promise(resolve => {')) {
    // some might have slightly different spacing, so let's use regex
    const regex = /\/\/\s*Wait for Firebase auth to initialize before making queries\s*if \(\!auth\.currentUser\) \{\s*await new Promise\(\(?(resolve|res)\)? => \{\s*const unsub = onAuthStateChanged\(auth, \(?user\)? => \{\s*unsub\(\);\s*(resolve|res)\(user\);\s*\}\);\s*\}\);\s*\}/g;
    
    code = code.replace(regex, goodBlock);
    
    // Also if the error happens, render an error message instead of blank screen
    // For admin/page.tsx specifically:
    if (file.endsWith('admin/page.tsx')) {
        code = code.replace(/if \(\!summaryData\) return null;/, 'if (!summaryData) return <div className="p-8 text-white">Loading data or insufficient permissions... (Try logging out and logging back in)</div>;');
    }
    
    fs.writeFileSync(file, code);
    console.log('Patched', file);
  }
}
