import { Router } from "express";
import {
  getSubjectsController,
  getSubjectByIdController,
  deleteSubjectController,
  createSubjectController,
  updateSubjectController,
} from "../../controllers/subjectController";

const router = Router();

router.get("/subject", getSubjectsController);
router.post("/subject", createSubjectController);
router.get("/subject/:id", getSubjectByIdController);
router.patch("/subject/:id", updateSubjectController);
router.delete("/subject/:id", deleteSubjectController);

export default router;
