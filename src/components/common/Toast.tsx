/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/50 bg-slate-900/95 text-emerald-100',
    error: 'border-rose-500/50 bg-slate-900/95 text-rose-100',
    info: 'border-sky-500/50 bg-slate-900/95 text-sky-100',
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs font-semibold ${borderColors[toast.type]}`}>
        {icons[toast.type]}
        <span className="flex-1 leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
