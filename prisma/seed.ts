import prisma from "../src/utils/db";
import bcrypt from "bcrypt";

async function main() {
  const saltRounds = 10;

  // Hash passwords
  const adminPassword = await bcrypt.hash("adminpassword", saltRounds);
  const faculty1Password = await bcrypt.hash("facultypassword1", saltRounds);
  const faculty2Password = await bcrypt.hash("facultypassword2", saltRounds);
  const studentPassword = await bcrypt.hash("studentpassword", saltRounds);

  // Create Admin User and Admin profile
  const adminUser = await prisma.user.create({
    data: {
      username: "adminuser",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      admin: {
        create: {
          firstName: "Alice",
          lastName: "Admin",
          middleName: "M",
          contactNo: "1234567890",
        },
      },
    },
  });

  // Create Faculty Users and Faculty profiles
  const facultyUser1 = await prisma.user.create({
    data: {
      username: "faculty1",
      email: "faculty1@example.com",
      password: faculty1Password,
      role: "faculty",
      faculty: {
        create: {
          firstName: "Bob",
          lastName: "Builder",
          contactNo: "0987654321",
        },
      },
    },
    include: { faculty: true },
  });

  const facultyUser2 = await prisma.user.create({
    data: {
      username: "faculty2",
      email: "faculty2@example.com",
      password: faculty2Password,
      role: "faculty",
      faculty: {
        create: {
          firstName: "Charlie",
          lastName: "Chaplin",
          contactNo: "1122334455",
        },
      },
    },
    include: { faculty: true },
  });

  // PSUET Courses
  const psuetCourses = [
    "Bachelor in Industrial Technology major in Automotive Technology",
    "Bachelor in Industrial Technology major in Electrical Technology",
    "Bachelor in Industrial Technology major in Food Service Management",
    "Bachelor in Industrial Technology major in Electronics Technology",
    "Bachelor in Industrial Technology major in Mechanical Technology",
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education major in Science",
    "Bachelor of Secondary Education major in English",
    "Bachelor of Secondary Education major in Mathematics",
    "Bachelor of Technology and Livelihood Education major in Home Economics",
  ];

  // Create Courses
  const createdCourses = [];
  for (const courseName of psuetCourses) {
    const createdCourse = await prisma.course.create({
      data: {
        courseName,
        department: "PSUET Department", // adjust department name as needed
      },
    });
    createdCourses.push(createdCourse);
  }

  // Create at least 2 dummy subjects per course
  const subjectsToCreate = [];
  for (const course of createdCourses) {
    subjectsToCreate.push({
      subjectCode: `SUBJ${course.courseId}01`,
      subjectName: `Intro Subject for ${course.courseName}`,
      units: 3,
    });
    subjectsToCreate.push({
      subjectCode: `SUBJ${course.courseId}02`,
      subjectName: `Advanced Subject for ${course.courseName}`,
      units: 3,
    });
  }

  // Create all subjects
  const createdSubjects = [];
  for (const subjectData of subjectsToCreate) {
    const createdSubject = await prisma.subject.create({
      data: subjectData,
    });
    createdSubjects.push(createdSubject);
  }

  // Assign Subjects to Courses (CourseSubject)
  for (const course of createdCourses) {
    // Filter subjects for current course
    const courseSubjects = createdSubjects.filter((subj) =>
      subj.subjectCode.startsWith(`SUBJ${course.courseId}`)
    );

    for (const subj of courseSubjects) {
      await prisma.courseSubject.create({
        data: {
          courseId: course.courseId,
          subjectCode: subj.subjectCode,
        },
      });
    }
  }

  // Assign Faculty to Subjects (SubjectFaculty) - Rotate faculties over subjects
  let facultyToggle = true;
  for (const subj of createdSubjects) {
    await prisma.subjectFaculty.create({
      data: {
        subjectCode: subj.subjectCode,
        facultyId: facultyToggle
          ? facultyUser1.faculty!.facultyId
          : facultyUser2.faculty!.facultyId,
      },
    });
    facultyToggle = !facultyToggle;
  }

  // Create Terms
  const term1 = await prisma.term.create({
    data: {
      academicYear: "2025-2026",
      semester: "First",
      isActive: true,
    },
  });
  const term2 = await prisma.term.create({
    data: {
      academicYear: "2025-2026",
      semester: "Second",
      isActive: false,
    },
  });

  // Create Student User and Student profile (linked to first PSUET course)
  const firstCourse = createdCourses[0];
  const studentUser = await prisma.user.create({
    data: {
      username: "studenta",
      email: "studenta@example.com",
      password: studentPassword,
      role: "student",
      students: {
        create: {
          firstName: "David",
          lastName: "Doe",
          middleName: "L",
          address: "123 Main St",
          dateEnrolled: new Date(),
          sex: "Male",
          placeOfBirth: "Cityville",
          nationality: "Countryland",
          religion: "None",
          contactNo: "555-1000",
          civilStatus: "Single",
          registrarSeal: "Pending",
          courseId: firstCourse.courseId,
        },
      },
    },
    include: { students: true },
  });

  // Enroll the student in all subjects assigned to their course for the active term
  const courseSubjects = await prisma.courseSubject.findMany({
    where: { courseId: firstCourse.courseId },
  });
  for (const cs of courseSubjects) {
    // Find assigned faculty for subject
    const sf = await prisma.subjectFaculty.findFirst({
      where: { subjectCode: cs.subjectCode },
    });
    if (!sf)
      throw new Error(`Faculty not assigned for subject ${cs.subjectCode}`);

    // Create Enrollment
    await prisma.enrollment.create({
      data: {
        studentId: studentUser.students!.studentId,
        subjectCode: cs.subjectCode,
        facultyId: sf.facultyId,
        termId: term1.termId,
        status: "Enrolled",
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
