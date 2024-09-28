import {
  createUnit,
  deleteUnitById,
  getUnitById,
  getUnits,
  updateUnitById,
} from "@/controllers/units";
import express from "express";

const unitRouter = express.Router();

unitRouter.post("/units", createUnit);
unitRouter.get("/units", getUnits);
unitRouter.get("/units/:id", getUnitById);
unitRouter.put("/units/:id", updateUnitById);
unitRouter.delete("/units/:id", deleteUnitById);

export default unitRouter;
