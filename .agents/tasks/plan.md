# EDUVISION Implementation Plan

## Overview

Comprehensive visual and functional upgrade of the EDUVISION Student Academic Performance Detection & Early Warning System. All changes preserve existing layout structure (sidebar, header, page structure, routes, data fetching, business logic). All data computed from `studentService.getStudents()` - never hardcoded.

**Stack:** React 18, TypeScript, Tailwind CSS, Vite
**Dependencies already installed:** lucide-react, recharts, papaparse, zustand, react-hook-form, date-fns

---

## Phase 1: Global Styles & Foundation

### 1. Update tailwind.config.js - Inter font, animations, extended colors

**What:** Add Inter font family, skeleton shimmer animation, count-up animation, focus ring utilities, and extended color system with gradient support.

**File:** `frontend/tailwind.config.js`

**Keep:** Existing risk and primary color definitions

**Add:**
- `fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }`
- Animation: `shimmer` (for skeleton loaders), `count-up`
- Box shadow: `card` (subtle shadow for cards)
- BorderRadius: `card` (12-16px)

**Verify:** `cd frontend && npm run build` completes without errors

---

### 2. Update index.css - Gradient background, transitions, focus rings

**What:** Add soft gradient page background, smooth page transitions, visible focus rings, skeleton shimmer styles, and improved contrast.

**File:** `frontend/src/index.css`

**Keep:** Existing Tailwind directives and scrollbar styles

**Add:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Page background gradient */
.page-bg { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); }

/* Card styles */
.card { @apply bg-white rounded-xl shadow-card border border-neutral-200/60; }

/* Focus rings */
.focus-ring { @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2; }

/* Skeleton shimmer */
.skeleton { @apply bg-neutral-200 animate-shimmer; }

/* Page transition */
.page-enter { animation: fadeSlideUp 200ms ease-out; }

