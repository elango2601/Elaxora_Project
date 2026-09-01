
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { projectsData } from "./data2";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function SeedProjects() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    setStatus(`Starting to upload ${projectsData.length} projects...`);
    
    try {
      const colRef = collection(db, "projects");
      let count = 0;
      
      for (const project of projectsData) {
        const newDocRef = doc(colRef);
        await setDoc(newDocRef, {
          ...project,
          created_at: serverTimestamp(),
          is_active: true
        });
        count++;
        setStatus(`Uploaded ${count} of ${projectsData.length}...`);
      }
      
      setStatus(`Success! All ${projectsData.length} projects have been added to the database.`);
      setTimeout(() => {
        router.push("/admin/projects");
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8 flex flex-col items-center justify-center">
        <div className="bg-card p-8 rounded-xl border border-card-border max-w-4xl w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Seed Database</h1>
            <p className="text-slate-400 text-sm mt-2">
              The following {projectsData.length} projects are ready to be uploaded to your live database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 border border-card-border p-4 rounded-lg bg-slate-950/50">
            {projectsData.map((p, i) => (
              <div key={i} className="bg-slate-900/80 p-4 rounded border border-card-border flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-indigo-400">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.short_description}</p>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {p.technologies.slice(0, 3).map((tech: string, j: number) => (
                    <span key={j} className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {tech}
                    </span>
                  ))}
                  {p.technologies.length > 3 && (
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">+{p.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Uploading..." : `Upload All ${projectsData.length} Projects Now`}
          </button>
          
          {status && (
            <div className="text-sm p-4 bg-slate-800/80 border border-slate-700 rounded-lg text-emerald-400 font-medium text-center">
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
