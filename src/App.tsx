/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/common/AndroidFrame';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { NotFound } from './components/common/NotFound';
import { AuthModal } from './components/auth/AuthModal';
import { PaymentModal } from './components/payment/PaymentModal';

// Views
import { HomeView } from './components/home/HomeView';
import { CourseList } from './components/courses/CourseList';
import { CourseDetail } from './components/courses/CourseDetail';
import { VideoPlayerView } from './components/courses/VideoPlayerView';
import { StudyMaterialsView } from './components/materials/StudyMaterialsView';
import { ExamListView } from './components/exams/ExamListView';
import { ExamInterface } from './components/exams/ExamInterface';
import { ExamResultView } from './components/exams/ExamResultView';
import { DailyQuizView } from './components/quiz/DailyQuizView';
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { TimetablePlanner } from './components/student/TimetablePlanner';
import { ProfileView } from './components/student/ProfileView';
import { SubscriptionView } from './components/student/SubscriptionView';
import { SupportTicketsView } from './components/student/SupportTicketsView';
import { NotificationsView } from './components/student/NotificationsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GraduationCap, Sparkles } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { currentRoute, isAndroidFrame } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  // Splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 flex flex-col items-center justify-center p-4 text-white text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-pulse">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 text-xs font-black shadow-md">
            ★
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
            RAJNISH FACTORY
          </h1>
          <p className="text-xs text-orange-200/80 font-medium tracking-widest uppercase">
            सफलता की असली फैक्ट्री • EDUCATION & CBT
          </p>
        </div>

        <div className="mt-8 flex items-center space-x-2 text-xs text-slate-400">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span>तैयार हो रहा है...</span>
        </div>
      </div>
    );
  }

  // Render current view safely with 404 fallback
  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'courses':
        return <CourseList />;
      case 'course-detail':
        return <CourseDetail />;
      case 'video-player':
        return <VideoPlayerView />;
      case 'materials':
        return <StudyMaterialsView />;
      case 'exams':
        return <ExamListView />;
      case 'exam-interface':
        return <ExamInterface />;
      case 'exam-result':
        return <ExamResultView />;
      case 'quiz':
        return <DailyQuizView />;
      case 'student-dashboard':
        return <StudentDashboardView />;
      case 'timetable':
        return <TimetablePlanner />;
      case 'profile':
        return <ProfileView />;
      case 'subscription':
        return <SubscriptionView />;
      case 'support':
        return <SupportTicketsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <NotFound />;
    }
  };

  const hideNavbarAndBottomNav = currentRoute === 'exam-interface';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {!hideNavbarAndBottomNav && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3">
        {renderCurrentRoute()}
      </main>

      {!hideNavbarAndBottomNav && <BottomNav />}

      <Toast />
      <AuthModal />
      <PaymentModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <MainRouter />
      </AndroidFrame>
    </AppProvider>
  );
}
