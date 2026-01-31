# Changelog

All notable changes to IronFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
