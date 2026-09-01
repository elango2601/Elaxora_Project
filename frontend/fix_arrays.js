const fs = require('fs');

let slugCode = fs.readFileSync('src/app/projects/[slug]/page.tsx', 'utf8');

slugCode = slugCode.replace(/\{project\.features\.map\(/g, '{(project.features || []).map(');
slugCode = slugCode.replace(/\{project\.modules\.map\(/g, '{(project.modules || []).map(');
slugCode = slugCode.replace(/\{project\.workflow\.map\(/g, '{(project.workflow || []).map(');
slugCode = slugCode.replace(/\{project\.whats_included\.map\(/g, '{(project.whats_included || []).map(');
slugCode = slugCode.replace(/\{project\.optional_services\.map\(/g, '{(project.optional_services || []).map(');
slugCode = slugCode.replace(/\{project\.faq\.map\(/g, '{(project.faq || []).map(');

fs.writeFileSync('src/app/projects/[slug]/page.tsx', slugCode);
