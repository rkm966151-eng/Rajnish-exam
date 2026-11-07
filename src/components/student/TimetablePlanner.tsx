/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Clock, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimetableEntry } from '../../types';

const INITIAL_SCHEDULE: TimetableEntry[] = [
  { id: 'tt-1', day: 'Monday', time: '07:00 AM - 08:30 AM', subject: 'Mathematics', topic: 'Number System & Unit Digit Short Tricks', isDone: true },
  { id: 'tt-2', day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'General Science', topic: 'Light Reflection & Human Eye NCERT', isDone: true },
  { id: 'tt-3', day: 'Monday', time: '05:00 PM - 06:00 PM', subject: 'Reasoning', topic: 'Syllogism 100-50 Concept Practice', isDone: false },
  { id: 'tt-4', day: 'Tuesday', time: '07:00 AM - 08:30 AM', subject: 'Mathematics', topic: 'Percentage & Fractional Calculations', isDone: false },
  { id: 'tt-5', day: 'Wednesday', time: '06:00 PM - 07:30 PM', subject: 'Mock Test', topic: 'SSC CGL Full Length Test 01', isDone: false },
];

export const TimetablePlanner: React.FC = () => {
  const { goBack, showToast, language } = useApp();
  const isHindi = language === 'hi';

  const [schedule, setSchedule] = useState<TimetableEntry[]>(() => {
    try {
      const raw = localStorage.getItem('rf_timetable');
      return raw ? JSON.parse(raw) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newTime, setNewTime] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleDone = (id: string) => {
    const updated = schedule.map(item => item.id === id ? { ...item, isDone: !item.isDone } : item);
    setSchedule(updated);
    localStorage.setItem('rf_timetable', JSON.stringify(updated));
    showToast(isHindi ? 'स्थिति अपडेट की गई!' : 'Status updated!', 'success');
  };

  const handleDelete = (id: string) => {
    const updated = schedule.filter(item => item.id !== id);
    setSchedule(updated);
    localStorage.setItem('rf_timetable', JSON.stringify(updated));
    showToast(isHindi ? 'हटा दिया गया' : 'Deleted', 'info');
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newTopic.trim()) return;

    const entry: TimetableEntry = {
      id: 'tt_' + Date.now(),
      day: selectedDay as any,
      time: newTime || '08:00 AM - 09:30 AM',
      subject: newSubject.trim(),
      topic: newTopic.trim(),
      isDone: false,
    };

    const updated = [...schedule, entry];
    setSchedule(updated);
    localStorage.setItem('rf_timetable', JSON.stringify(updated));
    setNewSubject('');
    setNewTopic('');
    setNewTime('');
    setShowAddForm(false);
    showToast(isHindi ? 'नया अध्ययन लक्ष्य जोड़ा गया!' : 'Study target added!', 'success');
  };

  const currentDayEntries = schedule.filter(item => item.day === selectedDay);

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
          <Calendar className="w-5 h-5 text-orange-500" />
          <span>{isHindi ? 'दैनिक अध्ययन समय-सारिणी (Timetable)' : 'Study Timetable Planner'}</span>
        </h1>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHindi ? 'नया जोड़ें' : 'Add Slot'}</span>
        </button>
      </div>

      {/* Days Horizontal Scroll */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              selectedDay === d
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Add Slot Form Modal/Card */}
      {showAddForm && (
        <form onSubmit={handleAddEntry} className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-orange-500/40 shadow-md space-y-3 animate-in fade-in">
          <h3 className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
            {isHindi ? `${selectedDay} के लिए नया अध्ययन स्लॉट जोड़ें` : `Add slot for ${selectedDay}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder={isHindi ? 'विषय (उदा: गणित)' : 'Subject (e.g. Mathematics)'}
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="text"
              placeholder={isHindi ? 'अध्याय / टॉपिक' : 'Topic (e.g. Unit Digit)'}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="text"
              placeholder={isHindi ? 'समय (उदा: 08:00 AM - 09:30 AM)' : 'Time (e.g. 08:00 AM - 09:30 AM)'}
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
            >
              सेव करें
            </button>
          </div>
        </form>
      )}

      {/* Slots List for Selected Day */}
      <div className="space-y-3">
        {currentDayEntries.length > 0 ? (
          currentDayEntries.map((slot) => (
            <div
              key={slot.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                slot.isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 opacity-75'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={() => handleToggleDone(slot.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    slot.isDone
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-orange-500'
                  }`}
                >
                  {slot.isDone && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      {slot.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{slot.time}</span>
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 ${slot.isDone ? 'line-through text-slate-400' : ''}`}>
                    {slot.topic}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => handleDelete(slot.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                title="Delete Slot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">{isHindi ? `${selectedDay} के लिए कोई अध्ययन स्लॉट नहीं है` : `No slots scheduled for ${selectedDay}`}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              + {isHindi ? 'पहला स्लॉट जोड़ें' : 'Add first study slot'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
