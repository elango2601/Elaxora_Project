"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

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
  description: string;
  problem_statement: string;
  proposed_solution: string;
  features: string[];
  architecture: string;
  seo_title: string;
  seo_meta_description: string;
  active: boolean;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Editor states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("AI/ML");
  const [department, setDepartment] = useState("CSE");
  const [difficulty, setDifficulty] = useState("Advanced");
  const [startingPrice, setStartingPrice] = useState("5999");
  const [techString, setTechString] = useState("Python, FastAPI, Next.js");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [featuresString, setFeaturesString] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoMeta, setSeoMeta] = useState("");

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  async function loadProjects() {
      // Wait for Firebase auth to initialize before making queries
      if (!auth.currentUser) {
        await new Promise(resolve => {
          const unsub = onAuthStateChanged(auth, user => {
            unsub();
            resolve(user);
          });
        });
      }
      
      

    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(data);
    } catch (err) {
      console.error("Project fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = getCookie("admin_token");
    if (!t) {
      router.push("/admin/login");
      return;
    }
    setToken(t);
    loadProjects();
  }, [router]);

  const handleEditClick = (p: Project) => {
    setEditingProjectId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category);
    setDepartment(p.department);
    setDifficulty(p.difficulty);
    setStartingPrice(p.starting_price.toString());
    setTechString(p.technology.join(", "));
    setShortDesc(p.short_description);
    setDescription(p.description);
    setProblemStatement(p.problem_statement);
    setProposedSolution(p.proposed_solution);
    setFeaturesString(p.features.join("\n"));
    setArchitecture(p.architecture);
    setSeoTitle(p.seo_title);
    setSeoMeta(p.seo_meta_description);
    
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setEditingProjectId(null);
    setTitle("");
    setSlug("");
    setShortDesc("");
    setDescription("");
    setProblemStatement("");
    setProposedSolution("");
    setFeaturesString("");
    setArchitecture("");
    setSeoTitle("");
    setSeoMeta("");
    
    setShowAddForm(false);
  };

  const handleDelete = async () => {
    if (!editingProjectId) return;
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "projects", editingProjectId));
      alert("Project deleted.");
      handleCancel();
      loadProjects();
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const payload = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      category: category,
      department: department,
      difficulty: difficulty,
      starting_price: parseFloat(startingPrice) || 0.0,
      technology: techString.split(",").map(t => t.trim()).filter(Boolean),
      short_description: shortDesc.trim(),
      description: description.trim(),
      problem_statement: problemStatement.trim(),
      proposed_solution: proposedSolution.trim(),
      features: featuresString.split("\n").map(f => f.trim()).filter(Boolean),
      architecture: architecture.trim(),
      modules: [
        { name: "Core Module Setup", description: "Database connections and configuration modules." },
        { name: "Frontend Client interface", description: "User interface view dashboards." }
      ],
      workflow: ["Setup database configurations.", "Initialize server API routes.", "Launch visual client dashboards."],
      whats_included: ["Working source code", "Database schema config scripts", "guided local installation"],
      optional_services: [
        { name: "Live cloud deployment setup", price: 999 },
        { name: "Professional report write support", price: 1499 }
      ],
      faq: [
        { question: "What is included?", answer: "We provide complete source files and database setups." }
      ],
      seo_title: seoTitle.trim() || title.trim(),
      seo_meta_description: seoMeta.trim() || shortDesc.trim(),
      active: true
    };

    try {
      if (editingProjectId) {
        // Update Project
        await updateDoc(doc(db, "projects", editingProjectId), payload);
      } else {
        // Create Project
        await addDoc(collection(db, "projects"), payload);
      }

      alert(editingProjectId ? "Project updated successfully." : "Project created successfully.");
      handleCancel();
      loadProjects();
    } catch (err: any) {
      alert(err.message || "Network error saving project.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Projects Management</h1>
            <p className="text-slate-400 text-xs mt-1">Manage project templates details and baseline pricing sheets.</p>
          </div>
          <button
            onClick={() => {
              if (showAddForm) handleCancel();
              else setShowAddForm(true);
            }}
            className="gradient-btn text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
          >
            {showAddForm ? "View Catalog" : "+ Add New Project"}
          </button>
        </div>

        {showAddForm ? (
          // Add/Edit Form
          <div className="glass-card p-6 max-w-3xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {editingProjectId ? "Edit Project Template" : "Add Project Template"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Project Title *</label>
                  <input placeholder="Enter Title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Url Slug *</label>
                  <input placeholder="Enter Slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white"
                  >
                    <option value="AI/ML">AI/ML</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="NLP">NLP</option>
                    <option value="IoT">IoT</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Starting Price (₹) *</label>
                  <input placeholder="Enter Starting Price"
                    type="number"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1 font-semibold">Technologies (comma separated) *</label>
                  <input placeholder="Enter Tech String"
                    type="text"
                    required
                    value={techString}
                    onChange={(e) => setTechString(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1 font-semibold">Short Description *</label>
                  <input placeholder="Enter Short Desc"
                    type="text"
                    required
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}

                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white placeholder-slate-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1 font-semibold">Detailed Description</label>
                  <textarea placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Problem Statement</label>
                  <textarea placeholder="Enter Problem Statement"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    rows={3}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold">Proposed Solution</label>
                  <textarea placeholder="Enter Proposed Solution"
                    value={proposedSolution}
                    onChange={(e) => setProposedSolution(e.target.value)}
                    rows={3}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1 font-semibold">Features list (one per line)</label>
                  <textarea placeholder="Enter Features String"
                    value={featuresString}
                    onChange={(e) => setFeaturesString(e.target.value)}
                    rows={4}

                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-500 mb-1.5 font-semibold">Architecture Description</label>
                  <input placeholder="Enter Architecture"
                    type="text"
                    value={architecture}
                    onChange={(e) => setArchitecture(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">SEO Title</label>
                  <input placeholder="Enter Seo Title"
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5 font-semibold">SEO Meta Description</label>
                  <input placeholder="Enter Seo Meta"
                    type="text"
                    value={seoMeta}
                    onChange={(e) => setSeoMeta(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5"
                >
                  {editingProjectId ? "Update Template" : "Publish Template"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-slate-500 hover:text-slate-400 font-semibold px-2"
                >
                  Cancel
                </button>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="ml-auto rounded bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 border border-red-500/20 font-bold px-4 py-2.5 transition-colors"
                  >
                    Delete Project
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          // Projects List view
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 font-bold bg-slate-950/40">
                    <th className="p-4">Slug</th>
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Dept</th>
                    <th className="p-4">Starting Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 animate-pulse">
                        Loading project catalog templates...
                      </td>
                    </tr>
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No projects seeded.
                      </td>
                    </tr>
                  ) : (
                    projects.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-300 select-all">{p.slug}</td>
                        <td className="p-4 text-white font-semibold">{p.title}</td>
                        <td className="p-4 text-slate-400">{p.category}</td>
                        <td className="p-4 text-slate-400">{p.department}</td>
                        <td className="p-4 text-indigo-400 font-bold">₹{p.starting_price.toLocaleString("en-IN")}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.active 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-slate-900 text-slate-500 border border-white/5"
                          }`}>
                            {p.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2 py-1 text-[10px] transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
