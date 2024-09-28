import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createSupplier(req: Request, res: Response) {
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    location,
    country,
    website,
    taxPin,
    regNumber,
    bankAccountNumber,
    bankName,
    paymentTerms,
    logo,
    rating,
    notes,
  } = req.body;

  try {
    //check if the user already exists (email, username, phone)
    const existingSupplierByPhone = await db.supplier.findUnique({
      where: {
        phone,
      },
    });
    if (existingSupplierByPhone) {
      return res.status(409).json({
        error: `Phone number ${phone} is already in use`,
        data: null,
      });
    }

    if (email) {
      const existingSupplierByEmail = await db.supplier.findUnique({
        where: {
          email,
        },
      });
      if (existingSupplierByEmail) {
        return res.status(409).json({
          error: `Email ${email} is already in use`,
          data: null,
        });
      }
    }
    if (regNumber) {
      const existingSupplierByRegNumber = await db.supplier.findUnique({
        where: {
          regNumber,
        },
      });
      if (existingSupplierByRegNumber) {
        return res.status(409).json({
          error: `regNumber ${regNumber} is already in use`,
          data: null,
        });
      }
    }
    const newSupplier = await db.supplier.create({
      data: {
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        location,
        country,
        website,
        taxPin,
        regNumber,
        bankAccountNumber,
        bankName,
        paymentTerms,
        logo,
        rating,
        notes,
      },
    });
    return res.status(201).json(newSupplier);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "something went wrong",
      data: null,
    });
  }
}

export async function getSuppliers(req: Request, res: Response) {
  try {
    let suppliers = await db.supplier.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(suppliers);
  } catch (error) {
    console.log(error);
  }
}

export async function getSupplierById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const supplier = await db.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      return res.status(404).json({
        error: "supplier not found",
        data: null,
      });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    console.log(error);
  }
}
