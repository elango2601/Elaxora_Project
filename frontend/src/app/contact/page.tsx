"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Query");
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) return;
    
    // Simulating message storage/send
    setSubmitted(true);
    setName("");
    setEmail("");
    setMsg("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Contact Us</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Need custom advice, updates on your active project, or referral inquiries? Drop a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Coordinates */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Channels</h3>
            
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase block font-bold">WhatsApp</span>
              <a
                href="https://wa.me/916374578233?text=Hi%20Elaxora Solutions,%20I%20have%20a%20question%20regarding%20final-year%20projects."
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 block"
              >
                💬 +91 63745 78233
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase block font-bold">Email</span>
              <a
                href="mailto:elaxora11@gmail.com"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 block"
              >
                ✉️ elaxora11@gmail.com
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase block font-bold">Hours</span>
              <span className="text-xs text-slate-400 block">
                Daily: 9:00 AM – 10:00 PM IST
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="glass-card p-6 sm:p-8">
            {submitted ? (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-6 text-center space-y-3">
                <span className="text-3xl block">✓</span>
                <h4 className="text-base font-bold text-white">Message Sent Successfully</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out. We will review your message and respond via email or WhatsApp within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}

                      className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}

                      className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Active Order Question">Active Order Question</option>
                    <option value="Referrals & Commissions">Referrals & Commissions</option>
                    <option value="Custom Tech Stack Idea">Custom Tech Stack Idea</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Message Body *
                  </label>
                  <textarea
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}

                    rows={4}
                    className="w-full rounded-lg bg-slate-900 border border-white/5 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="gradient-btn text-center block w-full py-3 rounded-lg text-xs font-bold text-white shadow-lg"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