/* Hover transitions */
.hover-lift { @apply transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md; }
```

**Verify:** `cd frontend && npm run build` completes without errors

---

## Phase 2: Shared Components

### 3. Create StatCard component

**What:** Modern stat card with gradient icon chip, count-up animation, trend caption, and hover lift effect.

**File:** `frontend/src/components/common/StatCard.tsx`

**Create new file with:**
- Props: `title`, `value`, `icon` (Lucide component), `color` (blue/red/amber/green), `trend?`, `to?` (link)
- Count-up animation using `useEffect` and `requestAnimationFrame`
- Gradient icon chip: rounded-lg with gradient background and white icon
- Hover lift effect
- Small trend caption below number

**Data source:** Values passed from parent (computed from `studentService.getStats()`)

**Verify:** Import in Dashboard, verify TypeScript compiles

---

### 4. Create RiskBadge component

**What:** Colored pill badge for risk levels with consistent styling.

**File:** `frontend/src/components/common/RiskBadge.tsx`

**Create new file with:**
- Props: `level` ('High' | 'Medium' | 'Low')
- Color mapping: High = red, Medium = amber, Low = green
- Consistent pill styling: `px-2.5 py-1 rounded-full text-xs font-semibold`

**Verify:** Import in StudentList, verify TypeScript compiles

---

### 5. Create TrendIcon component

**What:** Trend arrow with color coding.

**File:** `frontend/src/components/common/TrendIcon.tsx`

**Create new file with:**
- Props: `trend` ('Improving' | 'Stable' | 'Declining')
- Icons from lucide-react: TrendingUp (green), Minus (gray), TrendingDown (red)
- Returns icon + label

**Verify:** Import in StudentList, verify TypeScript compiles

---

### 6. Create EmptyState component

**What:** Friendly empty state with icon, message, and optional action.

**File:** `frontend/src/components/common/EmptyState.tsx`

**Create new file with:**
- Props: `icon` (Lucide), `title`, `description?`, `action?` (React node)
- Centered layout with muted colors

**Verify:** TypeScript compiles

---

### 7. Create Skeleton component

**What:** Loading skeleton with shimmer animation.

**File:** `frontend/src/components/common/Skeleton.tsx`

**Create new file with:**
- Props: `className?`, `variant?` ('text' | 'card' | 'circle')
- Shimmer animation CSS class

**Verify:** TypeScript compiles

---

### 8. Create Drawer component

**What:** Slide-in drawer for student detail view.

**File:** `frontend/src/components/common/Drawer.tsx`

**Create new file with:**
- Props: `open`, `onClose`, `title`, `children`
- Right-side slide-in animation
- Close on Esc, close on backdrop click
- Uses `@radix-ui/react-dialog` (already in devDependencies)

**Verify:** TypeScript compiles

---

### 9. Create ChartCard component

**What:** Card wrapper for Recharts with title and loading state.

**File:** `frontend/src/components/common/ChartCard.tsx`

**Create new file with:**
- Props: `title`, `children`, `loading?`
- White card with rounded corners, subtle shadow
- Skeleton when loading

**Verify:** TypeScript compiles

---

## Phase 3: Header & Sidebar Updates

### 10. Update Header.tsx - Notification bell with dropdown

**What:** Add real notification bell badge with unread count and dropdown preview of latest 5 notifications. Fix avatar dropdown to close on outside click and Esc.

**File:** `frontend/src/components/common/Header.tsx`

**Keep:** Existing logo block, user menu structure

**Add:**
- Import `useNotificationStore` from new store
- Bell icon from lucide-react with unread count badge
- Dropdown preview showing latest 5 notifications with unread dot
- Use `useEffect` with click outside handler for dropdowns
- Close avatar dropdown on Esc key

**Data source:** `useNotificationStore().unreadCount`, `useNotificationStore().notifications.slice(0, 5)`

**Verify:** `cd frontend && npm run build` compiles

---

### 11. Update Sidebar.tsx - Lucide icons, hover states, active accent

**What:** Replace emoji icons with Lucide icons, add soft hover state, left accent bar on active item, gradient logo block.

**File:** `frontend/src/components/common/Sidebar.tsx`

**Keep:** Existing navItems structure, mobile menu, footer

**Changes:**
- Replace emoji icons with Lucide: `LayoutDashboard`, `Users`, `AlertTriangle`, `Target`, `Bell`, `FileText`, `Database`, `Settings`
- Add left accent bar on active item: `border-l-4 border-primary-500`
- Add soft hover: `hover:bg-primary-50 dark:hover:bg-primary-900/20`
- Add gradient to logo block: `bg-gradient-to-r from-primary-500 to-primary-600`

**Verify:** `cd frontend && npm run build` compiles

---

## Phase 4: Zustand Stores

### 12. Create interventionsStore.ts

**What:** Zustand store for interventions with localStorage persistence.

**File:** `frontend/src/store/interventionsStore.ts`

**Create new file with:**
- Interface: `Intervention { id, studentId, type, notes, status, priority, assignedTo, dueDate, createdAt }`
- State: `interventions`, `loading`
- Actions: `addIntervention`, `updateIntervention`, `removeIntervention`, `getInterventionsByStudent`
- Auto-generate initial interventions for High and Medium risk students

**Data source:** `studentService.getStudents().filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium')`

**Verify:** TypeScript compiles

---

### 13. Create notificationsStore.ts

**What:** Zustand store for notifications with localStorage persistence.

**File:** `frontend/src/store/notificationsStore.ts`

**Create new file with:**
- Interface: `AppNotification { id, studentId, type, message, priority, read, createdAt }`
- State: `notifications`, `unreadCount`
- Actions: `markAsRead`, `markAllAsRead`, `addNotification`
- Auto-generate notifications from student data on initialization

**Data source:** Generate from High risk students, declining trends, attendance drops

**Verify:** TypeScript compiles

---

### 14. Create settingsStore.ts

**What:** Zustand store for app settings with localStorage persistence.

**File:** `frontend/src/store/settingsStore.ts`

