# IronFlow Development Guide

## Project Structure

```
/server         - Node.js backend (Express + Prisma + TypeScript)
/src            - React frontend (Vite + Tailwind)
/prisma         - Database schema and migrations
```

## Setup

1. Install dependencies: `npm install` (root and /server)
2. Copy `.env.example` to `.env`
3. Set `DATABASE_URL` and `EXERCISEDB_API_KEY`
4. Run migrations: `cd server && npx prisma migrate dev`
5. Start dev servers:
   - Frontend: `npm run dev` (root)
   - Backend: `cd server && npm run dev`

## ExerciseDB API

API Base: https://exercisedb.p.rapidapi.com
Rate Limit: 100 requests/day (free tier)
Docs: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb

### Endpoints Used
- GET /exercises - All exercises (paginated)
- GET /exercises/exercise/{id} - Single exercise
- GET /exercises/bodyPart/{bodyPart} - Filter by body part
- GET /exercises/target/{target} - Filter by target muscle
- GET /exercises/equipment/{equipment} - Filter by equipment

### Caching Strategy
Cache responses in CachedExercise table for 7 days.
Check cache before API call. Update fetchedAt on cache hit refresh.

## Muscle Mapping

ExerciseDB uses different muscle names than our visualization.
Map in /server/src/utils/muscleMapping.ts:

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
| cardio | (none - skip muscle map) |

## Design System

Based on reference design:
- **Primary Background**: #0a0a0a
- **Card Background**: #1a1a1a
- **Accent**: #BFFF00 (neon lime)
- **Text Primary**: #ffffff
- **Text Secondary**: #888888

## Code Patterns

### API Client (frontend)
Use /src/api/client.ts with fetch wrapper.
Auto-attaches JWT from localStorage.
Handles 401 by redirecting to login.

### Database Queries (backend)
Use Prisma client. No raw SQL unless necessary.
Always include userId in WHERE for user-owned data.

### Component Structure
- Pages in /src/pages/
- Reusable components in /src/components/
- API hooks in /src/hooks/

## Common Tasks

### Add new API endpoint
1. Add route in /server/src/routes/
2. Add Zod schema for validation
3. Add to /src/api/ client
4. Add React Query hook in /src/hooks/

### Add new database table
1. Update /prisma/schema.prisma
2. Run: `cd server && npx prisma migrate dev --name description`
3. Update SPEC.md data models section

### Seed exercises
Run: `cd server && npm run seed:exercises`
Fetches all exercises from ExerciseDB and caches locally.

## Development Workflow

**IMPORTANT: Create a PR for every phase of development.**
Each implementation phase should result in a separate PR for user review before merging.
Do not combine multiple phases into a single PR.

**After creating a PR:**
1. Prompt the user whether to continue to the next phase
2. If user agrees, clear context with /clear and create a new feature branch for the next phase
3. Start fresh with the new phase implementation

## Documentation

When making functional changes:
- Update SPEC.md if adding/changing features or keybindings
- Update README.md if changing user-facing behavior (keybindings, usage, installation) and when updating version
- Add entry to CHANGELOG.md following Keep a Changelog format

## Testing

- Backend: `cd server && npm test`
- Frontend: `npm test`
- E2E: `npm run test:e2e`

## Deployment

- Frontend: Static build to /dist, deploy to hosting
- Backend: Node.js server with PostgreSQL connection
- Environment variables required in production
