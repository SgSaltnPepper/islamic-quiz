"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, Lock, User, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TeacherSignup() {
  const [formData, setFormData] = useState({ name: "", pin: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.pin.length < 4) {
      alert("PIN must be at least 4 digits.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('teachers')
      .insert([{ name: formData.name, pin: formData.pin }]);

    if (error) {
      if (error.code === '23505') { 
        alert("This PIN is already taken. Please choose another one.");
      } else {
        alert("Error: " + error.message);
      }
    } else {
      alert("Registration Successful! Please Login.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-teal-50 via-emerald-50 to-emerald-100 p-4 font-sans text-gray-900">
      
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-300/30 rounded-full blur-[80px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 transform rotate-3">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tight">Join as Teacher</h1>
          <p className="text-emerald-800/60 mt-2 font-medium">Create your account to manage quizzes.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
              <input 
                required
                type="text" 
                placeholder="Ex. Sarah Khan"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-14 p-4 bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Secret PIN</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
              <input 
                required
                type="password" 
                placeholder="Create a 4-digit PIN"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
                className="w-full pl-14 p-4 bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none font-bold tracking-widest text-gray-900 transition-all placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal"
              />
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1">You will use this PIN to login securely.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"} 
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <Link href="/login" className="text-emerald-600 font-bold hover:underline text-sm">
            Already have a PIN? Login here
          </Link>
        </div>
      </motion.div>
    </main>
  );
}