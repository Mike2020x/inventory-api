import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
  //receive the data
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
  } = req.body;
  try {
    //check if the user already exists (email, username, phone)
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUserByEmail) {
      res.status(409).json({
        error: "Email already exists",
        data: null,
      });
      return;
    }
    const existingUserByPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (existingUserByPhone) {
      res.status(409).json({
        error: `Phone number ${phone}  is already taken`,
        data: null,
      });
      return;
    }
    const existingUserByUsername = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (existingUserByUsername) {
      res.status(409).json({
        error: "User is already taken",
        data: null,
      });
      return;
    }
    //hash the password
    const hashedPassword: string = await bcrypt.hash(password, 10);
    //Create the user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image: image
          ? image
          : `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`,
      },
    });
    //modify the returned user
    const { password: savedPassword, ...others } = newUser;
    res.status(201).json({
      data: others,
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

export async function getUsers(req: Request, res: Response) {
  try {
    let users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      data: users,
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
