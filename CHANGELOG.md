# Changelog

All notable changes to IronFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
