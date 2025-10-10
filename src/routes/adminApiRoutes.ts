import { Router } from "express";
const router = Router();

// *SUBJECT MANAGEMENT

//List of all subjects
router.get("/subjects", (req, res) => {
  res.json({ message: "List of all subjects" });
});
//Add a new subject
router.post("/subject", (req, res) => {
  res.json({ message: "Add a new subject" });
});
//Edit subject details
router.patch("/subject/:subjectCode", (req, res) => {
  res.json({
    message: `Edit subject details with ID ${req.params.subjectCode}`,
  });
});
//Delete a subject
router.delete("/subject/:subjectCode", (req, res) => {
  res.json({
    message: `Delete subject with ID ${req.params.subjectCode}`,
  });
});

// *STUDENT MANAGEMENT

//List of all students
router.get("/students", (req, res) => {
  res.json({ message: "List of all students" });
});
//View student details
router.get("/student/:studentId", (req, res) => {
  res.json({
    message: `Get details of student with ID ${req.params.studentId}`,
  });
});
//Edit student information
router.patch("/student/:studentId", (req, res) => {
  res.json({
    message: `Edit information of student with ID ${req.params.studentId}`,
  });
});
//Delete a student
router.delete("/student/:studentId", (req, res) => {
  res.json({
    message: `Delete student with ID ${req.params.studentId}`,
  });
});

// *FACULTY MANAGEMENT

//List of all faculty members
router.get("/faculties", (req, res) => {
  res.json({ message: "List of all faculty members" });
});
//Add a new faculty member
router.post("/faculty", (req, res) => {
  res.json({ message: "Add a new faculty member" });
});
//View details of a faculty member
router.get("/faculty/:facultyId", (req, res) => {
  res.json({
    message: `Get details of faculty member with ID ${req.params.facultyId}`,
  });
});
//Edit faculty member information
router.patch("/faculty/:facultyId", (req, res) => {
  res.json({
    message: `Edit information of faculty member with ID ${req.params.facultyId}`,
  });
});
//Delete a faculty member
router.delete("/faculty/:facultyId", (req, res) => {
  res.json({
    message: `Delete faculty member with ID ${req.params.facultyId}`,
  });
});

// *ASSIGN FACULTY/SUBJECT
router.post("/assign", (req, res) => {
  res.json({ message: "Assign faculty to subject" });
});
router.delete("/assign", (req, res) => {
  res.json({ message: "Remove faculty from subject" });
});

// *Graduate Tracking
router.get("/graduates", (req, res) => {
  res.json({ message: "List of all graduates" });
});
router.get("/graduate/:studentId", (req, res) => {
  res.json({
    message: `Get details of graduate with ID ${req.params.studentId}`,
  });
});

// *Term Management
router.get("/terms", (req, res) => {
  res.json({ message: "List of all terms" });
});
router.post("/term", (req, res) => {
  res.json({ message: "Add a new term" });
});
router.patch("/term/:termId", (req, res) => {
  res.json({
    message: `Edit term with ID ${req.params.termId}`,
  });
});
router.delete("/term/:termId", (req, res) => {
  res.json({
    message: `Delete term with ID ${req.params.termId}`,
  });
});
//Activate a term
router.post("/term/:termId/activate", (req, res) => {
  res.json({
    message: `Activate term with ID ${req.params.termId}`,
  });
});

export default router;
