import { Router } from "express";
import {
  getCoursesController,
  getCourseByIdController,
  deleteCourseController,
  createCourseController,
  updateCourseController,
} from "../../controllers/base/courseController";

const router = Router();

router.get("/course", getCoursesController);
router.post("/course", createCourseController);
router.get("/course/:id", getCourseByIdController);
router.patch("/course/:id", updateCourseController);
router.delete("/course/:id", deleteCourseController);

export default router;
