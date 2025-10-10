import { Router } from "express";

const router = Router();

//Subjects Faculty Teaches
router.get("/classes", (req, res) => {
  res.json({ message: "List of classes I am teaching" });
});
//Show all students in a class for the active term
router.get("/classes/:subjectCode/students", (req, res) => {
  const { subjectCode } = req.params;
  res.json({ message: `List of students in class ${subjectCode}` });
});
//Show student information on a specific class
router.get("/classes/:subjectCode/students/:studentId", (req, res) => {
  const { subjectCode, studentId } = req.params;
  res.json({
    message: `Information for student ${studentId} in class ${subjectCode}`,
  });
});

//Enter or Update student grades for student
router.patch("/classes/grade/:enrollmentId", (req, res) => {
  const { enrollmentId } = req.params;
  res.json({ message: `Grade updated for enrollment ${enrollmentId}` });
});

// View My Faculty Information
router.get("/profile", (req, res) => {
  res.json({ message: "My faculty profile information" });
});
// Update My Faculty Information
router.patch("/profile", (req, res) => {
  res.json({ message: "My faculty profile updated" });
});

// View Own Subjects Taught
router.get("/subjects", (req, res) => {
  res.json({ message: "List of subjects I teach" });
});

export default router;
