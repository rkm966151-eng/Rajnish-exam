/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  Award, 
  Bookmark, 
  PlayCircle, 
  Clock, 
  Calendar, 
  Download, 
  Sparkles, 
  CreditCard,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { CertificateModal } from './CertificateModal';
import { Certificate } from '../../types';

export const StudentDashboardView: React.FC = () => {
  const { user, courses, exams, materials, navigateTo, language } = useApp();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'courses' | 'tests' | 'certificates' | 'bookmarks'>('courses');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const enrolledCourses = courses.filter((c) => user?.enrolledCourseIds.includes(c.id));
  const userAttempts = StorageService.getAttempts(user?.id);
  const bookmarkedMaterials = materials.filter((m) => user?.savedMaterialIds.includes(m.id));

  // Generated sample certificates for completed courses
  const certificates: Certificate[] = enrolledCourses.slice(0, 2).map((c, i) => ({
    id: 'cert_' + c.id,
    courseId: c.id,
    courseTitle: c.titleHindi || c.title,
    studentName: user?.name || 'Rohan Sharma',
    issueDate: '15 April 2025',
    verificationCode: `RF-CERT-2025-0${i + 1}84`,
    instructorName: c.instructorName,
  }));

  return (
    <div className="space-y-6 pb-20 pt-2">
      
      {/* Student Welcome Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black">{user?.name || 'विद्यार्थी'}</h1>
              <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-full font-bold uppercase">
                {user?.subscription?.isActive ? 'VIP PASS ACTIVE' : 'FREE STUDENT'}
              </span>
            </div>
            <p className="text-xs text-orange-100 mt-0.5">
              {user?.email} • {user?.phone || '9876543210'}
            </p>
            <div className="flex items-center space-x-3 text-xs font-bold pt-1 text-amber-200">
              <span>🔥 {user?.streakDays || 5} {isHindi ? 'दिन की स्ट्रीक' : 'Days Streak'}</span>
              <span>🪙 {user?.coins || 180} {isHindi ? 'रिवॉर्ड कॉइन्स' : 'Coins'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigateTo('timetable')}
          className="px-4 py-2 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-md self-start sm:self-auto flex items-center space-x-1.5 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>{isHindi ? 'टाइमटेबल खोलें' : 'Open Timetable'}</span>
        </button>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setActiveTab('courses')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-orange-500/50 transition-all text-center"
        >
          <BookOpen className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
            {enrolledCourses.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {isHindi ? 'नामांकित कोर्सेज' : 'My Courses'}
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('tests')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-orange-500/50 transition-all text-center"
        >
          <CheckSquare className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
            {userAttempts.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {isHindi ? 'दिए गए टेस्ट' : 'Tests Taken'}
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('certificates')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-orange-500/50 transition-all text-center"
        >
          <Award className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
            {certificates.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {isHindi ? 'प्रमाणपत्र' : 'Certificates'}
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('bookmarks')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-orange-500/50 transition-all text-center"
        >
          <Bookmark className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
            {bookmarkedMaterials.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {isHindi ? 'सेव नोट्स' : 'Bookmarks'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-2.5 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'courses' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
          }`}
        >
          📚 {isHindi ? 'मेरे कोर्सेज' : 'My Courses'} ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex-1 py-2.5 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'tests' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
          }`}
        >
          📝 {isHindi ? 'टेस्ट रिपोर्ट' : 'My Test Reports'} ({userAttempts.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2.5 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'certificates' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
          }`}
        >
          🎓 {isHindi ? 'प्रमाणपत्र' : 'Certificates'} ({certificates.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2.5 px-3 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'bookmarks' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-slate-500'
          }`}
        >
          📑 {isHindi ? 'बुकमार्क नोट्स' : 'Bookmarked Notes'} ({bookmarkedMaterials.length})
        </button>
      </div>

      {/* Tab 1: Enrolled Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start space-x-3.5">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-20 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {c.category}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {isHindi && c.titleHindi ? c.titleHindi : c.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {c.lessons.length} {isHindi ? 'वीडियो लेक्चर्स' : 'Lectures'} • {c.totalDuration}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('video-player', { courseId: c.id, lessonId: c.lessons[0]?.id })}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-orange-500/20 self-start sm:self-auto"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{isHindi ? 'क्लास देखें' : 'Watch Lectures'}</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border p-6">
              <p className="text-xs text-slate-500">{isHindi ? 'आपने अभी किसी कोर्स में नामांकन नहीं किया है।' : 'No enrolled courses yet.'}</p>
              <button onClick={() => navigateTo('courses')} className="mt-2 text-xs font-bold text-orange-600">
                {isHindi ? 'कोर्स खोजें' : 'Browse Courses'} ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Test Attempts */}
      {activeTab === 'tests' && (
        <div className="space-y-3">
          {userAttempts.length > 0 ? (
            userAttempts.map((att) => (
              <div
                key={att.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{att.examTitle}</h4>
                  <p className="text-xs text-slate-500">
                    स्कोर: <strong className="text-orange-600">{att.score.toFixed(1)}</strong> / {att.maxScore} • सटीकता: {att.accuracy}%
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('exam-result', { attemptId: att.id })}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  हल देखें
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border p-6">
              <p className="text-xs text-slate-500">कोई टेस्ट परिणाम नहीं मिला।</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Certificates */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 rounded-3xl border-2 border-amber-300 dark:border-amber-700/60 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  {cert.verificationCode}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {cert.courseTitle}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  जारी तिथि: {cert.issueDate} • मार्गदर्शक: {cert.instructorName}
                </p>
              </div>

              <button
                onClick={() => setSelectedCertificate(cert)}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>प्रमाणपत्र देखें व डाउनलोड करें</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Bookmarked Notes */}
      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bookmarkedMaterials.map((mat) => (
            <div
              key={mat.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-orange-600">{mat.subject}</span>
                <h4 className="font-bold text-xs line-clamp-1">{mat.titleHindi || mat.title}</h4>
              </div>
              <button
                onClick={() => navigateTo('materials', { openMaterialId: mat.id })}
                className="px-3 py-1.5 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300 rounded-xl font-bold text-xs"
              >
                खोलें
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

    </div>
  );
};
