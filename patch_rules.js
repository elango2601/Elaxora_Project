const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(/match \/quotes\/\{document=\*\*\} \{\n\s*\/\/ Students can read their own quotes, Admin can do everything\n\s*allow read: if true;\n\s*allow update: if true; allow create, delete: if isAdmin\(\);\n\s*\}/, 
`match /quotes/{document=**} {
      allow read, update: if true;
      allow create, delete: if isAdmin();
    }`);

code = code.replace(/allow update: if true; allow create, delete: if isAdmin\(\);/g, 'allow write: if isAdmin();');

// Restore the quotes one correctly since the global replace just overrode it
code = code.replace(/match \/quotes\/\{document=\*\*\} \{\n\s*allow read, update: if true;\n\s*allow write: if isAdmin\(\);\n\s*\}/,
`match /quotes/{document=**} {
      allow read, update: if true;
      allow create, delete: if isAdmin();
    }`);

fs.writeFileSync('firestore.rules', code);
