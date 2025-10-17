import { Router } from "express";
import {
  myEnrollmentsController,
  studentInfoController,
  updateMyStudentInfoController,
} from "../controllers/studentApiController";

const router = Router();

// View My Student Information
router.get("/profile", studentInfoController);

// Update My Student Information
router.patch("/profile", updateMyStudentInfoController);

// View My Enrolled subjects
router.get("/enrollments", myEnrollmentsController);

export default router;
