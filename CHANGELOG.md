# Changelog

All notable changes to IronFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
