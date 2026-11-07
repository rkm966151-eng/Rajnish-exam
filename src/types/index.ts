/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'admin' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  savedMaterialIds: string[];
  bookmarkedQuestionIds: string[];
  coins: number;
  streakDays: number;
  lastActiveDate: string;
  isBlocked?: boolean;
  subscription?: {
    planId: string;
    planName: string;
    expiresAt: string;
    isActive: boolean;
  };
}

export interface Course {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  category: string;
  thumbnail: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  price: number;
  originalPrice: number;
  isFree: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  totalDuration: string;
  totalLessons: number;
  language: 'Hindi' | 'English' | 'Bilingual';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  lessons: Lesson[];
  features: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleHindi: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  youtubeId?: string;
  thumbnail?: string;
  pdfUrl?: string;
  isFreePreview: boolean;
  order: number;
  summary?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  titleHindi: string;
  subject: string;
  category: string;
  chapter: string;
  pages: number;
  fileSize: string;
  pdfUrl: string;
  isFree: boolean;
  downloadsCount: number;
  uploadDate: string;
  author: string;
  previewSnippet?: string;
}

export interface Question {
  id: string;
  examId?: string;
  questionText: string;
  questionTextHindi: string;
  options: {
    id: string;
    text: string;
    textHindi: string;
  }[];
  correctOptionId: string;
  explanation: string;
  explanationHindi: string;
  marks: number;
  negativeMarks: number;
  subject: string;
  topic?: string;
}

export interface Exam {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  negativeMarkingRate: number; // e.g. 0.25 or 0.33
  totalQuestions: number;
  isFree: boolean;
  isLive?: boolean;
  scheduledTime?: string;
  questions: Question[];
  instructions: string[];
  attemptsCount: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  userId: string;
  userName: string;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeSpentSeconds: number;
  completedAt: string;
  userAnswers: Record<string, string>; // questionId -> optionId
  rank?: number;
  totalParticipants?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionHindi: string;
  options: string[];
  optionsHindi: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationHindi: string;
  subject: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  testsCompleted: number;
  rank: number;
  streak: number;
  city?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minPurchase: number;
  validTill: string;
  isActive: boolean;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'exam' | 'course' | 'video' | 'material' | 'general' | 'payment';
  linkRoute?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  reply?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleHindi: string;
  content: string;
  contentHindi: string;
  date: string;
  isImportant: boolean;
  category: 'Notice' | 'Exam Alert' | 'Batch Launch' | 'General';
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string;
  subject: string;
  topic: string;
  isDone: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  verificationCode: string;
  instructorName: string;
}

export interface AppSettings {
  appName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  maintenanceMode: boolean;
  appVersion: string;
  minRequiredVersion: string;
  apkDownloadUrl: string;
  razorpayKeyId: string;
  bannerNotice: string;
  showBannerNotice: boolean;
}
