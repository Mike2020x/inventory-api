import { createUser, getUsers } from "@/controllers/users";
import { create } from "domain";
import express from "express";

const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.get("/users", getUsers);

export default userRouter;
