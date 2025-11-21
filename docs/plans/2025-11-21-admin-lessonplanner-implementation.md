# Admin Area & Lesson Planner Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Drive RJM admin area from a monolithic localStorage-based system into a modular, Firebase-powered application with intuitive student management and professional lesson planning.

**Architecture:** Component-based React architecture with Firebase Firestore for real-time data sync, React Context for state management, and custom calendar implementation using date-fns. Break the 4,175-line App.jsx into focused, maintainable components.

**Tech Stack:** React 18, Vite, Firebase v9+ (Firestore, Storage), Tailwind CSS, date-fns, Framer Motion, Headless UI

---

## PHASE 1: Foundation & Firebase Setup

### Task 1: Install Firebase Dependencies

**Files:**
- Modify: `/home/alastair/Desktop/DriveRJM/package.json`

**Step 1: Install Firebase SDK**

Run:
```bash
npm install firebase date-fns
```

Expected: Package installation success, firebase@^10.0.0 and date-fns@^3.0.0 added to dependencies

**Step 2: Install Headless UI for accessible components**

Run:
```bash
npm install @headlessui/react
```

Expected: Package installation success

**Step 3: Verify installations**

Run:
```bash
npm list firebase date-fns @headlessui/react
```

Expected: All packages listed with versions

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add Firebase, date-fns, and Headless UI dependencies"
```

---

### Task 2: Extract Firebase Configuration from ServiceAccountKey

**Files:**
- Read: `/home/alastair/Desktop/DriveRJM/ServiceAccountKey.json`
- Create: `/home/alastair/Desktop/DriveRJM/.env`
- Modify: `/home/alastair/Desktop/DriveRJM/.gitignore`

**Step 1: Read ServiceAccountKey.json to understand Firebase project**

Read the file to extract project_id and other config details.

**Step 2: Create .env file with Firebase client config**

Note: ServiceAccountKey.json is for server-side (Admin SDK). We need client SDK config from Firebase Console.

Create `.env`:
```
VITE_FIREBASE_API_KEY=AIza...  # Get from Firebase Console
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Step 3: Update .gitignore to exclude .env**

Add to `.gitignore`:
```
.env
.env.local
ServiceAccountKey.json
```

**Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: update gitignore to exclude sensitive files"
```

Note: Do not commit .env file

---

### Task 3: Create Firebase Configuration Module

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/firebase/config.js`

**Step 1: Create firebase directory**

Run:
```bash
mkdir -p /home/alastair/Desktop/DriveRJM/src/firebase
```

**Step 2: Write Firebase initialization code**

Create `src/firebase/config.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Connect to emulators in development (optional)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  connectAuthEmulator(auth, 'http://localhost:9099');
  console.log('Connected to Firebase Emulators');
}

export default app;
```

**Step 3: Verify no syntax errors**

Run:
```bash
npm run build
```

Expected: Build succeeds (warnings about missing env vars are OK for now)

**Step 4: Commit**

```bash
git add src/firebase/config.js
git commit -m "feat: add Firebase configuration module"
```

---

### Task 4: Create Utility Helper Functions

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/utils/dateHelpers.js`
- Create: `/home/alastair/Desktop/DriveRJM/src/utils/postcodeHelpers.js`
- Create: `/home/alastair/Desktop/DriveRJM/src/utils/timeHelpers.js`
- Create: `/home/alastair/Desktop/DriveRJM/src/utils/validation.js`

**Step 1: Create utils directory**

Run:
```bash
mkdir -p /home/alastair/Desktop/DriveRJM/src/utils
```

**Step 2: Write dateHelpers.js**

Create `src/utils/dateHelpers.js`:
```javascript
import { format, parse, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay as dateFnsIsSameDay } from 'date-fns';

export function formatDate(date, formatStr = 'PPP') {
  return format(date, formatStr);
}

export function parseDate(dateString) {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

export function isSameDay(date1, date2) {
  return dateFnsIsSameDay(date1, date2);
}

export function getWeekRange(date) {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(date, { weekStartsOn: 0 })
  };
}

export function getMonthRange(date) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
}

