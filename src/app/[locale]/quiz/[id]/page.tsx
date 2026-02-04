"use client";

import { useEffect, useState, use } from "react"; 
import { supabase } from "@/lib/supabase";
import QuestionCard from "@/components/quiz/QuestionCard";
import RegistrationForm from "@/components/ui/RegistrationForm"; // Import the form
import { useSoundEffects } from "@/hooks/useSounds";
import { triggerConfetti } from "@/lib/celebrate";
import { Trophy, RotateCcw, Home, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // --- State Management ---
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // User State: If this is null, we show the Registration Form
  const [user, setUser] = useState<{ username: string; email: string; grade?: string } | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(30); 
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { playSound } = useSoundEffects();

  // --- 1. Fetch Quiz Data ---
  useEffect(() => {
    const loadQuiz = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id);

      if (!error) setQuestions(data || []);
      setLoading(false);
    };
    loadQuiz();
    
    // Check if user is already remembered in this browser session
    const savedUser = sessionStorage.getItem("quiz_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [id]);

  // --- 2. Timer Logic ---
  useEffect(() => {
    // Only run timer if: User exists, Quiz isn't loading, Quiz isn't finished, and User hasn't answered yet
    if (!user || loading || isFinished || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, loading, isFinished, selectedAnswer, currentIndex]); // Added 'user' dependency

  const handleTimeUp = () => {
    setSelectedAnswer("TIMEOUT");
    setIsCorrect(false); 
    playSound('wrong');
    setTimeout(() => { nextQuestion(); }, 2500);
  };

  // --- 3. Database Sync (Save Score) ---
  useEffect(() => {
    if (isFinished && user) {
      const saveFinalScore = async () => {
        console.log("Saving score for:", user.username); // Debug log
        
        const { error } = await supabase
          .from('leaderboard')
          .insert([{ 
            username: user.username, 
            email: user.email, 
            score: score, 
            grade: user.grade || "General",
            quiz_id: id 
          }]);
          
        if (error) console.error("Score Sync Error:", error.message);
        else console.log("Score Saved Successfully!");
      };
      
      saveFinalScore();
      triggerConfetti();
      playSound('correct'); 
    }
  }, [isFinished, user, score, id, playSound]);

  // --- 4. Handlers ---
  const handleRegistrationComplete = (userData: any) => {
    // Save user to state and session
    setUser(userData);
    sessionStorage.setItem("quiz_user", JSON.stringify(userData));
    playSound('click');
  };

  const handleAnswerSelection = (option: string) => {
    if (selectedAnswer) return;

    const currentQ = questions[currentIndex];
    const correct = option === currentQ.correct_answer;
    
    setSelectedAnswer(option);
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setTimeout(() => { nextQuestion(); }, 2500);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null); 
      setIsCorrect(null);      
      setTimeLeft(30);         
    } else {
      setIsFinished(true);
    }
  };

  // --- 5. RENDER VIEWS ---

  // A. Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-emerald-800 font-bold animate-pulse">Loading Quiz...</p>
      </div>
    </div>
  );

  // B. Error State
  if (questions.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 text-red-500 font-bold">
      Quiz not found or invalid ID.
    </div>
  );

  // C. Registration Gate (The Fix!)
  // If we don't know who the user is yet, show the form instead of the quiz.
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100 p-4">
        <RegistrationForm onComplete={handleRegistrationComplete} />
      </main>
    );
  }

  // D. Results View
  if (isFinished) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-300 via-yellow-400 to-amber-500" />
          
          <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
            <Trophy className="w-12 h-12 text-amber-600 relative z-10" />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-full h-full border-2 border-dashed border-amber-300 rounded-full" 
            />
          </div>

          <h1 className="text-4xl font-extrabold text-emerald-950 mb-2">Mubarak!</h1>
          <p className="text-gray-500 font-medium">{user.username}, you completed the quiz.</p>
          
          <div className="my-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 relative">
            <Sparkles className="absolute -top-3 -right-3 text-amber-400 w-8 h-8 animate-bounce" />
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Final Score</p>
            <p className="text-7xl font-black text-emerald-900 leading-none tracking-tighter">
              {score}<span className="text-3xl text-emerald-300 font-bold">/{questions.length}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all">
              <RotateCcw className="w-5 h-5" /> Retake Quiz
            </button>
            <Link href="/" className="flex items-center justify-center gap-2 py-4 bg-white text-gray-600 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-all">
              <Home className="w-5 h-5" /> Go Home
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // E. Gameplay View
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-96 bg-emerald-600 rounded-b-[4rem] -z-10 shadow-2xl" />
      
      <div className="w-full max-w-xl z-10">
        <div className="flex justify-between items-center mb-8 text-white">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/50 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-sm border border-emerald-400/30">
              Q{currentIndex + 1} <span className="opacity-60">/ {questions.length}</span>
            </span>
          </div>
          
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold shadow-lg transition-all ${
            timeLeft <= 10 ? "bg-red-500 text-white animate-pulse shadow-red-500/30" : "bg-white text-emerald-800 shadow-emerald-900/10"
          }`}>
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? "text-white" : "text-emerald-500"}`} />
            <span className="tabular-nums">{timeLeft}s</span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-emerald-800/30 rounded-full mb-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </div>

        <QuestionCard 
          question={{
            id: questions[currentIndex].id,
            question: questions[currentIndex].question_text,
            options: questions[currentIndex].options,
            correctAnswer: questions[currentIndex].correct_answer,
            explanation: questions[currentIndex].explanation
          }}
          onAnswer={handleAnswerSelection}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
        />
      </div>
    </main>
  );
}