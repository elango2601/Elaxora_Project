const fs = require('fs');
let code = fs.readFileSync('src/app/projects/page.tsx', 'utf8');

// Update project cards grid
code = code.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-6">/, '<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">');
code = code.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">/, '<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">');
code = code.replace(/className="glass-card p-6 h-56 animate-pulse bg-slate-900\/40" \/>/g, 'className="glass-card p-4 sm:p-6 h-56 animate-pulse bg-slate-900/40" />');
code = code.replace(/className="glass-card glass-card-hover p-5 flex flex-col justify-between h-full space-y-4">/g, 'className="glass-card glass-card-hover p-3 sm:p-5 flex flex-col justify-between h-full space-y-4">');
code = code.replace(/className="text-base font-bold text-foreground line-clamp-1">/g, 'className="text-xs sm:text-base font-bold text-foreground line-clamp-1 sm:line-clamp-2">');
code = code.replace(/className="text-muted text-xs line-clamp-3 leading-relaxed">/g, 'className="text-muted text-[10px] sm:text-xs line-clamp-2 sm:line-clamp-3 leading-relaxed">');
code = code.replace(/className="gradient-btn text-center block w-full py-2.5 rounded-lg text-xs font-bold text-white shadow-lg"/g, 'className="gradient-btn text-center block w-full py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold text-white shadow-lg"');
code = code.replace(/className="pt-4 border-t border-card-border flex items-center justify-between">/g, 'className="pt-3 sm:pt-4 border-t border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">');

// Add the Amazon/Flipkart style pill filters at the top of the Projects Grid
const pillHTML = `      {/* Mobile-Only Filter Control Row */}
      <div className="lg:hidden flex overflow-x-auto pb-4 mb-6 gap-2 w-full no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <button 
          onClick={() => setSelectedCategories([])}
          className={\`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold border transition-colors \${selectedCategories.length === 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}\`}
        >
          All Projects
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              if (selectedCategories.includes(cat)) {
                setSelectedCategories(selectedCategories.filter(c => c !== cat));
              } else {
                setSelectedCategories([...selectedCategories, cat]);
              }
            }}
            className={\`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold border transition-colors \${selectedCategories.includes(cat) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}\`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold border border-slate-700 bg-slate-900 text-white flex items-center gap-1"
        >
          ⚙️ More Filters {activeFiltersCount > 0 && \`(\${activeFiltersCount})\`}
        </button>
      </div>`;

code = code.replace(/\{\/\* Mobile-Only Filter Control Row \*\/\}\n\s*<div className="lg:hidden flex items-center justify-between gap-3 mb-6">\n\s*<button\n\s*onClick=\{([^}]*)\}\n\s*className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900\/60 border border-card-border py-3 text-xs font-bold text-foreground hover:bg-slate-800 transition-colors"\n\s*>\n\s*🎛️ Filter Projects \{activeFiltersCount > 0 && `\(\$\{activeFiltersCount\}\)`\}\n\s*<\/button>\n\s*\{activeFiltersCount > 0 && \(\n\s*<button\n\s*onClick=\{resetFilters\}\n\s*className="text-xs text-indigo-500 font-bold whitespace-nowrap px-2"\n\s*>\n\s*Clear \(\{activeFiltersCount\}\)\n\s*<\/button>\n\s*\)\}\n\s*<\/div>/, pillHTML);

fs.writeFileSync('src/app/projects/page.tsx', code);
