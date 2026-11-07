/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, BookOpen, CheckSquare, FileText, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigateTo, language, setAuthModalOpen, user } = useApp();
  const isHindi = language === 'hi';

  const navItems = [
    {
      id: 'home',
      label: isHindi ? 'होम' : 'Home',
      icon: Home,
      route: 'home',
    },
    {
      id: 'courses',
      label: isHindi ? 'कोर्सेज' : 'Courses',
      icon: BookOpen,
      route: 'courses',
    },
    {
      id: 'exams',
      label: isHindi ? 'टेस्ट' : 'Tests',
      icon: CheckSquare,
      route: 'exams',
    },
    {
      id: 'materials',
      label: isHindi ? 'नोट्स' : 'Notes',
      icon: FileText,
      route: 'materials',
    },
    {
      id: 'profile',
      label: isHindi ? 'प्रोफ़ाइल' : 'Profile',
      icon: User,
      route: user ? 'profile' : 'auth',
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.route === 'auth') {
      setAuthModalOpen(true);
    } else {
      navigateTo(item.route);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center space-y-1 transition-all"
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-400 -translate-y-0.5'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight transition-all ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-orange-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
