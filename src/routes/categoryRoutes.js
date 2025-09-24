


import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.route("/")
  .get(getCategories)
  .post(authenticate, createCategory);

router.route("/:id")
  .put(authenticate, updateCategory)
  .delete(authenticate, deleteCategory);

export default router;
