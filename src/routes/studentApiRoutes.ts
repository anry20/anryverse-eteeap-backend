import { Router } from "express";

const router = Router();

// View My Student Information
router.get("/profile", (req, res) => {
  res.json({ message: "My student profile information" });
});

// Update My Student Information
router.patch("/profile", (req, res) => {
  res.json({ message: "My student profile updated" });
});

// View My Enrolled subjects
router.get("/enrollments", (req, res) => {
  res.json({ message: "List of enrolled subjects" });
});
// View My Grades
router.get("/grades", (req, res) => {
  res.json({ message: "List of my grades" });
});

export default router;
