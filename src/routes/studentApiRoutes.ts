import { Router } from "express";
import {
  getMyStudentInfoController,
  updateMyStudentInfoController,
} from "../controllers/studentsController";

const router = Router();

router.get("/", getMyStudentInfoController);
router.patch("/", updateMyStudentInfoController);

export default router;
