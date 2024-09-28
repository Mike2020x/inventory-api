import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createUnit(req: Request, res: Response) {
  try {
    const { name, abbreviation, slug } = req.body;
    const existingUnit = await db.unit.findUnique({
      where: {
        slug,
      },
    });
    if (existingUnit) {
      return res.status(409).json({
        error: `Unit ${name} already exists`,
        data: null,
      });
    }

    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug,
      },
    });
    return res.status(201).json({
      data: newUnit,
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
export async function getUnits(req: Request, res: Response) {
  try {
    const units = await db.unit.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      data: units,
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
export async function getUnitById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingUnit = await db.unit.findUnique({
      where: { id },
    });
    if (!existingUnit) {
      return res.status(404).json({
        data: null,
        error: "Unitdoes not exist",
      });
    }
    return res.status(200).json({
      data: existingUnit,
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
export async function updateUnitById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, abbreviation, slug } = req.body;
    const existingUnit = await db.unit.findUnique({
      where: {
        id,
      },
    });
    if (!existingUnit) {
      return res.status(404).json({
        error: "Unit not found",
        data: null,
      });
    }
    if (slug !== existingUnit.slug) {
      const existingUnitBySlug = await db.unit.findUnique({
        where: {
          slug,
        },
      });
      if (existingUnitBySlug) {
        return res.status(409).json({
          error: `Unit ${name} already exists`,
          data: null,
        });
      }
    }

    const updatedUnit = await db.unit.update({
      where: {
        id,
      },
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    return res.status(200).json({
      data: updatedUnit,
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
export async function deleteUnitById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const unit = await db.unit.findUnique({
      where: {
        id,
      },
    });
    if (!unit) {
      return res.status(404).json({
        data: null,
        error: "Unit not found",
      });
    }
    await db.unit.delete({
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
