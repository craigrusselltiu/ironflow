# IronFlow - Gym Routine Builder

A React-based gym routine builder with drag-and-drop exercises into weekly buckets and ASCII body visualization showing muscle fatigue.

## Features

- **Drag-and-drop exercises** into weekly buckets (Mon-Sun)
- **Exercise library** with 40+ exercises and muscle group mappings
- **ASCII body visualization** showing muscle fatigue (green → red gradient)
- **localStorage persistence** for saving routines

## Tech Stack

- React 18 with Vite
- @dnd-kit for drag-and-drop
- CSS for styling
- localStorage for data persistence

## Implementation Plan

### Project Structure
```
ironflow/
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── ExerciseLibrary.jsx      # Draggable exercise cards
│   │   ├── WeeklyPlanner.jsx        # 7 day buckets (drop zones)
│   │   ├── DayBucket.jsx            # Single day drop zone
│   │   ├── ExerciseCard.jsx         # Draggable exercise item
│   │   ├── MuscleMap.jsx            # ASCII body visualization
│   │   └── Header.jsx
│   ├── data/
│   │   └── exercises.js             # Exercise database with muscle mappings
│   ├── hooks/
│   │   └── useLocalStorage.js       # Persist state to localStorage
│   ├── utils/
│   │   ├── muscleCalculations.js    # Calculate muscle fatigue levels
│   │   └── asciiBody.js             # ASCII art generation with colors
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### Core Features

#### 1. Exercise Library
- Pre-built exercise database (~40 exercises)
- Each exercise has name, primary/secondary muscle groups, and category
- Exercises are draggable cards

#### 2. Weekly Planner (7 Day Buckets)
- Monday through Sunday drop zones
- Drag exercises from library into days
- Exercises can be reordered within days or moved between days
- Remove exercises by delete button

#### 3. Muscle Fatigue System
Each muscle group has a fatigue score (0-100):
- **Primary muscle hit**: +40 fatigue per exercise
- **Secondary muscle hit**: +20 fatigue per exercise
- Fatigue accumulates across the week
- Color mapping: 0% = gray, low = green, 100% = red

#### 4. ASCII Body Visualization (Front + Back Views)
Two side-by-side ASCII figures showing muscle fatigue with colored regions.

Muscle groups tracked (14 total):
- **Upper Front**: Chest, Front Delts, Biceps
- **Upper Back**: Traps, Upper Back, Lats, Rear Delts, Triceps
- **Core**: Abs, Lower Back
- **Legs**: Quads, Hamstrings, Glutes, Calves

### Development

```bash
npm install
npm run dev
```

### Deployment

```bash
npm run build
npm run deploy  # Deploy to GitHub Pages
```
