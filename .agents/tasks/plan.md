# Implementation Plan: UPswing Landing Page

## Overview
Build an interactive, animated landing page for UPswing at route `/`. This requires:
1. Routing restructuring: move Dashboard from `/` to `/dashboard`
2. New landing page files with 10 sections
3. Custom hooks for animations and interactions
4. Shared components for landing-specific features
5. Risk calculator utility (if none exists)

## Key Findings & Decisions

### Routing & Structure
- **Current state**: Dashboard is at `/`, Login at `/login`, protected routes only
- **Change needed**: Move Dashboard to `/dashboard`, add public Landing page at `/`
- **ProtectedRoute redirect**: Update to redirect from `/` to `/dashboard` instead
- **Intro animation**: Persists via sessionStorage, plays before landing page on first load—no changes needed
- **Login exists**: Yes (`/login` page confirmed), so "Launch demo" CTA links to `/login`

### Theme System
- **Current**: ThemeContext with `data-theme` attribute and CSS variables (--primary, --bg, --surface, --border, --text, --text-muted, --primary-soft)
- **Light mode**: Primary #2563eb, backgrounds light
- **Dark mode**: Primary #3b82f6 (lighter blue), backgrounds dark (#0b1120, #111a2e, #172036)
- **Landing page**: Will use existing theme system—no new tokens needed. CSS variables handle all colors.

### Existing UI Components
- **StatCard**: Count-up animation, icon, color prop, clickable links—reusable for hero stats
- **RiskBadge**: Shows High/Medium/Low risk with colors
- **ChartCard**: Card wrapper for charts with height prop—reusable
- **Sidebar**: Links to `/`, needs updating to `/dashboard`
- **Header**: Part of MainLayout, not used on landing (landing has custom LandingLayout)

### Animation Library
- **framer-motion**: NOT installed—cannot use
- **lucide-react**: Already installed (used in Dashboard, Sidebar)
- **recharts**: Already installed (used in Dashboard charts)
- **Approach**: CSS animations + IntersectionObserver + requestAnimationFrame, no external libraries

### Risk Calculator
- **Current app**: Uses `studentService.getStats()` which returns StudentStats with risk counts
- **No existing shared thresholds file**: Will create `src/utils/riskCalculator.ts` with thresholds:
  - **High risk**: Attendance < 75% OR Performance < 50% OR Failed subjects ≥ 3
  - **Medium risk**: Attendance < 85% OR Performance < 65% OR Failed subjects ≥ 2
  - **Low risk**: Everything else
  - **Trend**: Improving (avg up), Declining (avg down), Stable (flat)

### Real Data for Hero Stats
- Use `studentService.getStats()` in the Landing page or Hero component to fetch:
  - Total students monitored
  - High/Medium/Low risk counts
  - Average attendance, Average performance
- Display in hero preview card and trust strip

### Component Organization
- **Layout**: `src/pages/Landing/LandingLayout.tsx` (no sidebar, sticky nav, footer)
- **Main page**: `src/pages/Landing/index.tsx` (SEO meta via useEffect + document.title)
- **Sections**: Each in `src/pages/Landing/components/` for modularity
- **Shared**: Hooks in `src/hooks/`, Reveal component in `src/components/common/`

### CSS & Motion Constraints
- **Prefers-reduced-motion**: Respected—all animations disabled, static final states shown
- **Transforms & opacity only**: No layout thrash
- **Durations**: 300–700ms for interactions, no loop longer than 1.2s except decorative
- **Durations**: Parallax, tilt, cursor-glow loops pause when off-screen

### Keyboard Accessibility
- **Semantic HTML**: `<header>`, `<main>`, `<section>`, `<footer>`
- **Focus rings**: Visible, consistent with app's focus-ring class
- **ARIA labels**: On icons, accordions, sliders, modals
- **Contrast**: WCAG AA in both themes (use existing CSS variable colors)
- **Tab order**: Logical, skip to main content link
- **Accordions & tabs**: Keyboard operable (arrow keys, Enter)

### SEO & Meta Tags
- **No react-helmet**: Not in package.json
- **Approach**: Direct DOM manipulation in useEffect in `src/pages/Landing/index.tsx`
- **Tags**:
  - `<title>`: "UPswing | AI Student Academic Performance Detection & Early Warning System"
  - `<meta name="description">`: "UPswing turns attendance and marks into early warnings. Detect academic risk early, understand why each student is at risk, and track interventions that bring them back up."
  - **Open Graph**: og:title, og:description, og:type, og:url, og:image (CSS-generated or existing)

