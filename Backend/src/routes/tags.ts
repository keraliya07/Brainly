import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        title: 'asc'
      }
    });

    res.json({
      count: tags.length,
      tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Tag title is required' });
    }

    const trimmedTitle = title.trim().toLowerCase();

    const existingTag = await prisma.tag.findFirst({
      where: {
        title: trimmedTitle
      }
    });

    if (existingTag) {
      return res.json({
        message: 'Tag already exists',
        tag: existingTag
      });
    }

    const tag = await prisma.tag.create({
      data: {
        title: trimmedTitle
      }
    });

    res.status(201).json({
      message: 'Tag created successfully',
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
