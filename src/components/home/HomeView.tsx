/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Zap, 
  Flame, 
  Calendar, 
  Award, 
  ArrowRight, 
  PlayCircle, 
  Download, 
  Star, 
  Users, 
  Clock, 
  Sparkles, 
  ChevronRight,
  ShieldAlert,
  BellRing,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';

export const HomeView: React.FC = () => {
  const { user, courses, exams, materials, settings, navigateTo, openPayment, language } = useApp();
  const isHindi = language === 'hi';

  const announcements = StorageService.getAnnouncements();

  // Daily Goals State (stored locally)
  const [dailyGoals, setDailyGoals] = useState({
    videoWatched: true,
    testAttempted: false,
    quizPlayed: true,
  });

  const completedGoalsCount = Object.values(dailyGoals).filter(Boolean).length;
  const goalPercent = Math.round((completedGoalsCount / 3) * 100);

  const featuredCourses = courses.filter(c => c.isFeatured);
  const popularCourses = courses.filter(c => c.isPopular);

  // Recent video to continue
  const continueCourse = courses[0];
  const continueLesson = continueCourse?.lessons[0];

  return (
    <div className="space-y-6 pb-20 pt-2">
      
      {/* Notice Marquee Ticker */}
      {settings.showBannerNotice && settings.bannerNotice && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white px-3 py-2 rounded-2xl shadow-sm flex items-center space-x-2 text-xs overflow-hidden">
          <div className="flex items-center space-x-1 font-extrabold uppercase shrink-0 bg-black/20 px-2 py-0.5 rounded-full text-[10px]">
            <BellRing className="w-3 h-3 text-amber-200" />
            <span>{isHindi ? 'सूचना' : 'Notice'}</span>
          </div>
          <div className="overflow-x-auto whitespace-nowrap scrollbar-none font-medium flex-1">
            <span className="inline-block animate-marquee">{settings.bannerNotice}</span>
          </div>
        </div>
      )}

      {/* Hero Welcome & Streak Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-5 sm:p-7 text-white shadow-xl border border-orange-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isHindi ? 'भारत का नं. 1 प्रतियोगी परीक्षा मंच' : '#1 Competitive Exam Hub'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isHindi ? `नमस्ते, ${user ? user.name : 'विद्यार्थी'}!` : `Welcome, ${user ? user.name : 'Aspirant'}!`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHindi 
                ? 'सरकारी नौकरी के अपने सपने को पूरा करें। आज ही लाइव कक्षाएं, टेस्ट सीरीज और हस्तलिखित नोट्स से शुरुआत करें।' 
                : 'Turn your aspirations into reality with structured lectures, rigorous mock exams, and premium study materials.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {/* Streak Counter */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center min-w-[90px]">
              <div className="flex items-center justify-center space-x-1 text-amber-400 font-black text-lg">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{user?.streakDays || 5}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                {isHindi ? 'दिन की स्ट्रीक' : 'Day Streak'}
              </p>
            </div>

            {/* Coins */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center min-w-[90px]">
              <div className="text-amber-300 font-black text-lg">
                🪙 {user?.coins || 120}
              </div>
              <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                {isHindi ? 'रिवॉर्ड कॉइन्स' : 'RF Coins'}
              </p>
            </div>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Access Action Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isHindi ? 'त्वरित पहुंच (Quick Actions)' : 'Quick Access'}
          </h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
          
          <button
            onClick={() => navigateTo('courses')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
              {isHindi ? 'कोर्सेज' : 'Courses'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('exams')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
              {isHindi ? 'मॉक टेस्ट' : 'Exams'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('materials')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
              {isHindi ? 'पीडीएफ नोट्स' : 'PDF Notes'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('quiz')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
              {isHindi ? 'डेली क्विज' : 'Quiz'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('timetable')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
              {isHindi ? 'टाइमटेबल' : 'Timetable'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('subscription')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 text-center">
              {isHindi ? 'वीआईपी पास' : 'VIP Pass'}
            </span>
          </button>
        </div>
      </div>

      {/* Continue Learning Section */}
      {continueLesson && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/30 dark:border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center space-x-1">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{isHindi ? 'पढ़ाई जारी रखें (Continue Learning)' : 'Continue Learning'}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">65% पूर्ण</span>
          </div>

          <div 
            onClick={() => navigateTo('video-player', { courseId: continueCourse.id, lessonId: continueLesson.id })}
            className="flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                <img
                  src={continueLesson.thumbnail || continueCourse.thumbnail}
                  alt={continueLesson.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {isHindi && continueLesson.titleHindi ? continueLesson.titleHindi : continueLesson.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {continueCourse.titleHindi || continueCourse.title} • {continueLesson.duration}
                </p>
              </div>
            </div>

            <button className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 shadow-sm flex items-center space-x-1">
              <span>{isHindi ? 'देखें' : 'Resume'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full w-[65%]" />
          </div>
        </div>
      )}

      {/* Daily Learning Goals Interactive Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>🎯 {isHindi ? 'आज के दैनिक लक्ष्य' : "Today's Daily Target"}</span>
              <span className="text-[11px] bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">
                {goalPercent}%
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isHindi ? 'दैनिक लक्ष्य पूरे करें और +50 बोनस कॉइन्स पाएं' : 'Complete targets to earn streak and 50 bonus coins'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-orange-500/20 border-t-orange-500 flex items-center justify-center font-bold text-xs text-orange-600 dark:text-orange-400">
            {completedGoalsCount}/3
          </div>
        </div>

        <div className="space-y-2">
          {/* Goal 1 */}
          <div 
            onClick={() => setDailyGoals(prev => ({ ...prev, videoWatched: !prev.videoWatched }))}
            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
              dailyGoals.videoWatched 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2.5 text-xs font-semibold">
              <span className={dailyGoals.videoWatched ? 'line-through opacity-70' : ''}>
                📹 {isHindi ? 'कम से कम 30 मिनट वीडियो क्लास देखें' : 'Watch 30 mins video lecture'}
              </span>
            </div>
            <input type="checkbox" checked={dailyGoals.videoWatched} readOnly className="rounded text-orange-600" />
          </div>

          {/* Goal 2 */}
          <div 
            onClick={() => {
              setDailyGoals(prev => ({ ...prev, testAttempted: !prev.testAttempted }));
              if (!dailyGoals.testAttempted) navigateTo('exams');
            }}
            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
              dailyGoals.testAttempted 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2.5 text-xs font-semibold">
              <span className={dailyGoals.testAttempted ? 'line-through opacity-70' : ''}>
                📝 {isHindi ? '1 फुल लेंथ मॉक टेस्ट हल करें' : 'Attempt 1 full length mock test'}
              </span>
            </div>
            <input type="checkbox" checked={dailyGoals.testAttempted} readOnly className="rounded text-orange-600" />
          </div>

          {/* Goal 3 */}
          <div 
            onClick={() => {
              setDailyGoals(prev => ({ ...prev, quizPlayed: !prev.quizPlayed }));
              if (!dailyGoals.quizPlayed) navigateTo('quiz');
            }}
            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
              dailyGoals.quizPlayed 
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2.5 text-xs font-semibold">
              <span className={dailyGoals.quizPlayed ? 'line-through opacity-70' : ''}>
                ⚡ {isHindi ? 'दैनिक जीके व जीएस क्विज में भाग लें' : 'Play daily GK & Science quiz'}
              </span>
            </div>
            <input type="checkbox" checked={dailyGoals.quizPlayed} readOnly className="rounded text-orange-600" />
          </div>
        </div>
      </div>

      {/* Featured Courses Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              🔥 {isHindi ? 'लोकप्रिय एवं ट्रेंडिंग कोर्सेज' : 'Trending Courses'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'सैकड़ों सफल अभ्यर्थियों की पहली पसंद' : 'Trusted by thousands of successful aspirants'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('courses')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center space-x-1"
          >
            <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredCourses.map((course) => {
            const isEnrolled = user?.enrolledCourseIds.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {course.category}
                      </span>
                      {course.isFree && (
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                          100% FREE
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span>{course.totalDuration}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-[11px] text-amber-500 font-bold">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-slate-800 dark:text-slate-200">{course.rating}</span>
                      </div>
                      <span className="text-slate-400">({course.reviewCount.toLocaleString()}+ समीक्षाएं)</span>
                    </div>

                    <h3 
                      onClick={() => navigateTo('course-detail', { courseId: course.id })}
                      className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      {isHindi && course.titleHindi ? course.titleHindi : course.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {isHindi && course.descriptionHindi ? course.descriptionHindi : course.description}
                    </p>

                    <div className="flex items-center space-x-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-medium truncate">{course.instructorName}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    {course.isFree ? (
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">निःशुल्क (FREE)</span>
                    ) : (
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-black text-slate-900 dark:text-white">₹{course.price}</span>
                        <span className="text-xs line-through text-slate-400">₹{course.originalPrice}</span>
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigateTo('course-detail', { courseId: course.id })}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <span>{isHindi ? 'क्लास देखें' : 'View Course'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (course.isFree) {
                          navigateTo('course-detail', { courseId: course.id });
                        } else {
                          openPayment({ type: 'course', item: course });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1"
                    >
                      <span>{course.isFree ? (isHindi ? 'अभी शुरू करें' : 'Start Free') : (isHindi ? 'नामांकन करें' : 'Enroll Now')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Mock Tests & Quizzes Highlight */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
              {isHindi ? 'लाइव परीक्षा केंद्र' : 'CBT Exam Simulator'}
            </span>
            <h2 className="text-base sm:text-lg font-black mt-1">
              {isHindi ? 'अखिल भारतीय फ्री टेस्ट सीरीज' : 'All-India Free Mock Test Series'}
            </h2>
            <p className="text-xs text-blue-200">
              {isHindi ? 'नेगेटिव मार्किंग, टाइमर और विस्तृत समाधान के साथ वास्तविक परीक्षा जैसा अनुभव।' : 'Exact real exam pattern with timer, negative marking and rank.'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('exams')}
            className="px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shrink-0 shadow-md transition-all"
          >
            {isHindi ? 'टेस्ट दें' : 'Take Test'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {exams.slice(0, 2).map((exam) => (
            <div
              key={exam.id}
              onClick={() => navigateTo('exam-interface', { examId: exam.id })}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs line-clamp-1">
                  {isHindi && exam.titleHindi ? exam.titleHindi : exam.title}
                </h4>
                <p className="text-[11px] text-blue-200">
                  {exam.totalQuestions} प्रश्न • {exam.durationMinutes} मिनट • +{exam.totalMarks} अंक
                </p>
              </div>
              <span className="text-xs font-bold text-amber-300">
                {isHindi ? 'प्रारंभ ➔' : 'Start ➔'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent PDF Materials Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              📑 {isHindi ? 'नवीनतम हस्तलिखित नोट्स व ई-बुक्स' : 'Handwritten Notes & PDFs'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'बिना इंटरनेट के कभी भी रिवीजन करने के लिए' : 'Downloadable for quick offline revision'}
            </p>
          </div>
          <button
            onClick={() => navigateTo('materials')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center space-x-1"
          >
            <span>{isHindi ? 'लाइब्रेरी खोलें' : 'View Library'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {materials.slice(0, 2).map((mat) => (
            <div
              key={mat.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  PDF
                </div>
                <div>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    {mat.subject}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {isHindi && mat.titleHindi ? mat.titleHindi : mat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {mat.pages} पेज • {mat.fileSize} • {mat.downloadsCount.toLocaleString()} डाउनलोड
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateTo('materials', { openMaterialId: mat.id })}
                className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-orange-600 shrink-0 transition-colors"
                title="Download / View"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Official Notice Board */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <BellRing className="w-3.5 h-3.5 text-orange-500" />
          <span>{isHindi ? 'आधिकारिक सूचना पट्ट (Notice Board)' : 'Official Notice Board'}</span>
        </h3>
        <div className="space-y-2">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-600 dark:text-orange-400">{ann.category}</span>
                <span className="text-[10px] text-slate-400">{ann.date}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                {isHindi && ann.titleHindi ? ann.titleHindi : ann.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isHindi && ann.contentHindi ? ann.contentHindi : ann.content}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
