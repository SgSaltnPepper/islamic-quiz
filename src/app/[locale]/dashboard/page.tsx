"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Copy, Trash2, Plus, Share2, 
  ExternalLink, Trophy, LogOut, Search
} from "lucide-react";
import Link from "next/link";
import QuizResults from "@/components/quiz/QuizResults";

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem("teacher_access");
    if (!hasAccess) {
      router.push("/login"); 
      return;
    }

    const fetchMyQuizzes = async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setQuizzes(data || []);
      setLoading(false);
    };

    fetchMyQuizzes();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("teacher_access");
    router.push("/login");
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    // You could add a toast notification here instead of alert
    alert("Quiz ID copied!");
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm("Delete this quiz and all its results?")) return;
    const { error } = await supabase.from('quizzes').delete().eq('id', id);
    if (!error) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
      if (expandedQuiz === id) setExpandedQuiz(null);
    }
  };

  const shareToWhatsApp = (quizId: string, title: string) => {
    const quizUrl = `${window.location.origin}/quiz/${quizId}`;
    const message = `Assalamu Alaikum! 📚\n\nNew Quiz: *${title}*\n\nStart here: ${quizUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 gap-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-emerald-800 font-bold animate-pulse">Loading Dashboard...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/60 backdrop-blur-xl p-6 rounded-4xl border border-white/50 shadow-sm">
          <div>
            <h1 className="text-4xl font-black text-emerald-950 tracking-tight">Teacher Dashboard</h1>
            <p className="text-emerald-700 font-medium mt-1">Manage your active quizzes and student results</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
       
            <Link 
              href="/create" 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> New Quiz
            </Link>
          </div>
        </header>

        {/* Quiz Grid */}
        <AnimatePresence mode="popLayout">
          {quizzes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-xl p-20 rounded-[3rem] text-center shadow-xl border border-white/50 flex flex-col items-center"
            >
              <div className="bg-emerald-100 p-6 rounded-full mb-6">
                <BookOpen className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-950">No quizzes created yet</h2>
              <p className="text-gray-500 mt-2 mb-8 max-w-md">Start by creating your first quiz to challenge your students and track their progress.</p>
              <Link href="/create" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                Create First Quiz →
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {quizzes.map((quiz, index) => (
                <motion.div 
                  key={quiz.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-md rounded-4xl shadow-sm border border-white/60 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 transition-all group"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                      
                      {/* Quiz Info */}
                      <div className="flex items-start gap-5">
                        <div className="bg-linear-to-br from-emerald-100 to-teal-100 p-4 rounded-2xl text-emerald-700 shadow-inner">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-emerald-950 leading-tight">{quiz.title}</h3>
                          <div className="flex items-center gap-3 mt-2 text-sm font-medium text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 border border-gray-200">
                              ID: <span className="font-mono">{quiz.id.slice(0, 8)}</span>
                            </span>
                            <span>•</span>
                            <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <button onClick={() => copyToClipboard(quiz.id)} className="action-btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                          <Copy className="w-4 h-4" /> <span className="hidden sm:inline">Copy ID</span>
                        </button>
                        
                        <Link href={`/quiz/${quiz.id}`} className="action-btn bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-black">
                          <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Preview</span>
                        </Link>

                        <button onClick={() => shareToWhatsApp(quiz.id, quiz.title)} className="action-btn bg-green-50 text-green-700 hover:bg-green-100">
                          <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                        </button>

                        <button 
                          onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                          className={`action-btn transition-all border ${
                            expandedQuiz === quiz.id 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20" 
                              : "bg-white text-emerald-700 border-emerald-200 hover:border-emerald-300"
                          }`}
                        >
                          <Trophy className="w-4 h-4" /> 
                          {expandedQuiz === quiz.id ? "Hide Results" : "Results"}
                        </button>

                        <button onClick={() => deleteQuiz(quiz.id)} className="action-btn bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600">
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

      {/* Utility Style for buttons in this file */}
      <style jsx>{`
        .action-btn {
          @apply flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95;
        }
      `}</style>
    </main>
  );
}