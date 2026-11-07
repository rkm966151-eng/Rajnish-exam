/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Languages, 
  X,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { ExamAttempt } from '../../types';

export const ExamInterface: React.FC = () => {
  const { routeParams, exams, user, navigateTo, goBack, showToast, language } = useApp();
  
  const examId = routeParams.examId || exams[0]?.id;
  const exam = exams.find((e) => e.id === examId) || exams[0];

  const [questionLang, setQuestionLang] = useState<'hi' | 'en'>(language === 'hi' ? 'hi' : 'en');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  
  // State maps:
  // answers: questionId -> optionId
  // reviewed: Set of questionIds marked for review
  // visited: Set of questionIds visited
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set([exam?.questions[0]?.id || '']));

  // Timer: durationMinutes * 60
  const [timeLeft, setTimeLeft] = useState<number>((exam?.durationMinutes || 30) * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmitExam(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="p-8 text-center space-y-3">
        <p>No questions found in this test.</p>
        <button onClick={goBack} className="px-4 py-2 bg-orange-600 text-white rounded-xl">Back</button>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setReviewed((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setVisited((prev) => new Set(prev).add(exam.questions[nextIdx].id));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisited((prev) => new Set(prev).add(exam.questions[index].id));
  };

  const handleSubmitExam = (auto: boolean = false) => {
    setIsSubmitted(true);
    setIsSubmitModalOpen(false);

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    exam.questions.forEach((q) => {
      const selected = answers[q.id];
      if (!selected) {
        unanswered++;
      } else if (selected === q.correctOptionId) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const marksPerQ = exam.totalMarks / exam.totalQuestions;
    const score = Math.max(0, (correct * marksPerQ) - (incorrect * exam.negativeMarkingRate));
    const totalAttempted = correct + incorrect;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    const timeSpent = (exam.durationMinutes * 60) - timeLeft;

    const attempt: ExamAttempt = {
      id: 'attempt_' + Date.now(),
      examId: exam.id,
      examTitle: exam.titleHindi || exam.title,
      userId: user?.id || 'guest',
      userName: user?.name || 'Student',
      score,
      maxScore: exam.totalMarks,
      correctCount: correct,
      incorrectCount: incorrect,
      unansweredCount: unanswered,
      accuracy,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      userAnswers: answers,
      rank: Math.floor(1 + Math.random() * 45),
      totalParticipants: 1840,
    };

    StorageService.saveAttempt(attempt);

    showToast(auto ? 'समय समाप्त! टेस्ट स्वतः सबमिट हो गया।' : 'टेस्ट सफलतापूर्वक सबमिट हो गया!', 'success');
    navigateTo('exam-result', { attemptId: attempt.id });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 300; // < 5 mins

  const answeredCount = Object.keys(answers).length;
  const reviewedCount = reviewed.size;
  const unansweredCount = exam.totalQuestions - answeredCount;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20 pt-1 -mx-4 sm:mx-0">
      
      {/* Top Fixed CBT Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
            {questionLang === 'hi' ? exam.titleHindi : exam.title}
          </h2>
          <span className="text-[10px] text-slate-500">
            प्रश्न {currentQuestionIndex + 1} / {exam.totalQuestions} • विषय: {currentQ.subject}
          </span>
        </div>

        {/* Timer Badge */}
        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold shadow-sm ${
          isTimeCritical 
            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
        }`}>
          <Clock className="w-4 h-4 text-orange-500" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>

        {/* Right Actions: Lang toggle & Submit Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuestionLang(prev => (prev === 'hi' ? 'en' : 'hi'))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center space-x-1"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-orange-500" />
            <span>{questionLang === 'hi' ? 'EN' : 'हिं'}</span>
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">सबमिट करें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: Current Question & Options (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Question Header & Marks */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <span className="font-bold text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Question #{currentQuestionIndex + 1}
              </span>
              <div className="text-xs font-semibold flex items-center space-x-2">
                <span className="text-emerald-600 dark:text-emerald-400">+{currentQ.marks} Marks</span>
                <span className="text-rose-500">-{currentQ.negativeMarks} Marks</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {questionLang === 'hi' ? currentQ.questionTextHindi : currentQ.questionText}
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === opt.id;
                const optLetter = String.fromCharCode(65 + oIdx);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3.5 ${
                      isSelected
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-orange-500/40'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {optLetter}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-orange-950 dark:text-orange-100 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {questionLang === 'hi' ? opt.textHindi : opt.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions for current question */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearResponse}
                  disabled={!answers[currentQ.id]}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
                >
                  उत्तर हटाएं (Clear)
                </button>

                <button
                  onClick={handleToggleReview}
                  className={`px-3 py-2 rounded-xl border flex items-center space-x-1.5 transition-colors ${
                    reviewed.has(currentQ.id)
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>रिव्यू के लिए मार्क करें</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center space-x-1 shadow-sm"
                >
                  <span>सेव व अगला</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Question Palette & Legend (Span 1) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Question Palette (प्रश्नों की स्थिति)
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-[9px]">✓</span>
                <span>उत्तर दिया ({answeredCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-purple-500 text-white flex items-center justify-center font-bold text-[9px]">★</span>
                <span>रिव्यू ({reviewedCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-[9px]">○</span>
                <span>बिना उत्तर ({unansweredCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-md border-2 border-orange-500 flex items-center justify-center font-bold text-[9px]">▶</span>
                <span>वर्तमान प्रश्न</span>
              </div>
            </div>

            {/* Questions Number Grid */}
            <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              {exam.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answers[q.id];
                const isRev = reviewed.has(q.id);

                let bgClass = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
                if (isAnswered) {
                  bgClass = 'bg-emerald-500 text-white font-bold';
                } else if (isRev) {
                  bgClass = 'bg-purple-500 text-white font-bold';
                }

                if (isCurrent) {
                  bgClass += ' ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-800';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-xl flex items-center justify-center text-xs transition-all ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all mt-3"
            >
              <Send className="w-4 h-4" />
              <span>परीक्षा अंतिम सबमिट करें</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-orange-600 dark:text-orange-400">
              <ShieldCheck className="w-8 h-8" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                परीक्षा सबमिट करने की पुष्टि करें
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              क्या आप सचमुच परीक्षा समाप्त करना चाहते हैं? सबमिट करने के बाद आप उत्तर नहीं बदल सकेंगे।
            </p>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">उत्तर दिया</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">छोड़ा गया</span>
                <span className="text-base font-extrabold text-rose-500">{unansweredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">रिव्यू मार्क</span>
                <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">{reviewedCount}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                परीक्षा जारी रखें
              </button>
              <button
                onClick={() => handleSubmitExam(false)}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20"
              >
                हाँ, सबमिट करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
