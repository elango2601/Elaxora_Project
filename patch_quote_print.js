const fs = require('fs');
const file = 'frontend/src/app/quote/[id]/page.tsx';
let code = fs.readFileSync(file, 'utf8');

const statusSpanEndRegex = /<span className=\{\`px-2\.5 py-1 rounded-md text-xs font-bold(.*?)\`\}>\n\s*\{quote\.status\}\n\s*<\/span>/s;

const pdfButton = `
          <button 
            onClick={() => window.print()}
            className="print:hidden ml-2 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-colors border border-white/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Save PDF
          </button>`;

code = code.replace(statusSpanEndRegex, match => match + pdfButton);

// Also add print:hidden to the "Accept Quote" buttons area
code = code.replace(
  /<div className="border-t border-white\/5 pt-5 space-y-3">/,
  '<div className="print:hidden border-t border-white/5 pt-5 space-y-3">'
);

fs.writeFileSync(file, code);
console.log('patched quote print');
