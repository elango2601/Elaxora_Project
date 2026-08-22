"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  department: string;
  difficulty: string;
  starting_price: number;
  technology: string[];
  short_description: string;
}

const fallbackProjects: Project[] = [
  {
    id: "fb-1",
    title: "AI Resume Analyzer",
    slug: "ai-resume-analyzer",
    category: "AI/ML",
    department: "CSE",
    difficulty: "Advanced",
    starting_price: 5999,
    technology: ["Python", "FastAPI", "MongoDB", "NLP", "Next.js"],
    short_description: "Analyze and score student resumes against job descriptions, identifying key skill gaps."
  },
  {
    id: "fb-2",
    title: "Smart Lost & Found",
    slug: "smart-lost-found",
    category: "Full Stack",
    department: "IT",
    difficulty: "Advanced",
    starting_price: 5999,
    technology: ["Next.js", "FastAPI", "MongoDB", "Python", "AI"],
    short_description: "Smart lost and found portal with automatic visual image match recognition."
  },
  {
    id: "fb-3",
    title: "Student Performance Prediction",
    slug: "student-performance-prediction",
    category: "Data Science",
    department: "BCA",
    difficulty: "Intermediate",
    starting_price: 3499,
    technology: ["Python", "Machine Learning", "FastAPI", "MongoDB", "Next.js"],
    short_description: "Predict student failure or academic scores based on demographic and historical metrics."
  }
];

export default function ProjectsCatalog() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  // Mobile Filter Drawer Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const departments = [
    "AI & DS", "CSE", "IT", "ECE", "EEE", 
    "BCA", "MCA", "BBA", "B.Com", "Arts"
  ];

  const categories = [
    "AI/ML", "Data Science", "Full Stack", 
    "Web Development", "Computer Vision", 
    "NLP", "IoT", "Analytics", "Mobile Applications", "Other"
  ];

  const difficulties = ["Basic", "Intermediate", "Advanced"];
  
  const budgets = [
    "Under ₹2,000", 
    "₹2,000–₹5,000", 
    "₹5,000–₹10,000", 
    "₹10,000+"
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("http://localhost:8000/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.length > 0 ? data : fallbackProjects);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.warn("Failed fetching live projects, using client fallbacks", err);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const resetFilters = () => {
    setSearch("");
    setSelectedDept("");
    setSelectedCat("");
    setSelectedDifficulty("");
    setSelectedBudget("");
  };

  // Filter Logic
  const filteredProjects = projects.filter((p) => {
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.short_description.toLowerCase().includes(q);
      const matchTech = p.technology.some((t) => t.toLowerCase().includes(q));
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTech && !matchCat) return false;
    }
    if (selectedDept && p.department !== selectedDept) return false;
    if (selectedCat && p.category !== selectedCat) return false;
    if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
    if (selectedBudget) {
      const price = p.starting_price;
      if (selectedBudget === "Under ₹2,000" && price >= 2000) return false;
      if (selectedBudget === "₹2,000–₹5,000" && (price < 2000 || price > 5000)) return false;
      if (selectedBudget === "₹5,000–₹10,000" && (price < 5000 || price > 10000)) return false;
      if (selectedBudget === "₹10,000+" && price < 10000) return false;
    }
    return true;
  });

  const activeFiltersCount = [
    search.trim() !== "",
    selectedDept !== "",
    selectedCat !== "",
    selectedDifficulty !== "",
    selectedBudget !== ""
  ].filter(Boolean).length;

  // Reusable Filter Inputs markup
  const renderFilterFields = () => (
    <>
      {/* Live Search */}
      <div>
        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Search Catalog</label>
        <input placeholder="Enter Search"
          type="text"

          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2.5 text-xs text-foreground placeholder-muted focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Department */}
      <div>
        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Department</label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full rounded-lg bg-slate-900 border border-card-border px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-indigo-500/50"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Category</label>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="w-full rounded-lg bg-slate-900 border border-card-border px-3 py-2.5 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Difficulty</label>
        <div className="space-y-2.5">
          {difficulties.map((diff) => (
            <label key={diff} className="flex items-center text-xs text-foreground cursor-pointer select-none">
              <input
                type="radio"
                name="difficulty"
                checked={selectedDifficulty === diff}
                onChange={() => setSelectedDifficulty(diff)}
                className="rounded border-card-border bg-slate-900 text-indigo-600 focus:ring-0 mr-2 h-4 w-4"
              />
              {diff}
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Budget Bracket</label>
        <div className="space-y-2.5">
          {budgets.map((b) => (
            <label key={b} className="flex items-center text-xs text-foreground cursor-pointer select-none">
              <input
                type="radio"
                name="budget"
                checked={selectedBudget === b}
                onChange={() => setSelectedBudget(b)}
                className="rounded border-card-border bg-slate-900 text-indigo-600 focus:ring-0 mr-2 h-4 w-4"
              />
              {b}
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center sm:text-left mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Project Catalogue
        </h1>
        <p className="mt-1 text-muted text-xs sm:text-sm">
          Browse customizable final-year projects built with state-of-the-art architectures.
        </p>
      </div>

      {/* Mobile-Only Filter Control Row */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900/60 border border-card-border py-3 text-xs font-bold text-foreground hover:bg-slate-800 transition-colors"
        >
          🎛️ Filter Projects {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-indigo-500 font-bold whitespace-nowrap px-2"
          >
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="glass-card p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-[10px] text-indigo-500 hover:text-indigo-400 font-semibold"
              >
                Clear All
              </button>
            </div>
            {renderFilterFields()}
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-6 h-56 animate-pulse bg-slate-900/40" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="glass-card p-12 text-center text-muted text-xs space-y-4">
              <p>No project templates match your chosen search parameters.</p>
              <button
                onClick={resetFilters}
                className="gradient-btn px-4 py-2 text-white font-bold rounded-lg text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProjects.map((p) => (
                <div key={p.id} className="glass-card glass-card-hover p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="rounded bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-muted font-semibold">{p.department} | {p.difficulty}</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">{p.title}</h3>
                    <p className="text-muted text-xs line-clamp-3 leading-relaxed">
                      {p.short_description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-card-border flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] text-muted uppercase font-bold tracking-wider">Starts From</span>
                      <span className="text-base font-bold text-indigo-500">
                        ₹{p.starting_price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white transition-colors"
                    >
                      Specifications
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden flex items-end justify-end">
          <div className="w-full max-h-[85vh] bg-background border-t border-card-border rounded-t-2xl p-6 overflow-y-auto space-y-6 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Filter Catalogue</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-xs text-muted hover:text-foreground font-bold"
              >
                Done [X]
              </button>
            </div>
            <div className="space-y-6">
              {renderFilterFields()}
            </div>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setShowMobileFilters(false);
                }}
                className="w-1/3 rounded-xl bg-slate-900 border border-card-border py-3 text-xs font-bold text-muted"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-2/3 rounded-xl gradient-btn py-3 text-xs font-bold text-white shadow-lg"
              >
                Apply Filters ({activeFiltersCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
