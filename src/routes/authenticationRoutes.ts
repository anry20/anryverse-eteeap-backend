import { Router } from "express";
import {
  getSessionDetailsController,
  loginController,
  logoutController,
} from "../controllers/base/authenticationController";
import {
  preventAuthenticatedAccess,
  checkAuthAndRole,
} from "../middlewares/auth";

const router = Router();

router.post("/login", preventAuthenticatedAccess, loginController);
router.post("/logout", checkAuthAndRole, logoutController);

router.get("/", checkAuthAndRole, getSessionDetailsController);

export default router;
