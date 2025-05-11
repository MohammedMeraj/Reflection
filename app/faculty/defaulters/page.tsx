import { DefaultersView } from "@/app/_component/faculty/defaulterView";

// Mock data for classes
const mockClasses = [
  {
    id: "class-1",
    name: "Data Structures",
    branch: "CSE",
    year: "FY"
  },
  {
    id: "class-2",
    name: "Computer Networks",
    branch: "CSE",
    year: "SY"
  },
  {
    id: "class-3",
    name: "Database Management",
    branch: "IT",
    year: "TY"
  },
  {
    id: "class-4",
    name: "Compiler Design",
    branch: "CSE",
    year: "TY"
  }
];

// Mock data for students
const mockStudents = [
  // Data Structures Students (FY CSE)
  {
    id: "s1",
    name: "Rahul Sharma",
    rollNo: "CS21001",
    attendance: 82,
    class: "class-1",
    branch: "CSE",
    year: "FY"
  },
  {
    id: "s2",
    name: "Priya Patel",
    rollNo: "CS21002",
    attendance: 68,
    class: "class-1",
    branch: "CSE",
    year: "FY"
  },
  {
    id: "s3",
    name: "Arjun Singh",
    rollNo: "CS21003",
    attendance: 94,
    class: "class-1",
    branch: "CSE",
    year: "FY"
  },
  {
    id: "s4",
    name: "Meera Gupta",
    rollNo: "CS21004",
    attendance: 62,
    class: "class-1",
    branch: "CSE",
    year: "FY"
  },
  
  // Computer Networks Students (SY CSE)
  {
    id: "s5",
    name: "Vikram Deshmukh",
    rollNo: "CS20001",
    attendance: 76,
    class: "class-2",
    branch: "CSE",
    year: "SY"
  },
  {
    id: "s6",
    name: "Ananya Mehta",
    rollNo: "CS20002",
    attendance: 59,
    class: "class-2",
    branch: "CSE",
    year: "SY"
  },
  {
    id: "s7",
    name: "Suresh Kumar",
    rollNo: "CS20003",
    attendance: 88,
    class: "class-2",
    branch: "CSE",
    year: "SY"
  },
  
  // Database Management Students (TY IT)
  {
    id: "s8",
    name: "Riya Joshi",
    rollNo: "IT19001",
    attendance: 72,
    class: "class-3",
    branch: "IT",
    year: "TY"
  },
  {
    id: "s9",
    name: "Aditya Shah",
    rollNo: "IT19002",
    attendance: 64,
    class: "class-3",
    branch: "IT",
    year: "TY"
  },
  {
    id: "s10",
    name: "Neha Tiwari",
    rollNo: "IT19003",
    attendance: 91,
    class: "class-3",
    branch: "IT",
    year: "TY"
  },
  
  // Compiler Design Students (TY CSE)
  {
    id: "s11",
    name: "Rohan Malhotra",
    rollNo: "CS19001",
    attendance: 55,
    class: "class-4",
    branch: "CSE",
    year: "TY"
  },
  {
    id: "s12",
    name: "Shikha Reddy",
    rollNo: "CS19002",
    attendance: 79,
    class: "class-4",
    branch: "CSE",
    year: "TY"
  },
  {
    id: "s13",
    name: "Varun Kapoor",
    rollNo: "CS19003",
    attendance: 48,
    class: "class-4",
    branch: "CSE",
    year: "TY"
  },
  {
    id: "s14",
    name: "Tanvi Mehra",
    rollNo: "CS19004",
    attendance: 83,
    class: "class-4",
    branch: "CSE",
    year: "TY"
  }
];

export default function DefaultersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DefaultersView 
        classes={mockClasses} 
        students={mockStudents} 
        threshold={75} // Setting 75% as the defaulter threshold
      />
    </main>
  );
}