---

## Implementation Plan (Ordered by Dependency)

### Phase 1: Core Routing & Utilities

- [ ] 1. Create risk calculator utility
      **What**: Create `src/utils/riskCalculator.ts` with functions to classify risk level based on attendance, performance, failed subjects, and trend.
      **Why**: Shared logic for both dashboard and landing risk checker. Thresholds: High (att<75% OR perf<50% OR fails≥3), Medium (att<85% OR perf<65% OR fails≥2), Low (else). Export a `calculateRiskLevel(attendance, performance, failedSubjects)` function and `RiskThresholds` interface.
      **Files**: 
        - Create: `src/utils/riskCalculator.ts`
      **Verify**: 
        ```
        npm run type-check
        ```
        No TypeScript errors. Function exports visible in editor IntelliSense.

- [ ] 2. Update routing: move Dashboard to `/dashboard`, add Landing placeholder
      **What**: In `src/App.tsx`, (1) change Dashboard route from `/` to `/dashboard`, (2) add `<Route path="/" element={<Landing />} />` before protected routes with lazy-load placeholder, (3) update ProtectedRoute redirect to `/dashboard` instead of `/`.
      **Why**: Makes landing page public, protects dashboard, maintains once-per-session intro animation.
      **Files**: 
        - Modify: `src/App.tsx`
      **Verify**: 
        ```
        npm run type-check
        ```
        No errors. Routing structure validates.

- [ ] 3. Update Sidebar to link Dashboard to `/dashboard` and update isActive check
      **What**: In `src/components/common/Sidebar.tsx`, change the Dashboard nav item path from `/` to `/dashboard`, update `isActive` check to work with new route.
      **Why**: Sidebar nav reflects new routing.
      **Files**: 
        - Modify: `src/components/common/Sidebar.tsx`
      **Verify**: 
        ```
        npm run type-check
        ```
        No errors.

### Phase 2: Custom Hooks (Non-Visual)

- [ ] 4. Create custom hooks for animations and interactions
      **What**: Create `src/hooks/` directory with 5 hooks:
      - `useCountUp.ts`: Animate number from 0 to target over duration, respects prefers-reduced-motion
      - `useReveal.ts`: IntersectionObserver wrapper; trigger callback when element enters viewport, only once
      - `useScrollProgress.ts`: Returns 0–1 based on element scroll position relative to viewport
      - `useTilt.ts`: 3D tilt effect following mouse/touch, respects prefers-reduced-motion
      - `useMagnetic.ts`: Button that follows cursor with elastic animation, respects prefers-reduced-motion
      
      Each hook respects `prefers-reduced-motion` and uses only transforms/opacity.
      **Files**: 
        - Create: `src/hooks/useCountUp.ts`, `src/hooks/useReveal.ts`, `src/hooks/useScrollProgress.ts`, `src/hooks/useTilt.ts`, `src/hooks/useMagnetic.ts`
      **Verify**: 
        ```
        npm run type-check
        ```
        No errors. All hooks export typed functions.

### Phase 3: Shared Landing Components

- [ ] 5. Create Reveal component for scroll-triggered animations
      **What**: Create `src/components/common/Reveal.tsx`. Wraps children with IntersectionObserver trigger. Props: `children`, `variants` (fade-up, fade-in, scale-in, stagger-children), `delay`, `once` (default true). Animates on scroll into viewport.
      **Why**: Reused across all landing sections for consistent reveal animations.
      **Files**: 
        - Create: `src/components/common/Reveal.tsx`
      **Verify**: 
        ```
        npm run type-check
        ```
        No errors. Component accepts children and variant prop.

- [ ] 6. Create shared UI components for landing (Button, Badge variants, Card styles)
      **What**: In `src/components/common/`, create or extend:
      - Ensure Button exists or create Button.tsx with variants: primary, outline, secondary. Props: size, disabled, className, children.
      - Ensure Badge exists or create Badge.tsx with color/size variants
      - Create LandingCard.tsx: wrapper with gradient border option, hover lift
      
      **Why**: Consistent UI across landing page, reuses app's design system.
      **Files**: 
        - Create or extend: `src/components/common/Button.tsx`, `src/components/common/Badge.tsx`, `src/components/common/LandingCard.tsx`
      **Verify**: 
        ```
        npm run type-check
        ```
        No errors. Components render in isolation.

