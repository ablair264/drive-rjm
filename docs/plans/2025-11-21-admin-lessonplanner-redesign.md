# Admin Area & Lesson Planner Redesign

**Date:** November 21, 2025
**Project:** Drive RJM - Admin Dashboard Improvements
**Status:** Design Validated

---

## Executive Summary

Complete redesign of the Drive RJM admin area with focus on intuitive lesson planning, student management, and Firebase integration. This design moves from localStorage-based data storage to Firebase Firestore with real-time synchronization, breaks the monolithic App.jsx into proper component structure, and implements a professional calendar system with multiple views.

**Key Improvements:**
- Firebase integration for data persistence and multi-device sync
- Comprehensive student management with detailed profiles
- Intuitive lesson creation with smart recommendations
- Professional calendar with Week/Month/Agenda views
- Component-based architecture for maintainability

---

## 1. Firebase Architecture & Data Models

### Firebase Setup

**Technology:** Firebase Client SDK (v9+ modular)
**Authentication:** Continue using existing admin auth (future: migrate to Firebase Auth)
**Database:** Cloud Firestore
**Storage:** Firebase Storage (for student profile images)

### Collections Structure

```
firestore/
├── students/          # Student profiles
│   └── {studentId}    # Auto-generated doc ID
├── lessons/           # All lesson bookings
│   └── {lessonId}     # Auto-generated doc ID
├── enquiries/         # Contact form submissions
│   └── {enquiryId}    # Auto-generated doc ID
└── recentlyPassed/    # Success stories for homepage
    └── {storyId}      # Auto-generated doc ID
```

### Student Document Model

