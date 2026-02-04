"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Copy, Trash2, Plus, Share2, 
  ExternalLink, Trophy, LogOut, Search, Users, Sparkles
} from "lucide-react";
import Link from "next/link";
import QuizResults from "@/components/quiz/QuizResults";

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalQuizzes: 0, totalStudents: 0 });
  
  const router = useRouter();

  // --- 1. Fetch & Calculate Stats ---
  useEffect(() => {
    const hasAccess = sessionStorage.getItem("teacher_access");
    if (!hasAccess) {
      router.push("/login"); 
      return;
    }

    const fetchDashboardData = async () => {
      // Fetch Quizzes
      const { data: quizData, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && quizData) {
        setQuizzes(quizData);
        
        // Calculate basic stats (Mocking student count based on results would be better, 
        // but for now we count quizzes. You can expand this query later.)
        setStats({
          totalQuizzes: quizData.length,
          totalStudents: 0 // You would need a separate query to count total rows in 'leaderboard'
        });
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  // --- 2. Helper Functions ---
  const handleLogout = () => {
    if(confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem("teacher_access");
      router.push("/login");
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    alert("Quiz ID copied to clipboard!");
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm("This will permanently delete the quiz and ALL student results. Continue?")) return;
    
    const { error } = await supabase.from('quizzes').delete().eq('id', id);
    if (!error) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
      if (expandedQuiz === id) setExpandedQuiz(null);
    } else {
      alert("Error deleting: " + error.message);
    }
  };

  const shareToWhatsApp = (quizId: string, title: string) => {
    const quizUrl = `${window.location.origin}/quiz/${quizId}`;
    const message = `*Islamic Quiz Challenge* 🌙\n\nTopic: *${title}*\n\n👇 Click to Start:\n${quizUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filter quizzes based on search
  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.id.includes(searchQuery)
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-600 animate-pulse" />
      </div>
      <p className="text-emerald-900 font-bold animate-pulse tracking-widest uppercase text-xs">Loading Dashboard...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100 font-sans p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/50 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-emerald-950 tracking-tight">Teacher Dashboard</h1>
            <p className="text-emerald-700 font-medium mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Welcome back, Ustadh.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto relative z-10">
            <button 
              onClick={handleLogout}
              className="px-6 py-3 rounded-2xl font-bold text-emerald-700 bg-white border border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
            <Link 
              href="/create" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> Create Quiz
            </Link>
          </div>

          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl z-0" />
        </header>

        {/* --- Stats & Search Bar --- */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm flex items-center gap-4"
          >
            <div className="bg-emerald-100 p-4 rounded-2xl">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Quizzes</p>
              <p className="text-3xl font-black text-emerald-900">{stats.totalQuizzes}</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-white/80 backdrop-blur-md p-2 rounded-3xl border border-white/50 shadow-sm flex items-center"
          >
            <div className="p-4 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search your quizzes by title or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent p-4 text-lg font-medium text-emerald-900 placeholder:text-gray-400 outline-none"
            />
          </motion.div>
        </div>

        {/* --- Quiz Grid --- */}
        <AnimatePresence mode="popLayout">
          {filteredQuizzes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl p-20 rounded-[3rem] text-center shadow-xl border border-white/50 flex flex-col items-center"
            >
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-600">No quizzes found</h2>
              <p className="text-gray-400 mt-2">Try adjusting your search or create a new one.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredQuizzes.map((quiz, index) => (
                <motion.div 
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/90 backdrop-blur-md rounded-4xl shadow-sm border border-white/60 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                      
                      {/* Quiz Info */}
                      <div className="flex items-start gap-5">
                        <div className="bg-linear-to-br from-emerald-100 to-teal-100 p-4 rounded-2xl text-emerald-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors">
                            {quiz.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2 text-sm font-medium text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-600 border border-gray-200 font-mono tracking-tight">
                              ID: {quiz.id.slice(0, 8)}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span>{new Date(quiz.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <button onClick={() => copyToClipboard(quiz.id)} className="action-btn bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                          <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copy ID</span>
                        </button>
                        
                        <Link href={`/quiz/${quiz.id}`} className="action-btn bg-gray-50 text-gray-700 hover:bg-black hover:text-white">
                          <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Preview</span>
                        </Link>

                        <button onClick={() => shareToWhatsApp(quiz.id, quiz.title)} className="action-btn bg-green-50 text-green-700 hover:bg-green-600 hover:text-white">
                          <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button 
                          onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                          className={`action-btn transition-all border ${
                            expandedQuiz === quiz.id 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20" 
                              : "bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400"
                          }`}
                        >
                          <Trophy className="w-4 h-4" /> 
                          {expandedQuiz === quiz.id ? "Hide Results" : "Results"}
                        </button>

                        <button onClick={() => deleteQuiz(quiz.id)} className="action-btn bg-red-50 text-red-500 hover:bg-red-600 hover:text-white border border-transparent">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Results Area */}
                    <AnimatePresence>
                      {expandedQuiz === quiz.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-8 pt-8 border-t border-gray-100">
                            <QuizResults quizId={quiz.id} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .action-btn {
          @apply flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border border-transparent;
        }
      `}</style>
    </main>
  );
}