### Phase 4: Landing Layout & Main Page

- [ ] 7. Create LandingLayout component (no sidebar, sticky nav, footer)
      **What**: Create `src/pages/Landing/LandingLayout.tsx`. Props: `children`, `navItems`, `onNavClick`. Returns:
      - Sticky header with logo, wordmark, nav links, theme toggle, "Launch demo" button, mobile hamburger
      - `<main>` with children
      - Footer with logo, links, copyright
      
      Header becomes blur-translucent after 24px scroll. No sidebar or app layout.
      **Files**: 
        - Create: `src/pages/Landing/LandingLayout.tsx`
      **Verify**: 
        ```
        npm run type-check
        ```
        No errors. Header and footer render.

- [ ] 8. Create Hero component (headline, subtext, CTAs, interactive preview card)
      **What**: Create `src/pages/Landing/components/Hero.tsx`. Sections:
      - Headline: "Spot the dip. Fuel the upswing." with "upswing" in blue, underline animation
      - Subtext: "UPswing turns attendance and marks into early warnings..."
      - CTAs: "Launch demo" (primary) with magnetic hover, "See how it works" (outline)
      - Right side: Mini dashboard preview card with 4 stat cards (real data from studentService), risk donut, trend line, floating badges, 3D tilt, cursor glow
      - Background: Soft blue radial glow, SVG line animating upward curve (stroke-dashoffset), faint dotted grid parallax on scroll
      - Below hero: Trust strip with 3 animated counters (students monitored, risk factors, interventions tracked) from real data
      
      **Files**: 
        - Create: `src/pages/Landing/components/Hero.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Hero renders, headline visible, CTAs clickable, preview card tilts on mouse move, counters count up on scroll into view.

- [ ] 9. Create Problem-to-Solution component (two-column, connecting line animates on scroll)
      **What**: Create `src/pages/Landing/components/ProblemSolution.tsx`. Left column: "Students slip quietly." + 3 pain points (reveal staggered on scroll). Right column: "UPswing notices early." + 3 matching solutions. A connecting line between each pair animates (stroke-dashoffset) as user scrolls down.
      **Files**: 
        - Create: `src/pages/Landing/components/ProblemSolution.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Two columns render, line animates on scroll, pain points fade in one by one.

- [ ] 10. Create Features bento grid (6 cards, asymmetric, cursor spotlight border, staggered reveal)
      **What**: Create `src/pages/Landing/components/Features.tsx`. 6 feature cards in asymmetric bento grid (2 large, 4 small):
      1. Early warning
      2. Explainable risk scores
      3. Intervention tracking
      4. Reports and exports
      5. Data Center import
      6. Roles and privacy
      
      Each: lucide icon chip, one-line benefit, hover micro-animation (risk bars fill, gauge needle moves, CSV rows slide). Cursor spotlight border effect. Staggered reveal on scroll.
      **Files**: 
        - Create: `src/pages/Landing/components/Features.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        6 cards render in asymmetric grid, spotlight effect on hover, icons animate.

- [ ] 11. Create How It Works section (scroll-driven timeline with 4 steps, vertical progress line fills on scroll)
      **What**: Create `src/pages/Landing/components/HowItWorks.tsx`. Four steps with vertical progress line that fills as user scrolls:
      1. Import your data (CSV drop animation)
      2. Detect risk (score gauge animates to value)
      3. Understand why (top-3 factor bars, red for increasing/green for decreasing)
      4. Intervene and track (small kanban cards moving Planned → In Progress → Completed)
      
      Visual side crossfades with active step. On mobile, stack steps vertically.
      **Files**: 
        - Create: `src/pages/Landing/components/HowItWorks.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        4 steps render, progress line fills on scroll, mobile layout stacks.