```javascript
{
  id: string,                    // Firestore document ID
  name: string,                  // Full name: "Alastair Blair"
  email: string,                 // "blair@hotmail.co.uk"
  phone: string,                 // "07718182168"
  postcode: string,              // "WR6 6HX"
  licence_number: string,        // "BLAIR872987987987987"
  start_date: Timestamp,         // When they started lessons
  notes: string,                 // Instructor notes
  image: string,                 // Firebase Storage URL or base64
  second_phone: string,          // Alternative contact

  emergency_contact: {
    name: string,                // "Sammie Blair"
    phone: string,               // "7817293765"
    relationship: string         // "wife"
  },

  lesson_history: {
    hours_taught: number,        // 5
    theory_passed: boolean,      // true
    test_booked: boolean,        // true
    test_date: Timestamp | null  // Test date or null
  },

  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Lesson Document Model

```javascript
{
  id: string,                    // Firestore document ID
  student_id: string,            // Reference to student document
  student_name: string,          // Denormalized for quick access
  date: Timestamp,               // Lesson date
  start_time: string,            // "09:00" format (24-hour)
  end_time: string,              // "10:30" format (auto-calculated)
  duration_minutes: number,      // Total lesson duration (90)
  start_postcode: string,        // "WR6 6HX"
  end_postcode: string,          // "WR5 3DA"
  status: string,                // "scheduled", "completed", "cancelled"
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Enquiry Document Model

```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  postcode: string,
  service: string,
  message: string,
  source: string,                // "contact-form", "admin-modal", "quick-contact"
  created_at: Timestamp
}
```

### Recently Passed Document Model

```javascript
{
  id: string,
  name: string,                  // "Sophie, Worcester"
  tests: string,                 // "Passed 1st time"
  desc: string,                  // Success story description
  image: string,                 // Firebase Storage URL
  created_at: Timestamp
}
```

---

## 2. Student Management System

### Student Dropdown Component

**Purpose:** Select existing students or add new ones when creating lessons

**Features:**
- Searchable dropdown (filter by name or postcode)
- Display format: `"Alastair Blair (WR6 6HX)"`
- Sorted alphabetically by last name
- Last option: `"+ Add New Student"` (opens Create Student modal)
- On selection: Auto-populates Start Postcode field in lesson form

**Technical Implementation:**
- Custom select component or `react-select` library
- Real-time filtering as user types
- Virtualized list for performance with large student lists
- Keyboard navigation support (arrow keys, enter to select)

### Create Student Modal

**Trigger:** Click "+ Add New Student" in student dropdown

**Modal Layout:**

**Section 1: Basic Information (Required)**
- Name (text input, required)
- Email (email input, required, validated)
- Phone (tel input, required, formatted as UK mobile)
- Postcode (text input, required, UK postcode validation)

**Section 2: License & Start Date**
- License Number (text input, optional)
- Start Date (date picker, defaults to today)

**Section 3: Additional Information (Optional, Collapsible)**
- Second Phone (tel input, optional)
- Notes (textarea, optional, placeholder: "Any special requirements or notes...")
- Profile Image (file upload → Firebase Storage)
  - Accepts: JPG, PNG, max 5MB
  - Preview uploaded image
  - Option to remove uploaded image

**Section 4: Emergency Contact (Optional, Collapsible)**
- Name (text input)
- Phone (tel input)
- Relationship (text input, placeholder: "Mother, Father, Partner, etc.")

**Section 5: Lesson History (Auto-initialized)**
- Hours Taught: 0 (number input)
- Theory Passed: false (checkbox)
- Test Booked: false (checkbox)
- Test Date: null (date picker, enabled only if Test Booked = true)

**Modal Behavior:**
- **Submit →** Creates student in Firestore → Uploads image to Storage if provided → Closes modal → Returns to Create Lesson modal with new student pre-selected
- **Cancel →** Confirms if any fields filled → Closes without saving
- **Validation:** All required fields must be filled, show inline errors

### Students Tab (Admin Area)

**Purpose:** Manage all students in one place

**Layout:**
- Search bar at top (filters by name, email, phone, postcode)
- Table view with columns:
  - Photo (thumbnail)
  - Name
  - Phone
  - Email
  - Postcode
  - Hours Taught
  - Theory Passed (✓/✗)
  - Test Date
  - Actions (Edit, View Details)
- Pagination (20 students per page)
- Sort by: Name, Start Date, Hours Taught, Test Date

**Row Click:** Opens Edit Student modal (same form as Create Student but pre-filled)

**Actions:**
- Edit: Opens edit modal
- View Details: Expands row to show full profile including emergency contact, notes, lesson history
- Archive: Soft delete (moves to archived students, hidden by default)

---

## 3. Create Lesson Modal Redesign

### Modal Layout & Fields

**Header:**
- Title: "Create Lesson"
- Close button (X)

**Section 1: Student Selection**
- **Student:** Searchable dropdown (see Student Dropdown Component above)
  - Required field
  - On selection: Auto-fills Start Postcode from student profile

**Section 2: Date & Time**

- **Date:** Calendar date picker
  - Defaults to today
  - Quick select buttons: Today, Tomorrow, Next Monday
  - Shows day of week when date selected

- **Start Time:** Combined hour/minute inputs
  - **Hour:** Dropdown (00-23) with 15-minute interval suggestions (08:00, 08:15, 08:30, etc.)
  - **Minute:** Dropdown with options (00, 15, 30, 45) + allows free typing
  - Format display: "HH:MM" (24-hour)
  - Common times highlighted: 08:00, 09:30, 11:30, 13:00, 14:30, 16:30

- **Duration:** Separate hour/minute inputs
  - **Hours:** Dropdown (0, 1, 2, 3, 4)
  - **Minutes:** Dropdown (0, 15, 30, 45, 60, 75, 90)
  - Default: 1 hour 30 minutes
  - Common durations as quick-select buttons: 1h, 1.5h, 2h

- **End Time:** Calculated automatically, displayed as read-only badge
  - Shows: "End time: 10:30"
  - Updates in real-time as start time or duration changes
  - Visual indicator if end time is after 8pm (warning: "Late lesson")

**Section 3: Location**

- **Start Postcode:** Text input
  - Auto-filled from selected student
  - UK postcode validation
  - Format: XX## #XX (auto-formatting)

- **End Postcode:** Text input
  - Auto-fills to match Start Postcode
  - User can edit if lesson ends at different location
  - Swap icon button between Start/End for easy reversal

**Section 4: Recommended Slot Indicator** ⭐

**Algorithm:** Minimize travel time by recommending slots near lessons with similar postcodes

**Logic:**
1. Get all lessons for selected date
2. For each existing lesson, check postcode similarity (first 3-4 characters)
3. Find the existing lesson with closest postcode match
4. Recommend slot immediately before or after that lesson
5. If no postcode matches, recommend earliest available slot
6. Avoid overlapping with existing lessons

**Visual Indicator:**
- Gold star icon (⭐) appears next to Start Time field when selected time matches recommendation
- Tooltip on hover: "Recommended - minimizes travel from 09:30 lesson in WR6"
- Badge below time picker: "⭐ Suggested: 10:00 (close to WR6 lesson at 08:30)"
- User can ignore recommendation and choose any time

**Section 5: Action Buttons**
- **Create Lesson** (primary button, learner-red background)
  - Disabled until all required fields valid
  - Shows loading spinner during save
- **Cancel** (secondary button, grey)
  - Confirms if form has unsaved changes

### Removed Elements

- ❌ Miles input field (no longer needed)
- ❌ Fuel calculation display (removed entirely)
- ❌ Fuel estimate badge (removed entirely)

### Validation Rules

- Student: Required
- Date: Required, cannot be in the past
- Start Time: Required
- Duration: Required, minimum 30 minutes
- Start Postcode: Required, valid UK postcode format
- End Postcode: Valid UK postcode format if provided
- Time Conflict Detection: Warn if lesson overlaps existing lesson (soft warning, not blocking)

---

## 4. Calendar System with Multiple Views

### Calendar Header Controls

**View Switcher:**
- Toggle buttons: [Week] [Month] [Agenda]
- Active view highlighted (learner-red)
- Keyboard shortcuts: W (week), M (month), A (agenda)

**Navigation:**
- **Prev/Next Buttons:** [← Prev] [Next →]
  - Week view: Navigate by week
  - Month view: Navigate by month
  - Agenda view: Load more past/future
- **Today Button:** Jump to current date
- **Date Display:** "November 2025" (clickable)
  - Click → Opens month/year picker dropdown
  - Dropdown shows: Month selector (Jan-Dec) + Year input

**Quick Jump:**
- Calendar icon button → Date picker popup
- Allows jumping to any date instantly

**Filter:**
- Search box: "Filter by student..."
- Filters all views to show only lessons for matching students
- Real-time filtering as user types
- Clear filter button (X)

### Month View

**Layout:**
- 7-column grid (Sunday - Saturday)
- 5-6 rows depending on month
- Fixed-height cells for consistent layout

**Day Cell Contents:**
- **Day Number:** Top-left corner (e.g., "15")
- **Lesson Count Badge:** Top-right corner (e.g., "3 lessons")
  - Badge color: learner-red for days with lessons
- **Lesson Time Pills:** First 2 lessons shown as pills
  - Format: "09:00", "14:30"
  - Colored pills (different colors for different students)
- **Overflow Indicator:** "+2 more" if more than 2 lessons

**Visual States:**
- **Past Days:** Greyed out with reduced opacity
- **Today:** Bold border (learner-red) with subtle highlight
- **Days with Lessons:** Accent color on day number
- **Hover:** Cell elevates slightly, cursor pointer
- **Click:** Opens Day Detail Modal

**Empty State:**
- If no lessons in current month: "No lessons scheduled this month"

### Week View

**Layout:**
- Time grid: Y-axis = hourly slots (7am-8pm), X-axis = 7 days
- Each hour slot divided into 15-minute segments (light gridlines)
- Current time indicator (red horizontal line) if viewing current week

**Lesson Blocks:**
- Positioned at exact start time
- Height = lesson duration
- Shows: Student name + start postcode
- Background color: Coordinated by postcode area (adjacent similar postcodes = similar colors)
- Hover: Shows full lesson details in tooltip

**Interactions:**
- **Click Lesson Block:** Opens Edit Lesson modal
- **Click Empty Slot:** Opens Create Lesson modal with time pre-filled
- **Drag-and-Drop:** (Future enhancement) Drag lesson to new time slot

**Visual Features:**
- Past time slots (greyed out)
- Current hour (highlighted background)
- Weekend days (slightly different background color)

### Agenda View

**Layout:**
- Vertical scrolling list grouped by date
- Infinite scroll (loads 30 days at a time)

**Date Sections:**
- **Date Header:** "Monday, November 25, 2025"
  - Shows day count: "3 lessons"
  - Sticky header as you scroll
- **Lesson Rows:** Chronological order
  - Time badge: "09:00 - 10:30"
  - Student name
  - Route: "WR6 6HX → WR5 3DA"
  - Duration badge: "1h 30m"
  - Action buttons: Edit, Cancel

**Expandable Rows:**
- Click row to expand
- Expanded view shows: Student phone, emergency contact, notes
- Quick actions: Call, Text, Email student

**Empty State:**
- "No lessons scheduled" for date ranges with no lessons

### Day Detail Modal

**Trigger:** Click on a day in Month View

**Modal Header:**
- Date: "Monday, November 25, 2025"
- Lesson count: "3 lessons scheduled"
- Close button

**View Toggle:**
- Buttons: [Compact] [Standard] [Detailed]
- User preference saved to localStorage

**Compact View:**
```
09:00 - 10:30  |  Alastair Blair
14:00 - 15:30  |  Sophie Johnson
17:00 - 18:00  |  Mark Davis
```

**Standard View:**
```
09:00 - 10:30  |  Alastair Blair  |  WR6 6HX → WR5 3DA  |  1h 30m
14:00 - 15:30  |  Sophie Johnson  |  WR4 9LX → WR4 9LX  |  1h 30m
17:00 - 18:00  |  Mark Davis      |  WR3 8PQ → WR2 5AX  |  1h
```

**Detailed View:**
- Card layout for each lesson
- Shows all lesson info + student phone
- Quick action buttons: Edit, Cancel, Call, Text
- Student notes preview

**Modal Footer:**
- **"Add Lesson"** button (opens Create Lesson modal with date pre-filled)

---

## 5. Component Structure & Code Organization

### New File Structure

```
src/
├── App.jsx                          # Main app shell, routing, providers
├── main.jsx                         # Entry point
├── index.css                        # Global Tailwind imports
│
├── firebase/
│   ├── config.js                    # Firebase initialization & config
│   ├── students.js                  # Student CRUD operations
│   ├── lessons.js                   # Lesson CRUD operations
│   ├── enquiries.js                 # Enquiry operations
│   └── recentlyPassed.js            # Recently passed CRUD
│
├── contexts/
│   ├── AuthContext.jsx              # Admin authentication state
│   ├── StudentsContext.jsx          # Student data & operations
│   └── LessonsContext.jsx           # Lesson data & operations
│
├── hooks/
│   ├── useStudents.js               # Student data hook
│   ├── useLessons.js                # Lesson data hook
│   ├── useCalendar.js               # Calendar state & navigation
│   └── useAuth.js                   # Authentication hook
│
├── components/
│   ├── SEO.jsx                      # (existing) JSON-LD schemas
│   │
│   ├── admin/
│   │   ├── AdminLogin.jsx           # Login page
│   │   ├── AdminPage.jsx            # Main admin shell with tabs
│   │   ├── AdminHeader.jsx          # Top bar with Create buttons
│   │   ├── AdminSidebar.jsx         # Left navigation tabs
│   │   │
│   │   ├── Dashboard/
│   │   │   ├── DashboardTab.jsx     # Dashboard tab container
│   │   │   ├── StatsCards.jsx       # Enquiries, Lessons, Tests cards
│   │   │   └── RecentlyPassedForm.jsx  # Success story management
│   │   │
│   │   ├── Enquiries/
│   │   │   ├── EnquiriesTab.jsx     # Enquiries tab container
│   │   │   ├── EnquiriesTable.jsx   # Table of all enquiries
│   │   │   └── EnquiryModal.jsx     # Add enquiry from admin
│   │   │
│   │   ├── Students/
│   │   │   ├── StudentsTab.jsx      # Students management tab
│   │   │   ├── StudentsTable.jsx    # Table of all students
│   │   │   ├── CreateStudentModal.jsx  # Create new student
│   │   │   ├── EditStudentModal.jsx    # Edit existing student
│   │   │   └── StudentDetailView.jsx   # Expanded student details
│   │   │
│   │   └── LessonPlanner/
│   │       ├── LessonPlannerTab.jsx      # Main planner container
│   │       ├── CalendarHeader.jsx        # View switcher & navigation
│   │       ├── Calendar.jsx              # Calendar container component
│   │       ├── MonthView.jsx             # Month grid view
│   │       ├── WeekView.jsx              # Week time grid view
│   │       ├── AgendaView.jsx            # List view
│   │       ├── DayDetailModal.jsx        # Day detail popup
│   │       ├── CreateLessonModal.jsx     # Create lesson form
│   │       ├── EditLessonModal.jsx       # Edit lesson form
│   │       ├── StudentDropdown.jsx       # Searchable student select
│   │       └── LessonRecommendation.jsx  # Recommended slot logic
│   │
│   └── landing/
│       ├── Navigation.jsx           # Public site header
│       ├── Hero.jsx                 # Hero section
│       ├── PostcodeChecker.jsx      # Service area checker
│       ├── QuickContact.jsx         # Quick enquiry form
│       ├── About.jsx                # About Rowan section
│       ├── Services.jsx             # Services offered
│       ├── RecentlyPassed.jsx       # Success stories carousel
│       ├── Pricing.jsx              # Pricing & booking
│       ├── TowingBookingForm.jsx    # Towing services
│       ├── Car.jsx                  # Car specs section
│       ├── Manual.jsx               # Manual transmission section
│       ├── FAQ.jsx                  # FAQ accordion
│       ├── Contact.jsx              # Contact section
│       ├── Footer.jsx               # Site footer
│       └── WhatsAppButton.jsx       # Floating WhatsApp button
│
└── utils/
    ├── dateHelpers.js               # Date formatting & calculations
    ├── postcodeHelpers.js           # Postcode validation & comparison
    ├── lessonRecommendations.js     # Recommended slot algorithm
    ├── timeHelpers.js               # Time parsing & formatting
    └── validation.js                # Form validation functions
```

### Key Component Responsibilities

**AdminPage.jsx:**
- Manages active tab state
- Renders AdminSidebar + AdminHeader
- Renders active tab content
- No business logic (pure UI routing)

**LessonPlannerTab.jsx:**
- Calendar view state (month/week/agenda)
- Current date navigation state
- Student filter state
- Renders CalendarHeader + Calendar

**Calendar.jsx:**
- Determines which view to render based on state
- Passes down data and event handlers
- No direct rendering of lessons

**MonthView.jsx / WeekView.jsx / AgendaView.jsx:**
- Receives lessons data as props
- Handles layout and rendering
- Emits events (onDayClick, onLessonClick, etc.)

**CreateLessonModal.jsx:**
- Form state management
- Validation logic
- Calls `createLesson()` from LessonsContext
- Handles loading/error states

**StudentDropdown.jsx:**
- Searchable dropdown with students from StudentsContext
- Emits student selection event
- Opens CreateStudentModal when "+ Add New" clicked

### Migration Strategy

**Phase 1: Setup (Day 1)**
1. Install Firebase packages (`firebase`, `firestore`)
2. Create `firebase/config.js` and initialize Firebase
3. Set up contexts (`AuthContext`, `StudentsContext`, `LessonsContext`)
4. Create hooks (`useStudents`, `useLessons`, `useCalendar`)

**Phase 2: Component Structure (Day 2-3)**
1. Create empty component files
2. Move existing code section-by-section from App.jsx
3. Start with landing page components (no data dependencies)
4. Then admin shell components (AdminLogin, AdminPage, AdminSidebar)

**Phase 3: Firebase Integration (Day 4-5)**
1. Implement Firebase operations (`firebase/students.js`, `firebase/lessons.js`)
2. Replace localStorage calls with Firebase calls in contexts
3. Set up real-time listeners
4. Test CRUD operations

**Phase 4: Lesson Planner (Day 6-8)**
1. Implement Calendar components (MonthView first, then WeekView, then AgendaView)
2. Build CreateLessonModal with new design
3. Implement StudentDropdown and CreateStudentModal
4. Add recommended slot algorithm
5. Build DayDetailModal

**Phase 5: Students Tab (Day 9)**
1. Implement StudentsTab and StudentsTable
2. Wire up CreateStudentModal and EditStudentModal
3. Add search and filtering

**Phase 6: Testing & Polish (Day 10)**
1. Test all CRUD operations
2. Test real-time sync (open in two browsers)
3. Fix bugs and edge cases
4. Add loading states and error handling
5. Polish animations and transitions

---

## 6. Data Flow & State Management

### Context Providers Architecture

```jsx
<App>
  <FirebaseProvider>           {/* Firebase initialization */}
    <AuthProvider>             {/* Admin authentication */}
      <StudentsProvider>       {/* Student data & CRUD */}
        <LessonsProvider>      {/* Lesson data & CRUD */}
          <Router>
            {/* App content */}
          </Router>
        </LessonsProvider>
      </StudentsProvider>
    </AuthProvider>
  </FirebaseProvider>
</App>
```

### Real-time Listeners

**StudentsContext:**
```javascript
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'students'),
    (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
      setLoading(false);
    },
    (error) => {
      console.error('Error fetching students:', error);
      setError(error.message);
    }
  );

  return () => unsubscribe();
}, []);
```

**LessonsContext:**
- Date-range filtered listener (current view ± buffer)
- Month view: Current month ± 1 month
- Week view: Current week ± 2 weeks
- Agenda view: Load on scroll (30 days at a time)
- Re-subscribe when date range changes

### Data Flow Example: Creating a Lesson

**Step 1: User Action**
- User fills Create Lesson modal
- Selects student from dropdown (data from `StudentsContext`)
- Fills date, time, duration, postcodes
- Clicks "Create Lesson"

**Step 2: Validation**
- Client-side validation runs (required fields, format checks)
- Time conflict check (overlapping lessons warning)
- If validation fails, show inline errors and prevent submission

**Step 3: Optimistic Update**
```javascript
const createLesson = async (lessonData) => {
  // Generate temporary ID
  const tempId = `temp-${Date.now()}`;
  const tempLesson = { ...lessonData, id: tempId, status: 'creating' };

  // Optimistically add to state
  setLessons(prev => [...prev, tempLesson]);

  try {
    // Write to Firebase
    const docRef = await addDoc(collection(db, 'lessons'), {
      ...lessonData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    // Success: Real-time listener will update with actual doc
    return { success: true, id: docRef.id };
  } catch (error) {
    // Error: Remove optimistic update
    setLessons(prev => prev.filter(l => l.id !== tempId));
    return { success: false, error: error.message };
  }
};
```

**Step 4: Real-time Listener Update**
- Firestore real-time listener receives new document
- Updates `lessons` state with confirmed data
- UI reflects confirmed state (removes loading indicator)

**Step 5: UI Feedback**
- Show success toast: "Lesson created successfully"
- Close Create Lesson modal
- Calendar updates to show new lesson

### Caching Strategy

**Students:**
- Full student list cached in memory
- Refreshed on app mount and manual refresh
- Real-time updates from Firestore listener
- No pagination (assumption: < 200 students)

**Lessons:**
- Windowed caching based on current view
- **Month View:** Cache current month ± 1 month (3 months total)
- **Week View:** Cache current week ± 2 weeks (5 weeks total)
- **Agenda View:** Cache as user scrolls (30-day chunks)
- When navigating beyond cached range, fetch additional data
- Clear old cache when memory usage high

**Cache Invalidation:**
- On logout: Clear all cached data
- On manual refresh: Re-fetch current view range
- On real-time update: Merge with cache

### Loading & Error States

**Initial Load:**
- Show skeleton loaders for tables and calendars
- "Loading students..." and "Loading lessons..." indicators
- Graceful degradation if Firebase unavailable

**Mutations (Create/Edit/Delete):**
- Inline loading spinners on submit buttons
- Disable form during submission
- Optimistic updates for immediate feedback

**Error Handling:**
- **Toast Notifications:**
  - Success: Green toast, auto-dismiss after 3s
  - Error: Red toast, manual dismiss
  - Warning: Yellow toast, auto-dismiss after 5s
- **Inline Errors:** Validation errors shown below fields
- **Retry Logic:** Automatic retry for network failures (max 3 attempts)
- **Offline Detection:** Banner at top: "You're offline. Changes will sync when reconnected."

### Form Validation

**Client-Side Validation (Before Firebase Write):**

**Create/Edit Lesson:**
- Student: Required, must exist in students collection
- Date: Required, cannot be more than 1 year in the past
- Start Time: Required, format HH:MM
- Duration: Required, minimum 15 minutes, maximum 4 hours
- Start Postcode: Required, valid UK postcode format (regex: `^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$`)
- End Postcode: Optional, valid UK postcode format if provided
- **Time Conflict Detection:**
  - Check if lesson overlaps existing lesson for same student
  - Show warning (not blocking): "This overlaps with another lesson at 09:00"

**Create/Edit Student:**
- Name: Required, minimum 2 characters
- Email: Required, valid email format, must be unique
- Phone: Required, valid UK mobile format (starts with 07, 11 digits)
- Postcode: Required, valid UK postcode format
- License Number: Optional, alphanumeric
- Emergency Contact Phone: Valid UK format if provided

**Real-time Validation:**
- Validate as user types (with 300ms debounce)
- Show green checkmark when field valid
- Show red error message when field invalid

### Offline Support (Future Enhancement)

- Detect when Firebase connection lost
- Queue mutations locally (IndexedDB)
- Show offline indicator banner
- Sync queued changes when connection restored
- Conflict resolution: Last-write-wins

---

## 7. Additional Features & Enhancements

### Search & Filtering

**Global Search (Admin Header):**
- Search across students, lessons, enquiries
- Quick results dropdown with categories
- Click result to navigate to relevant section

**Lesson Planner Filtering:**
- Filter by student name (searchable dropdown)
- Filter by date range (from/to date pickers)
- Filter by status (scheduled, completed, cancelled)
- Clear all filters button

### Export & Reporting

**Export Options:**
- Export lessons to CSV (for accounting/records)
- Export student list to CSV
- Date range selection for exports
- Include/exclude specific columns

**Reports (Future):**
- Hours taught per student
- Revenue by month
- Postcode coverage heatmap
- Peak booking times

### Notifications & Reminders

**Email Notifications (Future):**
- Lesson confirmation email to student
- Reminder email 24 hours before lesson
- Test date reminders
- Monthly summary to instructor

**In-App Notifications:**
- New enquiry badge
- Upcoming test alerts
- Schedule conflicts

### Mobile Responsiveness

**Design Principles:**
- Mobile-first approach
- Touch-friendly tap targets (minimum 44px)
- Simplified navigation on mobile
- Collapsible sections for better mobile UX

**Mobile-Specific Features:**
- Swipe gestures for calendar navigation
- Bottom sheet modals on mobile (instead of center modals)
- Click-to-call and click-to-text student phone numbers
- GPS integration for postcode entry

### Accessibility

**WCAG 2.1 AA Compliance:**
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Focus indicators on all focusable elements
- Color contrast ratios meet standards (4.5:1 for text)
- Form labels properly associated with inputs

**Keyboard Shortcuts:**
- `N` - New Lesson
- `S` - New Student
- `M` - Month View
- `W` - Week View
- `A` - Agenda View
- `/` - Focus search
- `Esc` - Close modal
- `Ctrl+S` - Save form

---

## 8. Technical Implementation Details

### Firebase Configuration

**Install Dependencies:**
```bash
npm install firebase
```

**firebase/config.js:**
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
```

**Environment Variables (.env):**
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Recommended Slot Algorithm

**File:** `utils/lessonRecommendations.js`

**Algorithm Logic:**
```javascript
/**
 * Recommends optimal lesson slot based on existing lessons
 * Priority: Minimize travel by clustering similar postcodes
 */
export function computeRecommendedSlot(date, startPostcode, duration, existingLessons) {
  // Filter lessons for the same date
  const dayLessons = existingLessons.filter(l =>
    isSameDay(l.date, date)
  ).sort((a, b) => a.start_time.localeCompare(b.start_time));

  if (dayLessons.length === 0) {
    // No lessons on this day, recommend first slot
    return '08:00';
  }

  // Find lessons with similar postcodes (first 3-4 characters match)
  const postcodeArea = startPostcode.substring(0, 3);
  const similarPostcodeLessons = dayLessons.filter(l =>
    l.start_postcode.startsWith(postcodeArea) ||
    l.end_postcode.startsWith(postcodeArea)
  );

  if (similarPostcodeLessons.length > 0) {
    // Recommend slot adjacent to similar postcode lesson
    const closest = similarPostcodeLessons[0];
    const afterTime = addMinutes(closest.end_time, 15); // 15 min buffer

    // Check if this slot conflicts with another lesson
    const hasConflict = dayLessons.some(l =>
      timeRangesOverlap(afterTime, duration, l.start_time, l.duration_minutes)
    );

    if (!hasConflict) {
      return afterTime;
    }
  }

  // No similar postcodes, find earliest available slot
  return findEarliestAvailableSlot(dayLessons, duration);
}

function findEarliestAvailableSlot(lessons, duration) {
  const startOfDay = '08:00';
  const endOfDay = '20:00';

  // Check if first slot is available
  if (lessons[0].start_time >= addMinutes(startOfDay, duration)) {
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
  return addMinutes(lastLesson.end_time, 15);
}
```

### Postcode Validation

**File:** `utils/postcodeHelpers.js`

```javascript
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

export function validateUKPostcode(postcode) {
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  return UK_POSTCODE_REGEX.test(normalized);
}

export function formatPostcode(postcode) {
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  if (normalized.length <= 5) return normalized;

  // Insert space before last 3 characters
  const outward = normalized.slice(0, -3);
  const inward = normalized.slice(-3);
  return `${outward} ${inward}`;
}

export function getPostcodeArea(postcode) {
  // Returns first 2-4 characters (postcode area)
  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  const match = normalized.match(/^[A-Z]{1,2}\d{1,2}/);
  return match ? match[0] : '';
}

export function postcodesAreSimilar(postcode1, postcode2) {
  const area1 = getPostcodeArea(postcode1);
  const area2 = getPostcodeArea(postcode2);
  return area1 === area2;
}
```

### Date & Time Helpers

**File:** `utils/dateHelpers.js`

```javascript
import { format, parse, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

export function formatDate(date, formatStr = 'PPP') {
  return format(date, formatStr);
}

export function parseDate(dateString) {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

export function isSameDay(date1, date2) {
  return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
}

export function getWeekRange(date) {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(date, { weekStartsOn: 0 })
  };
}

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
```

---

## 9. Testing Strategy

### Unit Tests
- Utility functions (date helpers, postcode validation, recommendation algorithm)
- Form validation logic
- Data transformation functions

### Integration Tests
- Firebase CRUD operations (use Firebase Emulator)
- Context providers and hooks
- Modal workflows (create student → create lesson)

### E2E Tests (Cypress or Playwright)
- Complete user journeys:
  - Login → Create Student → Create Lesson → View in Calendar
  - Navigate calendar views
  - Search and filter
  - Edit and delete operations

### Manual Testing Checklist
- [ ] Real-time sync works across multiple tabs/devices
- [ ] Offline mode queues changes properly
- [ ] Image uploads to Firebase Storage
- [ ] Recommended slot algorithm produces sensible results
- [ ] Calendar performance with 100+ lessons
- [ ] Mobile responsive design on real devices
- [ ] Accessibility with screen reader

---

## 10. Deployment & DevOps

### Environment Setup

**Development:**
- Use Firebase Emulator Suite for local development
- Separate dev Firebase project
- Hot module reload with Vite

**Staging:**
- Staging Firebase project
- Test with production-like data
- Preview deployments on every PR

**Production:**
- Production Firebase project
- Firebase Hosting for frontend
- Firestore security rules enforced
- Automated backups

### Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated admin can read/write
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /student-images/{imageId} {
      allow read: if true; // Public read
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Performance Optimization

**Code Splitting:**
- Lazy load admin area (React.lazy)
- Lazy load calendar views
- Route-based splitting

**Image Optimization:**
- Resize student images on upload (Firebase Function)
- WebP format for modern browsers
- Lazy loading for images

**Bundle Optimization:**
- Tree-shaking with Vite
- Minimize dependencies (consider react-select alternatives)
- Analyze bundle size regularly

---

## 11. Success Metrics

**User Experience:**
- Time to create a lesson: < 30 seconds (down from ~60 seconds)
- Calendar navigation: 0 loading time (real-time updates)
- Mobile usability score: > 90 (Lighthouse)

**Technical:**
- First contentful paint: < 1.5s
- Time to interactive: < 3s
- Bundle size: < 300KB (gzipped)
- Firestore read operations: < 100 per day per user (optimize queries)

**Business:**
- Admin time saved: ~30 minutes per day (less manual tracking)
- Lesson planning efficiency: 50% faster with recommendations
- Zero data loss (Firebase persistence vs localStorage)

---

## 12. Future Enhancements

**Phase 2 Features:**
- Automated SMS/email reminders to students
- Test booking workflow with DVSA integration
- Revenue tracking and invoicing
- Drag-and-drop lesson rescheduling
- Mobile app (React Native)

**Phase 3 Features:**
- Student portal (view upcoming lessons, book lessons)
- Online payment integration (Stripe)
- Route optimization using Google Maps API
- Analytics dashboard (revenue, hours taught, pass rate)

**Advanced Features:**
- AI-powered lesson recommendations based on student progress
- Automated test readiness assessment
- Video lesson recording and playback
- Multi-instructor support

---

## Appendix A: Calendar Library Evaluation

For the calendar implementation, we evaluated several libraries:

**Option 1: Build Custom (RECOMMENDED)**
- Pros: Full control, tailored to exact needs, no bloat
- Cons: More development time
- Recommendation: Build custom using date-fns for date logic

**Option 2: FullCalendar**
- Pros: Feature-rich, well-documented
- Cons: Large bundle size (100KB+), overkill for needs, jQuery dependency

**Option 3: React Big Calendar**
- Pros: Good for complex scheduling, drag-and-drop
- Cons: Styling difficult to customize, 50KB bundle

**Decision:** Build custom calendar components for Month, Week, Agenda views using Tailwind CSS and date-fns. This gives maximum control, smallest bundle, and perfect match to design.

---

## Appendix B: Firebase vs Alternatives

**Why Firebase?**
- Real-time synchronization (critical for multi-device admin)
- Minimal backend code required
- Generous free tier
- Easy authentication integration
- Built-in offline support
- Scalable as business grows

**Alternatives Considered:**
- **Supabase:** Great alternative, Postgres-based, but real-time is more complex
- **AWS Amplify:** More complex setup, better for larger scale
- **Custom Backend (Node.js + MongoDB):** More control, but much more dev work

**Decision:** Firebase is ideal for this use case - small team, need for real-time sync, rapid development.

---

## Appendix C: Component Library Evaluation

**UI Components:**
- **Current:** Custom components with Tailwind CSS
- **Alternatives:** shadcn/ui, Headless UI, Radix UI
- **Decision:** Continue with custom + Headless UI for complex components (dropdowns, modals) for accessibility

**Icons:**
- **Current:** Lucide React (continuing)
- Size: ~2KB per icon with tree-shaking

**Animations:**
- **Current:** Framer Motion (continuing)
- Use sparingly in admin area (performance > flash)

---

## Sign-off

This design document represents the validated approach for redesigning the Drive RJM admin area and lesson planner. All sections have been reviewed and approved.

**Next Steps:**
1. Set up git worktree for isolated development
2. Create detailed implementation plan with task breakdown
3. Begin Phase 1: Firebase setup and component structure
4. Iterative development with testing after each phase

**Design Approved By:** Alastair Blair
**Date:** November 21, 2025
