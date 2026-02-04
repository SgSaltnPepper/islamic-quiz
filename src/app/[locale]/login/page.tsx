"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, UserPlus, KeyRound } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: dbError } = await supabase
      .from('teachers')
      .select('name')
      .eq('pin', pin)
      .single();

    if (dbError || !data) {
      setError("Invalid PIN. Please try again.");
      setPin("");
    } else {
      sessionStorage.setItem("teacher_access", "true");
      sessionStorage.setItem("teacher_name", data.name);
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_bottom_left,var(--tw-gradient-stops))] from-slate-50 via-emerald-50 to-teal-100 p-4 font-sans">
      
      {/* Background Shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-linear-to-tr from-emerald-500 to-teal-400 p-5 rounded-2xl shadow-lg shadow-emerald-500/30 transform -rotate-6">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-center text-emerald-950 mb-2 tracking-tight">Teacher Login</h1>
        <p className="text-center text-emerald-800/60 mb-10 font-medium">Enter your secure PIN to access dashboard.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
            <input 
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              placeholder="Enter 4-Digit PIN"
              className="w-full pl-14 p-5 text-lg font-bold tracking-widest bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none text-gray-900 transition-all placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm font-bold justify-center bg-red-50 p-3 rounded-xl border border-red-100"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Access Dashboard"} 
            {!loading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm mb-3 font-medium">Don't have an account?</p>
          <Link 
            href={`/${locale}/signup`} 
            className="inline-flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-6 py-3 rounded-xl transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Create Teacher Account
          </Link>
        </div>
      </motion.div>
    </main>
  );
}