const fs = require('fs');
let code = fs.readFileSync('src/app/enquire/page.tsx', 'utf8');

// Inside handleAuthAndSubmit, capture userCredential and set cookie
code = code.replace(
  /if \(authMode === "signup"\) \{\n\s*await createUserWithEmailAndPassword\(auth, email, authPassword\);\n\s*\} else \{\n\s*await signInWithEmailAndPassword\(auth, email, authPassword\);\n\s*\}/,
  `let userCredential;
      if (authMode === "signup") {
        userCredential = await createUserWithEmailAndPassword(auth, email, authPassword);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, authPassword);
      }
      document.cookie = \`student_token=\${await userCredential.user.getIdToken()}; path=/; max-age=604800\`;`
);

fs.writeFileSync('src/app/enquire/page.tsx', code);
console.log('Cookie logic added to enquire page');
