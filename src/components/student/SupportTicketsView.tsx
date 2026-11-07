/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, Send, MessageSquare, Phone, Mail, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { SupportTicket } from '../../types';

export const SupportTicketsView: React.FC = () => {
  const { user, goBack, showToast, language } = useApp();
  const isHindi = language === 'hi';

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getTickets(user?.id));

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const ticket: SupportTicket = {
      id: 'tkt_' + Date.now(),
      userId: user?.id || 'guest',
      userName: user?.name || 'Student',
      userEmail: user?.email || 'student@rajnishfactory.com',
      userPhone: phone || '9876543210',
      subject: subject.trim(),
      message: message.trim(),
      status: 'In Progress',
      createdAt: new Date().toLocaleDateString(),
      reply: 'हमारी सहायता टीम को आपका अनुरोध प्राप्त हो गया है। हम जल्द ही आपसे संपर्क करेंगे।',
    };

    StorageService.saveTicket(ticket);
    setTickets([ticket, ...tickets]);
    setSubject('');
    setMessage('');
    showToast(isHindi ? 'सपोर्ट टिकट सफलतापूर्वक दर्ज किया गया!' : 'Ticket submitted successfully!', 'success');
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
          <HelpCircle className="w-5 h-5 text-orange-500" />
          <span>{isHindi ? 'सहायता एवं संपर्क केंद्र' : 'Help & Support'}</span>
        </h1>

        <div className="w-8" />
      </div>

      {/* Emergency Contact Quick Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">हेल्पलाइन नंबर</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">+91 98765 43210</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">सपोर्ट ईमेल</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate block">support@rajnishfactory.com</span>
          </div>
        </div>
      </div>

      {/* New Ticket Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          ✍️ {isHindi ? 'अपनी समस्या / अनुरोध दर्ज करें' : 'Create Support Ticket'}
        </h3>

        <form onSubmit={handleSubmitTicket} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              विषय (Subject)
            </label>
            <input
              type="text"
              placeholder={isHindi ? 'जैसे: वीडियो चलने में समस्या / पेमेंट रसीद' : 'e.g. Video playback query or payment inquiry'}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              मोबाइल नंबर
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              विस्तार से बताएं (Message)
            </label>
            <textarea
              rows={3}
              placeholder={isHindi ? 'अपनी समस्या का विवरण यहाँ लिखें...' : 'Describe your problem here...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{isHindi ? 'टिकट सबमिट करें' : 'Submit Ticket'}</span>
          </button>
        </form>
      </div>

      {/* Existing Tickets */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
          {isHindi ? 'आपके पिछले टिकट' : 'Your Previous Tickets'}
        </h3>

        {tickets.map((t) => (
          <div key={t.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{t.subject}</span>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">
                {t.status}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400">{t.message}</p>
            {t.reply && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">✓ सपोर्ट टीम का उत्तर:</span>
                <span>{t.reply}</span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
