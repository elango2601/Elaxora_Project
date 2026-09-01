const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Why Students Choose Us
// <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
code = code.replace(
  /className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"/,
  'className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"'
);
// p-6 sm:p-8
code = code.replace(
  /p-6 sm:p-8 hover:bg-slate-800\/50/,
  'p-3 sm:p-8 hover:bg-slate-800/50'
);
// text-3xl sm:text-4xl block mb-4 bg-white/5 inline-flex p-3 rounded-xl
code = code.replace(
  /text-3xl sm:text-4xl block mb-4 bg-white\/5 inline-flex p-3 rounded-xl/,
  'text-xl sm:text-4xl block mb-2 sm:mb-4 bg-white/5 inline-flex p-2 sm:p-3 rounded-xl'
);
// text-lg sm:text-xl font-bold text-white mb-2
code = code.replace(
  /text-lg sm:text-xl font-bold text-white mb-2/,
  'text-[11px] sm:text-xl font-bold text-white mb-1 sm:mb-2'
);
// text-sm sm:text-base text-slate-400 leading-relaxed
code = code.replace(
  /text-sm sm:text-base text-slate-400 leading-relaxed/g,
  'text-[9px] sm:text-base text-slate-400 leading-relaxed'
);

// 2. Featured Projects (Features)
// <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
code = code.replace(
  /className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"/,
  'className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"'
);
// group flex flex-col justify-between p-6 h-full
code = code.replace(
  /group flex flex-col justify-between p-6 h-full/,
  'group flex flex-col justify-between p-3 sm:p-6 h-full'
);
// text-lg sm:text-xl font-bold text-white mb-2
// wait, replaced above globally? no, above wasn't global.
code = code.replace(
  /className="text-lg sm:text-xl font-bold text-white mb-2"/g,
  'className="text-[11px] sm:text-xl font-bold text-white mb-2 line-clamp-1 sm:line-clamp-none"'
);
// text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed
code = code.replace(
  /text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed/,
  'text-[9px] sm:text-sm text-slate-400 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-6 leading-relaxed'
);
// pt-4 flex items-center justify-between mt-auto
code = code.replace(
  /border-t border-white\/10 pt-4 flex items-center justify-between mt-auto/,
  'border-t border-white/10 pt-2 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-1 sm:gap-0'
);
// text-[10px] text-slate-500 font-semibold uppercase tracking-wider
code = code.replace(
  /text-\[10px\] text-slate-500 font-semibold uppercase tracking-wider/,
  'text-[8px] sm:text-[10px] text-slate-500 font-semibold uppercase tracking-wider'
);
// text-lg sm:text-xl font-bold text-white
code = code.replace(
  /text-lg sm:text-xl font-bold text-white/,
  'text-xs sm:text-xl font-bold text-white'
);

// 3. Hear From Our Students (Testimonials)
// <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
code = code.replace(
  /className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"/,
  'className="grid grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto"'
);
// bg-slate-900/50 p-8 rounded-2xl
code = code.replace(
  /bg-slate-900\/50 p-8 rounded-2xl/,
  'bg-slate-900/50 p-3 sm:p-8 rounded-2xl'
);
code = code.replace(
  /bg-slate-900\/50 p-8 rounded-2xl/,
  'bg-slate-900/50 p-3 sm:p-8 rounded-2xl'
); // replace second one since map applies it, wait, it's inside the map block so one replace is enough

code = code.replace(
  /text-4xl text-indigo-500\/20 absolute top-4 right-6 font-serif/,
  'text-2xl sm:text-4xl text-indigo-500/20 absolute top-2 right-3 sm:top-4 sm:right-6 font-serif'
);
code = code.replace(
  /text-slate-300 italic mb-6 relative z-10 text-sm sm:text-base leading-relaxed/,
  'text-slate-300 italic mb-3 sm:mb-6 relative z-10 text-[9px] sm:text-base leading-relaxed'
);
code = code.replace(
  /text-white font-bold text-sm sm:text-base/,
  'text-white font-bold text-[10px] sm:text-base'
);
code = code.replace(
  /text-slate-500 text-xs sm:text-sm/,
  'text-slate-500 text-[8px] sm:text-sm'
);

// 4. How It Works (might as well split this too so it doesn't look weird next to the others)
// <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
code = code.replace(
  /className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"/,
  'className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12"'
);
// text-xl sm:text-2xl font-bold text-white mb-2
code = code.replace(
  /text-xl sm:text-2xl font-bold text-white mb-2/g,
  'text-[11px] sm:text-2xl font-bold text-white mb-1 sm:mb-2'
);


fs.writeFileSync('src/app/page.tsx', code);
