import "./Design.css";

// Const Variables 10
const className = "Grade 10 - Section A";                     // const 1
const passingGrade = 75;                                      // const 2
const honorRollThreshold = 90; 

// const 3
const students = [                                            // const 4
  { name: "Yancy", gpa: 88, adviser: { name: "Mr. Cruz" } },
  { name: "Franz", gpa: 95 },
  { name: "John Mhyckel", gpa: 79 },
  { name: "Jullever", gpa: 91 },
  { name: "Harry", gpa: 94, adviser: { name: "Ms. Reyes" } }
];
const classAdviser = {                                        // const 5
  name: "Ms. Santos",
  role: "Class Adviser",
  office: { room: "204" }
};
const arr1 = [1, 2, 3];                                       // const 6
const arr2 = [4, 5, 6];                                       // const 7
const baseInfo = { school: className, year: "2026" };         // const 8
const extraInfo = {                                           // const 9
  city: "Metropolis",
  zip: "12345",
  library: { zip: "54321" }
};
const newStudent = { name: "Alex", gpa: 82 };                 // const 10

// Let Variables 10
let totalGpa = 0;                            // let 1
let averageGpa = 0;                          // let 2
let studentCount = students.length;          // let 3
let currentStudentName = "Guest";            // let 4
let isHonorStudent = false;                  // let 5
let currentDate = new Date().toDateString(); // let 6
let classList = [];                          // let 7
let message = "";                            // let 8
let seatsAvailable = 40;                     // let 9
let attendanceStatus = "pending";            // let 10

// Arrow Functions 5
const calculateAverage = (total, count) => total / count;                          // arrow function 1
const formatGpa = (gpa) => `${gpa.toFixed(2)}`;                                    // arrow function 2 + template literal 1
const greetStudent = (name) => `Hello, ${name}! Welcome to ${className}.`;         // arrow function 3 + template literal 2
const applyBonus = (gpa, points) => gpa + points;                                  // arrow function 4
const getStudentInfo = (student) =>
  `${student.name} has a GPA of ${formatGpa(student.gpa)}`;                        // arrow function 5 + template literal 3

// Arrays Using Spread Operator 2
const combinedArr = [...arr1, ...arr2];         // array spread 1
const newStudents = [...students, newStudent];  // array spread 2

// Object Literals Using Spread Operator 2
const fullInfo = { ...baseInfo, ...extraInfo };            // object spread 1
const updatedStudent = { ...students[0], gpa: 92 };        // object spread 2

// Destructured Arrays 3
const [first, second, third] = arr1;                  // destructured array 1
const [combinedFirst, combinedSecond] = combinedArr;  // destructured array 2
const [firstStudent, secondStudent] = students;       // destructured array 3

// Destructured Object Literals 3
const { name: adviserName, role } = classAdviser;                 // destructured object 1
const { name: stdName, gpa: stdGpa } = firstStudent;               // destructured object 2
const { city, zip } = fullInfo;                                    // destructured object 3

// Arrays Using .map() 2
const studentNames = students.map((s) => s.name);                       // map 1
const adjustedGpas = students.map((s) => applyBonus(s.gpa, 2));         // map 2

// Arrays Using .filter() 2
const honorStudents = students.filter((s) => s.gpa >= honorRollThreshold); // filter 1
const passingStudents = students.filter((s) => s.gpa >= passingGrade);    // filter 2

// Object Literals Using Optional Chaining 2
const firstAdviserName = firstStudent?.adviser?.name ?? "No adviser";   // optional chaining 1
const libraryZip = extraInfo?.library?.zip ?? "Unknown";               // optional chaining 2

// Using Let Variables
for (const s of students) {
  totalGpa += s.gpa;
}
averageGpa = calculateAverage(totalGpa, studentCount);
classList = [...studentNames];
message = `Class list: ${classList.join(", ")}`;   // template literal 4
currentStudentName = "Harry";
for (const s of honorStudents) {
  if (s.name === currentStudentName) {
    isHonorStudent = true;
  }
}
attendanceStatus = isHonorStudent ? "honor roll" : "regular";
seatsAvailable -= studentCount;

// Output
console.log(`----- "${className} - Class Report" -----`);                       // template literal 5
console.log(greetStudent(currentStudentName));
console.log(`Today's date: ${currentDate}`);                                  // template literal 6
console.log(`Total students in class: ${studentCount}`);                      // template literal 7
console.log(`Average GPA: ${formatGpa(averageGpa)}`);                         // template literal 8
console.log(`Adjusted GPA for first student: ${formatGpa(adjustedGpas[0])}`); // template literal 9
console.log(message);
console.log(`First student: ${firstStudent.name}, Second student: ${secondStudent.name}`); // template literal 10
console.log("Class Adviser: " + adviserName + " (" + role + ")");
console.log("Library ZIP code: " + libraryZip);
console.log(getStudentInfo(students[0]));
console.log("Honor roll students:", honorStudents);
console.log("Passing students:", passingStudents);
console.log("Updated student record:", updatedStudent);
console.log("Full class info:", fullInfo);
console.log("Attendance status for " + currentStudentName + ": " + attendanceStatus);
console.log("Remaining seats available: " + seatsAvailable);
console.log("Destructured array values -> first: " + first + ", second: " + second + ", third: " + third);
console.log("Combined array destructured -> " + combinedFirst + ", " + combinedSecond);
console.log(stdName + " GPA destructured: " + formatGpa(stdGpa));
console.log("First student's adviser: " + firstAdviserName);
console.log("City: " + city + ", Zip: " + zip);

const Activity = () => (
  <main className="container">
    <header className="header">
      <div>
        <p className="school-name">CLASS REPORT</p>
        <h1>{className}</h1>
        <p className="subtitle">{classAdviser.name} - {classAdviser.role}</p>
      </div>
      <div className="date">
        <span>Date</span>
        <strong>{currentDate}</strong>
      </div>
    </header>

    <section className="summary" aria-label="Class summary">
      <article className="summary-card">
        <span>Students</span>
        <strong>{studentCount}</strong>
      </article>
      <article className="summary-card">
        <span>Average GPA</span>
        <strong>{formatGpa(averageGpa)}</strong>
      </article>
      <article className="summary-card">
        <span>Honor roll</span>
        <strong>{honorStudents.length}</strong>
      </article>
      <article className="summary-card">
        <span>Seats available</span>
        <strong>{seatsAvailable}</strong>
      </article>
    </section>

    <section className="student-list">
      <h2>Students</h2>
      <div className="students">
        {students.map((student) => (
          <article className="student-card" key={student.name}>
            <div>
              <h3>{student.name}</h3>
              <p>{student.adviser?.name ?? "No adviser assigned"}</p>
            </div>
            <strong>{formatGpa(student.gpa)}</strong>
          </article>
        ))}
      </div>
    </section>
  </main>
);

export default Activity;