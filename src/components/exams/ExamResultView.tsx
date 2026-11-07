/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowLeft, 
  RotateCcw, 
  Share2, 
  Download, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen,
  Languages
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';

export const ExamResultView: React.FC = () => {
  const { routeParams, exams, goBack, navigateTo, showToast, language } = useApp();
  const isHindi = language === 'hi';

  const attemptId = routeParams.attemptId;
  const attempts = StorageService.getAttempts();
  const attempt = attempts.find(a => a.id === attemptId) || attempts[0];

  const exam = exams.find(e => e.id === attempt?.examId) || exams[0];

  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [solLang, setSolLang] = useState<'hi' | 'en'>(language === 'hi' ? 'hi' : 'en');

  if (!attempt || !exam) {
    return (
      <div className="p-8 text-center space-y-3">
        <p>No result found</p>
        <button onClick={() => navigateTo('exams')} className="px-4 py-2 bg-orange-600 text-white rounded-xl">Back to Tests</button>
      </div>
    );
  }

  const isPass = (attempt.score / attempt.maxScore) * 100 >= (exam.passPercentage || 60);

  const filteredQuestions = exam.questions.filter((q) => {
    const userSelected = attempt.userAnswers[q.id];
    const isCorrect = userSelected === q.correctOptionId;
    const isUnanswered = !userSelected;

    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return userSelected && !isCorrect;
    if (filterMode === 'unanswered') return isUnanswered;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 pt-2 max-w-4xl mx-auto">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('exams')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'सभी टेस्ट सूची' : 'All Tests'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSolLang(prev => (prev === 'hi' ? 'en' : 'hi'))}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1"
          >
            <Languages className="w-4 h-4 text-orange-500" />
            <span>{solLang === 'hi' ? 'English Solutions' : 'हिंदी व्याख्या'}</span>
          </button>
        </div>
      </div>

      {/* Hero Scorecard Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm text-center relative overflow-hidden space-y-6">
        
        {/* Pass/Fail Status Banner */}
        <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
          <Award className="w-4 h-4" />
          <span>{isPass ? (isHindi ? 'परीक्षा उत्तीर्ण (QUALIFIED)' : 'QUALIFIED') : (isHindi ? 'पुनः प्रयास आवश्यक' : 'NEEDS PRACTICE')}</span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {attempt.examTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            प्रयास तिथि: {new Date(attempt.completedAt).toLocaleString()}
          </p>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {attempt.score.toFixed(1)}
          </span>
          <span className="text-lg font-bold text-slate-400">/ {attempt.maxScore}</span>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">{isHindi ? 'ऑल इंडिया रैंक' : 'Rank'}</span>
            <div className="text-base sm:text-lg font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">
              #{attempt.rank || 12} <span className="text-xs text-slate-400">/ {attempt.totalParticipants || 1840}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">{isHindi ? 'सटीकता (Accuracy)' : 'Accuracy'}</span>
            <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {attempt.accuracy}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">{isHindi ? 'सही / गलत' : 'Correct/Wrong'}</span>
            <div className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
              <span className="text-emerald-600">{attempt.correctCount}</span> / <span className="text-rose-500">{attempt.incorrectCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">{isHindi ? 'लिया गया समय' : 'Time Taken'}</span>
            <div className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
              {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigateTo('exam-interface', { examId: exam.id })}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isHindi ? 'पुनः टेस्ट दें (Re-Attempt)' : 'Re-Attempt Test'}</span>
          </button>
        </div>
      </div>

      {/* Detailed Solutions & Question-by-Question Review */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              🔍 {isHindi ? 'विस्तृत प्रश्नवार हल एवं व्याख्या' : 'Detailed Question Solutions'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? 'प्रत्येक प्रश्न का सही उत्तर एवं आसान भाषा में व्याख्या' : 'Correct answers & comprehensive step-by-step explanations'}
            </p>
          </div>

          {/* Filter questions by outcome */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg ${filterMode === 'all' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-sm' : 'text-slate-500'}`}
            >
              सभी ({exam.questions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg ${filterMode === 'correct' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              सही ({attempt.correctCount})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg ${filterMode === 'incorrect' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-500'}`}
            >
              गलत ({attempt.incorrectCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, qIndex) => {
            const userSelectedId = attempt.userAnswers[q.id];
            const isCorrect = userSelectedId === q.correctOptionId;
            const isSkipped = !userSelectedId;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-4"
              >
                {/* Question Status Banner */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                  <span className="font-bold text-xs text-slate-500">
                    Question #{qIndex + 1} • {q.subject}
                  </span>

                  <div>
                    {isSkipped ? (
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        छोड़ दिया (Skipped)
                      </span>
                    ) : isCorrect ? (
                      <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>सही उत्तर (+{q.marks})</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <XCircle className="w-3 h-3" />
                        <span>गलत उत्तर (-{q.negativeMarks})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {solLang === 'hi' ? q.questionTextHindi : q.questionText}
                </h3>

                {/* Options List with outcome colors */}
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isUserChoice = userSelectedId === opt.id;
                    const isRightOption = opt.id === q.correctOptionId;
                    const optLetter = String.fromCharCode(65 + oIdx);

                    let cardClass = 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700';
                    let badgeClass = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                    if (isRightOption) {
                      cardClass = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold';
                      badgeClass = 'bg-emerald-600 text-white';
                    } else if (isUserChoice && !isRightOption) {
                      cardClass = 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-950 dark:text-rose-200';
                      badgeClass = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-xs sm:text-sm ${cardClass}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}>
                            {optLetter}
                          </span>
                          <span>{solLang === 'hi' ? opt.textHindi : opt.text}</span>
                        </div>

                        {isRightOption && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                            ✓ सही उत्तर (Correct)
                          </span>
                        )}
                        {isUserChoice && !isRightOption && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase">
                            ✗ आपका उत्तर (Your Answer)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Explanation Box */}
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5 text-amber-950 dark:text-amber-200">
                  <div className="flex items-center space-x-1.5 font-extrabold text-amber-800 dark:text-amber-300">
                    <BookOpen className="w-4 h-4" />
                    <span>विस्तृत समाधान (Detailed Explanation):</span>
                  </div>
                  <p className="leading-relaxed">
                    {solLang === 'hi' ? q.explanationHindi : q.explanation}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
