import express, { Request, Response } from "express";
import Content from "../models/Content";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Add Content Route (Protected)
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type, link, title, details, tags } = req.body;
    const userId = req.userId;

    // Validate input
    if (!type || !link || !title) {
      return res.status(400).json({
        success: false,
        message: "Please provide type, link, and title",
      });
    }

    // Validate type
    const validTypes = ["document", "tweet", "youtube", "link"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Type must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Validate tags (if provided)
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array",
      });
    }

    // Create new content
    const content = new Content({
      userId,
      type,
      link,
      title,
      details: details || undefined,
      tags: tags || [],
    });

    await content.save();

    res.status(201).json({
      success: true,
      message: "Content added successfully",
      data: {
        content: {
          id: content._id,
          type: content.type,
          link: content.link,
          title: content.title,
          details: content.details,
          tags: content.tags,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
        },
      },
    });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding content",
      error: error.message,
    });
  }
});

// Get User's Content Route (Protected)
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { type, tag, limit, skip } = req.query;

    // Build query
    const query: any = { userId };

    // Filter by type if provided
    if (type) {
      const validTypes = ["document", "tweet", "youtube", "link"];
      if (validTypes.includes(type as string)) {
        query.type = type;
      }
    }

    // Filter by tag if provided
    if (tag) {
      // Use $in operator to check if the tags array contains the specified tag
      query.tags = { $in: [tag as string] };
    }

    // Pagination with validation
    const limitNum = limit ? parseInt(limit as string, 10) : 20;
    const skipNum = skip ? parseInt(skip as string, 10) : 0;
    
    // Validate parsed values are valid numbers
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid limit parameter. Must be a positive number.",
      });
    }
    
    if (isNaN(skipNum) || skipNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid skip parameter. Must be a non-negative number.",
      });
    }

    // Fetch content
    const contents = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skipNum)
      .select("-__v");

    // Get total count for pagination
    const total = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully",
      data: {
        contents,
        pagination: {
          total,
          limit: limitNum,
          skip: skipNum,
          hasMore: skipNum + limitNum < total,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving content",
      error: error.message,
    });
  }
});

// Get Single Content by ID (Protected)
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const content = await Content.findOne({ _id: id, userId }).select("-__v");

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Content retrieved successfully",
      data: {
        content,
      },
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error retrieving content",
      error: error.message,
    });
  }
});

// Update Content Route (Protected)
router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { type, link, title, details, tags } = req.body;

    // Find content and verify ownership
    const content = await Content.findOne({ _id: id, userId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Update fields if provided
    if (type) {
      const validTypes = ["document", "tweet", "youtube", "link"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Type must be one of: ${validTypes.join(", ")}`,
        });
      }
      content.type = type;
    }

    if (link) content.link = link;
    if (title) content.title = title;
    if (details !== undefined) content.details = details;
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({
          success: false,
          message: "Tags must be an array",
        });
      }
      content.tags = tags;
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: "Content updated successfully",
      data: {
        content: {
          id: content._id,
          type: content.type,
          link: content.link,
          title: content.title,
          details: content.details,
          tags: content.tags,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
        },
      },
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating content",
      error: error.message,
    });
  }
});

// Delete Content Route (Protected)
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const content = await Content.findOneAndDelete({ _id: id, userId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting content",
      error: error.message,
    });
  }
});

export default router;

