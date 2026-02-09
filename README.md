# IronFlow

![Version](https://img.shields.io/badge/version-2.8.1-green)
![React](https://img.shields.io/badge/react-18-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

**IronFlow** is a gym routine builder with drag-and-drop planning, muscle coverage visualization, and workout tracking.

<img width="2516" height="1268" alt="image" src="https://github.com/user-attachments/assets/cbdfea1e-e650-414c-84e7-db1c74b1de5f" />


## Overview

IronFlow is a web application for building weekly workout routines. It features an interactive drag-and-drop interface for scheduling exercises across the week, and an SVG muscle heatmap that shows which muscles you're targeting to help identify imbalances.

IronFlow works without an account - your routines save to your browser automatically. Optionally create an account to sync routines across devices.

**[Try it live](https://craigrusselltiu.github.io/ironflow/)**

<!-- TODO: Add screenshot -->

## Built With

- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [dnd-kit](https://dndkit.com/) - Drag and drop
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - API framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

**Exercise Data:**
- Bundled JSON with 1,500+ exercises (no external API required)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [PostgreSQL](https://www.postgresql.org/) (optional, for backend)

### Installation

Clone the repository:

```bash
git clone https://github.com/craigrusselltiu/ironflow.git
cd ironflow
```

### Frontend Only (Guest Mode)

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Full Stack (with Backend)

```bash
# Terminal 1: Frontend
npm install
npm run dev

# Terminal 2: Backend
cd server
npm install
cp .env.example .env  # Edit with your DATABASE_URL
npx prisma migrate dev
npm run dev
```

## Usage

### Navigation

IronFlow has three main sections accessible via the tab navigation:

1. **Home** - Landing page with overview and quick access to features
2. **Routine Builder** - The main planner with drag-and-drop scheduling
3. **Exercises** - Browse and search the exercise library

### Building a Routine

1. **Browse exercises** - Search or filter by muscle group in the Exercise Browser
2. **Drag to schedule** - Drop exercises into any day (Monday-Sunday)
3. **Set reps & sets** - Click on an exercise to configure planned sets and reps
4. **Reorder** - Drag exercises within a day to reorder
5. **Remove** - Click the × button on any exercise to remove it

### Templates

Use the **Routine** dropdown in the builder header to:

- **Load Template** - Apply a pre-built routine (PPL, Upper/Lower, Full Body) or one of your saved templates
- **Save as Template** - Save your current routine as a reusable template

### Import / Export

Share routines or back them up using the **Routine** dropdown:

- **Export Routine** - Downloads the active routine as a `.json` file
- **Import Routine** - Loads a routine from a `.json` file (creates a new routine)

Exported files are portable and can be shared between users or across devices.

### Reading the Muscle Map

The heatmap shows training intensity per muscle:

| Color | Meaning |
|-------|---------|
| Gray | Not targeted |
| Green | Lightly trained |
| Yellow/Orange | Moderately trained |
| Red | Heavily trained |

Use this to spot overworked muscles (too much red) or neglected areas (gray).

### Muscle Groups Tracked

| Region | Muscles |
|--------|---------|
| Upper Front | Chest, Front Delts, Biceps |
| Upper Back | Traps, Upper Back, Lats, Rear Delts, Triceps |
| Core | Abs, Lower Back |
| Lower Body | Quads, Hamstrings, Glutes, Calves |
