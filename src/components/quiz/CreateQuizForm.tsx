"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, FileQuestion, CheckCircle2 } from "lucide-react";

export default function CreateQuizForm() {
  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: "",
      teacher_name: "",
      questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: "", explanation: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = async (data: any) => {
    // 1. Insert Quiz
    const { data: quiz, error: qError } = await supabase
      .from('quizzes')
      .insert([{ title: data.title, teacher_name: data.teacher_name }])
      .select().single();

    if (qError) return alert("Quiz Error: " + qError.message);

    // 2. Prepare Questions
    const formattedQuestions = data.questions.map((q: any) => ({
      quiz_id: quiz.id,
      ...q
    }));

    // 3. Insert Questions
    const { error: quesError } = await supabase.from('questions').insert(formattedQuestions);

    if (!quesError) {
      alert("Success! Quiz Created.");
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-400 to-teal-500" />
        <h2 className="text-3xl font-extrabold text-emerald-950 mb-6 flex items-center gap-3">
          <FileQuestion className="w-8 h-8 text-emerald-600" />
          Quiz Details
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Quiz Title</label>
            <input 
              {...register("title", { required: true })} 
              placeholder="e.g. The Golden Age of Islam" 
              // ADDED: text-gray-900 to force black text
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl transition-all font-bold text-lg text-gray-900 placeholder:text-gray-400 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Teacher Name</label>
            <input 
              {...register("teacher_name", { required: true })} 
              placeholder="e.g. Ustadh Ahmed" 
              // ADDED: text-gray-900 to force black text
              className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl transition-all font-medium text-lg text-gray-900 placeholder:text-gray-400 outline-none" 
            />
          </div>
        </div>
      </motion.div>

      {/* Questions List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {fields.map((field, index) => (
            <motion.div 
              key={field.id} 
              layout
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
            >
              {/* Question Number Badge */}
              <div className="absolute -left-3 top-6 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg text-sm z-10 border-4 border-emerald-50">
                {index + 1}
              </div>

              {/* Delete Button */}
              <button 
                type="button" 
                onClick={() => remove(index)}
                className="absolute right-4 top-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pl-4 space-y-5">
                <input 
                  {...register(`questions.${index}.question_text` as const, { required: true })} 
                  placeholder="Type your question here..." 
                  // ADDED: text-gray-900
                  className="w-full text-xl font-medium placeholder:text-gray-300 border-b-2 border-gray-100 focus:border-emerald-500 outline-none py-2 bg-transparent transition-colors text-gray-900" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((optIndex) => (
                    <div key={optIndex} className="relative group/opt">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <input 
                        {...register(`questions.${index}.options.${optIndex}` as const, { required: true })} 
                        placeholder={`Option ${optIndex + 1}`} 
                        // ADDED: text-gray-900
                        className="w-full pl-8 p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-300 outline-none text-sm transition-all text-gray-900 placeholder:text-gray-400" 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input 
                      {...register(`questions.${index}.correct_answer` as const, { required: true })} 
                      placeholder="Paste Correct Answer Here" 
                      // ADDED: text-emerald-900 for correct answer to verify visually
                      className="w-full pl-10 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl focus:border-emerald-500 outline-none text-sm text-emerald-900 placeholder:text-emerald-800/40 font-medium" 
                    />
                  </div>
                  <input 
                    {...register(`questions.${index}.explanation` as const)} 
                    placeholder="Explanation (Optional)" 
                    // ADDED: text-amber-900
                    className="w-full p-3 bg-amber-50/50 border border-amber-100 rounded-xl focus:border-amber-400 outline-none text-sm text-amber-900 placeholder:text-amber-800/40" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Action Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg border border-white/20 p-2 rounded-2xl shadow-2xl flex gap-2 z-50"
      >
        <button 
          type="button" 
          onClick={() => append({ question_text: "", options: ["", "", "", ""], correct_answer: "", explanation: "" })} 
          className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
        >
          {isSubmitting ? <span className="animate-spin">⏳</span> : <Save className="w-5 h-5" />}
          Save Quiz
        </button>
      </motion.div>
    </form>
  );
}