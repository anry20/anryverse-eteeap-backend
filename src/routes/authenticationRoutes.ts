import { Router } from "express";
import { loginController } from "../controllers/authenticationController";
import {
  preventAuthenticatedAccess,
  checkAuthAndRole,
} from "../middlewares/auth";

const router = Router();

router.post("/login", preventAuthenticatedAccess, loginController);

// Frontend Authentication Checker
router.get("/", checkAuthAndRole("admin", "student", "faculty"), (req, res) => {
  res.sendStatus(204);
});
router.get("/admin", checkAuthAndRole("admin"), (req, res) => {
  res.sendStatus(204);
});
router.get("/student", checkAuthAndRole("student"), (req, res) => {
  res.sendStatus(204);
});
router.get("/faculty", checkAuthAndRole("faculty"), (req, res) => {
  res.sendStatus(204);
});

export default router;
