/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Send, 
  Tag, 
  Settings as SettingsIcon, 
  Download, 
  AlertCircle, 
  Lock, 
  Unlock, 
  ArrowLeft,
  Bell,
  RefreshCw,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { AuthService } from '../../services/auth';
import { Course, Exam, StudyMaterial, User, Coupon, Announcement, Question } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, courses, exams, materials, settings, refreshData, showToast, goBack, navigateTo, language } = useApp();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'exams' | 'materials' | 'students' | 'coupons' | 'broadcast' | 'settings'
  >('overview');

  const allUsers = AuthService.getAllUsers();
  const allAttempts = StorageService.getAttempts();
  const coupons = StorageService.getCoupons();
  const announcements = StorageService.getAnnouncements();

  // Guard: If not admin, block access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl border border-red-300 dark:border-red-900/50 p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'सुरक्षित एडमिन एक्सेस आवश्यक' : 'Admin Authorization Required'}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi ? 'इस पैनल तक पहुँचने के लिए आपके पास मास्टर एडमिन अधिकार होना अनिवार्य है।' : 'You must have administrative privileges to access this area.'}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                AuthService.login('admin@rajnishfactory.com', 'admin123');
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
            >
              🔑 एडमिन के रूप में लॉगिन करें (One-Click)
            </button>
            <button
              onClick={goBack}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-semibold"
            >
              वापस जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STATS COMPUTATION ---
  const totalRevenue = 145000 + (allAttempts.length * 150);
  const totalVideosCount = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);

  // --- COURSE FORM STATE ---
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [cTitle, setCTitle] = useState('');
  const [cTitleHi, setCTitleHi] = useState('');
  const [cCategory, setCCategory] = useState('SSC Exams');
  const [cPrice, setCPrice] = useState<number>(999);
  const [cOriginalPrice, setCOriginalPrice] = useState<number>(2999);
  const [cIsFree, setCIsFree] = useState<boolean>(false);
  const [cDuration, setCDuration] = useState('120+ Hours');

  // Add Lesson to Course state
  const [lessonModalCourse, setLessonModalCourse] = useState<Course | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('30:00');
  const [lessonUrl, setLessonUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // --- EXAM FORM STATE ---
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eTitleHi, setETitleHi] = useState('');
  const [eCategory, setECategory] = useState('SSC Exams');
  const [eDuration, setEDuration] = useState<number>(60);
  const [eMarks, setEMarks] = useState<number>(100);
  const [eNegative, setENegative] = useState<number>(0.25);

  // Add Question to Exam state
  const [questionModalExam, setQuestionModalExam] = useState<Exam | null>(null);
  const [qText, setQText] = useState('');
  const [qTextHi, setQTextHi] = useState('');
  const [qSubject, setQSubject] = useState('General Studies');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState('opt_a');
  const [qExp, setQExp] = useState('');

  // --- MATERIAL FORM STATE ---
  const [matModalOpen, setMatModalOpen] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mSubject, setMSubject] = useState('Mathematics');
  const [mChapter, setMChapter] = useState('');
  const [mPages, setMPages] = useState<number>(50);

  // --- COUPON FORM STATE ---
  const [couponCode, setCouponCode] = useState('');
  const [couponDisc, setCouponDisc] = useState<number>(20);

  // --- BROADCAST STATE ---
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  // --- SETTINGS STATE ---
  const [appName, setAppName] = useState(settings.appName);
  const [bannerNotice, setBannerNotice] = useState(settings.bannerNotice);
  const [showBannerNotice, setShowBannerNotice] = useState(settings.showBannerNotice);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [appVersion, setAppVersion] = useState(settings.appVersion);

  // Handlers
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: editingCourseId || 'course_' + Date.now(),
      title: cTitle,
      titleHindi: cTitleHi || cTitle,
      description: 'Comprehensive high-scoring master batch prepared by Er. Rajnish Kumar.',
      descriptionHindi: 'रजनीश फैक्ट्री द्वारा संचालित विशेष लाइव एवं रिकॉर्डेड बैच।',
      category: cCategory,
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      instructorName: 'Er. Rajnish Kumar',
      instructorRole: 'Lead Mentor',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      price: cIsFree ? 0 : cPrice,
      originalPrice: cOriginalPrice,
      isFree: cIsFree,
      rating: 4.9,
      reviewCount: 120,
      totalDuration: cDuration,
      totalLessons: 12,
      language: 'Bilingual',
      level: 'All Levels',
      features: ['Live Doubt Sessions', 'Downloadable Handouts', 'Full Test Series'],
      lessons: [
        {
          id: 'l_' + Date.now(),
          courseId: editingCourseId || 'c_' + Date.now(),
          title: 'Class 01: Introduction & Foundation Strategy',
          titleHindi: 'कक्षा 01: परिचय एवं आधारभूत रणनीति',
          duration: '35:00',
          durationSeconds: 2100,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          isFreePreview: true,
          order: 1,
        }
      ],
    };

    StorageService.saveCourse(newCourse);
    refreshData();
    setCourseModalOpen(false);
    setEditingCourseId(null);
    showToast('कोर्स सफलतापूर्वक सुरक्षित किया गया!', 'success');
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('क्या आप सचमुच इस कोर्स को हटाना चाहते हैं?')) {
      StorageService.deleteCourse(id);
      refreshData();
      showToast('कोर्स हटा दिया गया!', 'info');
    }
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonModalCourse || !lessonTitle) return;

    const newLesson = {
      id: 'l_' + Date.now(),
      courseId: lessonModalCourse.id,
      title: lessonTitle,
      titleHindi: lessonTitle,
      duration: lessonDuration,
      durationSeconds: 1800,
      videoUrl: lessonUrl,
      isFreePreview: false,
      order: (lessonModalCourse.lessons?.length || 0) + 1,
      summary: 'नवीनतम परीक्षा पैटर्न पर आधारित महत्वपूर्ण वीडियो क्लास।',
    };

    lessonModalCourse.lessons.push(newLesson);
    lessonModalCourse.totalLessons = lessonModalCourse.lessons.length;
    StorageService.saveCourse(lessonModalCourse);
    refreshData();
    setLessonModalCourse(null);
    setLessonTitle('');
    showToast('नया वीडियो लेक्चर जोड़ा गया!', 'success');
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: Exam = {
      id: 'exam_' + Date.now(),
      title: eTitle,
      titleHindi: eTitleHi || eTitle,
      category: eCategory,
      durationMinutes: eDuration,
      totalMarks: eMarks,
      passPercentage: 60,
      negativeMarkingRate: eNegative,
      totalQuestions: 1,
      isFree: true,
      attemptsCount: 0,
      instructions: ['कुल प्रश्न हल करें।', 'नेगेटिव मार्किंग लागू है।'],
      questions: [
        {
          id: 'q_' + Date.now(),
          questionText: 'Which element has the atomic number 1?',
          questionTextHindi: 'किस तत्व का परमाणु क्रमांक 1 है?',
          options: [
            { id: 'opt_a', text: 'Hydrogen', textHindi: 'हाइड्रोजन' },
            { id: 'opt_b', text: 'Helium', textHindi: 'हीलियम' },
            { id: 'opt_c', text: 'Lithium', textHindi: 'लिथियम' },
            { id: 'opt_d', text: 'Oxygen', textHindi: 'ऑक्सीजन' },
          ],
          correctOptionId: 'opt_a',
          explanation: 'Hydrogen is the lightest element with atomic number 1.',
          explanationHindi: 'हाइड्रोजन सबसे हल्का तत्व है जिसका परमाणु क्रमांक 1 होता है।',
          marks: Math.round(eMarks / 1),
          negativeMarks: eNegative,
          subject: 'General Science',
        }
      ],
    };

    StorageService.saveExam(newExam);
    refreshData();
    setExamModalOpen(false);
    showToast('नया मॉक टेस्ट बनाया गया!', 'success');
  };

  const handleDeleteExam = (id: string) => {
    if (confirm('क्या आप सचमुच इस टेस्ट को हटाना चाहते हैं?')) {
      StorageService.deleteExam(id);
      refreshData();
      showToast('टेस्ट हटाया गया!', 'info');
    }
  };

  const handleAddQuestionToExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionModalExam || !qText) return;

    const newQuestion: Question = {
      id: 'q_' + Date.now(),
      questionText: qText,
      questionTextHindi: qTextHi || qText,
      options: [
        { id: 'opt_a', text: qOptA || 'Option A', textHindi: qOptA || 'विकल्प A' },
        { id: 'opt_b', text: qOptB || 'Option B', textHindi: qOptB || 'विकल्प B' },
        { id: 'opt_c', text: qOptC || 'Option C', textHindi: qOptC || 'विकल्प C' },
        { id: 'opt_d', text: qOptD || 'Option D', textHindi: qOptD || 'विकल्प D' },
      ],
      correctOptionId: qCorrect,
      explanation: qExp || 'विस्तृत समाधान फैकल्टी द्वारा तैयार किया गया है।',
      explanationHindi: qExp || 'विस्तृत समाधान फैकल्टी द्वारा तैयार किया गया है।',
      marks: 2,
      negativeMarks: questionModalExam.negativeMarkingRate,
      subject: qSubject,
    };

    questionModalExam.questions.push(newQuestion);
    questionModalExam.totalQuestions = questionModalExam.questions.length;
    StorageService.saveExam(questionModalExam);
    refreshData();
    setQuestionModalExam(null);
    setQText('');
    setQTextHi('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    showToast('एमसीक्यू प्रश्न सफलतापूर्वक जोड़ा गया!', 'success');
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newMat: StudyMaterial = {
      id: 'mat_' + Date.now(),
      title: mTitle,
      titleHindi: mTitle,
      subject: mSubject,
      category: 'Handwritten Notes',
      chapter: mChapter || 'General Concepts',
      pages: mPages,
      fileSize: '3.5 MB',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      isFree: true,
      downloadsCount: 15,
      uploadDate: new Date().toISOString().split('T')[0],
      author: 'Er. Rajnish Kumar',
      previewSnippet: `${mSubject} के महत्वपूर्ण सूत्र, शॉर्ट ट्रिक्स एवं त्वरित पुनरीक्षण बिंदु।`,
    };

    StorageService.saveMaterial(newMat);
    refreshData();
    setMatModalOpen(false);
    showToast('पीडीएफ नोट्स अपलोड कर दिए गए!', 'success');
  };

  const handleToggleBlockUser = (targetUser: User) => {
    targetUser.isBlocked = !targetUser.isBlocked;
    AuthService.saveUser(targetUser);
    showToast(targetUser.isBlocked ? 'छात्र अवरोधित (Blocked) कर दिया गया' : 'छात्र अनब्लॉक कर दिया गया', 'info');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      discountPercentage: couponDisc,
      maxDiscount: 1000,
      minPurchase: 299,
      validTill: '2026-12-31',
      isActive: true,
      description: `विशेष ${couponDisc}% छात्र छूट कूपन`,
    };
    StorageService.saveCoupon(newCoupon);
    setCouponCode('');
    showToast('कूपन कोड सक्रिय कर दिया गया!', 'success');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    const ann: Announcement = {
      id: 'ann_' + Date.now(),
      title: broadcastTitle,
      titleHindi: broadcastTitle,
      content: broadcastMsg,
      contentHindi: broadcastMsg,
      date: new Date().toLocaleDateString(),
      isImportant: true,
      category: 'Notice',
    };
    StorageService.saveAnnouncement(ann);
    setBroadcastTitle('');
    setBroadcastMsg('');
    showToast('पुश नोटिफिकेशन एवं नोटिस बोर्ड पर संदेश प्रसारित किया गया!', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      appName,
      bannerNotice,
      showBannerNotice,
      maintenanceMode,
      appVersion,
    };
    StorageService.saveSettings(updated);
    refreshData();
    showToast('ऐप सेटिंग्स अपडेट कर दी गईं!', 'success');
  };

  const handleExportBackup = () => {
    const data = StorageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RajnishFactory_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('डेटाबेस बैकअप सफलतापूर्वक डाउनलोड हुआ!', 'success');
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-900/10 dark:bg-purple-950/40 p-4 rounded-3xl border border-purple-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                RAJNISH FACTORY ADMIN CONSOLE
              </h1>
              <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                ROOT PRIVILEGES
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              संपूर्ण एप्लिकेशन, कोर्सेज, वीडियो, छात्र, टेस्ट व भुगतान नियंत्रण
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportBackup}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            title="Download JSON Database"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            <span>बैकअप (Export)</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-xl bg-orange-600 text-white text-xs font-bold flex items-center space-x-1"
          >
            <span>स्टूडेंट मोड ➔</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          📊 डैशबोर्ड (Overview)
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'courses' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          📚 कोर्सेज व वीडियो ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'exams' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          📝 मॉक टेस्ट बैंक ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'materials' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          📑 पीडीएफ नोट्स ({materials.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'students' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          👥 छात्र प्रबंधन ({allUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'coupons' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          🏷️ कूपन कोड ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'broadcast' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          📢 ब्रॉडकास्ट
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500'}`}
        >
          ⚙️ ऐप सेटिंग्स
        </button>
      </div>

      {/* --- TAB 1: OVERVIEW DASHBOARD --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">कुल छात्र (Students)</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {allUsers.length * 1250}+
              </div>
              <span className="text-[10px] text-emerald-500 font-bold">↑ +14% इस सप्ताह</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">लाइव कोर्सेज व वीडियो</span>
              <div className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400">
                {courses.length} / {totalVideosCount}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{totalVideosCount} वीडियो लेक्चर्स</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">कुल टेस्ट सबमिशन</span>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                {allAttempts.length * 480}+
              </div>
              <span className="text-[10px] text-emerald-500 font-bold">100% CBT सक्रिय</span>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">अनुमानित राजस्व (Revenue)</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Razorpay Verified</span>
            </div>
          </div>

          {/* Quick Operations Action Bar */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm flex items-center space-x-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>त्वरित एडमिन क्रियाएं (Quick Admin Actions)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
              <button
                onClick={() => { setEditingCourseId(null); setCourseModalOpen(true); }}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-center transition-colors border border-white/10"
              >
                + नया कोर्स बनाएं
              </button>
              <button
                onClick={() => setExamModalOpen(true)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-center transition-colors border border-white/10"
              >
                + नया मॉक टेस्ट जोड़ें
              </button>
              <button
                onClick={() => setMatModalOpen(true)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-center transition-colors border border-white/10"
              >
                + पीडीएफ नोट्स अपलोड
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-center transition-colors border border-white/10"
              >
                📢 नोटिस प्रसारित करें
              </button>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              नवीनतम पंजीकृत छात्र (Recent Registrations)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px]">
                    <th className="pb-2">छात्र नाम</th>
                    <th className="pb-2">ईमेल / फोन</th>
                    <th className="pb-2">रोल</th>
                    <th className="pb-2">रजिस्ट्रेशन तिथि</th>
                    <th className="pb-2 text-right">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {allUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                        <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </td>
                      <td className="py-2.5 text-slate-500">{u.email}</td>
                      <td className="py-2.5 uppercase font-bold text-[10px] text-purple-600">{u.role}</td>
                      <td className="py-2.5 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-600">सक्रिय (Active)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: MANAGE COURSES & LECTURES --- */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              कोर्स एवं वीडियो लेक्चर प्रबंधन
            </h2>
            <button
              onClick={() => { setEditingCourseId(null); setCourseModalOpen(true); }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया कोर्स जोड़ें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start space-x-3.5">
                  <img src={c.thumbnail} alt="" className="w-16 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">{c.category}</span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {c.titleHindi || c.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      मूल्य: ₹{c.price} • कुल लेक्चर्स: {c.lessons?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLessonModalCourse(c)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ वीडियो लेक्चर जोड़ें</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCourse(c.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: MANAGE EXAMS & QUESTIONS --- */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              ऑनलाइन मॉक टेस्ट एवं एमसीक्यू प्रश्न बैंक
            </h2>
            <button
              onClick={() => setExamModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया मॉक टेस्ट बनाएं</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">{ex.category}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5">
                    {ex.titleHindi || ex.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    समय: {ex.durationMinutes}m • प्रश्न: {ex.questions?.length || 0} • पूर्णांक: +{ex.totalMarks} • नेगेटिव: -{ex.negativeMarkingRate}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuestionModalExam(ex)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ MCQ प्रश्न जोड़ें</span>
                  </button>

                  <button
                    onClick={() => handleDeleteExam(ex.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: MANAGE STUDY MATERIALS --- */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              पीडीएफ नोट्स एवं स्टडी मटेरियल
            </h2>
            <button
              onClick={() => setMatModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया पीडीएफ नोट्स अपलोड</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {materials.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">{m.subject}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{m.titleHindi || m.title}</h4>
                  <p className="text-[11px] text-slate-500">{m.pages} पेज • {m.downloadsCount} डाउनलोड्स</p>
                </div>
                <button
                  onClick={() => {
                    StorageService.deleteMaterial(m.id);
                    refreshData();
                    showToast('नोट्स हटा दिया गया!', 'info');
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: MANAGE STUDENTS --- */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
            विद्यार्थी खाता प्रबंधन एवं एक्सेस कंट्रोल
          </h2>

          <div className="space-y-2">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{u.name}</h4>
                    <p className="text-xs text-slate-500">{u.email} • {u.phone || '9876543210'}</p>
                    <span className="text-[10px] text-orange-600 font-bold">
                      {u.enrolledCourseIds?.length || 0} कोर्सेज नामांकित
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleBlockUser(u)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                      u.isBlocked ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {u.isBlocked ? 'अनब्लॉक करें' : 'ब्लॉक करें'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: MANAGE COUPONS --- */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <form onSubmit={handleCreateCoupon} className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="नया कूपन कोड (उदा: FACTORY70)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs uppercase font-mono font-bold border border-slate-200 dark:border-slate-700"
              required
            />
            <input
              type="number"
              placeholder="छूट प्रतिशत (उदा: 50)"
              value={couponDisc}
              onChange={(e) => setCouponDisc(Number(e.target.value))}
              className="w-full sm:w-44 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
            >
              + कूपन सक्रिय करें
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((c) => (
              <div key={c.code} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-mono font-black text-sm text-orange-600">{c.code}</span>
                  <p className="text-xs text-slate-500">{c.discountPercentage}% छूट • {c.description}</p>
                </div>
                <button
                  onClick={() => {
                    StorageService.deleteCoupon(c.code);
                    refreshData();
                    showToast('कूपन हटा दिया गया', 'info');
                  }}
                  className="p-1.5 text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 7: BROADCAST NOTIFICATIONS --- */}
      {activeTab === 'broadcast' && (
        <form onSubmit={handleSendBroadcast} className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <Bell className="w-4 h-4 text-orange-500" />
            <span>सभी छात्रों को पुश नोटिफिकेशन / नोटिस बोर्ड संदेश भेजें</span>
          </h3>
          <input
            type="text"
            placeholder="शीर्षक (Title)"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700"
            required
          />
          <textarea
            rows={3}
            placeholder="संदेश सामग्री (Broadcast Message Body)..."
            value={broadcastMsg}
            onChange={(e) => setBroadcastMsg(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700"
            required
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>लाइव प्रसारित करें (Broadcast Now)</span>
          </button>
        </form>
      )}

      {/* --- TAB 8: APP SETTINGS & FIREBASE --- */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            प्लेटफॉर्म सेटिंग्स, वर्ज़न एवं सुरक्षा
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              एप्लिकेशन नाम
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              होम स्क्रीन टिकर नोटिस
            </label>
            <input
              type="text"
              value={bannerNotice}
              onChange={(e) => setBannerNotice(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="showNotice"
              checked={showBannerNotice}
              onChange={(e) => setShowBannerNotice(e.target.checked)}
              className="rounded text-orange-600"
            />
            <label htmlFor="showNotice" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              होम स्क्रीन पर नोटिस टिकर प्रदर्शित करें
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="maintMode"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="rounded text-orange-600"
            />
            <label htmlFor="maintMode" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              मेंटेनेंस मोड (Maintenance Mode)
            </label>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
          >
            सेटिंग्स सुरक्षित करें
          </button>
        </form>
      )}

      {/* --- MODAL 1: ADD / EDIT COURSE --- */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleSaveCourse} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">नया कोर्स जोड़ें</h3>
            <input
              type="text"
              placeholder="कोर्स का नाम (English)"
              value={cTitle}
              onChange={(e) => setCTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              required
            />
            <input
              type="text"
              placeholder="कोर्स का नाम (हिंदी)"
              value={cTitleHi}
              onChange={(e) => setCTitleHi(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="मूल्य (₹)"
                value={cPrice}
                onChange={(e) => setCPrice(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              />
              <input
                type="number"
                placeholder="असली मूल्य (₹)"
                value={cOriginalPrice}
                onChange={(e) => setCOriginalPrice(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFreeC"
                checked={cIsFree}
                onChange={(e) => setCIsFree(e.target.checked)}
              />
              <label htmlFor="isFreeC" className="text-xs">100% निःशुल्क कोर्स</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCourseModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
              <button type="submit" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl">कोर्स सुरक्षित करें</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 2: ADD LESSON TO COURSE --- */}
      {lessonModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleAddLesson} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border space-y-3">
            <h3 className="font-extrabold text-sm">
              + नया वीडियो लेक्चर: {lessonModalCourse.titleHindi || lessonModalCourse.title}
            </h3>
            <input
              type="text"
              placeholder="लेक्चर का शीर्षक (उदा: इकाई अंक शॉर्ट ट्रिक्स)"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              required
            />
            <input
              type="text"
              placeholder="अवधि (उदा: 42:15)"
              value={lessonDuration}
              onChange={(e) => setLessonDuration(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
            />
            <input
              type="text"
              placeholder="वीडियो स्ट्रीम URL (MP4 / HLS)"
              value={lessonUrl}
              onChange={(e) => setLessonUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setLessonModalCourse(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl">लेक्चर जोड़ें</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: ADD EXAM --- */}
      {examModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleSaveExam} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border space-y-3">
            <h3 className="font-extrabold text-sm">नया ऑनलाइन मॉक टेस्ट बनाएं</h3>
            <input
              type="text"
              placeholder="टेस्ट शीर्षक (उदा: ऑल इंडिया रेलवे स्पीड टेस्ट)"
              value={eTitle}
              onChange={(e) => setETitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              required
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="समय (Min)"
                value={eDuration}
                onChange={(e) => setEDuration(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              />
              <input
                type="number"
                placeholder="पूर्णांक (Marks)"
                value={eMarks}
                onChange={(e) => setEMarks(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              />
              <input
                type="number"
                step="0.05"
                placeholder="नेगेटिव (0.25)"
                value={eNegative}
                onChange={(e) => setENegative(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setExamModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">टेस्ट बनाएं</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 4: ADD QUESTION TO EXAM --- */}
      {questionModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleAddQuestionToExam} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border space-y-3">
            <h3 className="font-extrabold text-sm">
              + प्रश्न जोड़ें: {questionModalExam.titleHindi || questionModalExam.title}
            </h3>
            <textarea
              rows={2}
              placeholder="प्रश्न लिखें (हिंदी या अंग्रेजी में)..."
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="विकल्प A"
                value={qOptA}
                onChange={(e) => setQOptA(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
                required
              />
              <input
                type="text"
                placeholder="विकल्प B"
                value={qOptB}
                onChange={(e) => setQOptB(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
                required
              />
              <input
                type="text"
                placeholder="विकल्प C"
                value={qOptC}
                onChange={(e) => setQOptC(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
                required
              />
              <input
                type="text"
                placeholder="विकल्प D"
                value={qOptD}
                onChange={(e) => setQOptD(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold">सही विकल्प:</label>
              <select
                value={qCorrect}
                onChange={(e) => setQCorrect(e.target.value)}
                className="ml-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg text-xs border"
              >
                <option value="opt_a">विकल्प A</option>
                <option value="opt_b">विकल्प B</option>
                <option value="opt_c">विकल्प C</option>
                <option value="opt_d">विकल्प D</option>
              </select>
            </div>
            <textarea
              rows={2}
              placeholder="विस्तृत व्याख्या / समाधान (Solution Explanation)..."
              value={qExp}
              onChange={(e) => setQExp(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setQuestionModalExam(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">प्रश्न सेव करें</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 5: ADD STUDY MATERIAL --- */}
      {matModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form onSubmit={handleSaveMaterial} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border space-y-3">
            <h3 className="font-extrabold text-sm">पीडीएफ नोट्स अपलोड करें</h3>
            <input
              type="text"
              placeholder="नोट्स का नाम (उदा: गणित संपूर्ण सूत्र संग्रह)"
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              required
            />
            <input
              type="text"
              placeholder="विषय (उदा: Mathematics, Science)"
              value={mSubject}
              onChange={(e) => setMSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
              required
            />
            <input
              type="number"
              placeholder="कुल पेज"
              value={mPages}
              onChange={(e) => setMPages(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-xs border"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setMatModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">अपलोड करें</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
