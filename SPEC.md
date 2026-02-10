# IronFlow Product Specification

Version: 2.8.1

## Overview

IronFlow is a full-stack gym routine builder that helps users plan weekly workout routines, track exercises, log workouts, and analyze progress.

## Offline-First Architecture

The frontend operates in **dual mode** to support deployment on GitHub Pages without a backend:

### Online Mode (with backend)
- User authentication (login/register)
- Data synced to PostgreSQL via API
- ExerciseDB integration with caching
- Multi-device support

### Offline Mode (without backend)
- No login required
- Data stored in localStorage (like v1)
- Uses bundled exercise data
- Works on GitHub Pages

### Mode Detection
The storage mode is determined by login state:
- **Logged in** → API storage (synced to backend)
- **Not logged in (guest)** → localStorage (local only)

This means:
- Users can use the full routine builder without creating an account
- Guest data persists in browser localStorage
- Logging in does NOT migrate guest data (keeps them separate)
- Backend availability is checked only when user attempts to login

### Storage Abstraction
The app uses a unified storage interface:
```typescript
interface RoutineStorage {
  getRoutines(): Promise<Routine[]>
  getRoutine(id: string): Promise<Routine>
  createRoutine(data: CreateRoutineInput): Promise<Routine>
  updateRoutine(id: string, data: UpdateRoutineInput): Promise<Routine>
  deleteRoutine(id: string): Promise<void>
  // ... exercise methods
}
```
Two implementations:
- `ApiStorage` - calls backend REST API
- `LocalStorage` - uses browser localStorage

## Design System

Based on the reference design, IronFlow uses:
- **Primary Background**: #050505 (near black)
- **Secondary Background**: #0c0c0c (dark gray)
- **Card Background**: #111111
- **Elevated Background**: #161616
- **Accent Color**: #BFFF00 (neon lime/green)
- **Accent Hover**: #d4ff4d
- **Text Primary**: #ffffff
- **Text Secondary**: #737373
- **Text Tertiary**: #525252
- **Border**: #222222
- **Border Subtle**: #1a1a1a

Typography:
- **Headings**: Outfit (weight 700-800, tight letter-spacing)
- **Body**: Outfit (weight 400-500)
- **Monospace**: JetBrains Mono (for stats, numbers)
- Accent color highlights on key words
- High contrast for readability

Navigation:
- Sticky header with backdrop blur
- Tab-based navigation (Home, Routine Builder, Exercises)
- Mobile hamburger menu with slide-down animation

## Features

### v2.0.0 - Backend Foundation
- User registration and login
- JWT-based authentication
- PostgreSQL database with Prisma ORM

### v2.1.0 - ExerciseDB Integration
- Exercise search and browse
- Target muscle and equipment filters (can be combined)
- Cached exercise data (7-day TTL)

### v2.2.0 - Routine API
- Create/read/update/delete weekly routines
- Schedule exercises to specific days
- Drag-drop reordering support

### v2.3.0 - Frontend Auth
- Tailwind CSS migration
- Login/register pages
- Protected routes
- Auth context

### v2.4.0 - Exercise Browser
- Exercise library with search
- Filter by body part/equipment
- Exercise detail modal with GIF
- Add to day functionality

### v2.5.0 - Weekly Planner
- 7-day planner grid
- Drag-drop exercises between days
- Planned sets/reps fields
- SVG muscle map visualization

### v2.6.0 - Frontend Redesign
- New Home page with hero section
- Tab-based navigation system
- Mobile responsive hamburger menu
- Premium fitness aesthetic with animations
- New typography (Outfit, JetBrains Mono)
- Refined color system

### v2.7.0 - Exercise Data Migration
- Migrated from RapidAPI ExerciseDB to open-source exercisedb.dev API
- Replaced API calls with bundled JSON file (1,500+ exercises)
- No external API dependency required
- Combined filtering (target muscle AND equipment)
- Exercise filters use target muscle instead of body part
- Exercise card color-coding based on target muscle

### v2.8.0 - Templates
- Pre-built routine templates (PPL, Upper/Lower, Full Body)
- Save routine as template via dropdown in Routine Builder header
- Apply template to routine with modal confirmation when replacing existing exercises
- Template modal for browsing and previewing templates
- Modal confirmation dialogs for delete template and clear routine (replaces browser confirm)
- Backend API for template CRUD and application

