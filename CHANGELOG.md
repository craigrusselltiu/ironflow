# Changelog

All notable changes to IronFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v2.10.0 - 2026-02-10

### Added
- Mobile usability overhaul with comprehensive responsive improvements
- Safe area inset support for notched phones (viewport-fit=cover)
- TouchSensor for drag-and-drop on mobile devices (long-press to drag)
- Bottom-sheet style modals on small screens (< 600px)
- Horizontal scroll for filter chips on tablet/mobile
- iOS zoom prevention on input focus (16px minimum font-size)
- Mobile-optimized touch targets (44px minimum tap areas)

### Changed
- Routine builder scrolls vertically on mobile instead of fixed viewport height
- Builder sidebars get proportional height (40vh/45vh) on mobile instead of fixed 280px
- Remove buttons always visible on touch devices (no hover required)
- Exercise browser filters scroll horizontally on tablet instead of vertically
- Modals use slide-up animation and bottom-sheet layout on phones
- Nav height reduced to 60px on tablet and below for more content space
- Exercise detail modal uses full-width bottom-sheet on phones
- Feature cards and browser cards skip hover transforms on mobile (prevents jank)
- Hero section uses dynamic viewport height (dvh) on mobile

## v2.9.0 - 2026-02-10

### Added
- React Error Boundary component with user-friendly fallback UI and recovery button
- Error boundaries wrapping the full app and individual routes (Routine Builder, Exercise Browser)
- Toast notification system (success, error, info) with auto-dismiss and manual close
- Toast notifications for all RoutineContext operations (load, add, remove, update, clear, reorder)
- Toast notifications for template save/apply errors and import errors
- Skeleton loading screen for Routine Builder (7-day grid skeleton)
- Improved empty state for Exercise Browser with icon, description, and clear-filters button
- Improved empty state for Muscle Breakdown with icon
- Improved error state for Exercise Browser with icon and structured layout

### Changed
- ExerciseCard wrapped with React.memo to prevent unnecessary re-renders
- DayBucket wrapped with React.memo to prevent re-renders when other days change
- SvgMuscleMap, BodyView, and MuscleGroup wrapped with React.memo for render efficiency
- MuscleBreakdown wrapped with React.memo
- TemplateModal system/user template lists memoized with useMemo
- RoutineContext error handling upgraded from console.error to user-visible toast notifications

## v2.8.1 - 2026-02-09

### Added
- Export routine as a JSON file from the Routine dropdown menu
- Import routine from a JSON file via the Routine dropdown menu
- Versioned export format (`ironflow.version`) for future compatibility
- Backend `POST /api/routines/import` endpoint for atomic routine creation with exercises
- `importRoutine` method in storage interface for both API and localStorage modes
- Visual divider in Routine dropdown separating template and import/export actions
- Validation for imported routine files with user-friendly error messages
- Success feedback after importing a routine

## v2.8.0 - 2026-02-08

### Added
- Routine save dropdown in the Routine Builder header with "Save as Template" and "Load Template" options
- Template modal for browsing, previewing, and applying templates
- Three pre-built system templates: Push/Pull/Legs, Upper/Lower, and Full Body
- Save current routine as a reusable template with name and description
- Apply templates to replace the active routine's exercises
- Modal confirmation dialogs for applying templates, deleting templates, and clearing routines
- Template detail view showing exercises organized by day with sets/reps
- Backend API endpoints for template CRUD and application (GET/POST/DELETE /api/templates, POST /api/templates/:id/apply)
- Template storage in localStorage for guest users
- Reusable ConfirmModal component with warning and danger variants

### Changed
- Routine dropdown icon changed from save/floppy disk to list icon (menu contains both save and load actions)
- Template Apply button uses amber color to distinguish from the lime active-day indicators
- Delete template and clear routine confirmations use styled modals instead of browser confirm dialogs

## v2.7.9 - 2026-02-07

### Fixed
- Drag-and-drop moves between days and reorders within a day now persist to storage
- "Count Secondary Muscles" toggle now defaults to off

## v2.7.8 - 2026-02-07

### Added
- Visual divider between "Count Secondary Muscles" toggle and "Clear All" button in the Routine Builder header
- Filter persistence on the Exercises page (search, target muscle, equipment) across navigation using sessionStorage
- Filter persistence on the Routine Builder exercise sidebar (search, target filter, filter panel open state)
- Tab-to-next exercise: pressing Tab on the reps input saves and moves to editing the next exercise in the same day
- Auto-save sets/reps on blur (clicking away from the editor saves values automatically)

