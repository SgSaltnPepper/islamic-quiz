"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, Lock, LayoutDashboard, LogOut, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check login status whenever the route changes
  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const access = sessionStorage.getItem("teacher_access");
      setIsTeacher(!!access);
    };
    
    checkAuth();
    
    // Listen for storage events (in case login happens in another tab/window)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("teacher_access");
    sessionStorage.removeItem("teacher_name");
    setIsTeacher(false);
    router.push("/");
  };

  // Don't render hydration mismatch (wait for mount)
  if (!mounted) return null;

  // HIDE NAVBAR on specific pages if you want (Optional)
  // if (pathname.includes("/quiz/")) return null; 

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none" // pointer-events-none lets clicks pass through empty areas
    >
      <div className="max-w-6xl mx-auto pointer-events-auto"> {/* pointer-events-auto re-enables clicks for the navbar itself */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-emerald-900/5 rounded-full px-6 py-3 flex justify-between items-center transition-all">
          
          {/* LEFT: Logo or Back Button */}
          <div className="flex items-center gap-4">
            {pathname !== "/" && pathname.includes("/en") && pathname !== "/en" ? (
              <Link href="/" className="p-2 bg-white rounded-full text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-emerald-950 tracking-tight hidden sm:block">Islamic Quiz</span>
              </Link>
            )}
          </div>

          {/* RIGHT: Dynamic Actions */}
          <div className="flex items-center gap-2">
            {isTeacher ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                    pathname.includes("/dashboard") 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "hover:bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              // If not logged in, show Teacher Login (unless we are already on login page)
              !pathname.includes("/login") && (
                <Link 
                  href="/en/login" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" /> 
                  <span>Teacher Login</span>
                </Link>
              )
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  );
}