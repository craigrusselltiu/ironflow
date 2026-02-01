# IronFlow Product Specification

Version: 2.7.1

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
- Body part and equipment filters
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

### v2.7.0 - Workout Logging
- Start workout from planned routine
- Log sets with weight/reps
- View previous performance
- Workout history

### v2.8.0 - Templates
- Pre-built routine templates (PPL, Upper/Lower, Full Body)
- Save routine as template
- Apply template to routine

### v2.9.0 - Analytics
- Volume tracking over time
- Muscle group frequency
- Personal records (estimated 1RM)
- Date range filtering

### v2.10.0 - Polish
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
target        String
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

### Template (v2.7.0)
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

### Templates (v2.7.0)
```
GET    /api/templates                    List templates
POST   /api/templates                    Create template
POST   /api/templates/:id/apply          Apply to routine
DELETE /api/templates/:id                Delete template
```

### Analytics (v2.8.0)
```
GET    /api/analytics/volume             Volume over time
GET    /api/analytics/frequency          Muscle group frequency
GET    /api/analytics/prs                Personal records
```

---

## UI Screens

### Home Page (v2.6.0)
- Hero section with animated gradient background
- Feature badge with pulsing dot
- Large headline with accent color highlights
- CTA buttons: "Start Building", "Browse Exercises"
- Stats row: 1300+ Exercises, 13 Muscle Groups, 7 Day Planning
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
- Search bar at top
- Filter chips: body parts, equipment
- Grid of exercise cards
- Each card shows: name, target muscle, equipment, GIF thumbnail
- Click opens detail modal

### Exercise Detail Modal (v2.4.0)
- Large GIF animation
- Exercise name and details
- Instructions list
- "Add to Day" dropdown
- Close button

### Weekly Planner (v2.5.0)
- 7 columns for days (responsive: cards on mobile)
- Each day shows scheduled exercises
- Drag handle on exercises
- Click exercise to edit sets/reps
- Muscle map sidebar showing coverage

### Workout Logger (v2.6.0)
- Current exercise with GIF
- Set input rows (weight, reps, RPE)
- Previous performance reference
- Next/Skip buttons
- Complete workout button

### Analytics Dashboard (v2.8.0)
- Date range selector
- Volume chart (line graph)
- Muscle frequency chart (bar)
- PR list with estimated 1RM

---

## ExerciseDB Field Mapping

ExerciseDB returns:
```json
{
  "id": "0001",
  "name": "3/4 sit-up",
  "bodyPart": "waist",
  "target": "abs",
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
| shoulders | frontDelts, rearDelts |
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
| delts | frontDelts |
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