## v2.7.7 - 2026-02-07

### Changed
- Normalized exercise secondaryMuscles: replaced "rear deltoids", "deltoids", and "shoulders" with specific delt groups ("front delts", "side delts", "rear delts")
- Trimmed incorrect delt secondary muscles from 487 exercises based on actual movement patterns (e.g. pressing exercises keep only front delts, rowing exercises keep only rear delts)
- Removed dead deltoid/shoulder mapping entries from frontend and backend muscle mappings

## v2.7.6 - 2026-02-07

### Changed
- Delt exercises now filter as separate "Front Delts", "Side Delts", and "Rear Delts" target muscles instead of generic "Delts"
- Exercise cards show distinct accent colors for each delt variant

## v2.7.5 - 2026-02-07

### Added
- Side Delts as 16th muscle group with SVG heatmap paths (front and back views)
- Sets-based muscle volume calculation using recommended weekly sets per muscle
- "Count Secondary" toggle in Routine Builder header to include/exclude secondary muscles from set totals
- Muscle Breakdown now displays "X / Y sets" format showing actual vs recommended sets

### Changed
- Fatigue calculation uses actual planned sets per exercise (defaults to 3 if unset) instead of flat constants
- Lateral Raises now target Side Delts instead of Front Delts
- Generic "delts" target mapping changed from Front Delts to Side Delts in backend
- Shoulders body part mapping now includes Side Delts
- Exercise Browser filters (search, target muscle, equipment) now combine as AND instead of being mutually exclusive

### Fixed
- Day bucket columns changing width when exercises are added
- Muscle Breakdown set counts wrapping when both numbers are more than 1 digit

## v2.7.4 - 2026-02-07

### Added
- Forearms muscle group to muscle breakdown and SVG heatmap (front and back views)
- Collapsible filter panel in exercise library sidebar to save vertical space

### Changed
- Exercise Detail Modal GIF panel now uses explicit square dimensions instead of aspect-ratio
- Exercise Detail Modal GIF panel widened for larger GIF display
- Day select dropdown uses custom styled arrow with proper spacing
- "Add to Day" button has fixed width to prevent layout shift when switching days

### Fixed
- Exercise Detail Modal GIF panel not rendering as a square due to flex stretch
- GIF cropping in detail modal (object-fit: contain instead of cover)
- Custom dropdown arrow too close to right edge of select box

## v2.7.3 - 2026-02-06

### Added
- Expanded exercise database from 1,100 to 1,500 exercises
- Footer on the Exercises page matching the Home page design
- New target muscle filters: pectorals, quads, traps, spine, serratus anterior, levator scapulae

### Changed
- Renamed `target` field to `targetMuscles` across frontend, backend, and exercise data
- Redesigned Exercise Detail Modal with side-by-side layout (GIF left, info right) to show full GIF
- Exercise instructions reformatted to "Step N - ..." format
- Exercise sidebar cards now dynamically size to content (no fixed min-height)
- Removed main page scrollbar from Routine Builder and Exercises pages
- Improved right sidebar padding for Targeted Muscle Groups heading

### Fixed
- Exercise GIF cut off in detail modal (was showing only top half)
- Scroll wiggle on Routine Builder page
- Exercise card height inconsistency for multi-line names

## v2.7.2 - 2026-02-05

### Added
- Combined filtering on Exercises page (target muscle AND equipment)

### Changed
- Exercise filters now use target muscle instead of body part
- Exercise card color-coding now based on target muscle
- Increased exercise card height to prevent text cutoff
- Fixed first-row hover overlap on Exercises page

## v2.7.1 - 2026-02-01

### Changed
- Replaced ExerciseDB API calls with bundled JSON file containing 1,102 exercises
- Instant filtering and search with no network latency
- No backend proxy required for exercise data

### Removed
- ExerciseDB API dependency (exercisedb.dev)
- Backend exercise proxy endpoints

## v2.7.0 - 2026-02-01

### Changed
- Migrated from RapidAPI ExerciseDB to open-source exercisedb.dev API
- No API key required - uses free, open-source exercise database
- Added support for muscle-based filtering via `/muscles/{muscle}/exercises` endpoint
- Expanded muscle name mapping to support new API's muscle names (46 muscle groups)
- Updated API response parsing to handle new paginated response format

