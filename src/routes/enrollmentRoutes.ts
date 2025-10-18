import { Router } from "express";
import {
  enrollStudentController,
  getCoursesController,
} from "../controllers/enrollmentController";

const router = Router();

router.post("/", enrollStudentController);
router.get("/courses", getCoursesController);

export default router;
