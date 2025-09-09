import { Router } from "express";
import {
  getAllCoursesController,
  getCourseByIdController,
  deleteCourseController,
  createCourseController,
  updateCourseController,
} from "../controllers/courseController";

const router = Router();

router.get("/course", getAllCoursesController);
router.post("/course", createCourseController);
router.get("/course/:id", getCourseByIdController);
router.patch("/course/:id", updateCourseController);
router.delete("/course/:id", deleteCourseController);

export default router;
