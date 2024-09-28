import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
} from "@/controllers/brands";
import express from "express";

const brandRouter = express.Router();

brandRouter.post("/brands", createBrand);
brandRouter.get("/brands", getBrands);
brandRouter.get("/brands/:id", getBrandById);
brandRouter.put("/brands/:id", updateBrandById);
brandRouter.delete("/brands/:id", deleteBrandById);

export default brandRouter;
