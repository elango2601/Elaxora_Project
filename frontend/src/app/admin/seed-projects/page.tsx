"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { projectsData } from "./data";
import { useRouter } from "next/navigation";

export default function SeedProjects() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    setStatus("Starting to upload 15 projects...");
    
    try {
      const colRef = collection(db, "projects");
      let count = 0;
      
      for (const project of projectsData) {
        await addDoc(colRef, {
          ...project,
          created_at: serverTimestamp(),
          is_active: true
        });
        count++;
        setStatus(`Uploaded ${count} of ${projectsData.length}...`);
      }
      
      setStatus("Success! All 15 projects have been added to the database.");
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold">Seed Database</h1>
        <p className="text-slate-400 text-sm">
          Clicking the button below will permanently insert the 15 requested projects into your live Firestore database.
        </p>
        
        <button 
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload 15 Projects Now"}
        </button>
        
        {status && (
          <div className="text-sm p-4 bg-slate-700 rounded-lg text-emerald-400 font-medium">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
