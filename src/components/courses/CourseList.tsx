/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Star, Clock, BookOpen, Filter, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CourseList: React.FC = () => {
  const { courses, user, navigateTo, openPayment, language, searchQuery, setSearchQuery } = useApp();
  const isHindi = language === 'hi';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterPrice, setFilterPrice] = useState<'all' | 'free' | 'paid'>('all');

  const categories = ['All', 'SSC Exams', 'Railway Exams', 'General Science', 'Mathematics', 'Reasoning'];

  const filteredCourses = courses.filter((course) => {
    // category filter
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }
    // price filter
    if (filterPrice === 'free' && !course.isFree) return false;
    if (filterPrice === 'paid' && course.isFree) return false;
    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q) || course.titleHindi.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q) || course.descriptionHindi.toLowerCase().includes(q);
      const matchCategory = course.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            📚 {isHindi ? 'सभी कोर्सेज एवं ऑनलाइन बैच' : 'All Courses & Batches'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isHindi 
              ? 'अनुभवी शिक्षकों द्वारा तैयार संपूर्ण लाइव एवं रिकॉर्डेड बैच' 
              : 'Structured live & recorded batches crafted by top educators'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterPrice('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterPrice === 'all' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'}`}
          >
            {isHindi ? 'सभी' : 'All'}
          </button>
          <button
            onClick={() => setFilterPrice('free')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterPrice === 'free' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'}`}
          >
            {isHindi ? 'निःशुल्क (Free)' : 'Free'}
          </button>
          <button
            onClick={() => setFilterPrice('paid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filterPrice === 'paid' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'}`}
          >
            {isHindi ? 'प्रीमियम (Paid)' : 'Premium'}
          </button>
        </div>
      </div>

      {/* Category Horizontal Scroll */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-500/50'
            }`}
          >
            {cat === 'All' ? (isHindi ? 'सभी श्रेणियां' : 'All Categories') : cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
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
                      <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {course.category}
                      </span>
                      {course.isFree && (
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
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
                      <span className="text-slate-400">• {course.totalLessons} लेक्चर्स</span>
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
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {isHindi ? 'निःशुल्क' : 'FREE'}
                      </span>
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
                      <span>{isHindi ? 'कोर्स देखें' : 'View Course'}</span>
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
                      <span>{course.isFree ? (isHindi ? 'मुफ़्त शुरू करें' : 'Start Free') : (isHindi ? 'नामांकन करें' : 'Enroll Now')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            {isHindi ? 'कोई कोर्स नहीं मिला' : 'No courses found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi ? 'कृपया अन्य श्रेणी या खोज शब्द आज़माएं।' : 'Try adjusting your search or category filters.'}
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setFilterPrice('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
          >
            {isHindi ? 'सभी फ़िल्टर रीसेट करें' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
