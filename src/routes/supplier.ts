import {
  createSupplier,
  getSupplierById,
  getSuppliers,
} from "@/controllers/suppliers";
import express from "express";

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.post("/suppliers", createSupplier);
supplierRouter.get("/suppliers/:id", getSupplierById);
export default supplierRouter;
