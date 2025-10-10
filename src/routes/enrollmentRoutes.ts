import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.status(201).json({ message: "Enrollment created successfully" });
});

export default router;
