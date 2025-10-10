import { Router } from "express";
import {
  getMyStudentInfoController,
  updateMyStudentInfoController,
} from "../controllers/base/studentsController";

const router = Router();

router.get("/", getMyStudentInfoController);
router.patch("/", updateMyStudentInfoController);

export default router;
