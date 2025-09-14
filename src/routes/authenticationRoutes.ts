import { Router } from "express";
import {
  loginController,
  logoutController,
} from "../controllers/authenticationController";
import {
  preventAuthenticatedAccess,
  checkAuthAndRole,
} from "../middlewares/auth";

const router = Router();

router.post("/login", preventAuthenticatedAccess, loginController);
router.post("/logout", checkAuthAndRole, logoutController);

router.get("/", checkAuthAndRole, (req, res) => {
  res.json(req.session);
});

export default router;
