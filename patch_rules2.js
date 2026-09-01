const fs = require('fs');
const file = 'firestore.rules';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\.toLowerCase\(\)/g, '.lower()');

fs.writeFileSync(file, code);
console.log('patched firestore rules to lower()');
