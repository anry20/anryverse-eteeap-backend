import { Router } from "express";
import { loginController } from "../controllers/authenticationController";
import { preventAuthenticatedAccess } from "../middlewares/auth";

const router = Router();

router.post("/login", preventAuthenticatedAccess, loginController);

export default router;
