import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomer(req: Request, res: Response) {
  const {
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    country,
    location,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    dob,
    email,
    nationalId,
  } = req.body;

  try {
    //check if the user already exists (email, username, phone)
    const existingCustomerByPhone = await db.customer.findUnique({
      where: {
        phone,
      },
    });
    if (existingCustomerByPhone) {
      return res.status(409).json({
        error: `Phone number ${phone} is already in use`,
        data: null,
      });
    }

    if (email) {
      const existingCustomerByEmail = await db.customer.findUnique({
        where: {
          email,
        },
      });
      if (existingCustomerByEmail) {
        return res.status(409).json({
          error: `Email ${email} is already in use`,
          data: null,
        });
      }
    }

    if (nationalId) {
      const existingCustomerByNIN = await db.customer.findUnique({
        where: {
          nationalId,
        },
      });
      if (existingCustomerByNIN) {
        return res.status(409).json({
          error: `National id ${nationalId} is already in use`,
          data: null,
        });
      }
    }
    const newCustomer = await db.customer.create({
      data: {
        customerType,
        firstName,
        lastName,
        phone,
        gender,
        country,
        location,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        dob,
        email,
        nationalId,
      },
    });
    return res.status(201).json(newCustomer);
  } catch (error) {
    console.log(error);
  }
}

export async function getCustomers(req: Request, res: Response) {
  try {
    let customers = await db.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(customers);
  } catch (error) {
    console.log(error);
  }
}

export async function getCustomerById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const customer = await db.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      return res.status(404).json({
        error: "csutomer not found",
        data: null,
      });
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.log(error);
  }
}
