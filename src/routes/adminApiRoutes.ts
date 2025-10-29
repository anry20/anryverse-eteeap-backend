import { Router } from "express";
import {
  addSubjectController,
  assignFacultyToSubjectController,
  createFacultyController,
  deleteFacultyController,
  deleteStudentController,
  deleteSubjectController,
  getAllFacultiesController,
  getAllStudentsController,
  getAllSubjectsController,
  getFacultyDetailsController,
  getStudentDetailsController,
  unAssignFacultyFromSubjectController,
  updateFacultyController,
  updateStudentController,
  updateSubjectController,
} from "../controllers/adminApiController";

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
router.post("/faculty", createFacultyController);
//View details of a faculty member
router.get("/faculty/:facultyId", getFacultyDetailsController);
//Edit faculty member information
router.patch("/faculty/:facultyId", updateFacultyController);
//Delete a faculty member
router.delete("/faculty/:facultyId", deleteFacultyController);

// *ASSIGN FACULTY/SUBJECT
router.post("/assign", assignFacultyToSubjectController);
router.delete("/assign", unAssignFacultyFromSubjectController);

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
