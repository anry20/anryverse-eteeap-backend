import { Router } from "express";
import {
  activateTermController,
  addSubjectController,
  assignFacultyToSubjectController,
  createFacultyController,
  createTermController,
  deleteFacultyController,
  deleteStudentController,
  deleteSubjectController,
  deleteTermController,
  getAllFacultiesController,
  getAllStudentsController,
  getAllSubjectsController,
  getAllTermsController,
  getFacultyDetailsController,
  getStudentDetailsController,
  unAssignFacultyFromSubjectController,
  updateFacultyController,
  updateStudentController,
  updateSubjectController,
} from "../controllers/adminApiController";

const router = Router();

// SUBJECT MANAGEMENT
router.get("/subjects", getAllSubjectsController);
router.post("/subjects/add", addSubjectController);
router.patch("/subjects/:subjectCode", updateSubjectController);
router.delete("/subjects/:subjectCode", deleteSubjectController);

// STUDENT MANAGEMENT
router.get("/students", getAllStudentsController);
router.get("/students/:studentId", getStudentDetailsController);
router.patch("/students/:studentId", updateStudentController);
router.delete("/students/:studentId", deleteStudentController);

// FACULTY MANAGEMENT
router.get("/faculties", getAllFacultiesController);
router.post("/faculty", createFacultyController);
router.get("/faculty/:facultyId", getFacultyDetailsController);
router.patch("/faculty/:facultyId", updateFacultyController);
router.delete("/faculty/:facultyId", deleteFacultyController);

// ADMIN MANAGEMENT
router.get("/manage", (req, res) => {
  res.status(200).json({ message: "Admin route working" });
});
router.post("/manage", (req, res) => {
  res.status(200).json({ message: "Admin route working" });
});
router.delete("/manage", (req, res) => {
  res.status(200).json({ message: "Admin route working" });
});

// ASSIGN FACULTY/SUBJECT
router.post("/assign", assignFacultyToSubjectController);
router.delete("/assign", unAssignFacultyFromSubjectController);

// TERM MANAGEMENT
router.get("/terms", getAllTermsController);
router.post("/term", createTermController);
router.delete("/term/:termId", deleteTermController);
router.post("/term/:termId/activate", activateTermController);

export default router;
