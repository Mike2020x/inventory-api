import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "@/controllers/categories";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.post("/categories", createCategory);
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:id", getCategoryById);
categoryRouter.put("/categories/:id", updateCategoryById);
categoryRouter.delete("/categories/:id", deleteCategoryById);

export default categoryRouter;
