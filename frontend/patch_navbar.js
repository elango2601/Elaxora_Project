const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Desktop
code = code.replace(/className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"/, 'className="text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700"');
code = code.replace(/className="gradient-btn px-4 py-2 text-sm font-semibold rounded-lg text-white"/, 'className="gradient-btn px-4 py-2 text-sm font-bold rounded-lg text-white"');

// Mobile
code = code.replace(/className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2.5 rounded-lg text-center transition-colors border border-slate-700"/, 'className="text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-lg text-center transition-colors border border-slate-700"');
code = code.replace(/className="gradient-btn text-center px-4 py-2.5 text-sm font-semibold rounded-lg text-white"/, 'className="gradient-btn text-center px-4 py-2.5 text-sm font-bold rounded-lg text-white"');

fs.writeFileSync('src/components/Navbar.tsx', code);
