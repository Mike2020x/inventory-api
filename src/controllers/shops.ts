import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createShop(req: Request, res: Response) {
  try {
    const { name, slug, location, adminId, attendantsIds } = req.body;
    const existingShop = await db.shop.findUnique({
      where: {
        slug,
      },
    });
    if (existingShop) {
      return res.status(409).json({
        error: `Shop ${name} already exists`,
        data: null,
      });
    }

    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendantsIds,
      },
    });
    return res.status(201).json({
      data: newShop,
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

export async function getShops(req: Request, res: Response) {
  try {
    const shops = await db.shop.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      data: shops,
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

export async function getShopById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingShop = await db.shop.findUnique({
      where: { id },
    });
    if (!existingShop) {
      return res.status(400).json({
        data: null,
        error: "Shop does not exist",
      });
    }
    return res.status(200).json({
      data: existingShop,
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

export async function getShopAttendants(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingshop = await db.shop.findUnique({
      where: {
        id,
      },
    });

    if (!existingshop) {
      return res.status(404).json({
        data: null,
        error: "Shop does not exist",
      });
    }
    const attendants = await db.user.findMany({
      where: {
        id: {
          in: existingshop.attendantsIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        phone: true,
      },
    });
    return res.status(200).json({
      data: attendants,
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
