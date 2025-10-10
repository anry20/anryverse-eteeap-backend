import { Router } from "express";
import { getMyFacultyInfoController } from "../controllers/base/facultyController";

const router = Router();

router.get("/", getMyFacultyInfoController);

export default router;