**Create new file with:**
- Interface: `Settings { attendanceThreshold, performanceThreshold, notificationsEnabled, theme }`
- State: `settings`
- Actions: `updateSettings`, `resetToDefaults`

**Verify:** TypeScript compiles

---

## Phase 5: Dashboard Page

### 15. Update Dashboard.tsx - Modern stat cards and charts

**What:** Replace existing stat cards with new StatCard component (keeping 4 + 4 grid), add Recharts visualizations below existing content.

**File:** `frontend/src/pages/Dashboard.tsx`

**Keep:** 
- Page title/subtitle structure
- Existing 8 stat cards (replace with StatCard component)
- Existing 3 action cards (QuickLink components)

**Add below existing content:**

**Row 1 - Two donut charts:**
- Risk Distribution donut: High/Medium/Low counts
- Performance Trend donut: Improving/Stable/Declining counts

**Row 2 - Two charts:**
- Average Performance by Department bar chart
- Attendance vs Performance scatter plot (points colored by risk level)

**Row 3 - Top 5 At-Risk Students table:**
- Columns: Avatar initials, name, department, attendance, avg performance, risk badge, remarks (as reason)
- Sorted by lowest attendance among High risk students

**Row 4 - Needs Attention panel:**
- Students with High risk AND Declining trend
- Each with "Create intervention" button

**Data source:** 
- `studentService.getStats()` for counts
- `studentService.getStudents()` for charts and tables
- Computed: group by department, filter by risk/trend

**Verify:** `cd frontend && npm run build` compiles, visual check in browser

---

## Phase 6: Students Page

### 16. Update StudentList.tsx - Modern table with filters

**What:** Enhance table with avatar initials, colored attendance progress bar, trend arrows, search/filter/sort/pagination, and clickable row opening detail drawer.

**File:** `frontend/src/pages/StudentList.tsx`

**Keep:** Existing page structure, filter controls, pagination logic

**Changes:**
- Replace `riskBadge` and `trendIcon` functions with imported components
- Add avatar initials column with colored background
- Add small colored progress bar under attendance percentage
- Add sortable column headers (Name, Attendance, Performance)
- Make row clickable to open StudentDetailDrawer

**Data source:** `studentService.filterStudents()` with existing filters

**Verify:** `cd frontend && npm run build` compiles

---

### 17. Create StudentDetailDrawer component

**What:** Drawer showing student details with subject scores chart and "Why flagged" explanation.

**File:** `frontend/src/components/student/StudentDetailDrawer.tsx`

**Create new file with:**
- Props: `studentId`, `open`, `onClose`
- Profile info: name, roll number, department, year, section
- Subject scores: Math, Programming, AI/ML as radar or bar chart (Recharts)
- Attendance info: days present, absent, late count
- Failed subjects count
- "Why flagged" section: explanation based on thresholds (e.g., "Attendance 48%, below 65% threshold; 5 failed subjects; trend declining")

**Data source:** `studentService.getStudentById(studentId)`

**Verify:** TypeScript compiles

---

### 18. Update StudentProfile.tsx - Full student profile

**What:** Replace placeholder with real student profile using student data.

**File:** `frontend/src/pages/StudentProfile.tsx`

**Keep:** Existing page structure with MainLayout

**Add:**
- Load student via `studentService.getStudentById(studentId)`
- Profile card with all student info
- Subject scores chart (reuse from drawer)
- Risk analysis section with factor breakdown
- Intervention history

**Data source:** `studentService.getStudentById(studentId)`

**Verify:** `cd frontend && npm run build` compiles

---

## Phase 7: Risk Analysis Page

### 19. Create new RiskAnalysis page component

**What:** Replace current RiskAnalysis.tsx with enhanced version including summary strip, 3-column layout, risk score gauges, and factor bars.

**File:** `frontend/src/pages/RiskAnalysis.tsx`

**Keep:** Page title/subtitle structure

