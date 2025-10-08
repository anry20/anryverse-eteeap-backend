import { Router } from "express";
import {
  getMyStudentInfoController,
  updateStudentController,
  updateStudentInfoController,
} from "../controllers/studentsController";

const router = Router();

router.get("/", getMyStudentInfoController);
router.patch("/", updateStudentInfoController);

export default router;
