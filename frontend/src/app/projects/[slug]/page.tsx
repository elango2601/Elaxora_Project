"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Module {
  name: string;
  description: string;
}

interface OptionalService {
  name: string;
  price: number;
}

interface Faq {
  question: string;
  answer: string;
}

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
  modules: Module[];
  workflow: string[];
  whats_included: string[];
  optional_services: OptionalService[];
  faq: Faq[];
  demo_video_url?: string;
  demo_screenshots?: string[];
  git_link?: string;
  seo_title: string;
  seo_meta_description: string;
}

// Full specifications for fallback seeding
const fallbackProjectData: Record<string, Project> = {
  "ai-resume-analyzer": {
    id: "1",
    title: "AI Resume Analyzer",
    slug: "ai-resume-analyzer",
    category: "AI/ML",
    department: "CSE",
    difficulty: "Advanced",
    starting_price: 5999,
    technology: ["Python", "FastAPI", "MongoDB", "NLP", "Next.js"],
    short_description: "Analyze and score student resumes against job descriptions, identifying key skill gaps.",
    description: "An advanced AI-powered Resume Parser and Analyzer that leverages Natural Language Processing (NLP) to extract skills, qualifications, and experience from PDF/Word resumes. It maps candidates against specific job roles, calculates match percentages, and details actionable feedback on skills development and visual formatting improvements.",
    problem_statement: "Students face immense competition in job markets and are often rejected by automated applicant tracking systems (ATS) because their resumes do not match standard keywords or structure.",
    proposed_solution: "Develop an easy-to-use analysis portal where a student uploads their resume, selects a targeted job description, and receives instantaneous, high-fidelity metrics showing keyword discrepancies, skill gaps, and styling tips.",
    features: [
      "Resume upload (PDF/Word parser)",
      "Text & entities extraction",
      "Advanced skills and tool recognition",
      "Job role match percentage",
      "Visual feedback checklist",
      "Detailed recommendations reporting",
      "Secure Admin Dashboard for system metrics"
    ],
    architecture: "Next.js SPA frontend interacts with FastAPI backend endpoints. Python processes documents via Spacy/NLTK pipeline. Relational data points are saved in MongoDB.",
    modules: [
      { name: "Frontend Parser Interface", description: "Interactive drag-and-drop page using React hooks." },
      { name: "FastAPI Parsing Handler", description: "Handles API ingestion, validates files, and sanitizes input text." },
      { name: "NLP Matching Core", description: "Leverages TF-IDF vectorization and custom NER parsing pipeline." }
    ],
    workflow: [
      "User logs in and navigates to upload portal",
      "Uploads PDF format resume",
      "System extracts raw text and runs skill matching regex and NLP models",
      "Returns scores and visualizations immediately"
    ],
    whats_included: [
      "Fully working web application code",
      "Custom trained SpaCy parsing model source",
      "MongoDB schema configurations",
      "Detailed developer installation setup guide",
      "Technical system explanation (1-hour support)"
    ],
    optional_services: [
      { name: "Production VPS / Cloud deployment", price: 1499 },
      { name: "Custom database migration support", price: 999 },
      { name: "Full Project Report (.docx format)", price: 1999 }
    ],
    faq: [
      { question: "Can this parse scanned images?", answer: "By default, this parses text-based PDFs. OCR image scanning can be added as an optional customization." },
      { question: "Which NLP library is used?", answer: "This project leverages the SpaCy English library along with NLTK." }
    ],
    demo_video_url: "",
    demo_screenshots: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop"
    ],
    seo_title: "AI Resume Analyzer - Final Year CSE Project",
    seo_meta_description: "Get a professional AI Resume Analyzer project for final year computer science students. Built on Next.js, FastAPI, and MongoDB."
  },
  "smart-lost-found": {
    id: "2",
    title: "Smart Lost & Found",
    slug: "smart-lost-found",
    category: "Full Stack",
    department: "IT",
    difficulty: "Advanced",
    starting_price: 5999,
    technology: ["Next.js", "FastAPI", "MongoDB", "Python", "AI"],
    short_description: "Smart lost and found portal with automatic visual image match recognition.",
    description: "An interactive campus portal connecting students who lost items with finders. Features advanced visual recognition where images of found items are cross-matched with text reports of lost items to alert potential owners.",
    problem_statement: "Items lost on university campuses rarely find their way back to owners due to fragmented communication, manual spreadsheets, and delay in matching matches.",
    proposed_solution: "A central real-time portal where lost and found reports are matched automatically via description parameters and machine learning image similarity models.",
    features: [
      "Lost item posting and reporting form",
      "Found item posting and image upload",
      "Automatic match recommendation scoring",
      "Real-time notifications dashboard",
      "Moderator dashboard to approve or block posts",
      "Activity tracking analytics"
    ],
    architecture: "FastAPI triggers similarity index calculations, storage is handled in MongoDB, images are stored locally or via Cloudinary/AWS S3.",
    modules: [
      { name: "Authentication module", description: "Enables college email domain validation." },
      { name: "Reporting interface", description: "Form page for uploading images and tagging location metadata." },
      { name: "Similarity search server", description: "Python module using visual embeddings comparison." }
    ],
    workflow: [
      "Student submits lost keys with description",
      "Another student uploads image of found keys",
      "Matching algorithm flags correlation, emailing both students",
      "Admin closes status upon successful return"
    ],
    whats_included: [
      "Complete source code repository",
      "Local environment startup scripts",
      "Pre-configured database indexes",
      "Project flow diagrams and walkthrough files",
      "Viva support checklist"
    ],
    optional_services: [
      { name: "Host on Vercel and Railway Cloud", price: 999 },
      { name: "Email SMTP notification integration", price: 499 },
      { name: "Custom campus map layout", price: 1499 }
    ],
    faq: [
      { question: "How are images compared?", answer: "We compute image similarity using PyTorch ResNet feature extractors." }
    ],
    demo_video_url: "",
    demo_screenshots: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop"
    ],
    seo_title: "Smart Lost and Found Portal - IT Project",
    seo_meta_description: "High fidelity college smart lost & found project utilizing AI matching, Next.js, and MongoDB."
  },
  "student-performance-prediction": {
    id: "3",
    title: "Student Performance Prediction",
    slug: "student-performance-prediction",
    category: "Data Science",
    department: "BCA",
    difficulty: "Intermediate",
    starting_price: 3499,
    technology: ["Python", "Machine Learning", "FastAPI", "MongoDB", "Next.js"],
    short_description: "Predict student failure or academic scores based on demographic and historical metrics.",
    description: "A predictive analytics web dashboard allowing instructors to input historical performance data and demographics to classify students at risk of failing. Displays insights graphs to suggest tutoring resources.",
    problem_statement: "Academic advisors are often reactive, identifying failing students only after final grades are recorded, leading to high drop-out rates.",
    proposed_solution: "Establish early predictive pipelines analyzing mid-semester scores, attendance logs, and study hour estimates using classification machine learning models.",
    features: [
      "CSV Student data uploader",
      "Parameter input forms for single prediction queries",
      "Dashboard graphics using Chart.js",
      "Performance prediction metrics export (.pdf)",
      "Action item generator for teachers"
    ],
    architecture: "FastAPI coordinates scikit-learn models. Next.js handles chart outputs. MongoDB stores training datasets and results.",
    modules: [
      { name: "Data ingestion", description: "Converts CSV records into internal pandas dataframes." },
      { name: "ML Inference", description: "Loads trained Random Forest classifier models." }
    ],
    workflow: [
      "Teacher logs in",
      "Enters student metrics (Study hours: 5, Attendance: 80%)",
      "Model outputs risk level (High/Medium/Low) along with predictive confidence"
    ],
    whats_included: [
      "Web code codebase",
      "Trained machine learning models (.pkl)",
      "Sample dataset (1000 academic rows)",
      "Detailed readme and setup guide",
      "Project presentation PPT presentation template"
    ],
    optional_services: [
      { name: "Add automated email warning system", price: 799 },
      { name: "One-on-one video mentoring walkthrough", price: 999 }
    ],
    faq: [
      { question: "What algorithms are supported?", answer: "Random Forest, Decision Trees, and Logistic Regression models."}
    ],
    demo_video_url: "",
    demo_screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop"
    ],
    seo_title: "Student Performance Prediction ML Project",
    seo_meta_description: "Academic analytics dashboard for predicting student outcomes using Machine Learning."
  }
};

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, system, inclusions, faq

  useEffect(() => {
    let unsubscribe: () => void;
    
    async function setupListener() {
      if (!slug) return;
      
      const { onSnapshot } = await import("firebase/firestore");
      const q = query(collection(db, "projects"), where("slug", "==", slug));
      
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          setProject(fallbackProjectData[slug as string] || null);
        }
        setLoading(false);
      }, (err) => {
        console.warn("API offline, loading client fallback for details.", err);
        setProject(fallbackProjectData[slug as string] || null);
        setLoading(false);
      });
    }

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-6 w-1/4 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-800 rounded-xl"></div>
            <div className="h-10 bg-slate-800 rounded-lg"></div>
            <div className="h-32 bg-slate-800 rounded"></div>
          </div>
          <div className="lg:col-span-1 h-80 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <p className="text-slate-400 mb-8">The requested project layout page does not exist.</p>
        <Link href="/projects" className="gradient-btn px-4 py-2 rounded-lg text-white font-semibold">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link href="/projects" className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 mb-6">
        <span>←</span> Back to Projects
      </Link>

      {/* Main Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold rounded">
              {project.category}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs font-semibold">{project.department} Dept</span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs font-semibold">{project.difficulty} Level</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">{project.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/enquire?project=${project.slug}`}
            className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg shadow-indigo-500/20"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Details */}
        <div className="lg:col-span-2 space-y-8">


          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar gap-6">
            {[
              { id: "overview", name: "Overview" },
              { id: "system", name: "System Design" },
              { id: "inclusions", name: "What's Included" },
              { id: "faq", name: "FAQs" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-white font-bold"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content Panel */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Project Description</h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{project.description}</p>
                </div>
                {/* Problem & Proposed Solution - 2 columns on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3.5 sm:gap-6">
                  <div className="glass-card p-4 sm:p-5 border-l-2 border-l-rose-500">
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-2">Problem Statement</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">{project.problem_statement}</p>
                  </div>
                  <div className="glass-card p-4 sm:p-5 border-l-2 border-l-teal-500">
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-2">Proposed Solution</h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">{project.proposed_solution}</p>
                  </div>
                </div>
                {/* Key Features - 2 columns on mobile */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Key Deliverable Features</h2>
                  <ul className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    {(project.features || []).map((feat, idx) => (
                      <li key={idx} className="flex items-start text-[10px] sm:text-sm text-slate-400 gap-1.5 leading-normal">
                        <span className="text-emerald-500">✓</span>
                        <span className="line-clamp-3">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-8">
                {/* Architecture */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">System Architecture</h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">{project.architecture}</p>
                </div>
                {/* Modules - 2 columns on mobile */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Modules Breakdown</h2>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3.5 md:space-y-4">
                    {(project.modules || []).map((mod, idx) => (
                      <div key={idx} className="glass-card p-4 h-full flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-indigo-300 mb-1 leading-tight">{mod.name}</h4>
                          <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">{mod.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Workflow - 2 columns on mobile */}
                <div>
                  <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Project Workflow Steps</h2>
                  <ol className="grid grid-cols-2 md:grid-cols-1 gap-3.5 md:space-y-3">
                    {(project.workflow || []).map((step, idx) => (
                      <li key={idx} className="flex items-start text-[10px] sm:text-sm text-slate-400 gap-2 leading-tight">
                        <span className="font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[8px] sm:text-xs select-none shrink-0">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5 line-clamp-3">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {activeTab === "inclusions" && (
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {/* Base inclusions */}
                <div>
                  <h2 className="text-xs sm:text-lg font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">Base Package</h2>
                  <ul className="space-y-2.5">
                    {(project.whats_included || []).map((inc, idx) => (
                      <li key={idx} className="flex items-start text-[10px] sm:text-sm text-slate-400 gap-1.5">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <span className="line-clamp-2">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Optional add-ons */}
                <div>
                  <h2 className="text-xs sm:text-lg font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">Custom Add-ons</h2>
                  <ul className="space-y-2.5">
                    {(project.optional_services || []).map((srv, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-sm text-slate-400 border-b border-card-border pb-1.5 sm:pb-2 gap-0.5 sm:gap-2">
                        <span className="line-clamp-1">{srv.name}</span>
                        <span className="font-bold text-indigo-400 shrink-0">+₹{srv.price.toLocaleString("en-IN")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3.5 md:space-y-6">
                {(project.faq || []).map((f, idx) => (
                  <div key={idx} className="glass-card p-4 sm:p-5 h-full flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5 leading-tight">{f.question}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">{f.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Deliverables Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-6 sticky top-24">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Customization baseline</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">
                  ₹{project.starting_price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400 font-semibold">starting price</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed italic">
                *Note: Final quote depends on specific additions, revision limits, and deadline urgency.
              </p>
            </div>

            <div className="border-t border-white/5 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Baseline Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {(project.technology || project.technologies || []).map((tech, i) => (
                  <span key={i} className="text-xs font-semibold bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-slate-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Standard Package Rules</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">📂</span> Full Working Code Ingestion
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">🗄️</span> DB Setup & Schema Scripts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">🖥️</span> guided Local Screen-share Installation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">🔄</span> 2 Revision Rounds Included
                </li>
              </ul>
            </div>

            <div className="border-t border-white/5 pt-5 space-y-4">
              <Link
                href={`/enquire?project=${project.slug}`}
                className="gradient-btn text-center block w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-500/20"
              >
                Request Custom Quote
              </Link>
              <a
                href={`https://wa.me/916374578233?text=Hi%20Elaxora Solutions,%20I'm%20interested%20in%20the%20${encodeURIComponent(project.title)}%20project.`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold transition-all"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 py-3 bg-slate-950/95 border-t border-card-border backdrop-blur-md flex items-center justify-between gap-4 transition-all duration-200">
        <div>
          <span className="block text-[8px] text-muted uppercase font-bold tracking-wider">Starts From</span>
          <span className="text-base font-extrabold text-indigo-500">
            ₹{project.starting_price.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/916374578233?text=Hi%20Elaxora%20Solutions,%20I'm%20interested%20in%20the%20${encodeURIComponent(project.title)}%20project.`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-slate-900 border border-card-border p-2.5 text-xs font-semibold text-foreground hover:bg-slate-800 transition-colors"
          >
            💬 Chat
          </a>
          <Link
            href={`/enquire?project=${project.slug}`}
            className="rounded-lg gradient-btn px-4 py-2.5 text-xs font-bold text-white shadow-lg"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
