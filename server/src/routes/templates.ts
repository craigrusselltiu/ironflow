import { Router } from 'express';
import { prisma } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { createTemplateSchema, updateTemplateSchema, applyTemplateSchema } from '../schemas/template.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/templates - List templates (system + user's own)
router.get('/', async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { isSystem: true },
          { userId: req.user!.userId },
        ],
      },
      orderBy: [{ isSystem: 'desc' }, { createdAt: 'desc' }],
    });

    res.json(templates);
  } catch (err) {
    next(err);
  }
});

// POST /api/templates - Create user template
router.post('/', validate(createTemplateSchema), async (req, res, next) => {
  try {
    const { name, description, exercises } = req.body;

    const template = await prisma.template.create({
      data: {
        userId: req.user!.userId,
        name,
        description,
        exercises,
      },
    });

    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
});

// PUT /api/templates/:id - Update user template
router.put('/:id', validate(updateTemplateSchema), async (req, res, next) => {
  try {
    const template = await prisma.template.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
        isSystem: false,
      },
    });

    if (!template) {
      throw new AppError(404, 'Template not found');
    }

    const updated = await prisma.template.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/templates/:id/apply - Apply template to routine
router.post('/:id/apply', validate(applyTemplateSchema), async (req, res, next) => {
  try {
    const { routineId } = req.body;

    // Find template (system or user's own)
    const template = await prisma.template.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { isSystem: true },
          { userId: req.user!.userId },
        ],
      },
    });

    if (!template) {
      throw new AppError(404, 'Template not found');
    }

    // Verify routine ownership
    const routine = await prisma.weeklyRoutine.findFirst({
      where: {
        id: routineId,
        userId: req.user!.userId,
      },
    });

    if (!routine) {
      throw new AppError(404, 'Routine not found');
    }

    // Clear existing exercises and apply template in a transaction
    const exercises = template.exercises as Array<{
      exerciseId: string;
      day: number;
      orderIndex: number;
      plannedSets?: number | null;
      plannedReps?: number | null;
    }>;

    await prisma.$transaction([
      prisma.scheduledExercise.deleteMany({
        where: { routineId },
      }),
      ...exercises.map(ex =>
        prisma.scheduledExercise.create({
          data: {
            routineId,
            exerciseId: ex.exerciseId,
            day: ex.day,
            orderIndex: ex.orderIndex,
            plannedSets: ex.plannedSets ?? null,
            plannedReps: ex.plannedReps ?? null,
          },
        })
      ),
    ]);

    // Return updated routine with exercises
    const updated = await prisma.weeklyRoutine.findUnique({
      where: { id: routineId },
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

// DELETE /api/templates/:id - Delete user template
router.delete('/:id', async (req, res, next) => {
  try {
    const template = await prisma.template.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
        isSystem: false,
      },
    });

    if (!template) {
      throw new AppError(404, 'Template not found');
    }

    await prisma.template.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
