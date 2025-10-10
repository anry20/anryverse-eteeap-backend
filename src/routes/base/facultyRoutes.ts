import { Router } from "express";
import {
  getFacultiesController,
  getFacultyByIdController,
  createFacultyController,
  deleteFacultyController,
  updateFacultyController,
} from "../../controllers/base/facultyController";

const router = Router();

router.get("/faculty", getFacultiesController);
router.post("/faculty", createFacultyController);
router.get("/faculty/:id", getFacultyByIdController);
router.patch("/faculty/:id", updateFacultyController);
router.delete("/faculty/:id", deleteFacultyController);

export default router;
