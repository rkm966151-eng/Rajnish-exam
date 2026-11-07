/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Check, Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SubscriptionView: React.FC = () => {
  const { user, openPayment, goBack, language } = useApp();
  const isHindi = language === 'hi';

  const plans = [
    {
      id: 'plan-monthly',
      title: 'मासिक पास (1 Month)',
      titleEn: '1 Month Explorer Pass',
      price: 499,
      originalPrice: 999,
      duration: '30 Days',
      features: [
        'सभी लाइव व रिकॉर्डेड कोर्सेज का एक्सेस',
        'असीमित ऑनलाइन मॉक टेस्ट',
        'सभी हस्तलिखित पीडीएफ नोट्स',
        'डाउट समाधान सहायता',
      ],
      isPopular: false,
    },
    {
      id: 'plan-yearly-vip',
      title: 'वार्षिक महा-क्रांति वीआईपी पास (1 Year)',
      titleEn: '1 Year All-Access VIP Pass',
      price: 1499,
      originalPrice: 4999,
      duration: '365 Days',
      features: [
        'एसएससी, रेलवे एवं सभी प्रतियोगी परीक्षाओं के समस्त बैच',
        '100+ फुल लेंथ ऑल इंडिया टेस्ट सीरीज',
        'समस्त फॉर्मूला बुक्स व ई-बुक्स डाउनलोड',
        'प्राथमिकता पर लाइव डाउट चैट',
        'ऑफ़लाइन डाउनलोड एवं प्रिंट करने योग्य नोट्स',
        'वेरिफाइड समापन प्रमाणपत्र',
      ],
      isPopular: true,
    },
    {
      id: 'plan-lifetime',
      title: 'लाइफटाइम सलेक्शन पास',
      titleEn: 'Lifetime Selection Pass',
      price: 2999,
      originalPrice: 8999,
      duration: 'Lifetime',
      features: [
        'जब तक सलेक्शन न हो तब तक संपूर्ण एक्सेस',
        'भविष्य में आने वाले सभी नए बैच स्वतः शामिल',
        'व्यक्तिगत मेंटरशिप व स्ट्रैटेजी कॉल',
        'सर्वोच्च ऑल इंडिया टेस्ट सीरीज',
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="space-y-6 pb-20 pt-2 max-w-4xl mx-auto">
      
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
          <Award className="w-5 h-5 text-amber-500" />
          <span>{isHindi ? 'रजनीश फैक्ट्री वीआईपी पास' : 'VIP Subscription Plans'}</span>
        </h1>

        <div className="w-8" />
      </div>

      {/* Active Subscription Status Banner */}
      {user?.subscription?.isActive && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
              सक्रिय सदस्यता (Active)
            </span>
            <h3 className="text-base font-extrabold mt-1">{user.subscription.planName}</h3>
            <p className="text-xs text-emerald-100">
              वैधता: {new Date(user.subscription.expiresAt).toLocaleDateString()} तक
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-4 relative transition-all ${
              p.isPopular
                ? 'bg-white dark:bg-slate-800 border-orange-500 shadow-xl shadow-orange-500/10 scale-105 z-10'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
          >
            {p.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                ⭐ {isHindi ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {isHindi ? p.title : p.titleEn}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{p.duration}</span>
              </div>

              <div className="flex items-baseline space-x-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-3xl font-black text-slate-900 dark:text-white">₹{p.price}</span>
                <span className="text-xs line-through text-slate-400">₹{p.originalPrice}</span>
              </div>

              <div className="space-y-2 pt-2">
                {p.features.map((f, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => openPayment({ type: 'plan', item: p })}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                p.isPopular
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white shadow-orange-500/20'
                  : 'bg-slate-900 hover:bg-black dark:bg-slate-700 text-white'
              }`}
            >
              <span>{isHindi ? `₹${p.price} में अभी सक्रिय करें` : `Activate for ₹${p.price}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