### v2.8.1 - Import/Export
- Export routine as JSON file via Routine dropdown
- Import routine from JSON file via Routine dropdown
- Versioned export format with metadata for future compatibility
- Backend bulk import endpoint for atomic routine creation
- Works in both online (API) and offline (localStorage) modes

### v2.9.0 - Polish
- Loading states refinement
- Error boundaries
- Empty states
- Performance optimization

---

## Data Models

### User
```
id            String    @id @default(uuid())
email         String    @unique
passwordHash  String
name          String?
createdAt     DateTime  @default(now())
updatedAt     DateTime  @updatedAt
```

### WeeklyRoutine
```
id            String    @id @default(uuid())
userId        String
name          String
isActive      Boolean   @default(false)
createdAt     DateTime  @default(now())
updatedAt     DateTime  @updatedAt
```

### ScheduledExercise
```
id            String    @id @default(uuid())
routineId     String
exerciseId    String    // ExerciseDB ID
day           Int       // 0=Monday, 6=Sunday
orderIndex    Int
plannedSets   Int?
plannedReps   Int?
createdAt     DateTime  @default(now())
updatedAt     DateTime  @updatedAt
```

### CachedExercise (v2.1.0)
```
id            String    @id // ExerciseDB ID
name          String
bodyPart      String
targetMuscles String
equipment     String
gifUrl        String
secondaryMuscles String[]
instructions  String[]
fetchedAt     DateTime  @default(now())
```

### WorkoutLog (v2.6.0)
```
id            String    @id @default(uuid())
userId        String
routineId     String?
startedAt     DateTime
completedAt   DateTime?
notes         String?
```

### LoggedSet (v2.6.0)
```
id            String    @id @default(uuid())
workoutLogId  String
exerciseId    String
setNumber     Int
weight        Float?
reps          Int?
rpe           Int?      // 1-10 scale
createdAt     DateTime  @default(now())
```

### Template (v2.8.0)
```
id            String    @id @default(uuid())
userId        String?   // null = system template
name          String
description   String?
isSystem      Boolean   @default(false)
exercises     Json      // Serialized exercise data
createdAt     DateTime  @default(now())
```

---

## API Endpoints

