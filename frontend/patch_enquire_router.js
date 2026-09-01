const fs = require('fs');
let code = fs.readFileSync('src/app/enquire/page.tsx', 'utf8');

// Add useRouter import if missing
if (!code.includes('useRouter')) {
  code = code.replace(/import \{ useSearchParams \} from "next\/navigation";/, 'import { useSearchParams, useRouter } from "next/navigation";');
}

// Instantiate router
if (!code.includes('const router = useRouter()')) {
  code = code.replace(/const searchParams = useSearchParams\(\);/, 'const searchParams = useSearchParams();\n  const router = useRouter();');
}

// Change setSuccessData to router.push
code = code.replace(/setSuccessData\(\{ id: enqShortId \}\);/, 'setSuccessData({ id: enqShortId });\n      // Redirect to dashboard after successful submission\n      router.push("/student/dashboard");');

fs.writeFileSync('src/app/enquire/page.tsx', code);
console.log('Router push added to enquire page');
