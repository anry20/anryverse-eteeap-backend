import { Router } from "express";
import {
  getAdminsController,
  getAdminByIdController,
  createAdminController,
  updateAdminController,
  deleteAdminController,
} from "../../controllers/adminController";

const router = Router();

router.get("/admin", getAdminsController);
router.post("/admin", createAdminController);
router.get("/admin/:id", getAdminByIdController);
router.patch("/admin/:id", updateAdminController);
router.delete("/admin/:id", deleteAdminController);

export default router;
