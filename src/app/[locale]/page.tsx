"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { motion } from "framer-motion";
import { Search, GraduationCap, Lock, ArrowRight, BookOpen, Trophy, Moon, Sunrise, Sun, Sunset, CloudMoon } from "lucide-react";

export default function LandingPage() {
  const [quizId, setQuizId] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<string>("");
  
  const router = useRouter();
  const params = useParams(); 

  // --- 1. Fetch Prayer Times & Date (Lucknow) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data for Lucknow, India (Method 1: Egyptian General Authority of Survey is commonly used, or 2 for ISNA)
        const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Lucknow&country=India&method=1&school=1");
        const data = await res.json();
        
        if (data.data) {
          setPrayerTimes(data.data.timings);
          
          // Format Hijri Date
          const hDate = data.data.date.hijri;
          setHijriDate(`${hDate.day} ${hDate.month.en} ${hDate.year}`);
          
          // Calculate Next Prayer logic could go here (simplified for now)
          setNextPrayer("Asr"); // Placeholder logic
        }
      } catch (error) {
        console.error("Failed to fetch Islamic data", error);
      }
    };

    fetchData();
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizId.trim()) {
      router.push(`/quiz/${quizId.trim()}`);
    }
  };

  // Helper for Prayer Cards
  const PrayerCard = ({ name, time, icon: Icon, isNext }: any) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
      isNext 
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 border-emerald-500" 
        : "bg-white/60 text-emerald-900 border-white/50 hover:bg-white"
    }`}>
      <Icon className={`w-6 h-6 mb-2 ${isNext ? "text-emerald-100" : "text-emerald-600"}`} />
      <span className="text-xs font-bold uppercase tracking-wider opacity-80">{name}</span>
      <span className="text-lg font-black">{time}</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-[conic-gradient(at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100 font-sans flex flex-col">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-emerald-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-160 h-160 bg-teal-300/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 pt-20 pb-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          {/* ISLAMIC DATE WIDGET */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-emerald-100 mb-8"
          >
            <Moon className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <span className="text-emerald-900 font-bold font-amiri text-lg pt-1">
              {hijriDate || "Loading Date..."}
            </span>
            <div className="h-4 w-px bg-emerald-200 mx-2" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Lucknow</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tight mb-6 leading-[1.1]">
            Test Your Knowledge. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
              Grow Your Faith.
            </span>
          </h1>
          
          {/* SEARCH BOX */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-white p-3 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 max-w-md mx-auto mb-16"
          >
            <form onSubmit={handleJoin} className="flex gap-2 relative">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Enter Quiz ID (e.g. A1B2)" 
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none transition-all font-bold text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <button 
                type="submit"
                className="bg-emerald-600 text-white px-8 py-2 rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20 group"
              >
                Start <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* PRAYER TIMES WIDGET */}
          {prayerTimes && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 max-w-5xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-emerald-900 font-bold flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-lg">
                    <Sun className="w-4 h-4 text-emerald-600" />
                  </div>
                  Daily Prayer Times
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  Updated Today
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                <PrayerCard name="Fajr" time={prayerTimes.Fajr} icon={CloudMoon} />
                <PrayerCard name="Dhuhr" time={prayerTimes.Dhuhr} icon={Sun} />
                <PrayerCard name="Asr" time={prayerTimes.Asr} icon={Sun} isNext={true} />
                <PrayerCard name="Maghrib" time={prayerTimes.Maghrib} icon={Sunset} />
                <PrayerCard name="Isha" time={prayerTimes.Isha} icon={Moon} />
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>

      {/* Footer Features */}
      <div className="bg-white/60 backdrop-blur-xl border-t border-emerald-100/50 p-10 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">
          
          <div className="flex items-center gap-5 justify-center md:justify-start group cursor-default">
            <div className="bg-orange-100 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <GraduationCap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">For Students</h3>
              <p className="text-sm text-gray-500 font-medium">Compete & track progress.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 justify-center md:justify-start group cursor-default">
            <div className="bg-blue-100 p-4 rounded-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">For Teachers</h3>
              <p className="text-sm text-gray-500 font-medium">Create quizzes & view results.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 justify-center md:justify-start group cursor-default">
            <div className="bg-purple-100 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Live Leaderboard</h3>
              <p className="text-sm text-gray-500 font-medium">See Lucknow's top scorers.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}