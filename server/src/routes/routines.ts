import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  createRoutineSchema,
  updateRoutineSchema,
  addExerciseSchema,
  updateExerciseSchema,
  reorderSchema,
} from '../schemas/routine.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/routines - List user's routines
router.get('/', async (req, res, next) => {
  try {
    const routines = await prisma.weeklyRoutine.findMany({
      where: { userId: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { exercises: true } },
      },
    });

    res.json(routines);
  } catch (err) {
    next(err);
  }
});

// POST /api/routines - Create routine
router.post('/', validate(createRoutineSchema), async (req, res, next) => {
  try {
    const { name } = req.body;

    const routine = await prisma.weeklyRoutine.create({
      data: {
        userId: req.user!.userId,
        name,
      },
    });

    res.status(201).json(routine);
  } catch (err) {
    next(err);
  }
});

// GET /api/routines/:id - Get routine with exercises
router.get('/:id', async (req, res, next) => {
  try {
    const routine = await prisma.weeklyRoutine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      include: {
        exercises: {
          orderBy: [{ day: 'asc' }, { orderIndex: 'asc' }],
        },
      },
    });

    if (!routine) {
      throw new AppError(404, 'Routine not found');
    }

    res.json(routine);
  } catch (err) {
    next(err);
  }
});

// PUT /api/routines/:id - Update routine
router.put('/:id', validate(updateRoutineSchema), async (req, res, next) => {
  try {
    const { name, isActive } = req.body;

    // Verify ownership
    const existing = await prisma.weeklyRoutine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw new AppError(404, 'Routine not found');
    }

    // If setting as active, deactivate others
    if (isActive) {
      await prisma.weeklyRoutine.updateMany({
        where: {
          userId: req.user!.userId,
          isActive: true,
        },
        data: { isActive: false },
      });
    }

    const routine = await prisma.weeklyRoutine.update({
      where: { id: req.params.id },
      data: { name, isActive },
    });

    res.json(routine);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/routines/:id - Delete routine
router.delete('/:id', async (req, res, next) => {
  try {
    // Verify ownership
    const existing = await prisma.weeklyRoutine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw new AppError(404, 'Routine not found');
    }

    await prisma.weeklyRoutine.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// PUT /api/routines/:id/activate - Set as active routine
router.put('/:id/activate', async (req, res, next) => {
  try {
    // Verify ownership
    const existing = await prisma.weeklyRoutine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      throw new AppError(404, 'Routine not found');
    }

    // Deactivate all other routines
    await prisma.weeklyRoutine.updateMany({
      where: {
        userId: req.user!.userId,
        isActive: true,
      },
      data: { isActive: false },
    });

    // Activate this routine
    const routine = await prisma.weeklyRoutine.update({
      where: { id: req.params.id },
      data: { isActive: true },
    });

    res.json(routine);
  } catch (err) {
    next(err);
  }
});

// POST /api/routines/:id/exercises - Add exercise to routine
router.post(
  '/:id/exercises',
  validate(addExerciseSchema),
  async (req, res, next) => {
    try {
      const { exerciseId, day, plannedSets, plannedReps } = req.body;

      // Verify ownership
      const routine = await prisma.weeklyRoutine.findFirst({
        where: {
          id: req.params.id,
          userId: req.user!.userId,
        },
      });

      if (!routine) {
        throw new AppError(404, 'Routine not found');
      }

      // Get max orderIndex for this day
      const maxOrder = await prisma.scheduledExercise.findFirst({
        where: {
          routineId: req.params.id,
          day,
        },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });

      const orderIndex = (maxOrder?.orderIndex ?? -1) + 1;

      const exercise = await prisma.scheduledExercise.create({
        data: {
          routineId: req.params.id,
          exerciseId,
          day,
          orderIndex,
          plannedSets,
          plannedReps,
        },
      });

      res.status(201).json(exercise);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/routines/:routineId/exercises/:exerciseId - Update scheduled exercise
router.put(
  '/:routineId/exercises/:exerciseId',
  validate(updateExerciseSchema),
  async (req, res, next) => {
    try {
      const { day, orderIndex, plannedSets, plannedReps } = req.body;

      // Verify ownership through routine
      const existing = await prisma.scheduledExercise.findFirst({
        where: {
          id: req.params.exerciseId,
          routine: {
            id: req.params.routineId,
            userId: req.user!.userId,
          },
        },
      });

      if (!existing) {
        throw new AppError(404, 'Exercise not found');
      }

      const exercise = await prisma.scheduledExercise.update({
        where: { id: req.params.exerciseId },
        data: {
          day: day ?? existing.day,
          orderIndex: orderIndex ?? existing.orderIndex,
          plannedSets: plannedSets === null ? null : (plannedSets ?? existing.plannedSets),
          plannedReps: plannedReps === null ? null : (plannedReps ?? existing.plannedReps),
        },
      });

      res.json(exercise);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/routines/:routineId/exercises/:exerciseId - Remove exercise
router.delete('/:routineId/exercises/:exerciseId', async (req, res, next) => {
  try {
    // Verify ownership through routine
    const existing = await prisma.scheduledExercise.findFirst({
      where: {
        id: req.params.exerciseId,
        routine: {
          id: req.params.routineId,
          userId: req.user!.userId,
        },
      },
    });

    if (!existing) {
      throw new AppError(404, 'Exercise not found');
    }

    await prisma.scheduledExercise.delete({
      where: { id: req.params.exerciseId },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// PUT /api/routines/:id/reorder - Reorder exercises (for drag-drop)
router.put('/:id/reorder', validate(reorderSchema), async (req, res, next) => {
  try {
    const { exercises } = req.body;

    // Verify ownership
    const routine = await prisma.weeklyRoutine.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!routine) {
      throw new AppError(404, 'Routine not found');
    }

    // Update all exercises in a transaction
    await prisma.$transaction(
      exercises.map((e: { id: string; day: number; orderIndex: number }) =>
        prisma.scheduledExercise.update({
          where: { id: e.id },
          data: { day: e.day, orderIndex: e.orderIndex },
        })
      )
    );

    // Return updated routine
    const updated = await prisma.weeklyRoutine.findUnique({
      where: { id: req.params.id },
      include: {
        exercises: {
          orderBy: [{ day: 'asc' }, { orderIndex: 'asc' }],
        },
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
