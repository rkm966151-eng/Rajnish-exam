/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Certificate } from '../../types';
import { useApp } from '../../context/AppContext';

export const CertificateModal: React.FC<{
  certificate: Certificate | null;
  onClose: () => void;
}> = ({ certificate, onClose }) => {
  const { showToast, language } = useApp();
  const isHindi = language === 'hi';

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCertificate = () => {
    const certText = `======================================================================
               RAJNISH FACTORY - VERIFIED CERTIFICATE OF COMPLETION
======================================================================
Certificate ID: ${certificate.verificationCode}
Issued On: ${certificate.issueDate}

THIS IS TO CERTIFY THAT
${certificate.studentName.toUpperCase()}

has successfully completed all lectures, curriculum modules, and assessments for:
"${certificate.courseTitle}"

Lead Instructor: ${certificate.instructorName}
Issuing Authority: Rajnish Factory Academic Board
Verification URL: https://rajnishfactory.com/verify/${certificate.verificationCode}
======================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${certificate.verificationCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(isHindi ? 'प्रमाणपत्र सफलतापूर्वक डाउनलोड हुआ' : 'Certificate downloaded successfully', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Outer Border Frame */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 border-4 border-double border-amber-500/60 shadow-inner text-center space-y-4 print:p-0 print:border-none">
          
          {/* Top Crest */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              RAJNISH FACTORY ACADEMIC COUNCIL
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 dark:text-white mt-1">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-500">
              सत्यापित समापन प्रमाण पत्र
            </p>
          </div>

          <div className="py-2 space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-serif italic">This is proudly presented to:</p>
            <h3 className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400 uppercase tracking-wide">
              {certificate.studentName}
            </h3>
            <div className="w-32 h-0.5 bg-amber-500/40 mx-auto mt-1" />
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            for successfully completing all video lectures, syllabus modules, and online assessments for the course:
            <br />
            <strong className="text-sm font-extrabold text-slate-900 dark:text-white">
              "{certificate.courseTitle}"
            </strong>
          </p>

          {/* Verification Code & Signatures */}
          <div className="pt-4 border-t border-amber-500/30 flex items-center justify-between text-left text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Verification ID:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{certificate.verificationCode}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Date: {certificate.issueDate}</span>
            </div>

            <div className="text-right">
              <span className="font-serif italic font-bold text-sm text-slate-800 dark:text-slate-200 block">
                {certificate.instructorName}
              </span>
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                Lead Academic Director
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDownloadCertificate}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'प्रमाणपत्र डाउनलोड करें' : 'Download Certificate'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{isHindi ? 'प्रिंट करें' : 'Print'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
