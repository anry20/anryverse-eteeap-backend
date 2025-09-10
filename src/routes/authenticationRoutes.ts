import { Router } from "express";
import { loginController } from "../controllers/authenticationController";

const router = Router();

router.post("/login", loginController);

export default router;
