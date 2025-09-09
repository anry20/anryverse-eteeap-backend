import { Router } from "express";
import {
  getStudentByIdController,
  deleteStudentController,
  enrollStudentController,
  getAllStudentsController,
} from "../controllers/studentsController";

const router = Router();

router.get("/students", getAllStudentsController);
router.post("/students", enrollStudentController);
router.get("/students/:id", getStudentByIdController);
router.delete("/students/:id", deleteStudentController);

export default router;
