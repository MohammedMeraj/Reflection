"use client";

import { useState, useEffect } from "react";

interface SubjectTaught {
  id: string;
  name: string;
  year: string;
  semester: number;
}

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  url?: string;
}

interface Education {
  degree: string;
  institution: string;
  year: number;
  specialization?: string;
}

interface FacultyProfileInfo {
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
}

interface FacultyProfileProps {
  facultyInfo: FacultyProfileInfo;
}

export const FacultyProfile = ({
  facultyInfo,
}: FacultyProfileProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "subjects" | "publications">("overview");

  // Format experience years
  const calculateExperience = (joinedYear: number) => {
    const currentYear = new Date().getFullYear();
    return currentYear - joinedYear;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header with faculty info */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            <img 
              src={facultyInfo.imageUrl} 
              alt={facultyInfo.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium">{facultyInfo.name}</h2>
            <p className="text-sm text-blue-600">{facultyInfo.position}</p>
            <p className="text-xs text-gray-500">{facultyInfo.department}</p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 text-center py-3 text-sm font-medium ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("subjects")}
            className={`flex-1 text-center py-3 text-sm font-medium ${
              activeTab === "subjects"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Subjects
          </button>
          <button
            onClick={() => setActiveTab("publications")}
            className={`flex-1 text-center py-3 text-sm font-medium ${
              activeTab === "publications"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Publications
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-2">Bio</h3>
              <p className="text-sm text-gray-700">{facultyInfo.bio}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3">Academic Information</h3>
              
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
                  {calculateExperience(facultyInfo.joinedYear)}+ Years Experience
                </span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap">
                  {facultyInfo.subjectsTaught.length} Subjects
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                  {facultyInfo.publications.length} Publications
                </span>
              </div>
              
              <h4 className="text-xs font-medium text-gray-500 mb-2">Contact Information</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-sm">
                  <span className="w-16 text-gray-500">Email:</span>
                  <span className="text-blue-600">{facultyInfo.email}</span>
                </li>
                {facultyInfo.phone && (
                  <li className="flex items-center text-sm">
                    <span className="w-16 text-gray-500">Phone:</span>
                    <span>{facultyInfo.phone}</span>
                  </li>
                )}
              </ul>
              
              <h4 className="text-xs font-medium text-gray-500 mb-2">Education</h4>
              <ul className="space-y-3">
                {facultyInfo.education.map((edu, index) => (
                  <li key={index} className="text-sm">
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-gray-600">{edu.institution}, {edu.year}</div>
                    {edu.specialization && (
                      <div className="text-gray-500 text-xs">{edu.specialization}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3">Subjects Taught</h3>
              
              <ul className="divide-y">
                {facultyInfo.subjectsTaught.map((subject) => (
                  <li key={subject.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{subject.name}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {subject.year}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Sem {subject.semester}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "publications" && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-medium mb-3">Research Publications</h3>
              
              <ul className="divide-y">
                {facultyInfo.publications.map((pub) => (
                  <li key={pub.id} className="py-3">
                    <div className="font-medium text-sm">{pub.title}</div>
                    <p className="text-xs text-gray-600 mt-1">{pub.journal}, {pub.year}</p>
                    {pub.url && (
                      <a 
                        href={pub.url} 
                        className="text-xs text-blue-600 mt-1 block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Publication
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};