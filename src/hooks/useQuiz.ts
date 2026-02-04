import { useState } from 'react';
import questionsData from '@/lib/questions.json';

export const useQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questionsData[currentIndex];

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < questionsData.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questionsData.length,
    handleAnswer,
    score,
    isFinished
  };
};