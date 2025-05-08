"use client";

import { FacultyProfile } from "@/app/_component/faculty/profile-component";
import { useState, useEffect } from "react";


// --- Types ---------------------------------------------------
type Education = {
  degree: string;
  institution: string;
  year: number;
  specialization?: string;
};

type SubjectTaught = {
  id: string;
  name: string;
  year: string;
  semester: number;
};

type Publication = {
  id: string;
  title: string;
  journal: string;
  year: number;
  url?: string;
};

type FacultyInfo = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  imageUrl: string;
  bio: string;
  education: Education[];
  subjectsTaught: SubjectTaught[];
  publications: Publication[];
  joinedYear: number;
};

// --- Mock Data ---------------------------------------------
const mockFacultyInfo: FacultyInfo = {
  id: "faculty001",
  name: "Dr. Rajesh Kumar",
  position: "Assistant Professor",
  department: "Computer Science & Engineering",
  email: "rajesh.kumar@example.edu",
  phone: "+91 9876543210",
  imageUrl: "/api/placeholder/150/150",
  bio: "Dr. Rajesh Kumar is an Assistant Professor with over 8 years of experience in teaching and research. His primary areas of interest include Machine Learning, Data Structures, and Algorithm Analysis. He has published numerous papers in international journals and conferences, and has been recognized for his contributions to computer science education.",
  education: [
    {
      degree: "Ph.D. in Computer Science",
      institution: "Indian Institute of Technology, Delhi",
      year: 2017,
      specialization: "Machine Learning & Data Mining"
    },
    {
      degree: "M.Tech in Computer Science",
      institution: "National Institute of Technology, Warangal",
      year: 2012
    },
    {
      degree: "B.Tech in Computer Science",
      institution: "Anna University",
      year: 2010
    }
  ],
  subjectsTaught: [
    {
      id: "sub001",
      name: "Data Structures",
      year: "FY",
      semester: 2
    },
    {
      id: "sub002",
      name: "Compiler Design",
      year: "TY",
      semester: 5
    },
    {
      id: "sub003",
      name: "Theory of Computation",
      year: "SY",
      semester: 3
    },
    {
      id: "sub004",
      name: "Machine Learning",
      year: "TY",
      semester: 6
    },
    {
      id: "sub005",
      name: "Database Systems",
      year: "SY",
      semester: 4
    }
  ],
  publications: [
    {
      id: "pub001",
      title: "Efficient Algorithms for Large-Scale Data Processing",
      journal: "IEEE Transactions on Big Data",
      year: 2023,
      url: "#"
    },
    {
      id: "pub002",
      title: "A Comparative Study of Machine Learning Approaches for Educational Data Mining",
      journal: "Journal of Educational Technology",
      year: 2022,
      url: "#"
    },
    {
      id: "pub003",
      title: "Novel Approach to Student Performance Prediction using Neural Networks",
      journal: "International Conference on Educational Data Science",
      year: 2021
    }
  ],
  joinedYear: 2017
};

// --- Component ---------------------------------------------
export default function FacultyProfilePage() {
  const [facultyInfo, setFacultyInfo] = useState<FacultyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      // Replace with real API call when ready
      setTimeout(() => {
        setFacultyInfo(mockFacultyInfo);
        setLoading(false);
      }, 1000);
    };
    fetchFacultyData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        {/* Skeleton for profile header */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center px-4 py-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mr-4"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-1/5 animate-pulse"></div>
            </div>
          </div>
          
          {/* Skeleton for tabs */}
          <div className="flex border-b">
            <div className="flex-1 py-3 flex justify-center">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="flex-1 py-3 flex justify-center">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="flex-1 py-3 flex justify-center">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Skeleton for content */}
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-28 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {facultyInfo && <FacultyProfile facultyInfo={facultyInfo} />}
    </div>
  );
}