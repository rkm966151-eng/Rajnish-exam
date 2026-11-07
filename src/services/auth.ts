/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from '../types';

const AUTH_USER_KEY = 'rf_current_user';
const USERS_LIST_KEY = 'rf_all_users';

const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Er. Rajnish Kumar (Admin)',
    email: 'admin@rajnishfactory.com',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    enrolledCourseIds: ['course-ssc-cgl', 'course-railway-alp', 'course-general-science-free'],
    completedLessonIds: ['c1-l1', 'c1-l2'],
    savedMaterialIds: ['mat-math-formula', 'mat-sci-handwritten'],
    bookmarkedQuestionIds: ['q1', 'q3'],
    coins: 450,
    streakDays: 14,
    lastActiveDate: new Date().toISOString(),
  },
  {
    id: 'user-student-demo',
    name: 'Rohan Sharma',
    email: 'student@rajnishfactory.com',
    phone: '9812345678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    createdAt: '2024-03-15T00:00:00.000Z',
    enrolledCourseIds: ['course-general-science-free', 'course-ssc-cgl'],
    completedLessonIds: ['c3-l1', 'c1-l1'],
    savedMaterialIds: ['mat-math-formula'],
    bookmarkedQuestionIds: ['q2'],
    coins: 180,
    streakDays: 5,
    lastActiveDate: new Date().toISOString(),
    subscription: {
      planId: 'plan-pro-yearly',
      planName: 'VIP All-Access Pass',
      expiresAt: '2026-12-31T23:59:59.000Z',
      isActive: true,
    },
  },
];

export class AuthService {
  static getAllUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_LIST_KEY);
      if (!raw) {
        localStorage.setItem(USERS_LIST_KEY, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUser(user: User): void {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  }

  static getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (!raw) {
        // default to student demo for instant rich preview
        const demo = INITIAL_USERS[1];
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demo));
        return demo;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static login(identifier: string, passwordOrOtp: string): { success: boolean; user?: User; message?: string } {
    const trimmed = identifier.trim().toLowerCase();
    const users = this.getAllUsers();
    
    // Check for admin
    if (trimmed === 'admin@rajnishfactory.com' || trimmed === 'admin') {
      const admin = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(admin));
      return { success: true, user: admin };
    }

    // Check by email or phone
    const found = users.find(u => u.email.toLowerCase() === trimmed || u.phone === trimmed);
    if (found) {
      if (found.isBlocked) {
        return { success: false, message: 'आपका खाता व्यवस्थापक द्वारा अवरोधित कर दिया गया है। / Account is blocked.' };
      }
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(found));
      return { success: true, user: found };
    }

    // Auto register if identifier looks valid
    const isEmail = trimmed.includes('@');
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: isEmail ? trimmed.split('@')[0] : 'छात्र ' + trimmed.slice(-4),
      email: isEmail ? trimmed : `${trimmed}@rajnishfactory.in`,
      phone: isEmail ? undefined : trimmed,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      role: 'student',
      createdAt: new Date().toISOString(),
      enrolledCourseIds: ['course-general-science-free'],
      completedLessonIds: [],
      savedMaterialIds: [],
      bookmarkedQuestionIds: [],
      coins: 50,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
    };

    this.saveUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  static logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  }

  static enrollInCourse(courseId: string): User | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    if (!current.enrolledCourseIds.includes(courseId)) {
      current.enrolledCourseIds.push(courseId);
      this.saveUser(current);
    }
    return current;
  }

  static markLessonComplete(lessonId: string): User | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    if (!current.completedLessonIds.includes(lessonId)) {
      current.completedLessonIds.push(lessonId);
      current.coins = (current.coins || 0) + 10;
      this.saveUser(current);
    }
    return current;
  }

  static toggleBookmarkMaterial(materialId: string): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
    const exists = current.savedMaterialIds.includes(materialId);
    if (exists) {
      current.savedMaterialIds = current.savedMaterialIds.filter(id => id !== materialId);
    } else {
      current.savedMaterialIds.push(materialId);
    }
    this.saveUser(current);
    return !exists;
  }

  static deleteAccount(userId: string): void {
    const users = this.getAllUsers().filter(u => u.id !== userId);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }
}
