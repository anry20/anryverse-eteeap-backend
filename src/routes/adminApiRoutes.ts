import { Router } from "express";
import {
  activateTermController,
  addSubjectController,
  assignFacultyToSubjectController,
  createAdminController,
  createFacultyController,
  createTermController,
  deleteAdminController,
  deleteFacultyController,
  deleteStudentController,
  deleteSubjectController,
  deleteTermController,
  getAdminDetailsController,
  getAllAdminController,
  getAllFacultiesController,
  getAllStudentsController,
  getAllSubjectsController,
  getAllTermsController,
  getFacultyDetailsController,
  getStudentDetailsController,
  unAssignFacultyFromSubjectController,
  updateAdminController,
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
router.get("/manage", getAllAdminController);
router.get("/manage/:adminId", getAdminDetailsController);
router.post("/manage", createAdminController);
router.delete("/manage", deleteAdminController);
router.patch("/manage", updateAdminController);

// ASSIGN FACULTY/SUBJECT
router.post("/assign", assignFacultyToSubjectController);
router.delete("/assign", unAssignFacultyFromSubjectController);

// TERM MANAGEMENT
router.get("/terms", getAllTermsController);
router.post("/term", createTermController);
router.delete("/term/:termId", deleteTermController);
router.post("/term/:termId/activate", activateTermController);

export default router;
