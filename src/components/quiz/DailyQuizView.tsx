/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Zap, 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Medal,
  Award,
  Crown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_QUIZ_QUESTIONS, INITIAL_LEADERBOARD } from '../../data/mockData';
import { AuthService } from '../../services/auth';

export const DailyQuizView: React.FC = () => {
  const { user, refreshUser, showToast, language } = useApp();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard'>('quiz');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const questions = INITIAL_QUIZ_QUESTIONS;
  const currentQ = questions[currentQIndex];

  const handleChoose = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswerIndex) {
      setScore(prev => prev + 10);
      if (user) {
        user.coins = (user.coins || 0) + 10;
        AuthService.saveUser(user);
        refreshUser();
      }
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (user) {
        user.streakDays = (user.streakDays || 1) + 1;
        AuthService.saveUser(user);
        refreshUser();
      }
      showToast(isHindi ? 'बधाई हो! आज का दैनिक क्विज पूरा हुआ।' : 'Daily Quiz Completed!', 'success');
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 pb-20 pt-2 max-w-3xl mx-auto">
      
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'quiz'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{isHindi ? 'दैनिक क्विज (Daily Quiz)' : 'Daily Quiz'}</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{isHindi ? 'लीडरबोर्ड (All India Rank)' : 'Leaderboard'}</span>
        </button>
      </div>

      {activeTab === 'quiz' ? (
        !isFinished ? (
          /* Active Quiz Card */
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header: Progress, Streak, Coins */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                  Question {currentQIndex + 1} / {questions.length}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                  {currentQ.subject}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <span className="flex items-center space-x-1 text-amber-500">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  <span>{user?.streakDays || 5}d Streak</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  +{score} Pts
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
              {isHindi ? currentQ.questionHindi : currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {(isHindi ? currentQ.optionsHindi : currentQ.options).map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isRight = idx === currentQ.correctAnswerIndex;

                let cardStyle = 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-orange-500/40';
                if (isAnswered) {
                  if (isRight) {
                    cardStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isRight) {
                    cardStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                  }
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleChoose(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-medium ${cardStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && isRight && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    {isAnswered && isSelected && !isRight && (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation reveal upon answering */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1 text-amber-900 dark:text-amber-200 animate-in fade-in">
                <span className="font-bold flex items-center space-x-1 text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>व्याख्या (Explanation):</span>
                </span>
                <p className="leading-relaxed">
                  {isHindi ? currentQ.explanationHindi : currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <span>{currentQIndex === questions.length - 1 ? (isHindi ? 'क्विज पूरा करें' : 'Finish Quiz') : (isHindi ? 'अगला प्रश्न' : 'Next Question')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        ) : (
          /* Finished Card */
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-5 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isHindi ? 'शानदार प्रदर्शन!' : 'Great Performance!'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'आपने आज का दैनिक क्विज सफलतापूर्वक पूरा कर लिया है।' : 'You have completed today\'s daily quiz challenge.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">अर्जित अंक</span>
                <span className="text-xl font-black text-orange-600">{score} Pts</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">स्ट्रीक रिवॉर्ड</span>
                <span className="text-xl font-black text-amber-500">+1 Day 🔥</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isHindi ? 'दोबारा खेलें' : 'Play Again'}</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-500/20"
              >
                <Trophy className="w-4 h-4" />
                <span>{isHindi ? 'लीडरबोर्ड देखें' : 'View Leaderboard'}</span>
              </button>
            </div>
          </div>
        )
      ) : (
        /* Leaderboard View */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-7 shadow-sm space-y-5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>{isHindi ? 'अखिल भारतीय दैनिक लीडरबोर्ड' : 'All India Top Scorers'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? 'दैनिक क्विज और मॉक टेस्ट में शीर्ष प्रदर्शन करने वाले मेधावी छात्र' : 'Top performing students across India'}
            </p>
          </div>

          <div className="space-y-2.5">
            {INITIAL_LEADERBOARD.map((item) => {
              let badgeColor = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
              if (item.rank === 1) badgeColor = 'bg-amber-400 text-slate-950 font-black shadow-sm';
              if (item.rank === 2) badgeColor = 'bg-slate-300 text-slate-900 font-black';
              if (item.rank === 3) badgeColor = 'bg-amber-700 text-white font-black';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${badgeColor}`}>
                      {item.rank}
                    </span>

                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20 shrink-0"
                    />

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {item.city} • {item.testsCompleted} {isHindi ? 'टेस्ट पूर्ण' : 'Tests'} • 🔥 {item.streak}d streak
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-orange-600 dark:text-orange-400 block">
                      {item.score} Pts
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Rank #{item.rank}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
