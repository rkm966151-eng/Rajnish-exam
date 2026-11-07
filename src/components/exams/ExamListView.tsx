/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckSquare, Clock, Award, Users, AlertCircle, ArrowRight, Play, History, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';

export const ExamListView: React.FC = () => {
  const { exams, user, navigateTo, language } = useApp();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');
  const userAttempts = StorageService.getAttempts(user?.id);

  return (
    <div className="space-y-6 pb-20 pt-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            📝 {isHindi ? 'ऑनलाइन मॉक टेस्ट एवं परीक्षा केंद्र' : 'Online Mock Tests & CBT Exams'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isHindi 
              ? 'वास्तविक परीक्षा पैटर्न, नेगेटिव मार्किंग, टाइमर एवं ऑल इंडिया रैंक' 
              : 'Real exam simulator with timer, negative marking, percentile and All India Rank'}
          </p>
        </div>

        {/* Tab Switcher: Available Tests vs Previous Attempts */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'available'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {isHindi ? 'उपलब्ध मॉक टेस्ट' : 'Available Tests'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {isHindi ? 'मेरे प्रयास (History)' : 'My Attempts'}
          </button>
        </div>
      </div>

      {activeTab === 'available' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                    {exam.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span>{isHindi ? 'लाइव उपलब्ध' : 'Live Available'}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isHindi && exam.titleHindi ? exam.titleHindi : exam.title}
                </h3>

                {/* Exam Key Parameters */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{isHindi ? 'कुल प्रश्न' : 'Questions'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{exam.totalQuestions} MCQs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{isHindi ? 'समय' : 'Duration'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{exam.durationMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">{isHindi ? 'पूर्णांक' : 'Marks'}</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+{exam.totalMarks} M</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isHindi ? `नेगेटिव मार्किंग: -${exam.negativeMarkingRate} अंक प्रति गलत उत्तर` : `Negative Marking: -${exam.negativeMarkingRate} marks`}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  👥 {exam.attemptsCount.toLocaleString()}+ {isHindi ? 'छात्र दे चुके हैं' : 'Aspirants'}
                </span>

                <button
                  onClick={() => navigateTo('exam-interface', { examId: exam.id })}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isHindi ? 'टेस्ट शुरू करें' : 'Start Mock Test'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* History of Attempts */
        <div className="space-y-3">
          {userAttempts.length > 0 ? (
            userAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      सटीकता: {attempt.accuracy}%
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">
                    {attempt.examTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    प्राप्तांक: <strong className="text-orange-600">{attempt.score.toFixed(1)}</strong> / {attempt.maxScore} • सही: {attempt.correctCount} • गलत: {attempt.incorrectCount}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('exam-result', { attemptId: attempt.id })}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-orange-600 font-bold text-xs flex items-center justify-center space-x-1.5 self-start sm:self-auto"
                >
                  <Award className="w-4 h-4" />
                  <span>{isHindi ? 'स्कोरकार्ड व हल देखें' : 'View Detailed Result'}</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
              <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                {isHindi ? 'अभी तक कोई टेस्ट नहीं दिया गया है' : 'No test attempts yet'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? 'अपनी तैयारी की जांच के लिए उपलब्ध टेस्टों में से कोई एक टेस्ट दें।' : 'Attempt any test to see your performance scorecard.'}
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                {isHindi ? 'टेस्ट सूची देखें' : 'View Tests'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
