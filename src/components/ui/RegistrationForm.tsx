"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import * as z from "zod"; 
import { useSoundEffects } from "@/hooks/useSounds";
import { User, Mail, ArrowRight, Sparkles } from "lucide-react";

const localSchema = z.object({
  username: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type LocalValues = z.infer<typeof localSchema>;

export default function RegistrationForm({ onComplete }: { onComplete: (data: any) => void }) {
  const { playSound } = useSoundEffects();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LocalValues>({
    resolver: zodResolver(localSchema),
  });

  const onSubmit = (data: LocalValues) => {
    playSound('click');
    onComplete(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="max-w-md w-full p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-white/50 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-200/20 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-;inear-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 transform rotate-3">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-emerald-950">Welcome, Student</h2>
        <p className="text-emerald-600/80 font-medium mt-2">Ready to test your knowledge?</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 group">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-emerald-600 transition-colors">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              {...register("username")}
              placeholder="e.g. Ali Ahmed"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300 placeholder:font-normal"
            />
          </div>
          {errors.username && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
              <span>•</span> {errors.username.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2 group">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 group-focus-within:text-emerald-600 transition-colors">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              {...register("email")}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl outline-none font-bold text-gray-800 transition-all placeholder:text-gray-300 placeholder:font-normal"
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
              <span>•</span> {errors.email.message}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          Start Quiz <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
}