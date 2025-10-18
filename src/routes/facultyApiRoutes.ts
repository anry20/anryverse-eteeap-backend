import { Router } from "express";
import {
  addStudentGradeController,
  getClassListBySubjectController,
  getClassListController,
  getClassListStudentProfileController,
} from "../controllers/facultyApiController";

const router = Router();

//Subjects Faculty Teaches
router.get("/classlist", getClassListController);

router.get("/classlist/subject/:subjectCode", getClassListBySubjectController);

//Show student information on a specific class
router.get(
  "/classlist/student/:studentId",
  getClassListStudentProfileController
);

//Enter or Update student grades for student
router.post("/classlist/grade/:enrollmentId", addStudentGradeController);

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
