import { Router } from "express";
import {
  addStudentGradeController,
  getClassListBySubjectController,
  getClassListController,
  getClassListStudentProfileController,
  getMyFacultyInfoController,
  getSubjectsTaughtController,
  updateMyFacultyProfileController,
} from "../controllers/facultyApiController";

const router = Router();

//Subjects Faculty Teaches
router.get("/classlist", getClassListController);

//Show class list by subject code
router.get("/classlist/subject/:subjectCode", getClassListBySubjectController);

//Show student information on a specific class
router.get(
  "/classlist/student/:studentId",
  getClassListStudentProfileController
);

//Enter or Update student grades for student
router.post("/classlist/grade/:enrollmentId", addStudentGradeController);

// View Own Subjects Taught
router.get("/subjects", getSubjectsTaughtController);

// View My Faculty Information
router.get("/profile", getMyFacultyInfoController);
// Update My Faculty Information
router.patch("/profile", updateMyFacultyProfileController);

export default router;
