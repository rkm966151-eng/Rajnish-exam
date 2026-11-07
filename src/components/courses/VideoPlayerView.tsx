/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  Settings, 
  FileText, 
  MessageSquare, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { AuthService } from '../../services/auth';

export const VideoPlayerView: React.FC = () => {
  const { routeParams, courses, user, goBack, navigateTo, showToast, refreshUser, language } = useApp();
  const isHindi = language === 'hi';

  const courseId = routeParams.courseId || courses[0]?.id;
  const course = courses.find((c) => c.id === courseId) || courses[0];
  
  const [currentLessonId, setCurrentLessonId] = useState<string>(
    routeParams.lessonId || course?.lessons[0]?.id || ''
  );

  const currentLesson = course?.lessons.find((l) => l.id === currentLessonId) || course?.lessons[0];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState<boolean>(false);
  const [quality, setQuality] = useState<string>('720p (HD)');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'discussion'>('syllabus');

  // Doubt submission state
  const [doubtText, setDoubtText] = useState('');
  const [doubts, setDoubts] = useState([
    { id: 'd1', author: 'Vikash Kumar', time: '10 मिनट पहले', text: 'सर, क्या यह ट्रिक रेलवे एएलपी सीबीटी 2 में भी लागू होगी?', reply: 'हाँ विकाश! यह ट्रिक सभी प्रतियोगी परीक्षाओं के लिए समान रूप से प्रभावी है।' },
    { id: 'd2', author: 'Pooja', time: '1 घंटा पहले', text: 'क्लास नोट्स की पीडीएफ कहाँ से डाउनलोड करें?', reply: 'नीचे दिए गए "क्लास नोट्स" टैब से या डिजिटल लाइब्रेरी में जाकर डाउनलोड कर सकते हैं।' }
  ]);

  // Load saved progress
  useEffect(() => {
    if (currentLesson && videoRef.current) {
      const saved = StorageService.getVideoProgress(currentLesson.id);
      if (saved > 0) {
        videoRef.current.currentTime = saved;
        setCurrentTime(saved);
        showToast(isHindi ? `पिछली स्थिति (${Math.round(saved)}s) से शुरू किया गया` : `Resumed from ${Math.round(saved)}s`, 'info');
      }
    }
  }, [currentLesson?.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !currentLesson) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);
    StorageService.setVideoProgress(currentLesson.id, curr);

    // Auto mark completed if watched 80%
    if (videoRef.current.duration && (curr / videoRef.current.duration) > 0.8) {
      if (user && !user.completedLessonIds.includes(currentLesson.id)) {
        AuthService.markLessonComplete(currentLesson.id);
        refreshUser();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setSpeedMenuOpen(false);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    const newDoubt = {
      id: 'd_' + Date.now(),
      author: user?.name || 'Student',
      time: 'अभी-अभी',
      text: doubtText.trim(),
      reply: 'धन्यवाद! फैकल्टी टीम 24 घंटे के अंदर आपके प्रश्न का उत्तर देगी।',
    };
    setDoubts([newDoubt, ...doubts]);
    setDoubtText('');
    showToast(isHindi ? 'आपका प्रश्न पोस्ट कर दिया गया है' : 'Doubt posted successfully', 'success');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!course || !currentLesson) {
    return <div className="p-8 text-center">Video not found</div>;
  }

  const isCurrentCompleted = user?.completedLessonIds.includes(currentLesson.id);

  return (
    <div className="space-y-4 pb-20 pt-1 max-w-5xl mx-auto">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'कोर्स विवरण' : 'Course Details'}</span>
        </button>

        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
          {course.titleHindi || course.title}
        </span>
      </div>

      {/* Video Player Container */}
      <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 aspect-video group">
        <video
          ref={videoRef}
          src={currentLesson.videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          playsInline
        />

        {/* Big Center Play/Pause Overlay Button */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 ml-1 fill-white" />
            </div>
          </div>
        )}

        {/* Video Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white space-y-2 opacity-90 hover:opacity-100 transition-opacity">
          
          {/* Progress Slider */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <button onClick={togglePlay} className="p-1 hover:text-orange-400 transition-colors">
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button 
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                  }
                }}
                className="p-1 hover:text-orange-400 transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-[11px] font-mono text-slate-300">
                <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Speed Controller */}
              <div className="relative">
                <button
                  onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                  className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-[11px] font-bold font-mono transition-colors"
                >
                  {playbackSpeed}x
                </button>

                {speedMenuOpen && (
                  <div className="absolute bottom-8 right-0 bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-xl flex flex-col space-y-1 text-[11px] z-50">
                    {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`px-3 py-1 rounded-lg text-left ${playbackSpeed === spd ? 'bg-orange-600 text-white font-bold' : 'hover:bg-slate-800'}`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quality indicator */}
              <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">
                {quality}
              </span>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="p-1 hover:text-orange-400 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Title and Action */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            Lecture #{currentLesson.order}
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {isHindi && currentLesson.titleHindi ? currentLesson.titleHindi : currentLesson.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentLesson.summary}
          </p>
        </div>

        <button
          onClick={() => {
            if (user) {
              AuthService.markLessonComplete(currentLesson.id);
              refreshUser();
              showToast(isHindi ? 'लेक्चर पूर्ण चिह्नित किया गया! +10 कॉइन्स प्राप्त हुए।' : 'Lesson marked complete! +10 Coins.', 'success');
            }
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            isCurrentCompleted
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCurrentCompleted ? (isHindi ? 'पूर्ण हो चुका है' : 'Completed') : (isHindi ? 'पूर्ण चिह्नित करें' : 'Mark Complete')}</span>
        </button>
      </div>

      {/* Tab Switcher: Syllabus / Notes / Doubts */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'syllabus'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          📋 {isHindi ? 'सभी लेक्चर्स (Playlist)' : 'Playlist'}
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'notes'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          📝 {isHindi ? 'क्लास नोट्स व हैंडआउट' : 'Class Notes'}
        </button>
        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'discussion'
              ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500'
          }`}
        >
          💬 {isHindi ? 'पूछें डाउट (Ask Doubt)' : 'Discussion / Doubts'}
        </button>
      </div>

      {/* Tab Content 1: Playlist */}
      {activeTab === 'syllabus' && (
        <div className="space-y-2">
          {course.lessons.map((lesson, idx) => {
            const isSelected = lesson.id === currentLesson.id;
            const isDone = user?.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  setCurrentLessonId(lesson.id);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500/60 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-500/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected 
                      ? 'bg-orange-600 text-white' 
                      : isDone 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold line-clamp-1 ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {isHindi && lesson.titleHindi ? lesson.titleHindi : lesson.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{lesson.duration}</p>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  <Play className={`w-4 h-4 ${isSelected ? 'text-orange-600 fill-orange-600' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 2: Notes */}
      {activeTab === 'notes' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentLesson.titleHindi || currentLesson.title} - Official Handout
              </h3>
              <p className="text-xs text-slate-500">
                हस्तलिखित सूत्र, शॉर्ट ट्रिक्स एवं महत्वपूर्ण अभ्यास प्रश्नों की पीडीएफ
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <p className="font-bold text-slate-900 dark:text-white">अध्याय सारांश (Key Points):</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>संख्या पद्धति के आधारभूत नियम एवं इकाई अंक ज्ञात करने की 5-सेकंड विधि।</li>
              <li>विभाज्यता नियम (2, 3, 4, 7, 11, 13) के विशेष अपवाद और परीक्षा में पूछे जाने वाले पैटर्न।</li>
              <li>अंतिम दो अंक (Tens digit) निकालने का सरलतम बाइनरी व साइक्लिसिटी मेथड।</li>
            </ul>
          </div>

          <button
            onClick={() => navigateTo('materials', { openMaterialId: 'mat-math-formula' })}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>{isHindi ? 'डिजिटल लाइब्रेरी में पूरी बुक खोलें' : 'Open in Digital Library'}</span>
          </button>
        </div>
      )}

      {/* Tab Content 3: Doubts & Discussion */}
      {activeTab === 'discussion' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <form onSubmit={handlePostDoubt} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isHindi ? 'इस लेक्चर से संबंधित अपना प्रश्न पूछें:' : 'Ask your doubt regarding this lecture:'}
            </label>
            <textarea
              rows={3}
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              placeholder={isHindi ? 'यहाँ अपना प्रश्न विस्तार से लिखें...' : 'Type your question here...'}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-orange-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm"
              >
                {isHindi ? 'प्रश्न सबमिट करें' : 'Post Doubt'}
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'छात्रों के सवाल व फैकल्टी समाधान' : 'Recent Discussions'}
            </h4>
            {doubts.map((d) => (
              <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{d.author}</span>
                  <span className="text-[10px] text-slate-400">{d.time}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">{d.text}</p>
                {d.reply && (
                  <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-[11px] text-orange-900 dark:text-orange-200">
                    <span className="font-bold">👨‍🏫 रजनीश फैकल्टी उत्तर: </span>
                    <span>{d.reply}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
