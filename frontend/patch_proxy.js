const fs = require('fs');

if (fs.existsSync('src/proxy.ts')) {
  let code = fs.readFileSync('src/proxy.ts', 'utf8');
  code = code.replace(/ \|\| path\.startsWith\('\/enquire'\)/g, '');
  code = code.replace(/, '\/enquire'/g, '');
  fs.writeFileSync('src/proxy.ts', code);
  console.log('Patched proxy.ts');
  
  // Also create middleware.ts with the same content just in case
  fs.writeFileSync('src/middleware.ts', code);
  console.log('Created middleware.ts');
}

if (fs.existsSync('src/middleware.ts')) {
  let code = fs.readFileSync('src/middleware.ts', 'utf8');
  code = code.replace(/ \|\| path\.startsWith\('\/enquire'\)/g, '');
  code = code.replace(/, '\/enquire'/g, '');
  fs.writeFileSync('src/middleware.ts', code);
  console.log('Patched middleware.ts');
}

