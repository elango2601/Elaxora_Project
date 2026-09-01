const fs = require('fs');
const file = 'firestore.rules';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /request\.auth\.token\.email == "elaxora11@gmail\.com"/,
  'request.auth.token.email.toLowerCase() == "elaxora11@gmail.com"'
);
code = code.replace(
  /request\.auth\.token\.email == "elango2601@gmail\.com"/,
  'request.auth.token.email.toLowerCase() == "elango2601@gmail.com"'
);
code = code.replace(
  /request\.auth\.token\.email == "elangopugal26@gmail\.com"/,
  'request.auth.token.email.toLowerCase() == "elangopugal26@gmail.com"'
);

fs.writeFileSync(file, code);
console.log('patched firestore rules');
