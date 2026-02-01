import { Router } from 'express';
import { prisma } from '../db.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  fetchExercises,
  fetchExerciseById,
  fetchExercisesByBodyPart,
  fetchExercisesByTarget,
  fetchExercisesByEquipment,
  fetchExercisesByName,
  fetchBodyPartList,
  fetchEquipmentList,
  fetchTargetList,
  isCacheExpired,
  type ExerciseDbExercise,
} from '../services/exerciseDb.js';
import { getExerciseMuscles } from '../utils/muscleMapping.js';

const router = Router();

// Helper to cache exercise (silent failure if DB unavailable)
async function cacheExercise(exercise: ExerciseDbExercise) {
  try {
    await prisma.cachedExercise.upsert({
      where: { id: exercise.id },
      update: {
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        fetchedAt: new Date(),
      },
      create: {
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        gifUrl: exercise.gifUrl,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
      },
    });
  } catch {
    // Silently ignore cache failures - DB may not be connected
  }
}

// Helper to get cached exercises (returns null if DB unavailable)
async function getCachedExercises(options: {
  skip?: number;
  take?: number;
  where?: Record<string, unknown>;
  orderBy?: Record<string, string>;
}) {
  try {
    return await prisma.cachedExercise.findMany(options);
  } catch {
    return null;
  }
}

// Helper to get single cached exercise
async function getCachedExercise(id: string) {
  try {
    return await prisma.cachedExercise.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

// Helper to enrich exercise with muscle mapping
function enrichExercise(exercise: ExerciseDbExercise | {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}) {
  const muscles = getExerciseMuscles(
    exercise.bodyPart,
    exercise.target,
    exercise.secondaryMuscles
  );
  return {
    ...exercise,
    primaryMuscle: muscles.primary,
    secondaryMusclesMapping: muscles.secondary,
  };
}

// GET /api/exercises - List exercises
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Try cache first
    const cached = await getCachedExercises({
      skip: offset,
      take: limit,
      orderBy: { name: 'asc' },
    });

    if (cached && cached.length > 0 && !isCacheExpired(cached[0].fetchedAt)) {
      return res.json(cached.map(enrichExercise));
    }

    // Fetch from API
    const exercises = await fetchExercises(limit, offset);

    // Cache results (non-blocking)
    Promise.all(exercises.map(cacheExercise)).catch(() => {});

    res.json(exercises.map(enrichExercise));
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/lists/bodyParts - Get body part list
router.get('/lists/bodyParts', async (_req, res, next) => {
  try {
    const bodyParts = await fetchBodyPartList();
    res.json(bodyParts);
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/lists/equipment - Get equipment list
router.get('/lists/equipment', async (_req, res, next) => {
  try {
    const equipment = await fetchEquipmentList();
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/lists/targets - Get target list
router.get('/lists/targets', async (_req, res, next) => {
  try {
    const targets = await fetchTargetList();
    res.json(targets);
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/search - Search by name
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      throw new AppError(400, 'Search query is required');
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Try cache first
    const cached = await getCachedExercises({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      skip: offset,
      take: limit,
    });

    if (cached && cached.length > 0) {
      return res.json(cached.map(enrichExercise));
    }

    // Fetch from API
    const exercises = await fetchExercisesByName(query, limit, offset);
    Promise.all(exercises.map(cacheExercise)).catch(() => {});

    res.json(exercises.map(enrichExercise));
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/bodyPart/:bodyPart - Filter by body part
router.get('/bodyPart/:bodyPart', async (req, res, next) => {
  try {
    const { bodyPart } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Try cache first
    const cached = await getCachedExercises({
      where: { bodyPart: { equals: bodyPart, mode: 'insensitive' } },
      skip: offset,
      take: limit,
    });

    if (cached && cached.length > 0 && !isCacheExpired(cached[0].fetchedAt)) {
      return res.json(cached.map(enrichExercise));
    }

    // Fetch from API
    const exercises = await fetchExercisesByBodyPart(bodyPart, limit, offset);
    Promise.all(exercises.map(cacheExercise)).catch(() => {});

    res.json(exercises.map(enrichExercise));
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/target/:target - Filter by target muscle
router.get('/target/:target', async (req, res, next) => {
  try {
    const { target } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Try cache first
    const cached = await getCachedExercises({
      where: { target: { equals: target, mode: 'insensitive' } },
      skip: offset,
      take: limit,
    });

    if (cached && cached.length > 0 && !isCacheExpired(cached[0].fetchedAt)) {
      return res.json(cached.map(enrichExercise));
    }

    // Fetch from API
    const exercises = await fetchExercisesByTarget(target, limit, offset);
    Promise.all(exercises.map(cacheExercise)).catch(() => {});

    res.json(exercises.map(enrichExercise));
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/equipment/:equipment - Filter by equipment
router.get('/equipment/:equipment', async (req, res, next) => {
  try {
    const { equipment } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    // Try cache first
    const cached = await getCachedExercises({
      where: { equipment: { equals: equipment, mode: 'insensitive' } },
      skip: offset,
      take: limit,
    });

    if (cached && cached.length > 0 && !isCacheExpired(cached[0].fetchedAt)) {
      return res.json(cached.map(enrichExercise));
    }

    // Fetch from API
    const exercises = await fetchExercisesByEquipment(equipment, limit, offset);
    Promise.all(exercises.map(cacheExercise)).catch(() => {});

    res.json(exercises.map(enrichExercise));
  } catch (err) {
    next(err);
  }
});

// GET /api/exercises/:id - Get single exercise
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try cache first
    const cached = await getCachedExercise(id);

    if (cached && !isCacheExpired(cached.fetchedAt)) {
      return res.json(enrichExercise(cached));
    }

    // Fetch from API
    const exercise = await fetchExerciseById(id);
    cacheExercise(exercise).catch(() => {});

    res.json(enrichExercise(exercise));
  } catch (err) {
    next(err);
  }
});

export default router;
