"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, GraduationCap, ArrowRight, BookOpen, Trophy, 
  Moon, Sun, CloudMoon, Sunset, Sparkles, Quote, Repeat 
} from "lucide-react";

// --- Static Data for "Daily Wisdom" ---
const WISDOMS = [
  { text: "The best among you is the one who learns the Quran and teaches it.", source: "Prophet Muhammad (ﷺ)" },
  { text: "So verily, with the hardship, there is relief.", source: "Quran 94:5" },
  { text: "Kindness is a mark of faith, and whoever has not kindness has not faith.", source: "Prophet Muhammad (ﷺ)" },
  { text: "Allah does not burden a soul beyond that it can bear.", source: "Quran 2:286" },
  { text: "Speak good or remain silent.", source: "Prophet Muhammad (ﷺ)" }
];

export default function LandingPage() {
  const [quizId, setQuizId] = useState("");
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [wisdom, setWisdom] = useState(WISDOMS[0]);
  const [tasbihCount, setTasbihCount] = useState(0);
  
  const router = useRouter();

  // --- 1. Fetch Data & Calculate Logic ---
  useEffect(() => {
    // Randomize Wisdom on mount
    setWisdom(WISDOMS[Math.floor(Math.random() * WISDOMS.length)]);

    const fetchData = async () => {
      try {
        // Fetch Lucknow Data
        const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Lucknow&country=India&method=1&school=1");
        const data = await res.json();
        
        if (data.data) {
          const timings = data.data.timings;
          setPrayerTimes(timings);
          
          // Format Date
          const hDate = data.data.date.hijri;
          setHijriDate(`${hDate.day} ${hDate.month.en} ${hDate.year}`);
          
          // Calculate Next Prayer Real-time
          calculateNextPrayer(timings);
        }
      } catch (error) {
        console.error("Failed to fetch Islamic data", error);
      }
    };

    fetchData();
  }, []);

  // Helper: Find which prayer is next based on current time
  const calculateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const prayer of prayers) {
      const [hours, mins] = timings[prayer].split(':').map(Number);
      const prayerMinutes = hours * 60 + mins;
      
      if (prayerMinutes > currentMinutes) {
        setNextPrayer(prayer);
        return;
      }
    }
    setNextPrayer('Fajr'); // If all passed, next is Fajr tomorrow
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizId.trim()) router.push(`/quiz/${quizId.trim()}`);
  };

  // --- Components ---

  const PrayerCard = ({ name, time, icon: Icon }: any) => {
    const isNext = nextPrayer === name;
    
    return (
      <motion.div 
        whileHover={{ y: -5 }}
        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all overflow-hidden ${
          isNext 
            ? "bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/30 border-emerald-500" 
            : "bg-white/60 text-emerald-900 border-white/50 hover:bg-white"
        }`}
      >
        {isNext && (
          <div className="absolute top-0 right-0 p-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </div>
        )}
        <Icon className={`w-6 h-6 mb-2 ${isNext ? "text-emerald-100" : "text-emerald-600"}`} />
        <span className={`text-xs font-bold uppercase tracking-wider ${isNext ? "text-emerald-100" : "opacity-60"}`}>{name}</span>
        <span className="text-lg font-black">{time}</span>
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-emerald-100 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* --- Animated Background Elements --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-200 h-200 bg-emerald-400/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute top-[20%] -right-[10%] w-160 h-160 bg-teal-400/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col items-center p-6 relative z-10 pt-12 pb-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl w-full space-y-12"
        >
          
          {/* 1. Header & Hijri Badge */}
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-5 py-2 rounded-full shadow-sm border border-emerald-100/50"
            >
              <Moon className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-emerald-900 font-bold font-amiri text-lg pt-1">
                {hijriDate || "Loading Date..."}
              </span>
              <span className="w-px h-4 bg-emerald-200 mx-2" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Lucknow</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tight leading-[1.1]">
              Test Your Knowledge.<br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
                Grow Your Faith.
              </span>
            </h1>
          </div>

          {/* 2. Interactive Search Box */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-white p-2 rounded-4xl shadow-2xl shadow-emerald-900/10 border border-emerald-50 max-w-lg mx-auto"
          >
            <form onSubmit={handleJoin} className="flex gap-2 relative">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Enter Quiz ID (e.g. A1B2)" 
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-3xl bg-transparent border-none focus:ring-0 font-bold text-gray-800 placeholder:text-gray-400 text-lg"
                />
              </div>
              <button 
                type="submit"
                className="bg-emerald-600 text-white px-8 py-3 rounded-3xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20 group"
              >
                Start <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* 3. Interactive Widgets Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Widget A: Prayer Times */}
            <div className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <span className="bg-emerald-100 p-2 rounded-xl"><Sun className="w-5 h-5 text-emerald-600" /></span>
                  Prayer Times
                </h3>
                {nextPrayer && (
                  <span className="text-xs font-bold text-white bg-emerald-500 px-3 py-1 rounded-full animate-pulse">
                    Next: {nextPrayer}
                  </span>
                )}
              </div>
              
              {prayerTimes ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <PrayerCard name="Fajr" time={prayerTimes.Fajr} icon={CloudMoon} />
                  <PrayerCard name="Dhuhr" time={prayerTimes.Dhuhr} icon={Sun} />
                  <PrayerCard name="Asr" time={prayerTimes.Asr} icon={Sun} />
                  <PrayerCard name="Maghrib" time={prayerTimes.Maghrib} icon={Sunset} />
                  <PrayerCard name="Isha" time={prayerTimes.Isha} icon={Moon} />
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-emerald-800/50 font-bold animate-pulse">Loading Prayers...</div>
              )}
            </div>

            {/* Widget B: Interactive Tasbih & Wisdom */}
            <div className="space-y-6">
              
              {/* Tasbih Counter */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setTasbihCount(prev => prev + 1)}
                className="w-full bg-linear-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden group text-left"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Repeat className="w-24 h-24 rotate-12" />
                </div>
                <div className="relative z-10">
                  <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1">Digital Tasbih</p>
                  <p className="text-5xl font-black tabular-nums">{tasbihCount}</p>
                  <p className="text-emerald-100/80 text-xs mt-2 font-medium">Tap to count Dhikr</p>
                </div>
              </motion.button>

              {/* Daily Wisdom */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 relative">
                <Quote className="w-8 h-8 text-emerald-100 absolute top-4 right-4 rotate-180" />
                <p className="text-emerald-950 font-medium italic leading-relaxed mb-3 pr-4">
                  "{wisdom.text}"
                </p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  — {wisdom.source}
                </p>
              </div>

            </div>
          </div>

        </motion.div>
      </div>

      {/* --- Footer Stats --- */}
      <div className="bg-white/40 backdrop-blur-md border-t border-emerald-100/30 p-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between gap-8 text-center md:text-left opacity-80">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-emerald-900 text-sm">Student Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-emerald-900 text-sm">Curriculum Based</span>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-emerald-900 text-sm">Live Rankings</span>
          </div>
        </div>
      </div>
    </main>
  );
}