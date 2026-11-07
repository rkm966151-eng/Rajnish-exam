/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Course, Exam, StudyMaterial, AppSettings, NotificationItem } from '../types';
import { AuthService } from '../services/auth';
import { StorageService } from '../services/storage';

interface AppContextType {
  user: User | null;
  refreshUser: () => void;
  login: (id: string, code: string) => { success: boolean; message?: string };
  logout: () => void;
  
  // Navigation
  currentRoute: string;
  routeParams: Record<string, any>;
  navigateTo: (route: string, params?: Record<string, any>) => void;
  goBack: () => void;
  
  // Customization
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: 'hi' | 'en';
  toggleLanguage: () => void;
  isAndroidFrame: boolean;
  toggleAndroidFrame: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Triggers
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  paymentModalOpen: boolean;
  openPayment: (target: { type: 'course' | 'plan'; item: any }) => void;
  closePayment: () => void;
  paymentTarget: { type: 'course' | 'plan'; item: any } | null;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  
  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // App Data
  courses: Course[];
  exams: Exam[];
  materials: StudyMaterial[];
  settings: AppSettings;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'नया मॉक टेस्ट उपलब्ध',
    message: 'एसएससी सीजीएल ऑल इंडिया मॉक टेस्ट 01 अब लाइव है। अभी अपनी तैयारी परखें!',
    time: '10 मिनट पहले',
    isRead: false,
    type: 'exam',
    linkRoute: 'exams',
  },
  {
    id: 'notif-2',
    title: 'नया वीडियो लेक्चर जोड़ा गया',
    message: 'फाउंडेशन बैच में "संख्या पद्धति - यूनिट डिजिट ट्रिक्स" क्लास अपलोड हो चुकी है।',
    time: '2 घंटे पहले',
    isRead: false,
    type: 'video',
    linkRoute: 'courses',
  },
  {
    id: 'notif-3',
    title: '50% स्कॉलरशिप कूपन',
    message: 'कूपन कोड FACTORY50 का उपयोग करके किसी भी बैच पर 50% की विशेष छूट प्राप्त करें।',
    time: '1 दिन पहले',
    isRead: true,
    type: 'general',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});
  const [historyStack, setHistoryStack] = useState<{ route: string; params: Record<string, any> }[]>([
    { route: 'home', params: {} },
  ]);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('rf_theme') as 'dark' | 'light') || 'dark';
  });

  const [language, setLanguage] = useState<'hi' | 'en'>(() => {
    return (localStorage.getItem('rf_lang') as 'hi' | 'en') || 'hi';
  });

  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(() => {
    // Default to true for authentic Android app preview, can easily toggle to full screen!
    return window.innerWidth > 1024;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [paymentTarget, setPaymentTarget] = useState<{ type: 'course' | 'plan'; item: any } | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [exams, setExams] = useState<Exam[]>(() => StorageService.getExams());
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => StorageService.getMaterials());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('rf_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rf_lang', language);
  }, [language]);

  const refreshUser = () => {
    setUser(AuthService.getCurrentUser());
  };

  const refreshData = () => {
    setCourses(StorageService.getCourses());
    setExams(StorageService.getExams());
    setMaterials(StorageService.getMaterials());
    setSettings(StorageService.getSettings());
  };

  const login = (identifier: string, code: string) => {
    const res = AuthService.login(identifier, code);
    if (res.success && res.user) {
      setUser(res.user);
      showToast(
        language === 'hi' 
          ? `नमस्ते ${res.user.name}, स्वागत है रजनीश फैक्ट्री में!` 
          : `Welcome back, ${res.user.name}!`,
        'success'
      );
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    navigateTo('home');
    showToast(language === 'hi' ? 'आप सफलतापूर्वक लॉगआउट हो गए हैं।' : 'Logged out successfully', 'info');
  };

  const navigateTo = (route: string, params: Record<string, any> = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHistoryStack(prev => [...prev, { route, params }]);
    setCurrentRoute(route);
    setRouteParams(params);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop(); // Remove current
      const prev = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentRoute(prev.route);
      setRouteParams(prev.params);
    } else {
      setCurrentRoute('home');
      setRouteParams({});
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'hi' ? 'en' : 'hi'));
    showToast(language === 'hi' ? 'Language switched to English' : 'भाषा हिंदी में बदली गई', 'info');
  };

  const toggleAndroidFrame = () => {
    setIsAndroidFrame(prev => !prev);
  };

  const openPayment = (target: { type: 'course' | 'plan'; item: any }) => {
    setPaymentTarget(target);
    setPaymentModalOpen(true);
  };

  const closePayment = () => {
    setPaymentModalOpen(false);
    setPaymentTarget(null);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        user,
        refreshUser,
        login,
        logout,
        currentRoute,
        routeParams,
        navigateTo,
        goBack,
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        isAndroidFrame,
        toggleAndroidFrame,
        searchQuery,
        setSearchQuery,
        authModalOpen,
        setAuthModalOpen,
        paymentModalOpen,
        openPayment,
        closePayment,
        paymentTarget,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        toast,
        showToast,
        courses,
        exams,
        materials,
        settings,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