### Authentication (v2.0.0)
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login, returns JWT
POST   /api/auth/refresh      Refresh access token
GET    /api/auth/me           Get current user
```

### Exercises (v2.1.0)
```
GET    /api/exercises                    List exercises (paginated)
GET    /api/exercises/:id                Get single exercise
GET    /api/exercises/bodyPart/:part     Filter by body part
GET    /api/exercises/target/:muscle     Filter by target muscle
GET    /api/exercises/equipment/:equip   Filter by equipment
GET    /api/exercises/search?q=          Search by name
```

### Routines (v2.2.0)
```
GET    /api/routines                     List user's routines
POST   /api/routines                     Create routine
GET    /api/routines/:id                 Get routine with exercises
PUT    /api/routines/:id                 Update routine
DELETE /api/routines/:id                 Delete routine
PUT    /api/routines/:id/activate        Set as active routine
```

### Routine Import (v2.8.1)
```
POST   /api/routines/import              Import routine from JSON
```

### Scheduled Exercises (v2.2.0)
```
POST   /api/routines/:id/exercises       Add exercise to routine
PUT    /api/exercises/:id                Update scheduled exercise
DELETE /api/exercises/:id                Remove from routine
PUT    /api/routines/:id/reorder         Reorder exercises
```

### Workouts (v2.6.0)
```
POST   /api/workouts                     Start workout
GET    /api/workouts                     List workout history
GET    /api/workouts/:id                 Get workout with sets
PUT    /api/workouts/:id                 Update workout (complete)
POST   /api/workouts/:id/sets            Log a set
```

### Templates (v2.8.0)
```
GET    /api/templates                    List templates
POST   /api/templates                    Create template
POST   /api/templates/:id/apply          Apply to routine
DELETE /api/templates/:id                Delete template
```

---

## UI Screens

### Home Page (v2.6.0)
- Hero section with animated gradient background
- Feature badge with pulsing dot
- Large headline with accent color highlights
- CTA buttons: "Start Building", "Browse Exercises"
- Stats row: 1500+ Exercises, 16 Muscle Groups, 7 Day Planning
- Floating visual cards showing app features
- Features grid section
- Bottom CTA section with decorative rings
- Footer with navigation links

### Main Navigation (v2.6.0)
- Sticky header with backdrop blur
- Brand logo (barbell icon) and text
- Tab pills: Home, Routine Builder, Exercises
- Active tab highlighted with accent color
- Auth buttons: Sign In, Get Started
- Mobile: hamburger menu with slide-down panel

### Login Page (v2.3.0)
- Dark background with accent highlights
- Email and password fields
- Login button with neon accent
- Link to register page
- Error message display

### Register Page (v2.3.0)
- Name, email, password fields
- Register button
- Link to login page

### Exercise Browser (v2.4.0)
- Search bar at top (combinable with filter chips)
- Filter chips: target muscles, equipment (all filters apply simultaneously as AND)
- Grid of exercise cards
- Each card shows: name, target muscle, equipment, GIF thumbnail
- Click opens detail modal
- Footer matching Home page

### Exercise Detail Modal (v2.4.0)
- Side-by-side layout: GIF panel (left), info panel (right)
- Full GIF animation without clipping
- Exercise name with meta tags (body part, target muscle, equipment)
- Secondary muscles list
- Numbered instructions list
- "Add to Day" dropdown with day selector
- Close button
- Mobile: stacks vertically

### Weekly Planner (v2.5.0)
- 7 columns for days (responsive: cards on mobile)
- Each day shows scheduled exercises
- Drag handle on exercises
- Click exercise to edit sets/reps
- Muscle map sidebar showing coverage (16 muscle groups including side delts and forearms)
- Exercise library sidebar with collapsible muscle filter panel
- "Count Secondary" toggle to include/exclude secondary muscles from set volume
- Muscle Breakdown shows sets-based volume (X / Y sets per muscle)

### Routine Save Dropdown (v2.8.0)
- Located in Routine Builder header toolbar
- Dropdown trigger button labeled "Routine" with list icon and chevron
- Menu items:
  - Save as Template: Opens inline form with name/description inputs
  - Load Template: Opens Template Modal
  - Export Routine (v2.8.1): Downloads active routine as JSON file
  - Import Routine (v2.8.1): Opens file picker to load routine from JSON file
- Visual divider separating template and import/export actions
- Success/error feedback for save, import operations

### Template Modal (v2.8.0)
- Modal with three views: list, detail, confirm
- List view: Pre-Built Templates section + My Templates section
- Template cards show name, description, exercise count, active days indicator (lime dots)
- Apply button in amber color to distinguish from day indicators
- Detail view: Full exercise breakdown by day with sets/reps
- Apply button with modal confirmation dialog if routine is non-empty
- Delete button on user templates with modal confirmation (danger variant)

### Clear Routine (v2.8.0)
- Clear All button in Routine Builder header shows modal confirmation dialog
- Displays exercise count and warns action cannot be undone
- Uses danger variant styling (red confirm button)

### Workout Logger (v2.6.0)
- Current exercise with GIF
- Set input rows (weight, reps, RPE)
- Previous performance reference
- Next/Skip buttons
- Complete workout button

---

## ExerciseDB Field Mapping

ExerciseDB returns:
```json
{
  "id": "0001",
  "name": "3/4 sit-up",
  "bodyPart": "waist",
  "targetMuscles": "abs",
  "equipment": "body weight",
  "gifUrl": "https://...",
  "secondaryMuscles": ["hip flexors"],
  "instructions": ["Lie down...", "..."]
}
```

### Body Part to Muscle Group Mapping
| ExerciseDB bodyPart | IronFlow muscles |
|---------------------|------------------|
| back | upperBack, lats |
| chest | chest |
| shoulders | frontDelts, sideDelts, rearDelts |
| upper arms | biceps, triceps |
| lower arms | forearms |
| upper legs | quads, hamstrings, glutes |
| lower legs | calves |
| waist | abs, lowerBack |
| neck | traps |
| cardio | (none) |

### Target Muscle Mapping
| ExerciseDB target | IronFlow muscle |
|-------------------|-----------------|
| abs | abs |
| biceps | biceps |
| calves | calves |
| cardiovascular system | (none) |
| front delts | frontDelts |
| side delts | sideDelts |
| rear delts | rearDelts |
| forearms | forearms |
| glutes | glutes |
| hamstrings | hamstrings |
| lats | lats |
| pectorals | chest |
| quads | quads |
| traps | traps |
| triceps | triceps |
| upper back | upperBack |
| spine | lowerBack |
