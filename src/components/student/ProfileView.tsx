/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  Moon, 
  Sun, 
  Flame, 
  Award,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/auth';

export const ProfileView: React.FC = () => {
  const { user, refreshUser, logout, showToast, language, toggleLanguage, theme, toggleTheme, goBack } = useApp();
  const isHindi = language === 'hi';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  ];

  if (!user) {
    return (
      <div className="p-8 text-center space-y-3">
        <p>Please login to view profile</p>
        <button onClick={goBack} className="px-4 py-2 bg-orange-600 text-white rounded-xl">Back</button>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = name.trim();
    user.email = email.trim();
    user.phone = phone.trim();
    user.avatar = avatar;
    AuthService.saveUser(user);
    refreshUser();
    showToast(isHindi ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast(isHindi ? 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(isHindi ? 'पासवर्ड मेल नहीं खाते हैं' : 'Passwords do not match', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast(isHindi ? 'पासवर्ड सफलतापूर्वक बदल दिया गया!' : 'Password changed successfully!', 'success');
  };

  const handleDeleteAccount = () => {
    AuthService.deleteAccount(user.id);
    logout();
    showToast(isHindi ? 'आपका खाता हटा दिया गया है' : 'Account deleted', 'info');
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'वापस' : 'Back'}</span>
        </button>

        <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          👤 {isHindi ? 'प्रोफ़ाइल एवं सेटिंग्स' : 'Profile & Settings'}
        </h1>

        <div className="w-8" />
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
        
        {/* Avatar Selector */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-orange-500/30 shadow-md"
          />
          <span className="text-xs font-bold text-slate-500">
            {isHindi ? 'अवतार चुनें:' : 'Select Avatar:'}
          </span>
          <div className="flex items-center space-x-2">
            {sampleAvatars.map((av, idx) => (
              <img
                key={idx}
                src={av}
                alt="Option"
                onClick={() => setAvatar(av)}
                className={`w-9 h-9 rounded-full object-cover cursor-pointer transition-transform ${avatar === av ? 'ring-2 ring-orange-600 scale-110' : 'opacity-60 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Edit Info Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isHindi ? 'पूरा नाम' : 'Full Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isHindi ? 'ईमेल पता' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isHindi ? 'मोबाइल नंबर' : 'Phone Number'}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 pl-10 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isHindi ? 'प्रोफ़ाइल सुरक्षित करें' : 'Save Profile Changes'}</span>
          </button>
        </form>

      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Lock className="w-4 h-4 text-orange-500" />
          <span>{isHindi ? 'पासवर्ड बदलें' : 'Change Password'}</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder={isHindi ? 'वर्तमान पासवर्ड' : 'Current Password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
          />
          <input
            type="password"
            placeholder={isHindi ? 'नया पासवर्ड' : 'New Password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
          />
          <input
            type="password"
            placeholder={isHindi ? 'नए पासवर्ड की पुष्टि करें' : 'Confirm New Password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs"
          >
            {isHindi ? 'पासवर्ड अपडेट करें' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Preferences (Language & Theme) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {isHindi ? 'ऐप प्राथमिकताएं' : 'App Preferences'}
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Globe className="w-4 h-4 text-orange-500" />
            <span>{isHindi ? 'ऐप भाषा (Language)' : 'Language'}</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-xs text-orange-600 dark:text-orange-400"
          >
            {language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isHindi ? 'थीम मोड' : 'Theme'}</span>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-xs"
          >
            {theme === 'dark' ? 'डार्क मोड' : 'लाइट मोड'}
          </button>
        </div>
      </div>

      {/* Danger Zone: Logout and Delete Account */}
      <div className="p-5 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
        <h3 className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">
          {isHindi ? 'खाता प्रबंधन (Account Actions)' : 'Account Actions'}
        </h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={logout}
            className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{isHindi ? 'लॉगआउट करें' : 'Sign Out'}</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isHindi ? 'खाता हटाएं' : 'Delete Account'}</span>
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-xs space-y-2">
            <p className="text-rose-600 font-bold">
              चेतावनी: आपका खाता और सभी अध्ययन प्रगति हमेशा के लिए हटा दी जाएगी।
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs w-full"
            >
              हाँ, हमेशा के लिए खाता हटाएं
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
