const fs = require('fs');
let code = fs.readFileSync('src/app/student/dashboard/page.tsx', 'utf8');

code = code.replace(/} catch \(err\) \{\n\s*console.error\("Dashboard fetch error", err\);\n\s*\} finally \{/,
`} catch (err) {
        console.error("Dashboard fetch error", err);
        // Fallback to empty data to prevent blank screen crash
        setData({
          profile: { name: user.displayName || "Student", email: user.email, college: "" },
          enquiries: [],
          quotes: [],
          orders: []
        } as DashboardData);
      } finally {`);

fs.writeFileSync('src/app/student/dashboard/page.tsx', code);
