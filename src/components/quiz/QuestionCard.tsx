"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffects } from "@/hooks/useSounds";
import { CheckCircle2, XCircle, Lightbulb, ChevronRight } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  onAnswer: (option: string) => void;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

export default function QuestionCard({ 
  question, 
  onAnswer, 
  selectedAnswer, 
  isCorrect 
}: QuestionCardProps) {
  const { playSound } = useSoundEffects();

  const handlePress = (option: string) => {
    if (selectedAnswer !== null) return;
    playSound('click'); 
    onAnswer(option);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/10 border border-white/50 relative overflow-hidden">
          
          {/* Question Text */}
          <h2 className="text-2xl font-bold mb-8 text-gray-800 leading-snug">
            {question.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;
              
              // Logic for showing colors AFTER selection
              let borderColor = "border-gray-100";
              let bgColor = "bg-white";
              let textColor = "text-gray-600";
              let icon = null;

              if (selectedAnswer !== null) {
                if (isSelected) {
                  if (isCorrect) {
                    borderColor = "border-emerald-500";
                    bgColor = "bg-emerald-50";
                    textColor = "text-emerald-700";
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                  } else {
                    borderColor = "border-red-500";
                    bgColor = "bg-red-50";
                    textColor = "text-red-700";
                    icon = <XCircle className="w-5 h-5 text-red-500" />;
                  }
                } else if (isCorrectOption && !isCorrect) {
                  // Show correct answer if user got it wrong
                  borderColor = "border-emerald-500";
                  bgColor = "bg-emerald-50/50";
                  icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-50" />;
                } else {
                  // Fade out unselected options
                  textColor = "text-gray-300";
                }
              }

              return (
                <motion.button
                  key={option}
                  whileHover={selectedAnswer === null ? { scale: 1.02, x: 4 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  onClick={() => handlePress(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all flex justify-between items-center group relative overflow-hidden ${borderColor} ${bgColor} ${textColor}`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      selectedAnswer === null ? "bg-gray-100 text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600" : "bg-transparent border border-current"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>
                  {icon || (selectedAnswer === null && <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-400 transition-colors" />)}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Box */}
          <AnimatePresence>
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 flex gap-4">
                  <div className="bg-amber-100 p-2 rounded-xl h-fit">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Did you know?</h4>
                    <p className="text-sm text-amber-900/80 leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}