**Add:**
- Summary strip at top: High/Medium/Low counts with percentages
- Three columns listing students by risk level (High first), sorted by lowest attendance
- Each student card shows:
  - Risk score gauge (0-100) calculated from attendance, avg performance, failed subjects, trend
  - Top 3 contributing factors as horizontal bars
  - "Recommend action" line
- Classification rules displayed: e.g., "High: attendance below 65% or avg below 65 or 3+ failed subjects"

**Data source:** `studentService.getStudents()` grouped and sorted

**Verify:** `cd frontend && npm run build` compiles

---

### 20. Update App.tsx - Route to new RiskAnalysis

**What:** Update /risk-analysis route to use the new RiskAnalysis component instead of Dashboard.

**File:** `frontend/src/App.tsx`

**Change:** Import RiskAnalysis and update the route element from `<Dashboard />` to `<RiskAnalysis />`

**Verify:** `cd frontend && npm run build` compiles

---

## Phase 8: Interventions Page

### 21. Update Interventions.tsx - Full implementation

**What:** Replace placeholder with full intervention management system.

**File:** `frontend/src/pages/Interventions.tsx`

**Keep:** Page title/subtitle structure

**Add:**
- Summary cards: Total, Planned, In Progress, Completed
- Kanban or list view of interventions
- Auto-generated starter interventions for High and Medium risk students
- Each intervention shows: status, priority, assigned to, due date
- "Create intervention" button opening form (student, type, notes, due date, priority)
- Form saves to `useInterventionsStore`

**Data source:** 
- `useInterventionsStore().interventions`
- Auto-generate from `studentService.getStudents().filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium')`

**Verify:** `cd frontend && npm run build` compiles

---

## Phase 9: Notifications Page

### 22. Update Notifications.tsx - Full implementation

**What:** Replace placeholder with full notification system with tabs and mark as read functionality.

**File:** `frontend/src/pages/Notifications.tsx`

**Keep:** Page title/subtitle structure

**Add:**
- Tabs: All, Unread, High Risk, Attendance, Interventions
- Auto-generated notifications from student data
- Each notification: icon (lucide), time ago, unread dot
- "Mark as read" and "Mark all as read" buttons
- Connected to header bell via `useNotificationStore`

**Data source:** 
- `useNotificationStore().notifications`
- Filter by tab selection

**Verify:** `cd frontend && npm run build` compiles

---

## Phase 10: Reports Page

### 23. Update Reports.tsx - Full implementation with CSV export

**What:** Replace placeholder with report cards, live preview, and CSV export functionality.

**File:** `frontend/src/pages/Reports.tsx`

**Keep:** Page title/subtitle structure

**Add:**
- Report cards: Risk Summary, Attendance Report, Performance Report, Department-wise Report, Intervention Report
- Each card: description, Download CSV button, Print button
- Live preview section: table + chart for selected report
- CSV export using native JavaScript (create downloadable blob)
- Print-friendly view with `@media print` styles

**Data source:** `studentService.getStudents()` for all reports

**Verify:** `cd frontend && npm run build` compiles, CSV download works

---

## Phase 11: Data Center Page

### 24. Update DataCenter.tsx - CSV upload with PapaParse

**What:** Replace placeholder with drag-and-drop CSV upload, preview, and data quality cards.

**File:** `frontend/src/pages/DataCenter.tsx`

**Keep:** Page title/subtitle structure

**Add:**
- Drag-and-drop CSV upload zone using PapaParse
- File validation: required columns check, row count, error list
- Preview table: first 10 rows before confirming import
- "Replace data" and "Merge data" options
- Data quality cards: total records, missing values, duplicate IDs, last updated
- "Download sample CSV template" button
- "Export current data" button

**Data source:** 
- `studentService.getStudents()` for current data
- `studentService.setStudents()` for import
- PapaParse for CSV parsing

**Verify:** `cd frontend && npm run build` compiles, CSV import/export works

---

## Phase 12: Settings Page

### 25. Update Settings.tsx - Expanded settings with sliders

