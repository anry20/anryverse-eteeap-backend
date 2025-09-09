import { Router } from "express";
import {
  getStudentByIdController,
  deleteStudentController,
  createStudentController,
  getAllStudentsController,
  updateStudentController,
} from "../controllers/studentsController";

const router = Router();

router.get("/student", getAllStudentsController);
router.post("/student", createStudentController);
router.get("/student/:id", getStudentByIdController);
router.patch("/student/:id", updateStudentController);
router.delete("/student/:id", deleteStudentController);

export default router;
