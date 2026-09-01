const fs = require('fs');

let catCode = fs.readFileSync('src/app/projects/page.tsx', 'utf8');
catCode = catCode.replace(/technology: string\[\];/g, 'technology: string[];\n  technologies?: string[];');
fs.writeFileSync('src/app/projects/page.tsx', catCode);

let slugCode = fs.readFileSync('src/app/projects/[slug]/page.tsx', 'utf8');
slugCode = slugCode.replace(/technology: string\[\];/g, 'technology: string[];\n  technologies?: string[];');
fs.writeFileSync('src/app/projects/[slug]/page.tsx', slugCode);

