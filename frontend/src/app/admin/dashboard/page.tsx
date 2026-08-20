"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="text-xs text-muted animate-pulse">Redirecting to Dashboard Control...</span>
    </div>
  );
}
