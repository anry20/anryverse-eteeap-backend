import { Router } from "express";
import {
  addSubjectController,
  deleteStudentController,
  deleteSubjectController,
  getAllFacultiesController,
  getAllStudentsController,
  getAllSubjectsController,
  getFacultyDetailsController,
  getStudentDetailsController,
  updateStudentController,
  updateSubjectController,
} from "../controllers/adminApiController";
import { get } from "http";
const router = Router();

// *SUBJECT MANAGEMENT

//List of all subjects
router.get("/subjects", getAllSubjectsController);
//Add a new subject
router.post("/subjects/add", addSubjectController);
//Edit subject details
router.patch("/subjects/:subjectCode", updateSubjectController);
//Delete a subject
router.delete("/subjects/:subjectCode", deleteSubjectController);

// *STUDENT MANAGEMENT

//List of all students
router.get("/students", getAllStudentsController);
//View student details
router.get("/students/:studentId", getStudentDetailsController);
//Edit student information
router.patch("/students/:studentId", updateStudentController); //NOT FINALIZED
//Delete a student
router.delete("/students/:studentId", deleteStudentController);

// *FACULTY MANAGEMENT

//List of all faculty members
router.get("/faculties", getAllFacultiesController);
//Add a new faculty member
router.post("/faculty", (req, res) => {
  res.json({ message: "Add a new faculty member" });
});
//View details of a faculty member
router.get("/faculty/:facultyId", getFacultyDetailsController);
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