export function addDaysToDate(date, days) {
  return addDays(date, days);
}
```

**Step 3: Write timeHelpers.js**

Create `src/utils/timeHelpers.js`:
```javascript
export function addMinutes(timeString, minutes) {
  const [hours, mins] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

export function minutesBetween(startTime, endTime) {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  return (endHours * 60 + endMins) - (startHours * 60 + startMins);
}

export function timeRangesOverlap(start1, duration1, start2, duration2) {
  const end1 = addMinutes(start1, duration1);
  const end2 = addMinutes(start2, duration2);
  return (start1 < end2 && end1 > start2);
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}
```

**Step 4: Write postcodeHelpers.js**

Create `src/utils/postcodeHelpers.js`:
```javascript
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

export function validateUKPostcode(postcode) {
  if (!postcode) return false;
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  return UK_POSTCODE_REGEX.test(normalized);
}

export function formatPostcode(postcode) {
  if (!postcode) return '';
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  if (normalized.length <= 5) return normalized;

  // Insert space before last 3 characters
  const outward = normalized.slice(0, -3);
  const inward = normalized.slice(-3);
  return `${outward} ${inward}`;
}

export function getPostcodeArea(postcode) {
  if (!postcode) return '';
  // Returns first 2-4 characters (postcode area)
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  const match = normalized.match(/^[A-Z]{1,2}\d{1,2}/);
  return match ? match[0] : '';
}

export function postcodesAreSimilar(postcode1, postcode2) {
  const area1 = getPostcodeArea(postcode1);
  const area2 = getPostcodeArea(postcode2);
  return area1 === area2 && area1 !== '';
}
```

**Step 5: Write validation.js**

Create `src/utils/validation.js`:
```javascript
import { validateUKPostcode } from './postcodeHelpers';

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUKPhone(phone) {
  // UK mobile: starts with 07, 11 digits total
  const normalized = phone.replace(/\s/g, '');
  const ukMobileRegex = /^07\d{9}$/;
  return ukMobileRegex.test(normalized);
}

export function validateRequired(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

export function validateMinLength(value, minLength) {
  return value && value.length >= minLength;
}

export function validateLessonForm(formData) {
  const errors = {};

  if (!validateRequired(formData.student_id)) {
    errors.student_id = 'Please select a student';
  }

  if (!validateRequired(formData.date)) {
    errors.date = 'Please select a date';
  }

  if (!validateRequired(formData.start_time)) {
    errors.start_time = 'Please select a start time';
  }

  if (!validateRequired(formData.duration_minutes) || formData.duration_minutes < 15) {
    errors.duration_minutes = 'Duration must be at least 15 minutes';
  }

  if (!validateRequired(formData.start_postcode) || !validateUKPostcode(formData.start_postcode)) {
    errors.start_postcode = 'Please enter a valid UK postcode';
  }

  if (formData.end_postcode && !validateUKPostcode(formData.end_postcode)) {
    errors.end_postcode = 'Please enter a valid UK postcode';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStudentForm(formData) {
  const errors = {};

  if (!validateRequired(formData.name) || !validateMinLength(formData.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateRequired(formData.email) || !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(formData.phone) || !validateUKPhone(formData.phone)) {
    errors.phone = 'Please enter a valid UK mobile number (07...)';
  }

  if (!validateRequired(formData.postcode) || !validateUKPostcode(formData.postcode)) {
    errors.postcode = 'Please enter a valid UK postcode';
  }

  if (formData.emergency_contact?.phone && !validateUKPhone(formData.emergency_contact.phone)) {
    errors.emergency_contact_phone = 'Please enter a valid UK mobile number';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
```

**Step 6: Commit**

```bash
git add src/utils/
git commit -m "feat: add utility helper functions for dates, time, postcodes, and validation"
```

---

## PHASE 2: Firebase CRUD Operations

### Task 5: Create Student Firebase Operations

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/firebase/students.js`

**Step 1: Write students.js with CRUD operations**

Create `src/firebase/students.js`:
```javascript
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

const STUDENTS_COLLECTION = 'students';

// Create a new student
export async function createStudent(studentData) {
  try {
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
      ...studentData,
      emergency_contact: studentData.emergency_contact || { name: '', phone: '', relationship: '' },
      lesson_history: studentData.lesson_history || {
        hours_taught: 0,
        theory_passed: false,
        test_booked: false,
        test_date: null
      },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating student:', error);
    return { success: false, error: error.message };
  }
}

// Update existing student
export async function updateStudent(studentId, updates) {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message };
  }
}

// Delete student (soft delete - just mark as archived)
export async function archiveStudent(studentId) {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      archived: true,
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error archiving student:', error);
    return { success: false, error: error.message };
  }
}

// Get single student by ID
export async function getStudent(studentId) {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      return { success: true, data: { id: studentSnap.id, ...studentSnap.data() } };
    } else {
      return { success: false, error: 'Student not found' };
    }
  } catch (error) {
    console.error('Error getting student:', error);
    return { success: false, error: error.message };
  }
}

// Get all students (excluding archived)
export async function getAllStudents() {
  try {
    const studentsQuery = query(
      collection(db, STUDENTS_COLLECTION),
      where('archived', '!=', true),
      orderBy('archived'),
      orderBy('name')
    );

    const querySnapshot = await getDocs(studentsQuery);
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: students };
  } catch (error) {
    console.error('Error getting students:', error);
    return { success: false, error: error.message };
  }
}

// Check if email already exists (for uniqueness validation)
export async function checkEmailExists(email, excludeStudentId = null) {
  try {
    const studentsQuery = query(
      collection(db, STUDENTS_COLLECTION),
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(studentsQuery);

    if (excludeStudentId) {
      // Exclude the current student when editing
      const exists = querySnapshot.docs.some(doc => doc.id !== excludeStudentId);
      return { success: true, exists };
    } else {
      return { success: true, exists: !querySnapshot.empty };
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return { success: false, error: error.message };
  }
}
```

**Step 2: Commit**

```bash
git add src/firebase/students.js
git commit -m "feat: add Student CRUD operations for Firebase"
```

---

### Task 6: Create Lesson Firebase Operations

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/firebase/lessons.js`

**Step 1: Write lessons.js with CRUD operations**

Create `src/firebase/lessons.js`:
```javascript
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { addMinutes } from '../utils/timeHelpers';

const LESSONS_COLLECTION = 'lessons';

// Create a new lesson
export async function createLesson(lessonData) {
  try {
    // Calculate end_time from start_time + duration
    const end_time = addMinutes(lessonData.start_time, lessonData.duration_minutes);

    const docRef = await addDoc(collection(db, LESSONS_COLLECTION), {
      student_id: lessonData.student_id,
      student_name: lessonData.student_name,
      date: Timestamp.fromDate(new Date(lessonData.date)),
      start_time: lessonData.start_time,
      end_time: end_time,
      duration_minutes: lessonData.duration_minutes,
      start_postcode: lessonData.start_postcode,
      end_postcode: lessonData.end_postcode || lessonData.start_postcode,
      status: 'scheduled',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return { success: false, error: error.message };
  }
}

// Update existing lesson
export async function updateLesson(lessonId, updates) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);

    // Recalculate end_time if start_time or duration changed
    const updatedData = { ...updates };
    if (updates.start_time || updates.duration_minutes) {
      const currentLesson = await getDoc(lessonRef);
      const currentData = currentLesson.data();
      const start_time = updates.start_time || currentData.start_time;
      const duration = updates.duration_minutes || currentData.duration_minutes;
      updatedData.end_time = addMinutes(start_time, duration);
    }

    await updateDoc(lessonRef, {
      ...updatedData,
      updated_at: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating lesson:', error);
    return { success: false, error: error.message };
  }
}

// Cancel lesson (soft delete - change status)
export async function cancelLesson(lessonId) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await updateDoc(lessonRef, {
      status: 'cancelled',
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error cancelling lesson:', error);
    return { success: false, error: error.message };
  }
}

// Delete lesson permanently
export async function deleteLesson(lessonId) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await deleteDoc(lessonRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return { success: false, error: error.message };
  }
}

// Get lessons for a date range
export async function getLessonsInRange(startDate, endDate) {
  try {
    const lessonsQuery = query(
      collection(db, LESSONS_COLLECTION),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date'),
      orderBy('start_time')
    );

    const querySnapshot = await getDocs(lessonsQuery);
    const lessons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate() // Convert Timestamp to Date
    }));

    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error getting lessons:', error);
    return { success: false, error: error.message };
  }
}

// Get lessons for a specific student
export async function getLessonsByStudent(studentId) {
  try {
    const lessonsQuery = query(
      collection(db, LESSONS_COLLECTION),
      where('student_id', '==', studentId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(lessonsQuery);
    const lessons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));

    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error getting student lessons:', error);
    return { success: false, error: error.message };
  }
}

// Mark lesson as completed
export async function completeLesson(lessonId) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await updateDoc(lessonRef, {
      status: 'completed',
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error completing lesson:', error);
    return { success: false, error: error.message };
  }
}
```

**Step 2: Commit**

```bash
git add src/firebase/lessons.js
git commit -m "feat: add Lesson CRUD operations for Firebase"
```

---

### Task 7: Create Lesson Recommendation Algorithm

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/utils/lessonRecommendations.js`

**Step 1: Write lessonRecommendations.js**

Create `src/utils/lessonRecommendations.js`:
```javascript
import { isSameDay } from './dateHelpers';
import { addMinutes, minutesBetween, timeRangesOverlap } from './timeHelpers';
import { getPostcodeArea } from './postcodeHelpers';

/**
 * Recommends optimal lesson slot based on existing lessons
 * Priority: Minimize travel by clustering similar postcodes
 */
export function computeRecommendedSlot(date, startPostcode, duration, existingLessons) {
  // Filter lessons for the same date
  const dayLessons = existingLessons
    .filter(lesson => isSameDay(lesson.date, date) && lesson.status === 'scheduled')
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  if (dayLessons.length === 0) {
    // No lessons on this day, recommend first slot
    return { time: '08:00', reason: 'First lesson of the day' };
  }

  // Find lessons with similar postcodes (first 3-4 characters match)
  const postcodeArea = getPostcodeArea(startPostcode);
  const similarPostcodeLessons = dayLessons.filter(lesson =>
    getPostcodeArea(lesson.start_postcode) === postcodeArea ||
    getPostcodeArea(lesson.end_postcode) === postcodeArea
  );

  if (similarPostcodeLessons.length > 0) {
    // Try to find slot adjacent to similar postcode lesson
    for (const similarLesson of similarPostcodeLessons) {
      // Try after this lesson
      const afterTime = addMinutes(similarLesson.end_time, 15); // 15 min buffer

      // Check if this slot conflicts with another lesson
      const hasConflict = dayLessons.some(lesson =>
        timeRangesOverlap(afterTime, duration, lesson.start_time, lesson.duration_minutes)
      );

      if (!hasConflict && afterTime < '20:00') {
        return {
          time: afterTime,
          reason: `Recommended - minimizes travel from ${similarLesson.start_time} lesson in ${getPostcodeArea(similarLesson.start_postcode)}`
        };
      }

      // Try before this lesson
      const beforeTime = addMinutes(similarLesson.start_time, -(duration + 15));
      const hasConflictBefore = dayLessons.some(lesson =>
        timeRangesOverlap(beforeTime, duration, lesson.start_time, lesson.duration_minutes)
      );

      if (!hasConflictBefore && beforeTime >= '08:00') {
        return {
          time: beforeTime,
          reason: `Recommended - minimizes travel to ${similarLesson.start_time} lesson in ${getPostcodeArea(similarLesson.start_postcode)}`
        };
      }
    }
  }

  // No similar postcodes or couldn't find adjacent slot, find earliest available
  const earliestSlot = findEarliestAvailableSlot(dayLessons, duration);
  return {
    time: earliestSlot,
    reason: 'Earliest available time slot'
  };
}

function findEarliestAvailableSlot(lessons, duration) {
  const startOfDay = '08:00';
  const endOfDay = '20:00';

  // Check if first slot is available
  if (lessons.length === 0 || lessons[0].start_time >= addMinutes(startOfDay, duration)) {
    return startOfDay;
  }

  // Check gaps between lessons
  for (let i = 0; i < lessons.length - 1; i++) {
    const gapStart = lessons[i].end_time;
    const gapEnd = lessons[i + 1].start_time;
    const gapDuration = minutesBetween(gapStart, gapEnd);

    if (gapDuration >= duration + 30) { // 30 min buffer
      return addMinutes(gapStart, 15); // 15 min buffer after previous lesson
    }
  }

  // No gaps, recommend after last lesson
  const lastLesson = lessons[lessons.length - 1];
  const afterLast = addMinutes(lastLesson.end_time, 15);

  if (afterLast < endOfDay) {
    return afterLast;
  }

  // Day is full, return first slot anyway (will show warning)
  return startOfDay;
}

/**
 * Check if a lesson time conflicts with existing lessons
 */
export function checkTimeConflict(date, startTime, duration, existingLessons, excludeLessonId = null) {
  const dayLessons = existingLessons.filter(lesson =>
    isSameDay(lesson.date, date) &&
    lesson.status === 'scheduled' &&
    lesson.id !== excludeLessonId
  );

  for (const lesson of dayLessons) {
    if (timeRangesOverlap(startTime, duration, lesson.start_time, lesson.duration_minutes)) {
      return {
        hasConflict: true,
        conflictingLesson: lesson
      };
    }
  }

  return { hasConflict: false };
}
```

**Step 2: Commit**

```bash
git add src/utils/lessonRecommendations.js
git commit -m "feat: add lesson slot recommendation algorithm"
```

---

## PHASE 3: Context Providers & State Management

### Task 8: Create Auth Context

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/contexts/AuthContext.jsx`

**Step 1: Create contexts directory**

Run:
```bash
mkdir -p /home/alastair/Desktop/DriveRJM/src/contexts
```

**Step 2: Write AuthContext.jsx**

Create `src/contexts/AuthContext.jsx`:
```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const authed = localStorage.getItem('adminAuthed') === 'true';
    setIsAdminAuthed(authed);
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Hardcoded credentials (TODO: migrate to Firebase Auth)
    if (username === 'rowan' && password === '123') {
      setIsAdminAuthed(true);
      localStorage.setItem('adminAuthed', 'true');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setIsAdminAuthed(false);
    localStorage.removeItem('adminAuthed');
  };

  const value = {
    isAdminAuthed,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Step 3: Commit**

```bash
git add src/contexts/AuthContext.jsx
git commit -m "feat: add Auth context provider"
```

---

### Task 9: Create Students Context

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/contexts/StudentsContext.jsx`

**Step 1: Write StudentsContext.jsx with real-time listener**

Create `src/contexts/StudentsContext.jsx`:
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  createStudent as createStudentFirebase,
  updateStudent as updateStudentFirebase,
  archiveStudent as archiveStudentFirebase,
  checkEmailExists
} from '../firebase/students';

const StudentsContext = createContext();

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents must be used within StudentsProvider');
  }
  return context;
}

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for students
  useEffect(() => {
    const studentsQuery = query(
      collection(db, 'students'),
      where('archived', '!=', true),
      orderBy('archived'),
      orderBy('name')
    );

    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        const studentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching students:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createStudent = async (studentData) => {
    // Check email uniqueness
    const emailCheck = await checkEmailExists(studentData.email);
    if (emailCheck.exists) {
      return { success: false, error: 'A student with this email already exists' };
    }

    return await createStudentFirebase(studentData);
  };

  const updateStudent = async (studentId, updates) => {
    // If email is being updated, check uniqueness
    if (updates.email) {
      const emailCheck = await checkEmailExists(updates.email, studentId);
      if (emailCheck.exists) {
        return { success: false, error: 'A student with this email already exists' };
      }
    }

    return await updateStudentFirebase(studentId, updates);
  };

  const archiveStudent = async (studentId) => {
    return await archiveStudentFirebase(studentId);
  };

  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  const value = {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    archiveStudent,
    getStudentById
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
}
```

**Step 2: Commit**

```bash
git add src/contexts/StudentsContext.jsx
git commit -m "feat: add Students context with real-time Firebase listener"
```

---

### Task 10: Create Lessons Context

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/contexts/LessonsContext.jsx`

**Step 1: Write LessonsContext.jsx with date-range filtering**

Create `src/contexts/LessonsContext.jsx`:
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  createLesson as createLessonFirebase,
  updateLesson as updateLessonFirebase,
  cancelLesson as cancelLessonFirebase,
  deleteLesson as deleteLessonFirebase,
  completeLesson as completeLessonFirebase
} from '../firebase/lessons';
import { addDaysToDate } from '../utils/dateHelpers';

const LessonsContext = createContext();

export function useLessons() {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error('useLessons must be used within LessonsProvider');
  }
  return context;
}

export function LessonsProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: addDaysToDate(new Date(), -60), // 2 months back
    end: addDaysToDate(new Date(), 60)     // 2 months forward
  });

  // Real-time listener for lessons in date range
  useEffect(() => {
    const lessonsQuery = query(
      collection(db, 'lessons'),
      where('date', '>=', Timestamp.fromDate(dateRange.start)),
      where('date', '<=', Timestamp.fromDate(dateRange.end)),
      orderBy('date'),
      orderBy('start_time')
    );

    const unsubscribe = onSnapshot(
      lessonsQuery,
      (snapshot) => {
        const lessonsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate() // Convert Timestamp to Date
        }));
        setLessons(lessonsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching lessons:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dateRange]);

  const createLesson = async (lessonData) => {
    return await createLessonFirebase(lessonData);
  };

  const updateLesson = async (lessonId, updates) => {
    return await updateLessonFirebase(lessonId, updates);
  };

  const cancelLesson = async (lessonId) => {
    return await cancelLessonFirebase(lessonId);
  };

  const deleteLesson = async (lessonId) => {
    return await deleteLessonFirebase(lessonId);
  };

  const completeLesson = async (lessonId) => {
    return await completeLessonFirebase(lessonId);
  };

  const getLessonsForDate = (date) => {
    return lessons.filter(lesson => {
      const lessonDate = new Date(lesson.date);
      return (
        lessonDate.getFullYear() === date.getFullYear() &&
        lessonDate.getMonth() === date.getMonth() &&
        lessonDate.getDate() === date.getDate()
      );
    });
  };

  const getLessonsByStudent = (studentId) => {
    return lessons.filter(lesson => lesson.student_id === studentId);
  };

  const expandDateRange = (newStart, newEnd) => {
    setDateRange({ start: newStart, end: newEnd });
  };

  const value = {
    lessons,
    loading,
    error,
    createLesson,
    updateLesson,
    cancelLesson,
    deleteLesson,
    completeLesson,
    getLessonsForDate,
    getLessonsByStudent,
    expandDateRange
  };

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
}
```

**Step 2: Commit**

```bash
git add src/contexts/LessonsContext.jsx
git commit -m "feat: add Lessons context with real-time Firebase listener"
```

---

## PHASE 4: Component Extraction - Admin Shell

### Task 11: Extract AdminLogin Component

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/components/admin/AdminLogin.jsx`
- Read: `/home/alastair/Desktop/DriveRJM/src/App.jsx:40-94`

**Step 1: Create admin components directory**

Run:
```bash
mkdir -p /home/alastair/Desktop/DriveRJM/src/components/admin
```

**Step 2: Read existing AdminLogin code from App.jsx**

Read lines 40-94 from App.jsx to extract the AdminLogin component.

**Step 3: Create AdminLogin.jsx**

Create `src/components/admin/AdminLogin.jsx`:
```javascript
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-dark mb-6 font-rajdhani">Admin Login</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-learner-red text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/admin/AdminLogin.jsx
git commit -m "feat: extract AdminLogin component"
```

---

### Task 12: Create AdminSidebar Component

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/components/admin/AdminSidebar.jsx`

**Step 1: Create AdminSidebar.jsx with navigation tabs**

Create `src/components/admin/AdminSidebar.jsx`:
```javascript
import { LayoutDashboard, Mail, Calendar, Users, ClipboardCheck } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'planner', label: 'Lesson Planner', icon: Calendar },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'tests', label: 'Tests', icon: ClipboardCheck }
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-dark font-rajdhani">Drive RJM</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>

      <nav className="mt-6">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-learner-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/AdminSidebar.jsx
git commit -m "feat: add AdminSidebar navigation component"
```

---

### Task 13: Create AdminHeader Component

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/components/admin/AdminHeader.jsx`

**Step 1: Create AdminHeader.jsx with action buttons**

Create `src/components/admin/AdminHeader.jsx`:
```javascript
import { LogOut, Plus, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminHeader({ onCreateLesson, onCreateStudent, currentTab }) {
  const { logout } = useAuth();

  const showCreateButtons = currentTab === 'planner' || currentTab === 'students';

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark font-rajdhani">
            {currentTab === 'dashboard' && 'Dashboard'}
            {currentTab === 'enquiries' && 'Enquiries'}
            {currentTab === 'planner' && 'Lesson Planner'}
            {currentTab === 'students' && 'Students'}
            {currentTab === 'tests' && 'Tests'}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {showCreateButtons && (
            <>
              {currentTab === 'planner' && (
                <button
                  onClick={onCreateLesson}
                  className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus size={20} />
                  Create Lesson
                </button>
              )}

              {currentTab === 'students' && (
                <button
                  onClick={onCreateStudent}
                  className="flex items-center gap-2 bg-learner-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <UserPlus size={20} />
                  Add Student
                </button>
              )}
            </>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-learner-red transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/AdminHeader.jsx
git commit -m "feat: add AdminHeader with action buttons"
```

---

## PHASE 5: Student Management Components

### Task 14: Create StudentDropdown Component

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/components/admin/LessonPlanner/StudentDropdown.jsx`

**Step 1: Create LessonPlanner directory**

Run:
```bash
mkdir -p /home/alastair/Desktop/DriveRJM/src/components/admin/LessonPlanner
```

**Step 2: Create StudentDropdown.jsx with searchable select**

Create `src/components/admin/LessonPlanner/StudentDropdown.jsx`:
```javascript
import { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronDown, UserPlus } from 'lucide-react';
import { useStudents } from '../../../contexts/StudentsContext';

export default function StudentDropdown({ value, onChange, onAddNew }) {
  const { students } = useStudents();
  const [query, setQuery] = useState('');

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === value);
  }, [students, value]);

  const filteredStudents = useMemo(() => {
    if (query === '') return students;

    return students.filter((student) => {
      const searchStr = query.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchStr) ||
        student.postcode.toLowerCase().includes(searchStr)
      );
    });
  }, [students, query]);

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="relative">
          <Combobox.Input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent pr-10"
            displayValue={() =>
              selectedStudent
                ? `${selectedStudent.name} (${selectedStudent.postcode})`
                : ''
            }
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a student..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg border border-gray-200">
          {filteredStudents.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              No students found.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <Combobox.Option
                key={student.id}
                value={student.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-4 ${
                    active ? 'bg-learner-red text-white' : 'text-gray-900'
                  }`
                }
              >
                {student.name} ({student.postcode})
              </Combobox.Option>
            ))
          )}

          <button
            type="button"
            onClick={onAddNew}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-learner-red hover:bg-gray-100 border-t border-gray-200 mt-1"
          >
            <UserPlus size={16} />
            Add New Student
          </button>
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/admin/LessonPlanner/StudentDropdown.jsx
git commit -m "feat: add StudentDropdown searchable select component"
```

---

### Task 15: Create CreateStudentModal Component (Part 1 - Basic Fields)

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/components/admin/Students/CreateStudentModal.jsx`

**Step 1: Create Students directory**

Run:
```bash
mkdir -p /home/alastair/Desktop/DriveRJM/src/components/admin/Students
```

**Step 2: Create CreateStudentModal.jsx with basic fields**

Create `src/components/admin/Students/CreateStudentModal.jsx`:
```javascript
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useStudents } from '../../../contexts/StudentsContext';
import { validateStudentForm } from '../../../utils/validation';
import { formatPostcode } from '../../../utils/postcodeHelpers';

export default function CreateStudentModal({ isOpen, onClose, onStudentCreated }) {
  const { createStudent } = useStudents();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    licence_number: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: '',
    image: '',
    second_phone: '',
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    },
    lesson_history: {
      hours_taught: 0,
      theory_passed: false,
      test_booked: false,
      test_date: null
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergency_contact: { ...prev.emergency_contact, [field]: value }
    }));
  };

  const handleLessonHistoryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      lesson_history: { ...prev.lesson_history, [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateStudentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    // Format postcode before saving
    const studentData = {
      ...formData,
      postcode: formatPostcode(formData.postcode)
    };

    const result = await createStudent(studentData);

    setLoading(false);

    if (result.success) {
      // Call callback with new student ID
      if (onStudentCreated) {
        onStudentCreated(result.id);
      }
      onClose();
      resetForm();
    } else {
      setErrors({ general: result.error });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      postcode: '',
      licence_number: '',
      start_date: new Date().toISOString().split('T')[0],
      notes: '',
      image: '',
      second_phone: '',
      emergency_contact: { name: '', phone: '', relationship: '' },
      lesson_history: {
        hours_taught: 0,
        theory_passed: false,
        test_booked: false,
        test_date: null
      }
    });
    setErrors({});
    setShowAdditionalInfo(false);
    setShowEmergencyContact(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-bold text-dark font-rajdhani">
              Add New Student
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="07..."
                    required
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                      errors.postcode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="WR6 6HX"
                    required
                  />
                  {errors.postcode && <p className="mt-1 text-sm text-red-500">{errors.postcode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.licence_number}
                    onChange={(e) => handleChange('licence_number', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information (Collapsible) */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="flex items-center gap-2 text-lg font-semibold text-dark mb-4 hover:text-learner-red"
              >
                {showAdditionalInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                Additional Information
              </button>

              {showAdditionalInfo && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Second Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.second_phone}
                      onChange={(e) => handleChange('second_phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                      rows="3"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Contact (Collapsible) */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                className="flex items-center gap-2 text-lg font-semibold text-dark mb-4 hover:text-learner-red"
              >
                {showEmergencyContact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                Emergency Contact
              </button>

              {showEmergencyContact && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_contact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent ${
                        errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.emergency_contact_phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_phone}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent"
                      placeholder="Mother, Father, Partner, etc."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-learner-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/admin/Students/CreateStudentModal.jsx
git commit -m "feat: add CreateStudentModal component with form validation"
```

---

## PHASE 6: Calendar Components (Month View)

### Task 16: Create CalendarHeader Component

**Files:**
- Create: `/home/alastair/Desktop/DriveRJM/src/components/admin/LessonPlanner/CalendarHeader.jsx`

**Step 1: Create CalendarHeader.jsx with view switcher and navigation**

Create `src/components/admin/LessonPlanner/CalendarHeader.jsx`:
```javascript
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '../../../utils/dateHelpers';

const VIEWS = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'agenda', label: 'Agenda' }
];

export default function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Date Display */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-dark font-rajdhani">
            {formatDate(currentDate, 'MMMM yyyy')}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Previous"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={onToday}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>

            <button
              onClick={onNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {VIEWS.map((viewOption) => (
            <button
              key={viewOption.id}
              onClick={() => onViewChange(viewOption.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === viewOption.id
                  ? 'bg-learner-red text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {viewOption.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/admin/LessonPlanner/CalendarHeader.jsx
git commit -m "feat: add CalendarHeader with view switcher and navigation"
```

---

Due to length constraints, I'll continue with the remaining critical tasks in a condensed format:

---

## REMAINING TASKS SUMMARY

**Task 17: MonthView Component** - Create calendar grid with day cells showing lesson counts
**Task 18: CreateLessonModal Component** - Full lesson creation form with student dropdown, time pickers, recommendation indicator
**Task 19: DayDetailModal Component** - Shows all lessons for selected day with compact/standard/detailed views
**Task 20: WeekView Component** - Time grid layout with lesson blocks
**Task 21: AgendaView Component** - List view with infinite scroll
**Task 22: AdminPage Component** - Main admin container that ties everything together
**Task 23: Update App.jsx** - Wire up all contexts and route to admin area
**Task 24: Update main.jsx** - Add context providers
**Task 25: Test Firebase Connection** - Verify Firebase works and create test data
**Task 26: Migration Script** - Move existing localStorage data to Firebase
**Task 27: Final Integration Testing** - Test full workflow end-to-end

---

## Testing & Verification

After implementation, verify:
1. Firebase connection works (check console for errors)
2. Can create/edit/delete students
3. Can create/edit/delete lessons
4. Real-time sync works (open two browser tabs)
5. Recommended slot algorithm produces sensible results
6. Calendar navigation works smoothly
7. All validations work correctly

---

## Deployment Steps

1. Add Firebase config values to .env
2. Build production bundle: `npm run build`
3. Deploy to hosting
4. Set up Firestore security rules
5. Create Firebase indexes for queries
6. Test on production Firebase project

---
