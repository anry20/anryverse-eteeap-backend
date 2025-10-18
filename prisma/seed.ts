/* eslint-disable */

import prisma from "../src/utils/db";
import bcrypt from "bcrypt";

async function main() {
  const saltRounds = 10;

  // Create 5 Admins
  console.log("Creating admins...");
  for (let i = 1; i <= 5; i++) {
    const adminPassword = await bcrypt.hash(`adminpassword${i}`, saltRounds);
    await prisma.user.create({
      data: {
        username: `admin${i}`,
        email: `admin${i}@example.com`,
        password: adminPassword,
        role: "admin",
        admin: {
          create: {
            firstName: `Admin${i}`,
            lastName: `User${i}`,
            middleName: "M",
            contactNo: `123456789${i}`,
          },
        },
      },
    });
  }

  // Create 5 Faculty
  console.log("Creating faculty...");
  const facultyUsers = [];
  for (let i = 1; i <= 5; i++) {
    const facultyPassword = await bcrypt.hash(
      `facultypassword${i}`,
      saltRounds
    );
    const facultyUser = await prisma.user.create({
      data: {
        username: `faculty${i}`,
        email: `faculty${i}@example.com`,
        password: facultyPassword,
        role: "faculty",
        faculty: {
          create: {
            firstName: `Faculty${i}`,
            lastName: `Member${i}`,
            middleName: i % 2 === 0 ? "M" : undefined,
            contactNo: `098765432${i}`,
          },
        },
      },
      include: { faculty: true },
    });
    facultyUsers.push(facultyUser);
  }

  // Create 3 Courses: BSIT, BSCS, BIT
  console.log("Creating courses...");
  const courses = [
    {
      courseName: "Bachelor of Science in Information Technology",
      department: "PSUET Department",
      shortName: "BSIT",
    },
    {
      courseName: "Bachelor of Science in Computer Science",
      department: "PSUET Department",
      shortName: "BSCS",
    },
    {
      courseName: "Bachelor in Industrial Technology",
      department: "PSUET Department",
      shortName: "BIT",
    },
  ];

  const createdCourses = [];
  for (const course of courses) {
    const createdCourse = await prisma.course.create({
      data: {
        courseName: course.courseName,
        department: course.department,
      },
    });
    createdCourses.push({ ...createdCourse, shortName: course.shortName });
  }

  // Create at least 20 subjects (7 for BSIT, 7 for BSCS, 6 for BIT)
  console.log("Creating subjects...");
  const subjects = [
    // BSIT Subjects (7)
    {
      code: "IT101",
      name: "Introduction to Computing",
      units: 3,
      course: "BSIT",
    },
    { code: "IT102", name: "Computer Programming 1", units: 3, course: "BSIT" },
    {
      code: "IT103",
      name: "Data Structures and Algorithms",
      units: 3,
      course: "BSIT",
    },
    { code: "IT104", name: "Web Development 1", units: 3, course: "BSIT" },
    {
      code: "IT105",
      name: "Database Management Systems",
      units: 3,
      course: "BSIT",
    },
    {
      code: "IT106",
      name: "Systems Analysis and Design",
      units: 3,
      course: "BSIT",
    },
    { code: "IT107", name: "Information Security", units: 3, course: "BSIT" },

    // BSCS Subjects (7)
    { code: "CS101", name: "Discrete Mathematics", units: 3, course: "BSCS" },
    { code: "CS102", name: "Computer Programming 2", units: 3, course: "BSCS" },
    {
      code: "CS103",
      name: "Object-Oriented Programming",
      units: 3,
      course: "BSCS",
    },
    { code: "CS104", name: "Computer Architecture", units: 3, course: "BSCS" },
    { code: "CS105", name: "Operating Systems", units: 3, course: "BSCS" },
    { code: "CS106", name: "Theory of Computation", units: 3, course: "BSCS" },
    {
      code: "CS107",
      name: "Artificial Intelligence",
      units: 3,
      course: "BSCS",
    },

    // BIT Subjects (6)
    {
      code: "BIT101",
      name: "Industrial Safety and Health",
      units: 3,
      course: "BIT",
    },
    { code: "BIT102", name: "Technical Drawing", units: 3, course: "BIT" },
    { code: "BIT103", name: "Applied Physics", units: 3, course: "BIT" },
    { code: "BIT104", name: "Industrial Materials", units: 3, course: "BIT" },
    { code: "BIT105", name: "Quality Control", units: 3, course: "BIT" },
    { code: "BIT106", name: "Industrial Management", units: 3, course: "BIT" },
  ];

  const createdSubjects = [];
  for (const subject of subjects) {
    const createdSubject = await prisma.subject.create({
      data: {
        subjectCode: subject.code,
        subjectName: subject.name,
        units: subject.units,
      },
    });
    createdSubjects.push({
      ...createdSubject,
      courseShortName: subject.course,
    });
  }

  // Assign Subjects to Courses (CourseSubject)
  console.log("Assigning subjects to courses...");
  for (const subject of createdSubjects) {
    const course = createdCourses.find(
      (c) => c.shortName === subject.courseShortName
    );
    if (course) {
      await prisma.courseSubject.create({
        data: {
          courseId: course.courseId,
          subjectCode: subject.subjectCode,
        },
      });
    }
  }

  // Assign Faculty to Subjects (rotate through faculty)
  console.log("Assigning faculty to subjects...");
  for (let i = 0; i < createdSubjects.length; i++) {
    const facultyUser = facultyUsers[i % facultyUsers.length];
    await prisma.subjectFaculty.create({
      data: {
        subjectCode: createdSubjects[i].subjectCode,
        facultyId: facultyUser.faculty!.facultyId,
      },
    });
  }

  // Create Terms
  console.log("Creating terms...");
  const term1 = await prisma.term.create({
    data: {
      academicYear: "2025-2026",
      semester: "first",
      isActive: true,
    },
  });
  await prisma.term.create({
    data: {
      academicYear: "2025-2026",
      semester: "second",
      isActive: false,
    },
  });

  // Create 5 Students
  console.log("Creating students...");
  const studentUsers = [];
  const firstNames = ["David", "Emma", "Michael", "Sophia", "James"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];
  const civilStatuses = ["single", "single", "married", "single", "single"];

  for (let i = 1; i <= 5; i++) {
    const studentPassword = await bcrypt.hash(
      `studentpassword${i}`,
      saltRounds
    );
    const courseIndex = (i - 1) % 3; // Distribute students across 3 courses

    const studentUser = await prisma.user.create({
      data: {
        username: `student${i}`,
        email: `student${i}@example.com`,
        password: studentPassword,
        role: "student",
        students: {
          create: {
            firstName: firstNames[i - 1],
            lastName: lastNames[i - 1],
            middleName: i % 2 === 0 ? "L" : "M",
            address: `${i}23 Main St, Asingan`,
            dateEnrolled: new Date(),
            sex: i % 2 === 0 ? "female" : "male",
            placeOfBirth: "Asingan, Pangasinan",
            nationality: "Filipino",
            religion: i % 3 === 0 ? "Catholic" : "None",
            contactNo: `555-100${i}`,
            civilStatus: civilStatuses[i - 1] as any,
            registrarSeal: null,
            admitted: true, // Set admitted to true
            courseId: createdCourses[courseIndex].courseId,
          },
        },
      },
      include: { students: true },
    });
    studentUsers.push(studentUser);
  }

  // Enroll students in subjects
  console.log("Creating enrollments...");
  for (const studentUser of studentUsers) {
    const student = studentUser.students!;

    // Get subjects for this student's course
    const courseSubjects = await prisma.courseSubject.findMany({
      where: { courseId: student.courseId },
      take: 5, // Enroll in 5 subjects per student
    });

    for (const cs of courseSubjects) {
      // Find assigned faculty for subject
      const sf = await prisma.subjectFaculty.findFirst({
        where: { subjectCode: cs.subjectCode },
      });

      if (sf) {
        await prisma.enrollment.create({
          data: {
            studentId: student.studentId,
            subjectCode: cs.subjectCode,
            facultyId: sf.facultyId,
            termId: term1.termId,
            status: "enrolled",
          },
        });
      }
    }
  }

  console.log("Seeding finished successfully!");
  console.log(`Created:`);
  console.log(`- 5 Admins`);
  console.log(`- 5 Faculty members`);
  console.log(`- 3 Courses (BSIT, BSCS, BIT)`);
  console.log(`- 20 Subjects`);
  console.log(`- 5 Students (all admitted)`);
  console.log(`- Multiple enrollments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/* To reset all sequences in PostgreSQL, you can use the following SQL query:
  SELECT 'ALTER SEQUENCE ' || relname || ' RESTART WITH 1000;'
  FROM pg_class
  WHERE relkind = 'S';
*/
