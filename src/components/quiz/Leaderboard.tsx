"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      
      setScores(data || []);
      setLoading(false);
    };
    fetchScores();
  }, []);

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce-slow" />;
      case 1: return <Medal className="w-6 h-6 text-slate-400 fill-slate-300" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700 fill-amber-600" />;
      default: return <span className="text-sm font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  if (loading) return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/50 overflow-hidden"
      >
        <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <h2 className="text-3xl font-black uppercase tracking-widest flex justify-center gap-3 items-center relative z-10">
            <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-md" />
            Top Scorers
          </h2>
        </div>

        <div className="p-6 space-y-3">
          {scores.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                index === 0 
                  ? "bg-linear-to-r from-yellow-50 to-amber-50 border-amber-200 shadow-md" 
                  : "bg-white border-gray-100 hover:border-emerald-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  index === 0 ? "bg-yellow-100" : "bg-gray-50"
                }`}>
                  {getRankIcon(index)}
                </div>
                <div>
                  <p className={`font-bold text-lg ${index === 0 ? "text-amber-900" : "text-gray-800"}`}>
                    {entry.username}
                  </p>
                  <p className="text-[10px] font-bold tracking-wide text-gray-400 uppercase bg-gray-100 inline-block px-2 py-0.5 rounded-full">
                    {entry.grade || "General"}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600 leading-none">
                  {entry.score}
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Points</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}