"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { User, Calendar, Award } from "lucide-react";

export default function QuizResults({ quizId }: { quizId: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('quiz_id', quizId)
        .order('score', { ascending: false });

      setResults(data || []);
      setLoading(false);
    };
    fetchResults();
  }, [quizId]);

  if (loading) return (
    <div className="flex flex-col gap-2 p-4 animate-pulse">
      <div className="h-12 bg-gray-100 rounded-xl w-full" />
      <div className="h-12 bg-gray-100 rounded-xl w-full opacity-60" />
      <div className="h-12 bg-gray-100 rounded-xl w-full opacity-30" />
    </div>
  );

  return (
    <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
        <div className="col-span-2">Student</div>
        <div className="text-center">Score</div>
        <div className="text-right">Date</div>
      </div>

      {/* List */}
      <div className="max-h-100 overflow-y-auto custom-scrollbar">
        {results.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center gap-3 text-gray-400">
            <div className="bg-gray-100 p-3 rounded-full">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <p>No results yet.</p>
          </div>
        ) : (
          results.map((r, i) => (
            <motion.div 
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-white transition-colors border-b last:border-0 border-gray-50 group"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < 3 ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"
                }`}>
                  {r.username.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm group-hover:text-emerald-700 transition-colors">{r.username}</p>
                  <p className="text-[10px] text-gray-400">{r.grade}</p>
                </div>
              </div>
              
              <div className="text-center">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  r.score >= 8 ? "bg-emerald-100 text-emerald-700" : 
                  r.score >= 5 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                }`}>
                  {r.score}
                </span>
              </div>
              
              <div className="text-right text-xs text-gray-400 font-medium">
                {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}