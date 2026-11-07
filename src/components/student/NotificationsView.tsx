/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Check, Clock, BookOpen, CheckSquare, Sparkles, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, navigateTo, goBack, language } = useApp();
  const isHindi = language === 'hi';

  const icons = {
    exam: <CheckSquare className="w-4 h-4 text-blue-500" />,
    video: <BookOpen className="w-4 h-4 text-emerald-500" />,
    course: <BookOpen className="w-4 h-4 text-orange-500" />,
    material: <BookOpen className="w-4 h-4 text-purple-500" />,
    general: <Sparkles className="w-4 h-4 text-amber-500" />,
    payment: <Sparkles className="w-4 h-4 text-emerald-500" />,
  };

  return (
    <div className="space-y-6 pb-20 pt-2 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'वापस' : 'Back'}</span>
        </button>

        <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Bell className="w-5 h-5 text-orange-500" />
          <span>{isHindi ? 'सूचनाएं एवं अलर्ट' : 'Notifications & Alerts'}</span>
        </h1>

        <button
          onClick={() => notifications.forEach(n => markNotificationAsRead(n.id))}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
        >
          {isHindi ? 'सभी पढ़ी चिह्नित करें' : 'Mark all read'}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationAsRead(n.id);
              if (n.linkRoute) navigateTo(n.linkRoute);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
              n.isRead
                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-80'
                : 'bg-orange-50/60 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-600">
              {icons[n.type] || <Bell className="w-4 h-4 text-orange-500" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {n.title}
                </h4>
                <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{n.time}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {n.message}
              </p>
            </div>

            {!n.isRead && (
              <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
