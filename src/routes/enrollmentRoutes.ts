import { Router } from "express";
import { enrollStudentController } from "../controllers/enrollmentController";

const router = Router();

router.post("/", enrollStudentController);

export default router;
