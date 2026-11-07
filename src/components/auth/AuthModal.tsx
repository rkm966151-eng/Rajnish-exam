/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, language, showToast } = useApp();
  const isHindi = language === 'hi';

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  
  // Inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('123456');

  if (!authModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      showToast(isHindi ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Please enter valid 10-digit mobile number', 'error');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    showToast(isHindi ? `ओटीपी भेजा गया: ${newOtp}` : `OTP Sent: ${newOtp}`, 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
      showToast(isHindi ? 'अमान्य ओटीपी! कृपया सही ओटीपी दर्ज करें।' : 'Invalid OTP. Please check code.', 'error');
      return;
    }
    const res = login(phone, enteredOtp);
    if (res.success) {
      setAuthModalOpen(false);
    } else {
      showToast(res.message || 'Error', 'error');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast(isHindi ? 'कृपया मान्य ईमेल दर्ज करें' : 'Please enter valid email address', 'error');
      return;
    }
    const res = login(email, password || 'password123');
    if (res.success) {
      setAuthModalOpen(false);
    } else {
      showToast(res.message || 'Error', 'error');
    }
  };

  const handleQuickDemo = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      login('admin@rajnishfactory.com', 'admin123');
    } else {
      login('student@rajnishfactory.com', 'student123');
    }
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            RAJNISH FACTORY
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {tab === 'login' 
              ? (isHindi ? 'अपने खाते में लॉगिन करें और पढ़ाई जारी रखें' : 'Login to your account to continue learning')
              : tab === 'register'
              ? (isHindi ? 'नया छात्र खाता बनाएं और तुरंत पढ़ना शुरू करें' : 'Create a new student account to start learning')
              : (isHindi ? 'पासवर्ड रीसेट करने के लिए विवरण दर्ज करें' : 'Enter details to reset password')}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            onClick={() => { setTab('login'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isHindi ? 'लॉगिन' : 'Login'}
          </button>
          <button
            onClick={() => { setTab('register'); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isHindi ? 'रजिस्ट्रेशन' : 'Register'}
          </button>
        </div>

        {/* Mode selector (Phone / Email) */}
        <div className="flex items-center justify-center space-x-4 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => { setAuthMode('phone'); setOtpSent(false); }}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition-all ${
              authMode === 'phone'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isHindi ? 'मोबाइल नंबर (OTP)' : 'Mobile (OTP)'}</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setOtpSent(false); }}
            className={`flex items-center space-x-1.5 pb-1 border-b-2 transition-all ${
              authMode === 'email'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                : 'border-transparent hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isHindi ? 'ईमेल और पासवर्ड' : 'Email & Password'}</span>
          </button>
        </div>

        {/* Phone OTP Auth Form */}
        {authMode === 'phone' && (
          <div className="space-y-4">
            {tab === 'register' && !otpSent && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHindi ? 'आपका पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHindi ? 'जैसे: राहुल कुमार' : 'e.g. Rahul Kumar'}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-500">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pl-12 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 font-medium tracking-wider"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{isHindi ? 'ओटीपी (OTP) भेजें' : 'Get OTP Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 animate-in fade-in duration-200">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold">{isHindi ? 'डेमो सत्यापन कोड:' : 'Demo Verification Code:'} <span className="font-mono font-bold text-sm text-orange-600 dark:text-orange-400">{generatedOtp}</span></p>
                  <p className="text-[11px] opacity-80">{isHindi ? 'सुरक्षित प्रमाणीकरण के लिए यह ओटीपी दर्ज करें।' : 'Enter this OTP to complete secure verification.'}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHindi ? '6 अंकों का ओटीपी दर्ज करें' : 'Enter 6-digit OTP'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.slice(0, 6))}
                      placeholder={generatedOtp}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500 tracking-widest font-mono text-center text-lg font-bold"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <button type="button" onClick={() => setEnteredOtp(generatedOtp)} className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                    {isHindi ? 'ऑटो-भरें (Auto-Fill)' : 'Auto-Fill OTP'}
                  </button>
                  <button type="button" onClick={() => setOtpSent(false)} className="hover:underline">
                    {isHindi ? 'नंबर बदलें' : 'Change Number'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHindi ? 'ओटीपी सत्यापित कर लॉगिन करें' : 'Verify & Sign In'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Email Auth Form */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHindi ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Er. Rajnish"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isHindi ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@rajnishfactory.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? 'पासवर्ड' : 'Password'}
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => showToast(isHindi ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।' : 'Reset link sent to email', 'info')}
                    className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    {isHindi ? 'पासवर्ड भूल गए?' : 'Forgot?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>{tab === 'login' ? (isHindi ? 'लॉगिन करें' : 'Sign In') : (isHindi ? 'खाता बनाएं' : 'Create Account')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 1-Click Fast Demo Logins */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider">
            {isHindi ? 'त्वरित 1-क्लिक डेमो एक्सेस' : 'Quick 1-Click Demo Access'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHindi ? 'छात्र डेमो (Student)' : 'Demo Student'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center space-x-1.5 border border-purple-200 dark:border-purple-800/50 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{isHindi ? 'मास्टर एडमिन' : 'Master Admin'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
