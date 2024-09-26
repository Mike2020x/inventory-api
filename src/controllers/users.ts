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
    role,
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
        role,
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
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    const filteredUsers = users.map((user) => {
      const { password, ...others } = user;
      return others;
    });
    return res.status(200).json({
      data: filteredUsers,
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
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }
    const { password, ...others } = user;
    res.status(200).json({
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
export async function updateUserById(req: Request, res: Response) {
  const { id } = req.params;
  const {
    email,
    username,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    role,
    image,
  } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        email,
        username,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        role,
        image,
      },
    });
    const { password, ...others } = updatedUser;
    return res.status(200).json({
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
export async function updateUserPasswordById(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    const { password: savedPassword, ...others } = updatedUser;
    return res.status(200).json({
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
export async function deleteUserById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }
    await db.user.delete({
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

export async function getAttendants(req: Request, res: Response) {
  try {
    const attendants = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        role: "ATTENDANT",
      },
    });
    const filteredAttendants = attendants.map((attendant) => {
      const { password, ...others } = attendant;
      return others;
    });
    res.status(200).json({
      data: filteredAttendants,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}
