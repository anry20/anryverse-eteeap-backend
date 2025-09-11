import { Router } from "express";
import {
  createTermController,
  deleteTermController,
  getTermsController,
  getTermByIdController,
  updateTermController,
} from "../controllers/termController";

const router = Router();

router.get("/term", getTermsController);
router.get("/term/:id", getTermByIdController);
router.post("/term", createTermController);
router.patch("/term/:id", updateTermController);
router.delete("/term/:id", deleteTermController);

export default router;
