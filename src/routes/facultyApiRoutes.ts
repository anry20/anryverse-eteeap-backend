import { Router } from "express";
import { getMyFacultyInfoController } from "../controllers/facultyController";

const router = Router();

router.get("/", getMyFacultyInfoController);

export default router;
