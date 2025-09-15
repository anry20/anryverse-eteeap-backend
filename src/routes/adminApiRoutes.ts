import { Router } from "express";
import {
  getCoursesController,
  getCourseByIdController,
  deleteCourseController,
  createCourseController,
  updateCourseController,
} from "../controllers/courseController";

const router = Router();

//course routes
router.get("/course", getCoursesController);
router.get("/course/:id", getCourseByIdController);
router.delete("/course/:id", deleteCourseController);
router.post("/course", createCourseController);
router.put("/course/:id", updateCourseController);

export default router;
