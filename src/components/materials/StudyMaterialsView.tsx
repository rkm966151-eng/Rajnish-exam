/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Share2,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudyMaterial } from '../../types';
import { AuthService } from '../../services/auth';

export const StudyMaterialsView: React.FC = () => {
  const { materials, user, refreshUser, showToast, language, routeParams } = useApp();
  const isHindi = language === 'hi';

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [readingMaterial, setReadingMaterial] = useState<StudyMaterial | null>(() => {
    if (routeParams.openMaterialId) {
      return materials.find(m => m.id === routeParams.openMaterialId) || null;
    }
    return null;
  });

  const [pdfPage, setPdfPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const subjects = ['All', 'Mathematics', 'General Science', 'General Awareness', 'Reasoning'];

  const filteredMaterials = materials.filter((mat) => {
    if (selectedSubject !== 'All' && mat.subject !== selectedSubject) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        mat.title.toLowerCase().includes(q) ||
        mat.titleHindi.toLowerCase().includes(q) ||
        mat.chapter.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownload = (mat: StudyMaterial) => {
    const textContent = `================================================
RAJNISH FACTORY - OFFICIAL STUDY MATERIAL
================================================
Document: ${mat.title}
Subject: ${mat.subject}
Chapter: ${mat.chapter}
Author: ${mat.author}
Pages: ${mat.pages}
Published: ${mat.uploadDate}
Official Portal: https://rajnishfactory.com

KEY REVISION SUMMARY & FORMULAS:
1. Short Trick Concept: Always verify unit digits and digital roots before tedious arithmetic calculation.
2. Speed Formulation: Speed = Distance / Time (convert km/h to m/s via factor 5/18).
3. Physics Constants: g = 9.8 m/s^2, Speed of Light c = 3 x 10^8 m/s.
4. Chemistry Periodic Law: Elements arranged in increasing atomic numbers (Modern Periodic Table).
5. Indian Polity: Article 32 (Constitutional Remedies) is called the Heart and Soul of the Constitution.

For full interactive video explanations, download the Rajnish Factory Android Application.
================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mat.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(isHindi ? `${mat.titleHindi || mat.title} डाउनलोड प्रारंभ हुआ!` : `Downloading ${mat.title}...`, 'success');
  };

  const handleToggleBookmark = (id: string) => {
    if (!user) {
      showToast(isHindi ? 'बुकमार्क करने के लिए कृपया पहले लॉगिन करें' : 'Please login to bookmark', 'info');
      return;
    }
    const isBookmarked = AuthService.toggleBookmarkMaterial(id);
    refreshUser();
    showToast(
      isBookmarked 
        ? (isHindi ? 'नोट्स बुकमार्क में जोड़ा गया' : 'Added to Bookmarks') 
        : (isHindi ? 'बुकमार्क से हटाया गया' : 'Removed from Bookmarks'),
      'success'
    );
  };

  return (
    <div className="space-y-6 pb-20 pt-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            📑 {isHindi ? 'डिजिटल लाइब्रेरी एवं पीडीएफ नोट्स' : 'Digital Library & PDF Notes'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isHindi 
              ? 'प्रतियोगी परीक्षाओं के लिए हस्तलिखित नोट्स, सूत्र पुस्तकें व पिछले वर्षों के प्रश्न पत्र' 
              : 'Download handwritten notes, formula sheets, and past year solved question papers'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isHindi ? 'नोट्स या विषय खोजें...' : 'Search study materials...'}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-transparent focus:border-orange-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedSubject === subj
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-500/50'
            }`}
          >
            {subj === 'All' ? (isHindi ? 'सभी विषय' : 'All Subjects') : subj}
          </button>
        ))}
      </div>

      {/* Material Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => {
          const isBookmarked = user?.savedMaterialIds.includes(mat.id);

          return (
            <div
              key={mat.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      PDF
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                          {mat.subject}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                          {mat.category}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                        {isHindi && mat.titleHindi ? mat.titleHindi : mat.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleBookmark(mat.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Bookmark Note"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-orange-600 fill-orange-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {mat.previewSnippet}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <span>📄 {mat.pages} {isHindi ? 'पेज' : 'Pages'}</span>
                  <span>💾 {mat.fileSize}</span>
                  <span>📥 {mat.downloadsCount.toLocaleString()} {isHindi ? 'डाउनलोड्स' : 'Downloads'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setReadingMaterial(mat);
                    setPdfPage(1);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-950/70 text-orange-700 dark:text-orange-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-orange-200 dark:border-orange-800"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isHindi ? 'पीडीएफ पढ़ें' : 'Read PDF'}</span>
                </button>

                <button
                  onClick={() => handleDownload(mat)}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHindi ? 'डाउनलोड करें' : 'Download'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-App PDF Reader Modal */}
      {readingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            
            {/* PDF Viewer Header */}
            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  PDF
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {isHindi && readingMaterial.titleHindi ? readingMaterial.titleHindi : readingMaterial.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate">
                    {readingMaterial.subject} • {readingMaterial.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(160, prev + 20))}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(60, prev - 20))}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(readingMaterial)}
                  className="p-1.5 rounded-lg bg-orange-600 text-white font-bold text-xs px-2.5 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => setReadingMaterial(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PDF Render Simulation View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 dark:bg-slate-950 flex justify-center">
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-xl bg-white text-slate-900 rounded-2xl shadow-xl p-6 sm:p-10 transition-transform duration-200 min-h-[600px] space-y-6 border border-slate-300"
              >
                {/* Header of Simulated PDF Page */}
                <div className="border-b-2 border-orange-600 pb-3 flex items-center justify-between">
                  <div>
                    <span className="font-black text-orange-600 tracking-wider text-xs">RAJNISH FACTORY OFFICIAL NOTES</span>
                    <h2 className="text-base font-extrabold text-slate-900">{readingMaterial.titleHindi || readingMaterial.title}</h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Page {pdfPage} / {readingMaterial.pages}</span>
                </div>

                {/* Simulated Content */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800">
                  <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-orange-950 font-semibold">
                    💡 महत्वपूर्ण परीक्षा सूत्र (Golden Formula #{pdfPage}):
                  </div>
                  <p className="font-serif">
                    संख्या पद्धति एवं बीजगणित के महत्वपूर्ण अनुप्रयोग: जब किसी संख्या N को क्रमागत रूप से a, b, c से विभाजित किया जाता है और शेषफल x, y, z प्राप्त होते हैं, तो अभीष्ट संख्या:
                  </p>
                  <div className="p-4 bg-slate-100 rounded-xl font-mono text-center text-sm font-bold text-slate-800 border">
                    N = LCM(a, b, c) × K + R
                  </div>
                  <p>
                    <strong>नोट:</strong> एसएससी, रेलवे एवं राज्य स्तरीय परीक्षाओं में सीधे इस प्रकार के प्रश्न विगत 5 वर्षों में 35+ बार पूछे गए हैं। नीचे दिए गए अभ्यास प्रश्नों को बिना पेन चलाए हल करने का प्रयास करें।
                  </p>

                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-slate-900">अभ्यास प्रश्न 1:</p>
                    <p className="bg-slate-50 p-2.5 rounded-lg border text-xs">
                      वह छोटी से छोटी संख्या कौन सी है जिसे 12, 15, 20 और 54 से विभाजित करने पर प्रत्येक स्थिति में 8 शेषफल बचता है?
                    </p>
                    <p className="text-emerald-700 font-bold text-xs">
                      हल: LCM(12, 15, 20, 54) = 540. अभीष्ट संख्या = 540 + 8 = 548 (उत्तर)।
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 text-center font-mono">
                  © Rajnish Factory Education • Verified Digital Handout • Page {pdfPage}
                </div>
              </div>
            </div>

            {/* PDF Bottom Pagination Controller */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-850 shrink-0">
              <button
                disabled={pdfPage <= 1}
                onClick={() => setPdfPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold disabled:opacity-40 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला पेज</span>
              </button>

              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                पेज {pdfPage} / {readingMaterial.pages}
              </span>

              <button
                disabled={pdfPage >= readingMaterial.pages}
                onClick={() => setPdfPage(prev => Math.min(readingMaterial.pages, prev + 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold disabled:opacity-40 flex items-center space-x-1"
              >
                <span>अगला पेज</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
