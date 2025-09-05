"use client";

import { DepartmentHeadDashboard } from "@/app/_component/department-head/department-head-home";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function DepartmentHeadPage() {
  const { user } = useKindeAuth();

  // Get current department head information based on logged-in user email
  const currentDepartmentHead = useQuery(
    api.superAdmin.getDepartmentHeadByEmail,
    user?.email ? { email: user.email } : "skip"
  );

  // Get real data from Convex backend
  const facultyList = useQuery(
    api.faculty.getAllFaculty, 
    currentDepartmentHead?.departmentId ? { departmentId: currentDepartmentHead.departmentId } : "skip"
  );
  const classList = useQuery(api.classes.getAllClasses);
  const labsList = useQuery(api.labs.getAllLabs, {});

  // Show loading in the component itself - it handles its own skeleton
  const isLoading = facultyList === undefined || classList === undefined || labsList === undefined || currentDepartmentHead === undefined;

  return (
    <DepartmentHeadDashboard 
      facultyList={facultyList || []}
      classList={classList || []}
      labsList={labsList || []}
      currentDepartmentHead={currentDepartmentHead}
      isLoading={isLoading}
    />
  );
}
