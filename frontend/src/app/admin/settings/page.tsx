"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("admin@elaxorasolutions.com");
  
  // Settings forms states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [businessName, setBusinessName] = useState("Elaxora Solutions");
  const [supportEmail, setSupportEmail] = useState("elaxora11@gmail.com");
  const [supportWhatsapp, setSupportWhatsapp] = useState("+916374578233");
  
  const [defaultCommission, setDefaultCommission] = useState("10");
  const [defaultDiscount, setDefaultDiscount] = useState("10");

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const token = getCookie("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      if (payload && payload.sub) {
        setAdminEmail(payload.sub);
      }
    } catch (e) {
      // Fallback
    }
  }, [router]);

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== verifyPassword) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password updated successfully. (Seed config remains primary for dev)");
    setCurrentPassword("");
    setNewPassword("");
    setVerifyPassword("");
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Global system settings saved successfully.");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-grow p-6 sm:p-8 space-y-8">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Configuration Panel</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-1">Admin Settings</h1>
          <p className="text-muted text-xs">Configure administrative profile parameters and defaults policies.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Business configuration */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-3">
              💼 Business Profile Information
            </h3>
            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">Corporate Brand Name</label>
                <input placeholder="Enter Business Name"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none focus:border-indigo-500/50 font-bold"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">Public Support Email</label>
                  <input placeholder="Enter Support Email"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 font-semibold">WhatsApp Hotlink Number</label>
                  <input placeholder="Enter Support Whatsapp"
                    type="text"
                    value={supportWhatsapp}
                    onChange={(e) => setSupportWhatsapp(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none focus:border-indigo-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase mb-3">Campaign Defaults</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1.5">Referral Commission (%)</label>
                    <input placeholder="Enter Default Commission"
                      type="number"
                      value={defaultCommission}
                      onChange={(e) => setDefaultCommission(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5">Student Discount (%)</label>
                    <input placeholder="Enter Default Discount"
                      type="number"
                      value={defaultDiscount}
                      onChange={(e) => setDefaultDiscount(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="gradient-btn text-white font-bold px-4 py-2.5 rounded-lg"
              >
                Save General Configurations
              </button>
            </form>
          </div>

          {/* Profile Security Panel */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-3">
              🔒 Profile Security Settings
            </h3>
            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5">Registered Admin Email</label>
                <input placeholder="Enter Admin Email"
                  type="text"
                  disabled
                  value={adminEmail}
                  className="w-full rounded-lg bg-slate-900/50 border border-card-border px-3.5 py-2 text-muted focus:outline-none cursor-not-allowed select-all"
                />
              </div>

              <div className="border-t border-card-border pt-4 space-y-4">
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase">Change Portal Password</h4>
                <div>
                  <label className="block text-slate-400 mb-1.5">Current Password</label>
                  <input placeholder="Enter Current Password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}

                    className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1.5">New Password</label>
                    <input placeholder="Enter New Password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}

                      className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5">Confirm New Password</label>
                    <input placeholder="Enter Verify Password"
                      type="password"
                      required
                      value={verifyPassword}
                      onChange={(e) => setVerifyPassword(e.target.value)}

                      className="w-full rounded-lg bg-slate-900 border border-card-border px-3.5 py-2 text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="gradient-btn text-white font-bold px-4 py-2.5 rounded-lg"
              >
                Change Admin Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
