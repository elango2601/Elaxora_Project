const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Remove theme state and useEffect
code = code.replace(/const \[theme, setTheme\] = useState<"dark" | "light">\("dark"\);\n\n\s*\/\/ Load and apply initial theme\n\s*useEffect\(\(\) => \{\n\s*const savedTheme = localStorage.getItem\("pf-theme"\) as "dark" | "light" | null;\n\s*if \(savedTheme\) \{\n\s*setTheme\(savedTheme\);\n\s*document.documentElement.className = savedTheme;\n\s*\} else \{\n\s*const systemDark = window.matchMedia\("\(prefers-color-scheme: dark\)"\).matches;\n\s*const initialTheme = systemDark \? "dark" : "light";\n\s*setTheme\(initialTheme\);\n\s*document.documentElement.className = initialTheme;\n\s*\}\n\s*\}, \[\]\);\n\n\s*const toggleTheme = \(\) => \{\n\s*const newTheme = theme === "dark" \? "light" : "dark";\n\s*setTheme\(newTheme\);\n\s*localStorage.setItem\("pf-theme", newTheme\);\n\s*document.documentElement.className = newTheme;\n\s*\};\n/, '');

// Remove the theme toggle button from the desktop header
code = code.replace(/<button\n\s*onClick=\{toggleTheme\}\n\s*className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"\n\s*aria-label="Toggle Theme"\n\s*>\n\s*\{theme === "dark" \? \(\n\s*<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" \/>\n\s*<\/svg>\n\s*\) : \(\n\s*<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" \/>\n\s*<\/svg>\n\s*\)\}\n\s*<\/button>/, '');

fs.writeFileSync('src/components/Navbar.tsx', code);