### Removed
- RapidAPI ExerciseDB dependency and API key requirement
- EXERCISEDB_API_KEY environment variable no longer needed

## v2.6.2 - 2026-02-01

### Changed
- Frontend now calls ExerciseDB API directly (no backend required for exercises)
- Using placeholder images for exercises (ExerciseDB v2 image endpoint has CORS restrictions)
- Hardcoded ExerciseDB API key for consistent operation

## v2.6.1 - 2026-02-01

### Added
- Hero section background image with gradient overlay

### Fixed
- Exercise routines now persist correctly in localStorage for guest users
- Page refresh no longer shows 404 on non-root routes (GitHub Pages SPA fix)
- 401 redirect now uses correct base path (/ironflow/login)
- Exercise cards in browser now maintain consistent size regardless of filter selection
- Sidebar exercise cards now have consistent height with 2-line text clamp
- Exercise card fade-in animation now plays when switching category filters

## v2.6.0 - 2026-02-01

### Added
- New Home page with hero section, feature highlights, and call-to-action
- Tab-based navigation system (Home, Routine Builder, Exercises)
- Mobile hamburger menu for responsive navigation
- Dedicated Routine Builder page separated from main layout
- Floating hero visual cards with animations

### Changed
- Complete frontend redesign with premium fitness aesthetic
- New typography using Outfit and JetBrains Mono fonts
- Refined color system with deeper blacks and better contrast
- Upgraded button styles with glow effects on hover
- Enhanced card designs with hover lift and border highlights
- Improved modal animations with backdrop blur
- Better responsive breakpoints for all screen sizes
- Navigation now uses sticky header with blur effect
- Exercise Browser header simplified (removed back link)

### Removed
- Old header component with inline navigation
- Previous App.jsx layout (replaced by MainLayout + RoutineBuilderPage)

## v2.5.0 - 2026-01-31

### Added
- Storage abstraction layer with dual-mode support (ApiStorage for logged-in users, LocalStorage for guests)
- Planned sets and reps fields on scheduled exercises with inline editing
- SVG muscle map visualization replacing ASCII art for better visual feedback
- Loading states for routine management operations
- Support for multiple routines with active routine selection

### Changed
- RoutineContext now uses storage abstraction based on authentication state
- Exercise cards now show sets/reps with click-to-edit functionality
- Muscle map rendering upgraded from ASCII to interactive SVG
- Auto-create default routine for first-time users

## v2.4.0 - 2026-01-31

### Added
- Exercise Browser page with search functionality
- Filter exercises by body part and equipment
- Exercise detail modal with animated GIF preview
- Add to day functionality from exercise browser
- RoutineContext for shared routine state management
- Exercise hooks for API data fetching (useExercises, useExerciseLists)
- TypeScript types for Exercise data

### Changed
- Header now includes "Browse Exercises" navigation link
- Routine state moved to context for cross-page access

## v2.3.0 - 2026-01-31

### Added
- Frontend authentication with login and register pages
- AuthContext for managing authentication state
- API client with automatic JWT attachment and 401 handling
- React Router for page navigation
- ProtectedRoute component for guarding authenticated routes

### Changed
- Migrated to Tailwind CSS v4 with CSS-based configuration
- Updated Header component with login/logout buttons

## v2.2.0 - 2026-01-31

### Added
- Routine CRUD API endpoints (GET, POST, PUT, DELETE /api/routines)
- ScheduledExercise management within routines
- Week-based routine organization

## v2.1.0 - 2026-01-31

### Added
- ExerciseDB API integration
- Exercise caching with 7-day expiry
- Muscle mapping from ExerciseDB to IronFlow format
- Exercise search and filter endpoints
- Database seeding script for exercises

## v2.0.0 - 2026-01-31

### Added
- Node.js backend with Express and TypeScript
- PostgreSQL database with Prisma ORM
- User authentication (register, login, JWT refresh)
- Database schema for User, WeeklyRoutine, ScheduledExercise
- Zod validation for API requests
- Error handling middleware

### Changed
- Architecture from client-only to full-stack

## v1.0.0 - 2024-01-01

### Added
- Initial prototype release
- Drag-and-drop weekly planner
- 44 exercises across 5 categories
- ASCII muscle map visualization
- localStorage persistence
