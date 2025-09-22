import { Router } from "express";
import { getMyStudentInfoController } from "../controllers/studentsController";

const router = Router();

router.get("/", getMyStudentInfoController);

export default router;
