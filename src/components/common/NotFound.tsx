/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Compass, BookOpen, CheckSquare, Search, RefreshCw, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotFound: React.FC = () => {
  const { navigateTo, goBack, language, setSearchQuery } = useApp();
  const isHindi = language === 'hi';

  const quickLinks = [
    { title: isHindi ? 'होम पेज' : 'Home Page', desc: isHindi ? 'मुख्य डैशबोर्ड पर लौटें' : 'Return to main dashboard', icon: Home, route: 'home' },
    { title: isHindi ? 'सभी कोर्सेज' : 'All Courses', desc: isHindi ? 'फाउंडेशन व स्पेशल बैच' : 'Explore video courses', icon: BookOpen, route: 'courses' },
    { title: isHindi ? 'मॉक टेस्ट' : 'Online Exams', desc: isHindi ? 'फ्री व लाइव टेस्ट सीरीज' : 'Practice tests & quizzes', icon: CheckSquare, route: 'exams' },
    { title: isHindi ? 'डिजिटल लाइब्रेरी' : 'Digital Library', desc: isHindi ? 'पीडीएफ नोट्स व फॉर्मूले' : 'Downloadable PDF notes', icon: Compass, route: 'materials' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Error Badge */}
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border border-orange-500/40 flex items-center justify-center animate-bounce">
            <span className="text-4xl font-black text-orange-600 dark:text-orange-400">404</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Safe Fallback
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isHindi ? 'पेज नहीं मिला (Page Not Found)' : 'Page Not Found'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isHindi 
              ? 'चिंता न करें! हमारे जीरो-404 सिस्टम ने आपकी सुरक्षा की है। आप नीचे दिए गए किसी भी मुख्य अनुभाग में जा सकते हैं।' 
              : "Don't worry! Our zero-404 recovery system ensures you never get stuck. Choose any destination below to continue learning."}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>{isHindi ? 'मुख्य पेज पर जाएं' : 'Return to Home'}</span>
          </button>

          <button
            onClick={goBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'पिछला पेज' : 'Go Back'}</span>
          </button>
        </div>

        {/* Recommended destinations */}
        <div className="pt-4 text-left">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 text-center">
            {isHindi ? 'लोकप्रिय अनुभाग' : 'Popular Destinations'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigateTo(link.route)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 cursor-pointer transition-all flex items-start space-x-3"
                >
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{link.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{link.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
