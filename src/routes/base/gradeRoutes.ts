import { Router } from "express";
import {
  getGradesController,
  getGradeByEnrollmentIdController,
  deleteGradeController,
  createGradeController,
  updateGradeController,
} from "../../controllers/base/gradeController";

const router = Router();

router.get("/grade", getGradesController);
router.post("/grade", createGradeController);
router.get("/grade/:enrollmentId", getGradeByEnrollmentIdController);
router.patch("/grade/:enrollmentId", updateGradeController);
router.delete("/grade/:enrollmentId", deleteGradeController);

export default router;
