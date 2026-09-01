const fs = require('fs');

// Fix catalog page
let catCode = fs.readFileSync('src/app/projects/page.tsx', 'utf8');
catCode = catCode.replace(/const matchTech = p\.technology\.some\(\(t\) => t\.toLowerCase\(\)\.includes\(q\)\);/g, 
  'const techArray = p.technology || p.technologies || [];\n      const matchTech = techArray.some((t: string) => t.toLowerCase().includes(q));');
catCode = catCode.replace(/\{project\.technology\.map\(/g, '{(project.technology || project.technologies || []).map(');
fs.writeFileSync('src/app/projects/page.tsx', catCode);

// Fix slug page
let slugCode = fs.readFileSync('src/app/projects/[slug]/page.tsx', 'utf8');
slugCode = slugCode.replace(/\{project\.technology\.map\(/g, '{(project.technology || project.technologies || []).map(');
fs.writeFileSync('src/app/projects/[slug]/page.tsx', slugCode);