- [ ] 12. Create RiskChecker component (sliders for attendance/performance/failed subjects, trend selector, live risk score & factors)
      **What**: Create `src/pages/Landing/components/RiskChecker.tsx`. Centerpiece card with:
      - 3 sliders: Attendance (0–100%), Avg Performance (0–100%), Failed Subjects (0–6)
      - Trend selector buttons: Improving / Stable / Declining
      - Live updates: Risk badge (High/Medium/Low), risk score gauge (0–100), top 3 contributing factors as bars, suggested action text
      - Uses `riskCalculator` utility with real app thresholds
      - Buttons: "Reset", "Thriving", "Needs attention", "Critical" (presets)
      - Note: "Demo using the same rules as the dashboard"
      
      **Files**: 
        - Create: `src/pages/Landing/components/RiskChecker.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Sliders work, risk score updates live, presets populate sliders, gauge animates.

- [ ] 13. Create RoleTabs component (Admin/Teacher/Counselor tabs, mock preview, role-specific bullet list)
      **What**: Create `src/pages/Landing/components/RoleTabs.tsx`. Keyboard-accessible tab pattern:
      - 3 tabs: Admin, Teacher, Counselor
      - Switching tabs animates mock preview (different sidebar items & card sets)
      - Shows role-specific feature list as bullets
      - Arrow keys (left/right) switch tabs, Enter activates
      **Files**: 
        - Create: `src/pages/Landing/components/RoleTabs.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Tabs keyboard operable, preview animates on tab switch.

- [ ] 14. Create BeforeAfter comparison slider (draggable, keyboard operable, shows risk curve before/after intervention)
      **What**: Create `src/pages/Landing/components/BeforeAfter.tsx`. Draggable comparison slider showing student risk curve before/after intervention: left red falling line, right green swinging upward. Caption: "Interventions that work, measured." Label: "Illustrative". Keyboard operable: arrow keys move slider.
      **Files**: 
        - Create: `src/pages/Landing/components/BeforeAfter.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Slider drags smoothly, keyboard arrows work, curves render.

- [ ] 15. Create FAQ component (4–5 accordion questions, smooth height animation, Reveal wrapper)
      **What**: Create `src/pages/Landing/components/FAQ.tsx`. Accordion with questions:
      1. How is risk calculated?
      2. Is student data private?
      3. Can I import my own CSV?
      4. Do I need to install anything?
      5. Can thresholds be changed?
      
      Each answer is accessible via keyboard (arrow keys, Enter to expand/collapse), smooth height transition.
      **Files**: 
        - Create: `src/pages/Landing/components/FAQ.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Accordion items expand/collapse smoothly, keyboard operable.

- [ ] 16. Create FinalCTA component (animated "U" mark drawing itself, tagline, "Launch demo" button)
      **What**: Create `src/pages/Landing/components/FinalCTA.tsx`. Full-width CTA band with:
      - Animated UpswingMark drawing itself (reuse SVG from UpswingIntro)
      - Line: "Ready to lift every student?"
      - "Launch demo" primary button
      - Reveal animation on scroll
      **Files**: 
        - Create: `src/pages/Landing/components/FinalCTA.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Mark draws on scroll into view, button clickable.

- [ ] 17. Create Footer component (logo, description, link columns, copyright, theme toggle)
      **What**: Create `src/pages/Landing/components/Footer.tsx`. Sticky footer with:
      - Logo + "UPswing" wordmark
      - Short description: "Early warning system for academic performance"
      - 3 link columns: Product, Resources, Project
      - "© 2026 UPswing"
      - Theme toggle in footer
      **Files**: 
        - Create: `src/pages/Landing/components/Footer.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Footer renders, theme toggle works, links visually present.

- [ ] 18. Create Landing page index (assemble all sections, manage SEO meta tags, Intro animation check)
      **What**: Create `src/pages/Landing/index.tsx`. Main landing page component:
      - Import all section components
      - Wrap in LandingLayout
      - Manage SEO: useEffect sets document.title, meta description, og tags
      - Fetch real data from studentService for hero stats
      - Fetch settings/thresholds for RiskChecker (or use defaults from riskCalculator)
      - Wrap with React.lazy and Suspense in App.tsx
      - Section order: Nav (in layout), Hero, ProblemSolution, Features, HowItWorks, RiskChecker, RoleTabs, BeforeAfter, FAQ, FinalCTA, Footer
      
      **Files**: 
        - Create: `src/pages/Landing/index.tsx`
      **Verify**: 
        ```
        npm run dev
        ```
        Landing page loads at `/`, all sections render, no console errors, SEO tags visible in HTML.

### Phase 5: Integration & Final Routing

- [ ] 19. Lazy-load Landing page in App.tsx with React.lazy and Suspense
      **What**: In `src/App.tsx`, wrap Landing import with `React.lazy()`, use `<Suspense>` with loading fallback, route at `/`.
      **Why**: Keeps main bundle small, landing loads on demand.
      **Files**: 
        - Modify: `src/App.tsx`
      **Verify**: 
        ```
        npm run build
        ```
        Build succeeds, landing route loads with lazy loading fallback visible briefly.

