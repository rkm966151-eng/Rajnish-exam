# RAJNISH FACTORY (com.rajnish.factory)
### भारत का सबसे विश्वसनीय प्रतियोगी परीक्षा एवं शिक्षा संस्थान

Rajnish Factory is a production-ready educational platform and Android-ready application built with React, TypeScript, Tailwind CSS, Express, and Capacitor Android.

---

## 📱 1. Android Application & APK Build Guide

Package Name: `com.rajnish.factory`  
Category: Education / Learning  
Default Language: Hindi (Bilingual English support)

### Prerequisites:
- Node.js (v18+)
- Android Studio (Hedgehog / Iguana or later)
- Java JDK 17
- Android SDK 34 (API level 34)

### Step A: Build Web Assets
```bash
npm install
npm run build
```

### Step B: Sync with Android Project
```bash
npx cap sync android
```

### Step C: Build Debug APK
To generate a debug APK directly from the command line:
```bash
cd android
./gradlew assembleDebug
```
The output APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Step D: Build Production Release Android App Bundle (AAB)
To generate the production bundle for Google Play Store:
```bash
cd android
./gradlew bundleRelease
```
The output bundle will be located at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

## 🛡️ 2. Zero-404 Routing & Hosting Architecture

To completely eliminate 404 errors during page refreshes, direct URL navigation, and deep linking, the system implements:
1. **SPA Rewrites via `firebase.json`**:
   All non-static requests automatically route to `/index.html`.
2. **Express Server Catch-All Fallback** (`server.ts`):
   Express catches all unmatched endpoints and serves `index.html`.
3. **In-App 404 Recovery Boundary**:
   If an invalid path is encountered inside the application, the `NotFound.tsx` component safely intercepts it with one-click return to Home and quick links.

---

## 🔑 3. Pre-configured Access Accounts

For instant testing and evaluation:

### Master Admin Account:
- **Email / Identifier**: `admin@rajnishfactory.com` or `admin`
- **Password**: `admin123`
- **Features**: Full CMS, course publishing, lecture uploads, question bank management, user blocking, coupon creation, push broadcasts, app settings.

### Demo Student Account:
- **Email**: `student@rajnishfactory.com`
- **Phone**: `9812345678`
- **OTP**: Enter any 6 digits or click **Auto-Fill OTP**
- **Features**: Pre-enrolled in Foundation Batches, VIP Pass active, mock test attempts and verified certificates.

---

## 💳 4. Razorpay Payment Gateway Integration

1. In the Admin Panel -> App Settings, configure your Razorpay Key ID:
   ```env
   RAZORPAY_KEY_ID="rzp_live_your_key_here"
   ```
2. Transactions are validated via the backend API `/api/payments/verify`.
3. Working Demo Coupons:
   - `FACTORY50`: Flat 50% discount on all mega batches
   - `WELCOME100`: 30% discount for new aspirants
   - `RAJNISH10`: 10% student scholarship voucher

---

## 📁 5. Directory Structure
```
/
├── android/                   # Complete native Android source project
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml # Permissions, Package com.rajnish.factory
│   │   └── java/com/rajnish/factory/MainActivity.java
│   └── build.gradle
├── src/
│   ├── components/
│   │   ├── admin/             # Full Admin Control Panel & CMS
│   │   ├── auth/              # Mobile OTP & Email Login Modal
│   │   ├── common/            # Navbar, BottomNav, AndroidFrame, Toast, NotFound
│   │   ├── courses/           # Course List, Detail, Video Player
│   │   ├── exams/             # CBT Mock Tests, Palette, Question Solutions
│   │   ├── home/              # Home Dashboard, Daily Goals, Banner Marquee
│   │   ├── materials/         # Subject Notes & Interactive In-App PDF Reader
│   │   ├── payment/           # Razorpay Checkout & Tax Invoice Receipt
│   │   ├── quiz/              # Daily Quick Quiz & All-India Leaderboard
│   │   └── student/           # Dashboard, Timetable Planner, Certificates
│   ├── context/AppContext.tsx # Master state & routing
│   ├── data/mockData.ts       # Bilingual seed curriculum database
│   ├── services/              # Persistent Storage & Auth services
│   └── types/                 # TypeScript interfaces
├── capacitor.config.ts        # Capacitor Android configuration
├── firebase.json              # Hosting rewrite config (Zero-404)
├── firestore.rules            # Hardened ABAC security rules
├── firebase-blueprint.json    # Database schema specification
└── server.ts                  # Production Express API & SPA server
```
