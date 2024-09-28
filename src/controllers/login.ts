import { db } from "@/db/db";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/generateJWT";
import { Request, Response } from "express";

export async function authorizeUser(req: Request, res: Response) {
  const { email, password, username } = req.body;
  try {
    let existingUser = null;
    if (email) {
      existingUser = await db.user.findUnique({
        where: {
          email,
        },
      });
    }
    if (username) {
      existingUser = await db.user.findUnique({
        where: {
          username,
        },
      });
    }
    if (!existingUser) {
      return res.status(403).json({
        error: "wrong credentials",
        data: null,
      });
    }

    //check if password is correct
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(403).json({
        error: "Incorrect password",
        data: null,
      });
    }
    const { password: userPass, ...userWhithoutPassword } = existingUser;
    const accessToken = generateAccessToken(userWhithoutPassword);
    const result = {
      ...userWhithoutPassword,
      accessToken,
    };
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "something went wrong",
      data: null,
    });
  }
}
