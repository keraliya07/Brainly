import express, { type Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, description, link, type, tagIds } = req.body;
    const userId = req.userId!;

    if (!title || !description || !type) {
      return res.status(400).json({ error: 'Title, description, and type are required' });
    }

    const validTypes = ['youtube', 'twitter', 'video', 'article', 'podcast', 'book', 'course', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const createData: any = {
      title,
      description,
      link: link || null,
      type,
      userId
    };

    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      createData.tags = {
        connect: tagIds.map((id: number) => ({ id }))
      };
    }

    const content = await prisma.content.create({
      data: createData,
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Content created successfully',
      content
    });
  } catch (error: any) {
    console.error('Create content error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'One or more tags not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/home', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const contents = await prisma.content.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        link: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      count: contents.length,
      contents
    });
  } catch (error) {
    console.error('Get home contents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { type, tagId, search } = req.query;

    const where: any = {
      userId
    };

    if (type) {
      where.type = type;
    }

    if (tagId) {
      where.tags = {
        some: {
          id: parseInt(tagId as string)
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const contents = await prisma.content.findMany({
      where,
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      count: contents.length,
      contents
    });
  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const createTypeRoute = (contentType: string) => {
  return async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { tagId, search } = req.query;

      const where: any = {
        userId,
        type: contentType
      };

      if (tagId) {
        where.tags = {
          some: {
            id: parseInt(tagId as string)
          }
        };
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const contents = await prisma.content.findMany({
        where,
        include: {
          tags: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        type: contentType,
        count: contents.length,
        contents
      });
    } catch (error) {
      console.error(`Get ${contentType} contents error:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

router.get('/twitter', createTypeRoute('twitter'));
router.get('/youtube', createTypeRoute('youtube'));
router.get('/video', createTypeRoute('video'));
router.get('/article', createTypeRoute('article'));
router.get('/podcast', createTypeRoute('podcast'));
router.get('/book', createTypeRoute('book'));
router.get('/course', createTypeRoute('course'));
router.get('/other', createTypeRoute('other'));

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const contentId = parseInt(req.params.id as string);

    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }

    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        userId
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ content });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const contentId = parseInt(req.params.id as string);
    const { title, description, link, type, tagIds } = req.body;

    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }

    const existingContent = await prisma.content.findFirst({
      where: {
        id: contentId,
        userId
      }
    });

    if (!existingContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (type) {
      const validTypes = ['youtube', 'twitter', 'video', 'article', 'podcast', 'book', 'course', 'other'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid content type' });
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (link !== undefined) updateData.link = link || null;
    if (type !== undefined) updateData.type = type;

    if (tagIds !== undefined) {
      await prisma.content.update({
        where: { id: contentId },
        data: {
          tags: {
            set: []
          }
        }
      });

      if (Array.isArray(tagIds) && tagIds.length > 0) {
        updateData.tags = {
          connect: tagIds.map((id: number) => ({ id }))
        };
      }
    }

    const content = await prisma.content.update({
      where: { id: contentId },
      data: updateData,
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Content updated successfully',
      content
    });
  } catch (error: any) {
    console.error('Update content error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'One or more tags not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const contentId = parseInt(req.params.id as string);

    if (isNaN(contentId)) {
      return res.status(400).json({ error: 'Invalid content ID' });
    }

    const existingContent = await prisma.content.findFirst({
      where: {
        id: contentId,
        userId
      }
    });

    if (!existingContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await prisma.content.delete({
      where: { id: contentId }
    });

    res.json({
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
