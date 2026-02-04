"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, RefreshCw, Star } from "lucide-react";

export default function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data allows us to add a "Refresh" button
  const fetchScores = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);
    
    setScores(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce-slow drop-shadow-lg" />;
      case 1: return <Medal className="w-6 h-6 text-slate-400 fill-slate-300 drop-shadow-md" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700 fill-amber-600 drop-shadow-md" />;
      default: return <span className="text-sm font-bold text-gray-400 font-mono">#{index + 1}</span>;
    }
  };

  // Skeleton Loader
  if (loading && scores.length === 0) return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-4">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto relative px-4 pb-20">
      
      {/* Glow Effect behind the card */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-emerald-400/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest leading-none">Top Scorers</h2>
                <p className="text-emerald-100 text-xs font-medium mt-1">Global Leaderboard</p>
              </div>
            </div>
            
            <button 
              onClick={fetchScores} 
              disabled={loading}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-90"
            >
              <RefreshCw className={`w-5 h-5 text-white ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 space-y-3 bg-white/50">
          {scores.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No records yet. Be the first!</p>
            </div>
          ) : (
            scores.map((entry, index) => (
              <motion.div
                key={entry.id || index} // Fallback to index if id missing
                initial={{ x: -20, opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, type: "spring" }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)" }}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border group relative overflow-hidden ${
                  index === 0 
                    ? "bg-linear-to-r from-yellow-50/80 to-amber-50/80 border-amber-200/50 shadow-amber-100" 
                    : index === 1
                    ? "bg-slate-50 border-slate-200/50"
                    : index === 2
                    ? "bg-orange-50 border-orange-200/50"
                    : "bg-white border-transparent hover:border-emerald-100 hover:shadow-sm"
                }`}
              >
                {/* Subtle shine effect for top rank */}
                {index === 0 && <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 blur-xl rounded-full -mr-10 -mt-10" />}

                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm ${
                    index === 0 ? "bg-white" : "bg-gray-100"
                  }`}>
                    {getRankIcon(index)}
                  </div>
                  
                  <div>
                    <p className={`font-bold text-lg leading-tight ${index === 0 ? "text-amber-900" : "text-gray-800"}`}>
                      {entry.username}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold tracking-wide text-gray-500 uppercase bg-gray-100/80 px-2 py-0.5 rounded-md">
                        {entry.grade || "General"}
                      </span>
                      {index < 3 && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                    </div>
                  </div>
                </div>
                
                <div className="text-right relative z-10">
                  <div className={`text-2xl font-black leading-none ${index === 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {entry.score}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Points</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}