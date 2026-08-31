const fs = require('fs');
let code = fs.readFileSync('src/app/admin/payments/page.tsx', 'utf8');

// Replace imports
code = code.replace(/import \{ collection, getDocs \} from "firebase\/firestore";/, 'import { collection, onSnapshot, query } from "firebase/firestore";');

// Replace getDocs with onSnapshot
code = code.replace(/try \{\n\s*const querySnapshot = await getDocs\(collection\(db, "orders"\)\);\n\s*const allPayments: Payment\[\] = \[\];\n\s*\n\s*querySnapshot\.forEach\(\(docSnap\) => \{\n\s*const data = docSnap\.data\(\);\n\s*if \(data\.payments && Array\.isArray\(data\.payments\)\) \{\n\s*data\.payments\.forEach\(\(pay: any\) => \{\n\s*allPayments\.push\(\{\n\s*order_id: docSnap\.id,\n\s*student_name: data\.student_name,\n\s*student_email: data\.student_email,\n\s*project_name: data\.project_name,\n\s*\.\.\.pay\n\s*\}\);\n\s*\}\);\n\s*\}\n\s*\}\);\n\s*\n\s*allPayments\.sort\(\(a, b\) => new Date\(b\.timestamp\)\.getTime\(\) - new Date\(a\.timestamp\)\.getTime\(\)\);\n\s*setPayments\(allPayments\);\n\s*setLoading\(false\);\n\s*\} catch \(err\) \{\n\s*console\.error\(err\);\n\s*setError\("Failed to load payments"\);\n\s*setLoading\(false\);\n\s*\}/g,
`try {
        const q = query(collection(db, "orders"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const allPayments: Payment[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.payments && Array.isArray(data.payments)) {
              data.payments.forEach((pay: any) => {
                allPayments.push({
                  order_id: docSnap.id,
                  student_name: data.student_name,
                  student_email: data.student_email,
                  project_name: data.project_name,
                  ...pay
                });
              });
            }
          });
          allPayments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setPayments(allPayments);
          setLoading(false);
        }, (err) => {
          console.error(err);
          setError("Failed to load payments");
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (err) {
        console.error(err);
        setError("Failed to load payments listener");
        setLoading(false);
      }`);

fs.writeFileSync('src/app/admin/payments/page.tsx', code);
