/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Star, 
  PlayCircle, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Award, 
  Share2, 
  ArrowLeft, 
  Download, 
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/auth';

export const CourseDetail: React.FC = () => {
  const { routeParams, courses, user, navigateTo, goBack, openPayment, showToast, refreshUser, language } = useApp();
  const isHindi = language === 'hi';

  const courseId = routeParams.courseId || courses[0]?.id;
  const course = courses.find((c) => c.id === courseId) || courses[0];

  if (!course) {
    return (
      <div className="text-center py-20">
        <p>Course not found</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl">Back</button>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourseIds.includes(course.id) || course.isFree;

  const handleEnrollFree = () => {
    if (!user) {
      showToast(isHindi ? 'कृपया पहले लॉगिन करें' : 'Please login first', 'info');
      return;
    }
    AuthService.enrollInCourse(course.id);
    refreshUser();
    showToast(isHindi ? 'बधाई हो! आप निःशुल्क कोर्स में नामांकित हो गए हैं।' : 'Enrolled in free course successfully!', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Check out ${course.title} on Rajnish Factory!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(isHindi ? 'लिंक क्लिपबोर्ड पर कॉपी हो गया!' : 'Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'वापस जाएं' : 'Back'}</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1 text-xs font-semibold"
          title="Share Course"
        >
          <Share2 className="w-4 h-4" />
          <span>{isHindi ? 'शेयर करें' : 'Share'}</span>
        </button>
      </div>

      {/* Hero Course Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="relative h-60 sm:h-72 w-full bg-slate-900">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4 sm:p-6">
            <div className="text-white space-y-2">
              <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {course.category}
              </span>
              <h1 className="text-lg sm:text-2xl font-black leading-tight text-white">
                {isHindi && course.titleHindi ? course.titleHindi : course.title}
              </h1>
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <div className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{course.rating}</span>
                </div>
                <span>• {course.reviewCount}+ समीक्षाएं</span>
                <span>• {course.totalDuration}</span>
                <span>• {course.language}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {course.isFree ? (
              <div>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {isHindi ? '100% निःशुल्क कोर्स' : '100% Free Course'}
                </span>
                <p className="text-[11px] text-slate-500">{isHindi ? 'लाइफटाइम एक्सेस बिना किसी शुल्क के' : 'Lifetime free access'}</p>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹{course.price}</span>
                  <span className="text-sm line-through text-slate-400">₹{course.originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isHindi ? 'कूपन FACTORY50 लागू करने पर अतिरिक्त छूट' : 'Use coupon FACTORY50 for extra discount'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isEnrolled ? (
              <button
                onClick={() => navigateTo('video-player', { courseId: course.id, lessonId: course.lessons[0]?.id })}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <PlayCircle className="w-5 h-5" />
                <span>{isHindi ? 'पढ़ाई शुरू करें (Start Watching)' : 'Start Watching'}</span>
              </button>
            ) : course.isFree ? (
              <button
                onClick={handleEnrollFree}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isHindi ? 'मुफ़्त नामांकन करें' : 'Enroll for Free'}</span>
              </button>
            ) : (
              <button
                onClick={() => openPayment({ type: 'course', item: course })}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isHindi ? `₹${course.price} में अभी खरीदें` : `Buy Now for ₹${course.price}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructor Information */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-4">
        <img
          src={course.instructorAvatar}
          alt={course.instructorName}
          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/30 shrink-0"
        />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            {isHindi ? 'कोर्स मार्गदर्शक' : 'Lead Instructor'}
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            {course.instructorName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {course.instructorRole} • {isHindi ? '10+ वर्षों का शिक्षण अनुभव' : '10+ Years Mentoring Experience'}
          </p>
        </div>
      </div>

      {/* Course Features */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          ✨ {isHindi ? 'इस कोर्स में आपको क्या मिलेगा?' : 'What will you get in this course?'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {course.features.map((feat, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum / Syllabus Breakdown */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              📖 {isHindi ? 'कोर्स पाठ्यक्रम एवं वीडियो लेक्चर्स' : 'Course Curriculum & Lectures'}
            </h3>
            <p className="text-xs text-slate-500">
              {course.lessons.length} {isHindi ? 'अध्याय' : 'Lessons'} • {course.totalDuration}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {course.lessons.map((lesson, index) => {
            const canPlay = isEnrolled || lesson.isFreePreview;
            const isCompleted = user?.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (canPlay) {
                    navigateTo('video-player', { courseId: course.id, lessonId: lesson.id });
                  } else {
                    showToast(isHindi ? 'यह क्लास लॉक है। कृपया कोर्स अनलॉक करें।' : 'Class is locked. Please enroll.', 'info');
                    openPayment({ type: 'course', item: course });
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  canPlay 
                    ? 'bg-slate-50 hover:bg-orange-50/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-700 cursor-pointer'
                    : 'bg-slate-50/40 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : canPlay 
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {isHindi && lesson.titleHindi ? lesson.titleHindi : lesson.title}
                      </h4>
                      {lesson.isFreePreview && !isEnrolled && (
                        <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {lesson.duration} {lesson.summary ? `• ${lesson.summary}` : ''}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {canPlay ? (
                    <PlayCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Certificate Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {isHindi ? 'प्रमाणित समापन प्रमाणपत्र (Verified Certificate)' : 'Verified Completion Certificate'}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {isHindi ? 'कोर्स के सभी लेक्चर्स पूरा करने पर स्वतः जारी किया जाता है।' : 'Issued automatically upon 100% course lecture completion.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
