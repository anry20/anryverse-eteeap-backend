import { Router } from "express";
import {
  getStudentByIdController,
  deleteStudentController,
  createStudentController,
  getStudentsController,
  updateStudentController,
} from "../../controllers/base/studentsController";

const router = Router();

router.get("/student", getStudentsController);
router.post("/student", createStudentController);
router.get("/student/:id", getStudentByIdController);
router.patch("/student/:id", updateStudentController);
router.delete("/student/:id", deleteStudentController);

export default router;
