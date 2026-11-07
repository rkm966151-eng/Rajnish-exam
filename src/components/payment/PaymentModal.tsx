/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Tag, QrCode, CreditCard, Building, ArrowRight, Download, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';

export const PaymentModal: React.FC = () => {
  const { paymentModalOpen, closePayment, paymentTarget, user, refreshUser, showToast, language, navigateTo } = useApp();
  const isHindi = language === 'hi';

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  if (!paymentModalOpen || !paymentTarget) return null;

  const item = paymentTarget.item;
  const originalPrice = item.price || 999;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    const coupons = StorageService.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === code && c.isActive);

    if (found) {
      const discount = Math.min(found.maxDiscount, Math.round((originalPrice * found.discountPercentage) / 100));
      setAppliedCoupon({ code: found.code, discount });
      showToast(isHindi ? `कूपन ${found.code} लागू हुआ! ₹${discount} की बचत हुई।` : `Coupon ${found.code} applied! Saved ₹${discount}.`, 'success');
    } else {
      showToast(isHindi ? 'अमान्य या समाप्त कूपन कोड' : 'Invalid or expired coupon code', 'error');
    }
  };

  const handlePayNow = () => {
    if (!user) {
      showToast(isHindi ? 'कृपया भुगतान करने से पहले लॉगिन करें' : 'Please login to complete payment', 'error');
      return;
    }

    setIsProcessing(true);
    // Simulate secure Razorpay order processing and verification
    setTimeout(() => {
      setIsProcessing(false);
      const orderId = 'RF_ORD_' + Math.floor(100000 + Math.random() * 900000);
      const paymentId = 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();

      if (paymentTarget.type === 'course') {
        AuthService.enrollInCourse(item.id);
      } else {
        // subscription plan
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          currentUser.subscription = {
            planId: item.id || 'vip-annual',
            planName: item.title || 'VIP All-Access Pass',
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          };
          // Also enroll in all available courses
          const allCourses = StorageService.getCourses();
          allCourses.forEach(c => {
            if (!currentUser.enrolledCourseIds.includes(c.id)) {
              currentUser.enrolledCourseIds.push(c.id);
            }
          });
          AuthService.saveUser(currentUser);
        }
      }

      refreshUser();

      setPaymentSuccess({
        orderId,
        paymentId,
        amount: finalPrice,
        itemName: item.title || item.name,
        date: new Date().toLocaleString(),
      });

      showToast(isHindi ? 'भुगतान सफल! आपको कोर्स का एक्सेस मिल गया है।' : 'Payment Verified! Access Granted.', 'success');
    }, 1500);
  };

  const handleDownloadInvoice = () => {
    if (!paymentSuccess) return;
    const invoiceContent = `================================================
RAJNISH FACTORY - OFFICIAL TAX INVOICE
================================================
Invoice No: ${paymentSuccess.orderId}
Transaction ID: ${paymentSuccess.paymentId}
Date & Time: ${paymentSuccess.date}
Student Name: ${user?.name || 'Student'}
Student Email: ${user?.email || 'N/A'}
Student Phone: ${user?.phone || 'N/A'}

Item Purchased: ${paymentSuccess.itemName}
Amount Paid: INR ₹${paymentSuccess.amount}.00
Payment Gateway: Razorpay Secure (Verified)
Status: PAID & COMPLETED
================================================
Thank you for learning with Rajnish Factory!
Support: support@rajnishfactory.com | +91 98765 43210
================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${paymentSuccess.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(isHindi ? 'रसीद डाउनलोड हो गई है' : 'Invoice downloaded', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closePayment}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentSuccess ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                ₹
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Razorpay Secure Checkout
                  </h3>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">
                    256-bit SSL
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rajnish Factory Official Merchant Gateway
                </p>
              </div>
            </div>

            {/* Order Item Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    {paymentTarget.type === 'course' ? (isHindi ? 'कोर्स नामांकन' : 'Course Enrollment') : (isHindi ? 'वीआईपी पास' : 'VIP Pass')}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                    {isHindi && item.titleHindi ? item.titleHindi : item.title || item.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs line-through text-slate-400">₹{item.originalPrice || originalPrice * 2}</span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">₹{originalPrice}</p>
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder={isHindi ? 'कूपन कोड (उदा: FACTORY50)' : 'Coupon Code (e.g. FACTORY50)'}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 pl-9 rounded-xl text-xs border border-slate-200 dark:border-slate-700 uppercase font-mono font-bold tracking-wider focus:outline-none focus:border-orange-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  {isHindi ? 'लागू करें' : 'Apply'}
                </button>
              </form>
              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold">✓ कूपन '{appliedCoupon.code}' सक्रिय है</span>
                  <span>-₹{appliedCoupon.discount}</span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isHindi ? 'भुगतान विधि चुनें' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px]">Card / EMI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building className="w-5 h-5 text-purple-600" />
                  <span className="text-[11px]">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{isHindi ? 'मूल मूल्य' : 'Subtotal'}</span>
                <span>₹{originalPrice}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{isHindi ? 'कूपन छूट' : 'Discount'}</span>
                  <span>-₹{appliedCoupon.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>{isHindi ? 'कुल देय राशि' : 'Total Payable'}</span>
                <span className="text-orange-600 dark:text-orange-400">₹{finalPrice}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isHindi ? 'सुरक्षित भुगतान संसाधित हो रहा है...' : 'Processing Secure Payment...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHindi ? `₹${finalPrice} सुरक्षित भुगतान करें` : `Pay Securely ₹${finalPrice}`}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isHindi ? 'भुगतान सफल रहा!' : 'Payment Successful!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? 'आपका नामांकन सक्रिय कर दिया गया है।' : 'Your enrollment has been activated.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'ऑर्डर आईडी:' : 'Order ID:'}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{paymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'ट्रांजेक्शन आईडी:' : 'Transaction ID:'}</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{paymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'भुगतान की गई राशि:' : 'Amount Paid:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{paymentSuccess.amount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{isHindi ? 'रसीद डाउनलोड करें' : 'Download Invoice'}</span>
              </button>

              <button
                onClick={() => {
                  closePayment();
                  navigateTo('courses');
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <span>{isHindi ? 'पढ़ाई शुरू करें' : 'Start Learning'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
