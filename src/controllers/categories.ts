import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, slug } = req.body;
    const existingCategory = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (existingCategory) {
      return res.status(409).json({
        error: `Category ${name} already exists`,
        data: null,
      });
    }
    const newCategory = await db.category.create({
      data: {
        name,
        slug,
      },
    });
    return res.status(201).json({
      data: newCategory,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error,
    });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await db.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      data: categories,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "something went wrong",
    });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingCategory = await db.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      return res.status(404).json({
        data: null,
        error: "category does not exist",
      });
    }
    return res.status(200).json({
      data: existingCategory,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}

export async function updateCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    const existingCategory = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!existingCategory) {
      return res.status(404).json({
        error: "category not found",
        data: null,
      });
    }
    if (slug !== existingCategory.slug) {
      const existingCategoryBySlug = await db.category.findUnique({
        where: {
          slug,
        },
      });
      if (existingCategoryBySlug) {
        return res.status(409).json({
          error: `Category ${name} already exists`,
          data: null,
        });
      }
    }
    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
      },
    });

    return res.status(200).json({
      data: updatedCategory,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}

export async function deleteCategoryById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      return res.status(404).json({
        data: null,
        error: "category not found",
      });
    }
    await db.category.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}
