/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Exam, StudyMaterial, ExamAttempt, Announcement, AppSettings, SupportTicket, Coupon, User } from '../types';
import { INITIAL_COURSES, INITIAL_EXAMS, INITIAL_STUDY_MATERIALS, INITIAL_ANNOUNCEMENTS, INITIAL_SETTINGS } from '../data/mockData';

const KEYS = {
  COURSES: 'rf_courses',
  EXAMS: 'rf_exams',
  MATERIALS: 'rf_materials',
  ATTEMPTS: 'rf_exam_attempts',
  ANNOUNCEMENTS: 'rf_announcements',
  SETTINGS: 'rf_settings',
  TICKETS: 'rf_tickets',
  COUPONS: 'rf_coupons',
  USERS: 'rf_users',
  BOOKMARKS: 'rf_bookmarks',
  RECENT_VIDEOS: 'rf_recent_videos',
  VIDEO_PROGRESS: 'rf_video_progress',
};

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'FACTORY50', discountPercentage: 50, maxDiscount: 1500, minPurchase: 500, validTill: '2026-12-31', isActive: true, description: 'Flat 50% discount on all mega batches' },
  { code: 'WELCOME100', discountPercentage: 30, maxDiscount: 500, minPurchase: 300, validTill: '2026-12-31', isActive: true, description: 'Welcome 30% off for new students' },
  { code: 'RAJNISH10', discountPercentage: 10, maxDiscount: 200, minPurchase: 100, validTill: '2026-12-31', isActive: true, description: '10% student scholarship voucher' },
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export class StorageService {
  // Courses
  static getCourses(): Course[] {
    return getStored<Course[]>(KEYS.COURSES, INITIAL_COURSES);
  }

  static getCourseById(id: string): Course | undefined {
    return this.getCourses().find(c => c.id === id);
  }

  static saveCourse(course: Course): void {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === course.id);
    if (idx >= 0) {
      courses[idx] = course;
    } else {
      courses.unshift(course);
    }
    setStored(KEYS.COURSES, courses);
  }

  static deleteCourse(id: string): void {
    const courses = this.getCourses().filter(c => c.id !== id);
    setStored(KEYS.COURSES, courses);
  }

  // Exams
  static getExams(): Exam[] {
    return getStored<Exam[]>(KEYS.EXAMS, INITIAL_EXAMS);
  }

  static getExamById(id: string): Exam | undefined {
    return this.getExams().find(e => e.id === id);
  }

  static saveExam(exam: Exam): void {
    const exams = this.getExams();
    const idx = exams.findIndex(e => e.id === exam.id);
    if (idx >= 0) {
      exams[idx] = exam;
    } else {
      exams.unshift(exam);
    }
    setStored(KEYS.EXAMS, exams);
  }

  static deleteExam(id: string): void {
    const exams = this.getExams().filter(e => e.id !== id);
    setStored(KEYS.EXAMS, exams);
  }

  // Exam Attempts
  static getAttempts(userId?: string): ExamAttempt[] {
    const attempts = getStored<ExamAttempt[]>(KEYS.ATTEMPTS, []);
    return userId ? attempts.filter(a => a.userId === userId) : attempts;
  }

  static saveAttempt(attempt: ExamAttempt): void {
    const attempts = this.getAttempts();
    attempts.unshift(attempt);
    setStored(KEYS.ATTEMPTS, attempts);
  }

  // Study Materials
  static getMaterials(): StudyMaterial[] {
    return getStored<StudyMaterial[]>(KEYS.MATERIALS, INITIAL_STUDY_MATERIALS);
  }

  static saveMaterial(material: StudyMaterial): void {
    const materials = this.getMaterials();
    const idx = materials.findIndex(m => m.id === material.id);
    if (idx >= 0) {
      materials[idx] = material;
    } else {
      materials.unshift(material);
    }
    setStored(KEYS.MATERIALS, materials);
  }

  static deleteMaterial(id: string): void {
    const materials = this.getMaterials().filter(m => m.id !== id);
    setStored(KEYS.MATERIALS, materials);
  }

  // Announcements
  static getAnnouncements(): Announcement[] {
    return getStored<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static saveAnnouncement(ann: Announcement): void {
    const list = this.getAnnouncements();
    const idx = list.findIndex(a => a.id === ann.id);
    if (idx >= 0) list[idx] = ann;
    else list.unshift(ann);
    setStored(KEYS.ANNOUNCEMENTS, list);
  }

  static deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter(a => a.id !== id);
    setStored(KEYS.ANNOUNCEMENTS, list);
  }

  // Coupons
  static getCoupons(): Coupon[] {
    return getStored<Coupon[]>(KEYS.COUPONS, DEFAULT_COUPONS);
  }

  static saveCoupon(coupon: Coupon): void {
    const list = this.getCoupons();
    const idx = list.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx >= 0) list[idx] = coupon;
    else list.unshift(coupon);
    setStored(KEYS.COUPONS, list);
  }

  static deleteCoupon(code: string): void {
    const list = this.getCoupons().filter(c => c.code !== code);
    setStored(KEYS.COUPONS, list);
  }

  // Settings
  static getSettings(): AppSettings {
    return getStored<AppSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: AppSettings): void {
    setStored(KEYS.SETTINGS, settings);
  }

  // Support Tickets
  static getTickets(userId?: string): SupportTicket[] {
    const list = getStored<SupportTicket[]>(KEYS.TICKETS, []);
    return userId ? list.filter(t => t.userId === userId) : list;
  }

  static saveTicket(ticket: SupportTicket): void {
    const list = getStored<SupportTicket[]>(KEYS.TICKETS, []);
    const idx = list.findIndex(t => t.id === ticket.id);
    if (idx >= 0) list[idx] = ticket;
    else list.unshift(ticket);
    setStored(KEYS.TICKETS, list);
  }

  // Video Progress tracking
  static getVideoProgress(lessonId: string): number {
    const map = getStored<Record<string, number>>(KEYS.VIDEO_PROGRESS, {});
    return map[lessonId] || 0;
  }

  static setVideoProgress(lessonId: string, seconds: number): void {
    const map = getStored<Record<string, number>>(KEYS.VIDEO_PROGRESS, {});
    map[lessonId] = seconds;
    setStored(KEYS.VIDEO_PROGRESS, map);
  }

  // Backup & Reset
  static exportAllData(): string {
    const all = {
      courses: this.getCourses(),
      exams: this.getExams(),
      materials: this.getMaterials(),
      attempts: this.getAttempts(),
      announcements: this.getAnnouncements(),
      settings: this.getSettings(),
      coupons: this.getCoupons(),
      exportedAt: new Date().toISOString(),
      appName: 'Rajnish Factory',
    };
    return JSON.stringify(all, null, 2);
  }

  static resetToDefault(): void {
    localStorage.removeItem(KEYS.COURSES);
    localStorage.removeItem(KEYS.EXAMS);
    localStorage.removeItem(KEYS.MATERIALS);
    localStorage.removeItem(KEYS.ATTEMPTS);
    localStorage.removeItem(KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.COUPONS);
  }
}
