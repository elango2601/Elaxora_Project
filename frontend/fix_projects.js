const fs = require('fs');
let code = fs.readFileSync('src/app/projects/page.tsx', 'utf8');

code = code.replace(/setSelectedCategories\(\[\]\)/g, 'setSelectedCat("")');
code = code.replace(/selectedCategories\.length === 0/g, 'selectedCat === ""');

code = code.replace(/if \(selectedCategories\.includes\(cat\)\) \{\n\s*setSelectedCategories\(selectedCategories\.filter\(c => c !== cat\)\);\n\s*\} else \{\n\s*setSelectedCategories\(\[\.\.\.selectedCategories, cat\]\);\n\s*\}/g, 'setSelectedCat(selectedCat === cat ? "" : cat)');

code = code.replace(/selectedCategories\.includes\(cat\)/g, 'selectedCat === cat');

fs.writeFileSync('src/app/projects/page.tsx', code);
