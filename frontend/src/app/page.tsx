import Link from "next/link";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

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

// Fallback seed projects in case backend is offline
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

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/projects", { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return fallbackProjects;
    const data = await res.json();
    return data.length > 0 ? data.slice(0, 3) : fallbackProjects;
  } catch (error) {
    console.warn("Backend not reachable. Serving fallback static projects.");
    return fallbackProjects;
  }
}

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  const trustMetrics = [
    {
      title: "Student-Friendly Pricing",
      desc: "High-quality project packages starting from just ₹999. Zero hidden charges.",
      icon: "🪙"
    },
    {
      title: "Customizable Projects",
      desc: "Tailored to your specific university guide inputs and syllabus requirements.",
      icon: "⚙️"
    },
    {
      title: "1-on-1 Setup Support",
      desc: "Remote screen-share help to configure databases and launch servers locally.",
      icon: "💻"
    },
    {
      title: "Comprehensive Mentoring",
      desc: "Code walkthroughs and system design discussions so you can explain it to your examiner.",
      icon: "🧑‍🏫"
    },
    {
      title: "Viva Preparation",
      desc: "Detailed guides, questionnaires, and cheat sheets to ace your academic defense.",
      icon: "🎯"
    },
    {
      title: "Optional Deployments",
      desc: "Host your live project on AWS, Vercel, or Railway with sharing links.",
      icon: "🌐"
    }
  ];

  const steps = [
    { num: "01", title: "Select a Template", desc: "Choose from our advanced templates across AI, Data Science, or Full-Stack Web." },
    { num: "02", title: "Submit Rules", desc: "Share your college parameters, modifications, deadlines, and target budget." },
    { num: "03", title: "Review Custom Quote", desc: "Receive a transparent quotation detailing base costs and selected service add-ons." },
    { num: "04", title: "Lock Scope", desc: "Pay the required milestone advance to lock project scope, launching custom coding." },
    { num: "05", title: "Demo & Revisions", desc: "Review working video demo, request revision rounds, and verify requirements." },
    { num: "06", title: "Delivery & Setup", desc: "Clear balances, retrieve full source code, and get guided local setup assistance." }
  ];

  const faqItems = [
    { q: "Is this a copy-paste project?", a: "No. Unlike generic marketplaces, we customize every project code base and focus heavily on technical mentoring. We provide guided local setup, code walk-throughs, and viva guides." },
    { q: "How do payments work?", a: "For projects under ₹5,000, we require a 50% advance + 50% on demo approval. For projects ₹5,000 and above, it is split: 40% advance + 30% milestone + 30% final delivery." },
    { q: "Help me run the code?", a: "Absolutely. Local setup assistance is included in every project. We connect via screen-share (AnyDesk/Zoom) to install databases and run the backend/frontend." },
    { q: "What if my guide asks for changes?", a: "We specify a set number of revision rounds in our quotation. For new feature additions outside the locked scope, we provide a transparent Change Request quote." }
  ];

  return (
    <div className="relative isolate overflow-hidden">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:pt-28 sm:pb-32 text-left sm:text-center relative">
        <FadeInUp delay={0.1}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Premium Project Support starting from ₹999
          </div>
        </FadeInUp>
        
        <FadeInUp delay={0.2}>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-7xl max-w-5xl sm:mx-auto leading-[1.1] sm:leading-[1.05]">
            Your Final-Year Project, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
              Built Around Your Requirements.
            </span>
          </h1>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <p className="mt-6 sm:mx-auto max-w-2xl text-base sm:text-xl text-slate-400 font-medium">
            Affordable, customizable project development and 1-on-1 technical mentoring for engineering and computer applications students. From ideation to working demo.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <div className="mt-10 flex flex-col sm:flex-row sm:justify-center items-center gap-4 w-full max-w-sm sm:max-w-md sm:mx-auto">
            <Link
              href="/projects"
              className="w-full sm:w-auto text-center bg-white text-slate-900 hover:bg-slate-100 px-8 py-3.5 text-sm font-bold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Projects
            </Link>
            <Link
              href="/enquire"
              className="w-full sm:w-auto text-center px-8 py-3.5 text-sm font-bold rounded-xl text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300"
            >
              Get Free Quote
            </Link>
          </div>
        </FadeInUp>
      </section>

      {/* Trust Metrics Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />
        
        <FadeInUp>
          <div className="text-left sm:text-center mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Why Students Choose Us
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto">
              We don't just sell code — we ensure you understand and can present it confidently.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {trustMetrics.map((m, idx) => (
            <StaggerItem key={idx}>
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 p-6 sm:p-8 hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all duration-500 h-full backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-3xl sm:text-4xl block mb-4 bg-white/5 inline-flex p-3 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-500">{m.icon}</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{m.title}</h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <FadeInUp>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                Featured Templates
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-lg">
                Use these premium templates as a baseline for your customized project.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20 transition-all"
            >
              View all projects 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </FadeInUp>
        </div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <StaggerItem key={p.id}>
              <div className="group flex flex-col justify-between p-6 h-full rounded-2xl bg-slate-900/50 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] sm:text-xs font-bold text-indigo-300 border border-indigo-500/30">
                      {p.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-950 px-2 py-1 rounded border border-white/5">{p.difficulty}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">{p.short_description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.technology.map((tech, i) => (
                      <span key={i} className="text-[10px] sm:text-xs bg-slate-950/50 border border-white/10 rounded-md px-2.5 py-1 text-slate-300 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Starting at</span>
                    <span className="text-lg font-bold text-white">₹{p.starting_price.toLocaleString("en-IN")}</span>
                  </div>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="rounded-xl bg-white text-slate-900 px-4 py-2 text-xs sm:text-sm font-bold hover:bg-slate-200 transition-colors shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5 relative">
        <FadeInUp>
          <div className="text-left sm:text-center mb-16">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              From Idea to Working Demo
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto">
              Our structured 6-step development process protects your syllabus compliance and budget.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {steps.map((step, idx) => (
            <StaggerItem key={idx}>
              <div className="relative flex flex-col items-start group pl-6 sm:pl-0 border-l sm:border-l-0 border-white/10">
                <span className="text-4xl sm:text-6xl font-black text-white/5 absolute top-0 -left-6 sm:-top-8 sm:left-0 select-none group-hover:text-indigo-500/10 transition-colors duration-500">
                  {step.num}
                </span>
                <div className="hidden sm:block w-8 h-1 bg-indigo-500 mb-6 rounded-full group-hover:w-12 transition-all duration-300" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 z-10 relative">
                  <span className="sm:hidden absolute -left-8 top-2 w-4 h-4 rounded-full bg-indigo-500 border-4 border-background" />
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5 bg-slate-900/20">
        <FadeInUp>
          <div className="text-left sm:text-center mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hear from our Students
            </h2>
          </div>
        </FadeInUp>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              quote: "The mentoring they provided before my final viva was incredible. The examiner asked exactly what we discussed.",
              author: "Rahul M.",
              role: "B.Tech CSE"
            },
            {
              quote: "I had a very tight budget and deadline, and Elaxora delivered a fully working Machine Learning project exactly on time.",
              author: "Priya S.",
              role: "BCA"
            }
          ].map((testimonial, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 relative">
                <div className="text-4xl text-indigo-500/20 absolute top-4 right-6 font-serif">"</div>
                <p className="text-slate-300 italic mb-6 relative z-10 text-sm sm:text-base leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="text-white font-bold text-sm sm:text-base">{testimonial.author}</p>
                  <p className="text-slate-500 text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
        <FadeInUp>
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl mb-6">
            Ready to secure your marks?
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-sm sm:text-lg">
            Don't leave your final-year project to the last minute. Get a customized quote today and lock your slot before slots fill up.
          </p>
          <Link
            href="/enquire"
            className="inline-flex justify-center items-center bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-sm font-bold rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1"
          >
            Request a Free Quote Now
          </Link>
        </FadeInUp>
      </section>
    </div>
  );
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
}

// Fallback seed projects in case backend is offline
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

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/projects", { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return fallbackProjects;
    const data = await res.json();
    return data.length > 0 ? data.slice(0, 3) : fallbackProjects;
  } catch (error) {
    console.warn("Backend not reachable. Serving fallback static projects.");
    return fallbackProjects;
  }
}

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  const trustMetrics = [
    {
      title: "Student-Friendly Pricing",
      desc: "High-quality project packages starting from just ₹999. Zero hidden charges.",
      icon: "🪙"
    },
    {
      title: "Customizable Projects",
      desc: "Tailored to your specific university guide inputs and syllabus requirements.",
      icon: "⚙️"
    },
    {
      title: "1-on-1 Setup Support",
      desc: "Remote screen-share help to configure databases and launch servers locally on your machine.",
      icon: "💻"
    },
    {
      title: "Comprehensive Mentoring",
      desc: "Code walkthroughs and system design discussions so you can explain it to your examiner.",
      icon: "🧑‍🏫"
    },
    {
      title: "Viva Preparation",
      desc: "Detailed guides, questionnaires, and cheat sheets to ace your academic defense.",
      icon: "🎯"
    },
    {
      title: "Optional Deployments",
      desc: "Host your live project on AWS, Vercel, or Railway with sharing links.",
      icon: "🌐"
    }
  ];

  const steps = [
    { num: "01", title: "Select a Template", desc: "Choose from our advanced templates across AI, Data Science, or Full-Stack Web." },
    { num: "02", title: "Submit Rules", desc: "Share your college parameters, modifications, deadlines, and target budget." },
    { num: "03", title: "Review Custom Quote", desc: "Receive a transparent quotation detailing base costs and selected service add-ons." },
    { num: "04", title: "Lock Scope", desc: "Pay the required milestone advance to lock project scope, launching custom coding." },
    { num: "05", title: "Demo & Revisions", desc: "Review working video demo, request revision rounds, and verify requirements." },
    { num: "06", title: "Delivery & Setup", desc: "Clear balances, retrieve full source code, and get guided local setup assistance." }
  ];

  const faqItems = [
    { q: "Is this a copy-paste project?", a: "No. Unlike generic marketplaces, we customize every project code base and focus heavily on technical mentoring. We provide guided local setup, code walk-throughs, and viva guides." },
    { q: "How do payments work?", a: "For projects under ₹5,000, we require a 50% advance + 50% on demo approval. For projects ₹5,000 and above, it is split: 40% advance + 30% milestone + 30% final delivery." },
    { q: "Help me run the code?", a: "Absolutely. Local setup assistance is included in every project. We connect via screen-share (AnyDesk/Zoom) to install databases and run the backend/frontend." },
    { q: "What if my guide asks for changes?", a: "We specify a set number of revision rounds in our quotation. For new feature additions outside the locked scope, we provide a transparent Change Request quote." }
  ];

  return (
    <div className="relative isolate">
      {/* Hero Section - Text Left Aligned on Mobile, Centered on Desktop */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 text-left sm:text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6">
          <span>🚀 Premium Project Support starting from ₹999</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl sm:mx-auto leading-tight sm:leading-none">
          Your Final-Year Project, <span className="gradient-text">Built Around Your Requirements.</span>
        </h1>
        <p className="mt-4 sm:mx-auto sm:mt-6 max-w-2xl text-sm sm:text-lg text-slate-400">
          Affordable, customizable project development and 1-on-1 technical mentoring for engineering and computer applications students. From ideation to working demo.
        </p>
        <div className="mt-8 flex flex-row sm:justify-center items-center gap-3 w-full max-w-sm sm:max-w-md sm:mx-auto">
          <Link
            href="/projects"
            className="w-1/2 sm:w-auto text-center gradient-btn px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold rounded-xl text-white shadow-lg"
          >
            Explore Projects
          </Link>
          <Link
            href="/enquire"
            className="w-1/2 sm:w-auto text-center px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold rounded-xl text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          >
            Free Quote
          </Link>
        </div>
      </section>

      {/* Trust Metrics Section - Two Column Layout on Mobile */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-card-border">
        <div className="text-left sm:text-center mb-8">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
            Why Students Choose Elaxora Solutions
          </h2>
          <p className="mt-1.5 text-slate-400 text-xs sm:text-sm">
            We don't just sell code — we ensure you understand and can present it confidently.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {trustMetrics.map((m, idx) => (
            <div key={idx} className="glass-card glass-card-hover p-4 sm:p-6 space-y-2">
              <span className="text-2xl sm:text-3xl block">{m.icon}</span>
              <h3 className="text-xs sm:text-lg font-bold text-white">{m.title}</h3>
              <p className="text-[10px] sm:text-sm text-slate-400 leading-normal sm:leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects - Two Column Layout on Mobile */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-card-border bg-slate-950/20">
        <div className="flex flex-row items-end justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
              Featured Templates
            </h2>
            <p className="mt-1 text-slate-400 text-xs sm:text-sm">
              Use these templates as a baseline for your customized project.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {projects.map((p) => (
            <div key={p.id} className="glass-card glass-card-hover flex flex-col justify-between p-4 sm:p-6 h-full space-y-4">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-indigo-400 border border-indigo-500/20 truncate">
                    {p.category}
                  </span>
                  <span className="text-[9px] sm:text-xs text-slate-400 hidden sm:inline">{p.difficulty}</span>
                </div>
                <h3 className="text-xs sm:text-xl font-bold text-white mb-1 line-clamp-1">{p.title}</h3>
                <p className="text-[10px] sm:text-sm text-slate-400 line-clamp-3 mb-2">{p.short_description}</p>
                {/* Tech chips are hidden on mobile to conserve screen space */}
                <div className="hidden sm:flex flex-wrap gap-1 mb-4">
                  {p.technology.map((tech, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 border border-white/5 rounded px-2 py-0.5 text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-card-border pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[8px] sm:text-xs text-slate-500 block">Starting price</span>
                  <span className="text-xs sm:text-lg font-bold text-white">₹{p.starting_price.toLocaleString("en-IN")}</span>
                </div>
                <Link
                  href={`/projects/${p.slug}`}
                  className="rounded-lg bg-indigo-600 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section - Two Column Layout on Mobile */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-card-border">
        <div className="text-left sm:text-center mb-10">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
            From Project Idea to Working Demo
          </h2>
          <p className="mt-1.5 text-slate-400 text-xs sm:text-sm">
            Our structured development process protects your syllabus compliance and budget.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-start p-2">
              <span className="text-3xl sm:text-5xl font-black text-white/5 absolute -top-4 sm:-top-8 left-0 select-none">
                {step.num}
              </span>
              <h3 className="text-xs sm:text-lg font-bold text-white mt-2 sm:mt-4 mb-1 z-10">{step.title}</h3>
              <p className="text-[10px] sm:text-sm text-slate-400 leading-normal">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Two Column Layout on Mobile */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-card-border bg-slate-950/20">
        <div className="text-left sm:text-center mb-8">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
            What Our Students Say
          </h2>
          <p className="mt-1 text-slate-500 text-[10px] italic">
            *Representative experiences based on feedback from our custom mentoring program (placeholder names used).
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="glass-card p-4">
            <p className="text-[10px] sm:text-sm text-slate-300 italic mb-4 line-clamp-6">
              "The local setup assistance was a lifesaver. I was really stressed about setting up MongoDB on my Mac, but they did it in 15 minutes."
            </p>
            <h4 className="text-xs font-bold text-white">Ananya Iyer</h4>
            <span className="text-[9px] text-slate-500">B.Tech IT Student</span>
          </div>
          <div className="glass-card p-4">
            <p className="text-[10px] sm:text-sm text-slate-300 italic mb-4 line-clamp-6">
              "My college guide requested changes halfway. I got a small quote of ₹500, and they updated the code and documentation quickly."
            </p>
            <h4 className="text-xs font-bold text-white">Rohit Verma</h4>
            <span className="text-[9px] text-slate-500">MCA Student</span>
          </div>
          <div className="glass-card p-4 col-span-2 md:col-span-1">
            <p className="text-[10px] sm:text-sm text-slate-300 italic mb-4 line-clamp-6">
              "Affordable pricing. I got a prediction model with Next.js interface for under ₹3,500. They walked me through the code blocks before viva."
            </p>
            <h4 className="text-xs font-bold text-white">Siddharth Sen</h4>
            <span className="text-[9px] text-slate-500">B.Sc Computer Science</span>
          </div>
        </div>
      </section>

      {/* FAQ Section - Two Column Layout on Mobile */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 border-t border-card-border">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl text-left sm:text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-0 md:space-y-6">
          {faqItems.map((item, idx) => (
            <div key={idx} className="glass-card p-4 md:p-6 space-y-1">
              <h3 className="text-xs md:text-base font-bold text-white leading-tight">{item.q}</h3>
              <p className="text-[10px] md:text-sm text-slate-400 leading-normal">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mb-16">
        <div className="gradient-border-box p-8 text-left sm:text-center overflow-hidden relative">
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl leading-tight">
            Have a Project Idea? Let's Build It.
          </h2>
          <p className="mt-4 max-w-xl text-xs sm:text-sm text-slate-300 sm:mx-auto">
            Tell us your university guidelines, preferred technology stack, and budget. We will design a custom scope quotation for your final-year review.
          </p>
          <div className="mt-8">
            <Link
              href="/enquire"
              className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-xs sm:text-base font-semibold text-slate-950 hover:bg-slate-100 transition-colors shadow-lg"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