**What:** Replace placeholder with real settings functionality.

**File:** `frontend/src/pages/Settings.tsx`

**Keep:** Two card layout structure (General Settings and User Management)

**Add to General Settings:**
- Risk thresholds: attendance and performance cutoffs with range sliders
- Notification toggles: enable/disable notification types
- Theme toggle: light/dark mode switch

**Add to User Management:**
- Table of demo users: Admin, Teacher, Counselor
- Role badges
- Active/inactive toggle switches

**Make cards expandable** with "Expand" button opening into full panel on same page.

**Data source:** 
- `useSettingsStore()` for settings state
- Demo users array (local)

**Verify:** `cd frontend && npm run build` compiles, settings persist to localStorage

---

## Phase 13: Final Verification

### 26. Run full build and type check

**What:** Ensure all changes compile and build successfully.

**Command:** `cd frontend && npm run build && npm run type-check`

**Verify:** No TypeScript errors, build completes successfully

---

### 27. Run development server and verify UI

**What:** Start dev server and visually verify all pages render correctly.

**Command:** `cd frontend && npm run dev`

**Verify:** 
- All pages load without errors
- Navigation works
- Data displays correctly
- Charts render
- Responsive layout works

---

## New Files Summary

**Components (9 files):**
- `frontend/src/components/common/StatCard.tsx`
- `frontend/src/components/common/RiskBadge.tsx`
- `frontend/src/components/common/TrendIcon.tsx`
- `frontend/src/components/common/EmptyState.tsx`
- `frontend/src/components/common/Skeleton.tsx`
- `frontend/src/components/common/Drawer.tsx`
- `frontend/src/components/common/ChartCard.tsx`
- `frontend/src/components/student/StudentDetailDrawer.tsx`

**Stores (3 files):**
- `frontend/src/store/interventionsStore.ts`
- `frontend/src/store/notificationsStore.ts`
- `frontend/src/store/settingsStore.ts`

## Modified Files Summary

**Global Styles:**
- `frontend/tailwind.config.js` - Add Inter font, animations
- `frontend/src/index.css` - Add gradient backgrounds, transitions

**Components:**
- `frontend/src/components/common/Header.tsx` - Notification bell dropdown
- `frontend/src/components/common/Sidebar.tsx` - Lucide icons, hover states

**Pages:**
- `frontend/src/pages/Dashboard.tsx` - Stat cards + Recharts
- `frontend/src/pages/StudentList.tsx` - Modern table + drawer
- `frontend/src/pages/StudentProfile.tsx` - Full profile
- `frontend/src/pages/RiskAnalysis.tsx` - New implementation
- `frontend/src/pages/Interventions.tsx` - Full implementation
- `frontend/src/pages/Notifications.tsx` - Full implementation
- `frontend/src/pages/Reports.tsx` - CSV export
- `frontend/src/pages/DataCenter.tsx` - CSV upload
- `frontend/src/pages/Settings.tsx` - Expanded settings

**Routes:**
- `frontend/src/App.tsx` - Update RiskAnalysis route

---

## Dependencies

All required dependencies are already installed in `package.json`:
- `lucide-react` - Icons
- `recharts` - Charts
- `papaparse` - CSV parsing
- `zustand` - State management
- `react-hook-form` - Form handling
- `date-fns` - Date formatting
- `@radix-ui/react-dialog` - Drawer component

No additional npm install required.

---

## Implementation Order

1. Global styles (tailwind.config.js, index.css)
2. Shared components (StatCard, RiskBadge, TrendIcon, EmptyState, Skeleton, Drawer, ChartCard)
3. Zustand stores (interventions, notifications, settings)
4. Header and Sidebar updates
5. Dashboard page
6. Students page + StudentDetailDrawer + StudentProfile
7. Risk Analysis page + App.tsx route update
8. Interventions page
9. Notifications page
10. Reports page
11. Data Center page
12. Settings page
13. Final verification

Each step leaves the codebase in a buildable state.
