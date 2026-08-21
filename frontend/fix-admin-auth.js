const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/admin');
const filesToProcess = [];

function findFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      filesToProcess.push(fullPath);
    }
  }
}

findFiles(adminDir);

for (const file of filesToProcess) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.includes('admin/login/page.tsx') || file.includes('admin/dashboard/page.tsx') || file.includes('admin/settings/page.tsx')) {
    continue;
  }
  
  if (!content.includes('import { auth, db }')) {
     content = content.replace('import { db } from "@/lib/firebase";', 'import { auth, db } from "@/lib/firebase";\nimport { onAuthStateChanged } from "firebase/auth";');
  }

  // Find the exact line:
  // const token = getCookie("admin_token");
  // const t = getCookie("admin_token");
  
  const injectWait = `
      // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, user => {
            unsub();
            resolve(user);
          });
        });
      }
      
      // Double check auth
      if (!auth.currentUser) {
         router.push("/admin/login");
         return;
      }
`;

  // We only replace if we are inside an async function or we can just replace inside the function body!
  // Wait, in `src/app/admin/enquiries/page.tsx`, it's:
  //   async function loadEnquiries(currentToken: string) {
  // So inside the async function, I can just inject it at the top of the function!
  // Or I can replace `try {` with the check!
  
  // The safest way is to inject it right before `try {` that calls `getDocs`.
  
  content = content.replace(/\s*try\s*\{\s*const querySnapshot = await getDocs/g, (match) => {
    return injectWait + match;
  });

  // What about `src/app/admin/quotes/page.tsx`? It has `const q = query(...)` then `await getDocs`.
  content = content.replace(/\s*try\s*\{\s*const q = query/g, (match) => {
    return injectWait + match;
  });
  
  // `src/app/admin/page.tsx`: `try { const ordersSnapshot = await getDocs`
  content = content.replace(/\s*try\s*\{\s*const ordersSnapshot = await getDocs/g, (match) => {
    return injectWait + match;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed', file);
}
