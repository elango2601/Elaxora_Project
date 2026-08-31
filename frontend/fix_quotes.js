const fs = require('fs');
let code = fs.readFileSync('src/app/admin/quotes/page.tsx', 'utf8');

// Replace imports
code = code.replace(/import \{ collection, getDocs, query, orderBy \} from "firebase\/firestore";/, 'import { collection, onSnapshot, query, orderBy } from "firebase/firestore";');

// Replace getDocs with onSnapshot
code = code.replace(/try \{\n\s*const q = query\(collection\(db, "quotes"\), orderBy\("created_at", "desc"\)\);\n\s*const snapshot = await getDocs\(q\);\n\s*const list = snapshot\.docs\.map\(doc => \(\{\n\s*id: doc\.id,\n\s*\.\.\.doc\.data\(\)\n\s*\}\)\) as Quote\[\];\n\s*setQuotes\(list\);\n\s*setLoading\(false\);\n\s*\} catch \(err\) \{\n\s*console\.error\(err\);\n\s*setError\("Failed to load quotes"\);\n\s*setLoading\(false\);\n\s*\}/g,
`try {
        const q = query(collection(db, "quotes"), orderBy("created_at", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Quote[];
          setQuotes(list);
          setLoading(false);
        }, (err) => {
          console.error(err);
          // Fallback: If index is missing, try without orderBy
          const fallbackQ = query(collection(db, "quotes"));
          onSnapshot(fallbackQ, (fallbackSnap) => {
            const list = fallbackSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Quote[];
            list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setQuotes(list);
            setLoading(false);
          });
        });
        return () => unsubscribe();
      } catch (err) {
        console.error(err);
        setError("Failed to load quotes");
        setLoading(false);
      }`);

fs.writeFileSync('src/app/admin/quotes/page.tsx', code);
