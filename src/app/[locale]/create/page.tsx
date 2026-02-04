"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateQuizForm from "@/components/quiz/CreateQuizForm"; 
import { ArrowLeft, LayoutDashboard, Sparkles, UserCircle } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CreatePage() {
  const router = useRouter();
  const [teacherName, setTeacherName] = useState("");
  const { scrollY } = useScroll();
  
  // Parallax / Scroll Effect for Navbar opacity
  const navBackground = useTransform(
    scrollY, 
    [0, 50], 
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );
  
  const navBorder = useTransform(
    scrollY, 
    [0, 50], 
    ["rgba(255, 255, 255, 0)", "rgba(229, 231, 235, 1)"]
  );

  const navBlur = useTransform(
    scrollY, 
    [0, 50], 
    ["blur(0px)", "blur(12px)"]
  );

  useEffect(() => {
    // Security & User Check
    const hasAccess = sessionStorage.getItem("teacher_access");
    const name = sessionStorage.getItem("teacher_name");
    
    if (!hasAccess) {
      router.push("/login");
    } else if (name) {
      setTeacherName(name);
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100 font-sans pb-24">
      
      {/* --- 1. THE AMAZING NAVBAR --- */}


      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-120 h-120 bg-teal-300/20 rounded-full blur-3xl opacity-60" />
      </div>

      {/* --- 2. MAIN CONTENT (Padded top for Navbar) --- */}
      <div className="max-w-5xl mx-auto px-6 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* We remove the old header since the Navbar replaces it */}
          <CreateQuizForm />
        </motion.div>
      </div>
      
    </main>
  );
}