import { Router } from "express";
import {
  getCoursesController,
  getCourseByIdController,
  deleteCourseController,
  createCourseController,
  updateCourseController,
} from "../controllers/courseController";
import {
  getSubjectsController,
  getSubjectByIdController,
  deleteSubjectController,
  createSubjectController,
  updateSubjectController,
} from "../controllers/subjectController";
import {
  getAdminsController,
  getAdminByIdController,
  createAdminController,
  updateAdminController,
  deleteAdminController,
} from "../controllers/adminController";

import {
  getFacultiesController,
  getFacultyByIdController,
  createFacultyController,
  deleteFacultyController,
  updateFacultyController,
} from "../controllers/facultyController";

const router = Router();

//course routes
router.get("/course", getCoursesController);
router.get("/course/:id", getCourseByIdController);
router.delete("/course/:id", deleteCourseController);
router.post("/course", createCourseController);
router.put("/course/:id", updateCourseController);

//subject routes
router.get("/subject", getSubjectsController);
router.post("/subject", createSubjectController);
router.get("/subject/:id", getSubjectByIdController);
router.patch("/subject/:id", updateSubjectController);
router.delete("/subject/:id", deleteSubjectController);

//admin management routes
router.get("/manage/admin", getAdminsController);
router.post("/manage/admin", createAdminController);
router.get("/manage/admin/:id", getAdminByIdController);
router.patch("/manage/admin/:id", updateAdminController);
router.delete("/manage/admin/:id", deleteAdminController);

//faculty management routes
router.get("/manage/faculty", getFacultiesController);
router.post("/manage/faculty", createFacultyController);
router.get("/manage/faculty/:id", getFacultyByIdController);
router.patch("/manage/faculty/:id", updateFacultyController);
router.delete("/manage/faculty/:id", deleteFacultyController);

export default router;
