import { Router } from "express";
import {
  checkSessionController,
  getSessionDetailsController,
  loginController,
  logoutController,
} from "../controllers/authenticationController";
import {
  preventAuthenticatedAccess,
  checkAuthAndRole,
  optionalAuth,
} from "../middlewares/auth";

const router = Router();

router.post("/login", preventAuthenticatedAccess, loginController);
router.post("/logout", checkAuthAndRole, logoutController);
router.get("/", checkAuthAndRole, getSessionDetailsController);
router.get("/check", optionalAuth, checkSessionController);

export default router;
