/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Languages, 
  LogOut, 
  Flame, 
  BookOpen, 
  Award,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    currentRoute, 
    navigateTo, 
    theme, 
    toggleTheme, 
    language, 
    toggleLanguage,
    isAndroidFrame,
    toggleAndroidFrame,
    unreadNotificationsCount,
    setAuthModalOpen,
    logout,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const isHindi = language === 'hi';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('courses', { search: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-black text-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-300">
                  RAJNISH FACTORY
                </span>
                <span className="bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {isHindi ? 'सफलता की असली फैक्ट्री' : 'The Premier Learning Hub'}
              </p>
            </div>
          </div>

          {/* Search bar on desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'कोर्स, टेस्ट या नोट्स खोजें...' : 'Search courses, tests or notes...'}
                className="w-full bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-sm border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </form>
          </div>

          {/* Quick Actions & Preferences */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs font-bold"
            >
              <Languages className="w-4 h-4 text-orange-500" />
              <span>{isHindi ? 'EN' : 'हिं'}</span>
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Android Phone Frame Toggle (Preview Simulator) */}
            <button
              onClick={toggleAndroidFrame}
              title={isAndroidFrame ? 'Exit Phone Frame' : 'Preview in Android Phone Frame'}
              className="hidden lg:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors items-center space-x-1 text-xs font-semibold"
            >
              {isAndroidFrame ? (
                <>
                  <Monitor className="w-4 h-4 text-sky-500" />
                  <span className="text-[11px]">{isHindi ? 'डेस्कटॉप' : 'Full Screen'}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px]">{isHindi ? 'मोबाइल ऐप' : 'Android Mode'}</span>
                </>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => navigateTo('notifications')}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isHindi ? 'सूचनाएं' : 'Notifications'}
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Streak Counter for Students */}
            {user && (
              <div 
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold cursor-pointer"
                onClick={() => navigateTo('quiz')}
                title="Daily Study Streak"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{user.streakDays || 1} {isHindi ? 'दिन' : 'Days'}</span>
              </div>
            )}

            {/* User Account / Profile / Admin */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40"
                  />
                  <div className="hidden xl:block text-left text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold uppercase">
                      {user.role === 'admin' ? 'Master Admin' : 'Student'}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdown(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => navigateTo('student-dashboard')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center space-x-2.5"
                    >
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      <span>{isHindi ? 'मेरी पढ़ाई (My Dashboard)' : 'My Dashboard'}</span>
                    </button>

                    <button
                      onClick={() => navigateTo('profile')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center space-x-2.5"
                    >
                      <UserIcon className="w-4 h-4 text-blue-500" />
                      <span>{isHindi ? 'प्रोफ़ाइल एवं सेटिंग्स' : 'Profile & Settings'}</span>
                    </button>

                    <button
                      onClick={() => navigateTo('subscription')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center space-x-2.5"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span>{isHindi ? 'सब्सक्रिप्शन व ऑर्डर्स' : 'Subscriptions & Passes'}</span>
                    </button>

                    {/* Admin Dashboard shortcut */}
                    {user.role === 'admin' && (
                      <div className="border-t border-slate-100 dark:border-slate-700 my-1 pt-1">
                        <button
                          onClick={() => navigateTo('admin-dashboard')}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center space-x-2.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isHindi ? 'एडमिन कंट्रोल पैनल' : 'Admin Control Panel'}</span>
                        </button>
                      </div>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 my-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isHindi ? 'लॉगआउट करें' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{isHindi ? 'लॉगिन / साइन-अप' : 'Login / Sign Up'}</span>
              </button>
            )}

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'कोर्स, टेस्ट या नोट्स खोजें...' : 'Search...'}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <button
              onClick={() => { navigateTo('courses'); setMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left ${currentRoute === 'courses' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
            >
              📚 {isHindi ? 'सभी कोर्सेज' : 'All Courses'}
            </button>
            <button
              onClick={() => { navigateTo('exams'); setMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left ${currentRoute === 'exams' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
            >
              📝 {isHindi ? 'ऑनलाइन टेस्ट' : 'Mock Tests'}
            </button>
            <button
              onClick={() => { navigateTo('materials'); setMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left ${currentRoute === 'materials' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
            >
              📑 {isHindi ? 'पीडीएफ नोट्स' : 'PDF Notes'}
            </button>
            <button
              onClick={() => { navigateTo('quiz'); setMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left ${currentRoute === 'quiz' ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
            >
              ⚡ {isHindi ? 'डेली क्विज' : 'Daily Quiz'}
            </button>
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <button
                onClick={() => { navigateTo('student-dashboard'); setMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm flex items-center justify-between"
              >
                <span>🎓 {isHindi ? 'मेरा डैशबोर्ड' : 'My Student Dashboard'}</span>
              </button>
              <button
                onClick={() => { navigateTo('timetable'); setMenuOpen(false); }}
                className="w-full text-left py-2 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm flex items-center justify-between"
              >
                <span>📅 {isHindi ? 'स्टडी टाइमटेबल' : 'Study Timetable'}</span>
              </button>
              {user.role === 'admin' && (
                <button
                  onClick={() => { navigateTo('admin-dashboard'); setMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 font-bold text-sm"
                >
                  🛡️ {isHindi ? 'एडमिन पैनल' : 'Admin Panel'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
