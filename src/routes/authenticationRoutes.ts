import { Router } from "express";
import { loginController } from "../controllers/authenticationController";
import {
  preventAuthenticatedAccess,
  checkAuthAndRole,
} from "../middlewares/auth";

const router = Router();

router.post("/login", preventAuthenticatedAccess, loginController);

router.get("/", checkAuthAndRole(), (req, res) => {
  res.json(req.session);
});

export default router;
