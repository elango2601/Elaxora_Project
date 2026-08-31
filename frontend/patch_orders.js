const fs = require('fs');
let code = fs.readFileSync('src/app/admin/orders/page.tsx', 'utf8');

code = code.replace(/try \{\n\s*const querySnapshot = await getDocs\(collection\(db, "orders"\)\);\n\s*const list = querySnapshot.docs.map\(\(doc\) => \(\{\n\s*id: doc.id,\n\s*\.\.\.doc.data\(\)\n\s*\}\)\) as Order\[\];\n\s*setOrders\(list\);\n\s*setLoading\(false\);\n\s*\} catch \(err\) \{\n\s*console.error\(err\);\n\s*setError\("Failed to load orders"\);\n\s*setLoading\(false\);\n\s*\}/g,
`try {
      const q = query(collection(db, "orders"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Order[];
        setOrders(list);
        
        setSelectedOrder((prev) => {
          if (!prev) return null;
          const updated = list.find((o) => o.id === prev.id);
          return updated || prev;
        });
        
        setLoading(false);
      }, (err) => {
        console.error(err);
        setError("Failed to load orders");
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setError("Failed to initialize orders listener");
      setLoading(false);
    }`);

// Because the regex probably didn't match perfectly, let's just use string replacement from the start of `try {` to the end of `catch (err) { ... }` inside the `useEffect`.
