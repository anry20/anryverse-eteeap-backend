import { Router } from "express";
import {
  assignFacultyToSubjectController,
  removeFacultyFromSubjectController,
  getFacultyAssignmentsByFacultyIdController,
  getFacultyForSubjectController,
} from "../../controllers/subjectFacultyController";

const router = Router();

router.post("/subject/:id/assign", assignFacultyToSubjectController);
router.delete("/subject/assign/:id", removeFacultyFromSubjectController);
router.get(
  "/faculty/:id/assignments",
  getFacultyAssignmentsByFacultyIdController
);
router.get("/subject/:id/faculties", getFacultyForSubjectController);

export default router;