- [ ] 20. Test full routing flow: public landing → login → protected dashboard, redirects work
      **What**: Test:
      - Visit `/` → Landing page loads
      - Click "Launch demo" → Redirect to `/login` (or login if not authenticated)
      - Login → Redirect to `/dashboard` (not `/`)
      - Try accessing `/` while authenticated → Landing page still loads (public)
      - Try accessing `/dashboard` without auth → Redirect to `/login`
      - Dashboard nav link goes to `/dashboard`
      **Files**: (No file changes, testing only)
      **Verify**: 
        ```
        npm run dev
        ```
        Open browser, test all routes above, no 404s, redirects work.

---

## Notes on Implementation Order & Key Details

### Dependency Order Rationale
1. **Risk calculator first**: Used by RiskChecker and potentially Dashboard (if we refactor it later)
2. **Routing next**: Unblocks all landing pages
3. **Hooks & shared components**: Foundation for all section components
4. **Sections in build order**: Hero → simple static sections → interactive sections → Layout/main page

### Real Data Integration
- **Hero stats & trust strip**: Call `studentService.getStats()` in Hero component
- **RiskChecker**: Use `riskCalculator.calculateRiskLevel()` with real thresholds
- **Settings/thresholds**: Landing page index fetches from `dashboardApi` or uses defaults from riskCalculator

### Accessibility Checklist (Built Into Each Component)
- [ ] Semantic HTML: header, main, section, footer, nav
- [ ] ARIA labels on icons, accordions, sliders, buttons
- [ ] Focus rings: Use `.focus-ring` class from tailwind config
- [ ] Keyboard navigation: Tab order logical, accordions/tabs support arrow keys + Enter
- [ ] Color contrast: Use CSS variables (--text, --primary, etc.) which maintain WCAG AA
- [ ] prefers-reduced-motion: All hooks check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, disable animations if true
- [ ] Mobile: Test at 375px and 768px breakpoints, hamburger nav drawer responsive

### Animation Performance
- Use `transform` and `opacity` only (no width, height, margin changes during animation)
- `requestAnimationFrame` for smooth 60fps updates
- Loops pause when off-screen (useReveal checks visibility)
- Durations: 300–700ms typical, no loop > 1.2s except decorative background patterns

### Build & Test Commands
```bash
npm run build          # Full build, check bundle size
npm run dev            # Dev server, hot reload
npm run type-check     # TypeScript check
npm run lint           # ESLint check
npm run format         # Prettier
```

### Dark Mode Testing
- All sections must render in both light and dark modes
- Use CSS variables and Tailwind's `dark:` prefix
- Test with theme toggle in Header or Footer

---

## Summary of Files to Create/Modify

### Create (28 files):
- `src/utils/riskCalculator.ts`
- `src/hooks/useCountUp.ts`, `useReveal.ts`, `useScrollProgress.ts`, `useTilt.ts`, `useMagnetic.ts`
- `src/components/common/Reveal.tsx`, `Button.tsx` (or extend), `Badge.tsx` (or extend), `LandingCard.tsx`
- `src/pages/Landing/index.tsx`
- `src/pages/Landing/LandingLayout.tsx`
- `src/pages/Landing/components/Hero.tsx`, `ProblemSolution.tsx`, `Features.tsx`, `HowItWorks.tsx`, `RiskChecker.tsx`, `RoleTabs.tsx`, `BeforeAfter.tsx`, `FAQ.tsx`, `FinalCTA.tsx`, `Footer.tsx`

### Modify (3 files):
- `src/App.tsx` (routing, lazy loading)
- `src/components/common/Sidebar.tsx` (Dashboard link to `/dashboard`)

---

## Success Criteria
1. Landing page loads at `/` without authentication
2. Dashboard moved to `/dashboard`, accessible only when authenticated
3. All 10 landing sections render and scroll smoothly
4. Hero stats show real data from studentService
5. RiskChecker calculates risk correctly using riskCalculator utility
6. All animations respect `prefers-reduced-motion`
7. Keyboard navigation works: tabs, accordions, sliders, links
8. Light and dark themes both work without visual issues
9. Mobile responsive at 375px and 768px
10. Once-per-session intro animation plays before landing on first load
11. "Launch demo" CTA links to `/login`
12. No build errors, TypeScript strict mode, ESLint passing
13. Lazy-loaded landing keeps main bundle small
