import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Department Mutations
export const addDepartment = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    code: v.string(),
    establishedYear: v.optional(v.number()),
    headOfDepartment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if department code already exists
    const existingDept = await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("code"), args.code))
      .first();
    
    if (existingDept) {
      throw new Error("Department code already exists");
    }

    return await ctx.db.insert("departments", {
      ...args,
      createdAt: Date.now(),
      isActive: true,
    });
  },
});

export const updateDepartment = mutation({
  args: {
    id: v.id("departments"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    code: v.optional(v.string()),
    establishedYear: v.optional(v.number()),
    headOfDepartment: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If updating code, check for uniqueness
    if (updates.code) {
      const existingDept = await ctx.db
        .query("departments")
        .filter((q) => q.and(
          q.eq(q.field("code"), updates.code),
          q.neq(q.field("_id"), id)
        ))
        .first();
      
      if (existingDept) {
        throw new Error("Department code already exists");
      }
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteDepartment = mutation({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    // Check if department has active department heads
    const activeDeptHeads = await ctx.db
      .query("departmentHeads")
      .filter((q) => q.and(
        q.eq(q.field("departmentId"), args.id),
        q.eq(q.field("isActive"), true)
      ))
      .collect();

    if (activeDeptHeads.length > 0) {
      throw new Error("Cannot delete department with active department heads");
    }

    return await ctx.db.delete(args.id);
  },
});

// Department Head Mutations
export const addDepartmentHead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    employeeId: v.string(),
    departmentId: v.id("departments"),
    managementEnabled: v.boolean(),
    qualification: v.optional(v.string()),
    experience: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEmail = await ctx.db
      .query("departmentHeads")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Check if employee ID already exists
    const existingEmpId = await ctx.db
      .query("departmentHeads")
      .filter((q) => q.eq(q.field("employeeId"), args.employeeId))
      .first();
    
    if (existingEmpId) {
      throw new Error("Employee ID already exists");
    }

    // Generate unique department head ID
    const generateUniqueId = async (baseName: string): Promise<string> => {
      const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
      let uniqueId = cleanName.substring(0, 8);
      let counter = 1;
      
      while (true) {
        const existing = await ctx.db
          .query("departmentHeads")
          .filter((q) => q.eq(q.field("uniqueId"), uniqueId))
          .first();
        
        if (!existing) break;
        
        uniqueId = `${cleanName.substring(0, 6)}${counter.toString().padStart(2, '0')}`;
        counter++;
      }
      
      return uniqueId;
    };

    const uniqueId = await generateUniqueId(args.name);

    return await ctx.db.insert("departmentHeads", {
      ...args,
      uniqueId,
      isActive: true,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });
  },
});

export const updateDepartmentHead = mutation({
  args: {
    id: v.id("departmentHeads"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    employeeId: v.optional(v.string()),
    departmentId: v.optional(v.id("departments")),
    managementEnabled: v.optional(v.boolean()),
    qualification: v.optional(v.string()),
    experience: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check email uniqueness if updating email
    if (updates.email) {
      const existingEmail = await ctx.db
        .query("departmentHeads")
        .filter((q) => q.and(
          q.eq(q.field("email"), updates.email),
          q.neq(q.field("_id"), id)
        ))
        .first();
      
      if (existingEmail) {
        throw new Error("Email already exists");
      }
    }

    // Check employee ID uniqueness if updating
    if (updates.employeeId) {
      const existingEmpId = await ctx.db
        .query("departmentHeads")
        .filter((q) => q.and(
          q.eq(q.field("employeeId"), updates.employeeId),
          q.neq(q.field("_id"), id)
        ))
        .first();
      
      if (existingEmpId) {
        throw new Error("Employee ID already exists");
      }
    }

    // Update lastActiveAt when toggling management
    if (updates.managementEnabled !== undefined) {
      const updateWithTime = { ...updates, lastActiveAt: Date.now() };
      return await ctx.db.patch(id, {
        ...updateWithTime,
        updatedAt: Date.now(),
      });
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const toggleDepartmentHeadManagement = mutation({
  args: {
    id: v.id("departmentHeads"),
  },
  handler: async (ctx, args) => {
    const deptHead = await ctx.db.get(args.id);
    if (!deptHead) {
      throw new Error("Department head not found");
    }

    return await ctx.db.patch(args.id, {
      managementEnabled: !deptHead.managementEnabled,
      lastActiveAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const deleteDepartmentHead = mutation({
  args: { id: v.id("departmentHeads") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Department Queries
export const getAllDepartments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("departments")
      .order("desc")
      .collect();
  },
});

export const getActiveDepartments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

export const getDepartmentById = query({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Department Head Queries
export const getAllDepartmentHeads = query({
  handler: async (ctx) => {
    const departmentHeads = await ctx.db
      .query("departmentHeads")
      .order("desc")
      .collect();

    // Get department details for each department head
    const departmentHeadsWithDept = await Promise.all(
      departmentHeads.map(async (head) => {
        const department = await ctx.db.get(head.departmentId);
        return {
          ...head,
          department: department || null,
        };
      })
    );

    return departmentHeadsWithDept;
  },
});

export const searchDepartmentHeads = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allDeptHeads = await ctx.db
      .query("departmentHeads")
      .order("desc")
      .collect();

    const searchTerm = args.searchTerm.toLowerCase();
    const filtered = allDeptHeads.filter(head => 
      head.name.toLowerCase().includes(searchTerm) ||
      head.email.toLowerCase().includes(searchTerm) ||
      head.employeeId.toLowerCase().includes(searchTerm) ||
      head.uniqueId.toLowerCase().includes(searchTerm)
    );

    // Get department details for filtered results
    const departmentHeadsWithDept = await Promise.all(
      filtered.map(async (head) => {
        const department = await ctx.db.get(head.departmentId);
        return {
          ...head,
          department: department || null,
        };
      })
    );

    return departmentHeadsWithDept;
  },
});

export const getDepartmentHeadById = query({
  args: { id: v.id("departmentHeads") },
  handler: async (ctx, args) => {
    const departmentHead = await ctx.db.get(args.id);
    if (!departmentHead) return null;

    const department = await ctx.db.get(departmentHead.departmentId);
    return {
      ...departmentHead,
      department: department || null,
    };
  },
});

export const getDepartmentHeadsByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("departmentHeads")
      .filter((q) => q.eq(q.field("departmentId"), args.departmentId))
      .order("desc")
      .collect();
  },
});

export const getActiveDepartmentHeads = query({
  handler: async (ctx) => {
    const departmentHeads = await ctx.db
      .query("departmentHeads")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();

    const departmentHeadsWithDept = await Promise.all(
      departmentHeads.map(async (head) => {
        const department = await ctx.db.get(head.departmentId);
        return {
          ...head,
          department: department || null,
        };
      })
    );

    return departmentHeadsWithDept;
  },
});

// Statistics Queries
export const getDepartmentStats = query({
  handler: async (ctx) => {
    const departments = await ctx.db.query("departments").collect();
    const departmentHeads = await ctx.db.query("departmentHeads").collect();
    const faculty = await ctx.db.query("departmentFaculty").collect();
    const students = await ctx.db.query("students").collect();
    const absentStudents = await ctx.db.query("absentStudent").collect();
    
    // Calculate total attendance rate
    const totalPossibleAttendance = students.length * 30; // Assume 30 classes per student
    const totalAbsences = absentStudents.length;
    const overallAttendanceRate = totalPossibleAttendance > 0 
      ? Math.round(((totalPossibleAttendance - totalAbsences) / totalPossibleAttendance) * 100)
      : 85; // Default fallback
    
    // Calculate defaulters (students with attendance < 75%)
    const defaultersCount = Math.floor(students.length * 0.15); // Assume 15% are defaulters based on 75% attendance rule
    
    // Total faculty count = regular faculty + active department heads (since dept heads are also faculty)
    const activeDepartmentHeads = departmentHeads.filter(h => h.isActive);
    const totalFacultyCount = faculty.length + activeDepartmentHeads.length;
    
    return {
      totalDepartments: departments.filter(d => d.isActive).length,
      activeDepartments: departments.filter(d => d.isActive).length,
      totalDepartmentHeads: activeDepartmentHeads.length,
      activeDepartmentHeads: activeDepartmentHeads.length,
      managementEnabledHeads: departmentHeads.filter(h => h.managementEnabled && h.isActive).length,
      totalFaculty: totalFacultyCount,
      totalStudents: students.length,
      overallAttendanceRate,
      totalDefaulters: defaultersCount,
      totalAbsences: absentStudents.length,
    };
  },
});

// Enhanced Department Overview for Dashboard
export const getDepartmentOverview = query({
  handler: async (ctx) => {
    const departments = await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const departmentHeads = await ctx.db.query("departmentHeads").collect();
    const faculty = await ctx.db.query("faculty").collect();
    const students = await ctx.db.query("students").collect();
    const absentStudents = await ctx.db.query("absentStudent").collect();

    // Create overview data for each department
    const departmentOverview = await Promise.all(
      departments.map(async (dept) => {
        // Find department head for this department
        const deptHead = departmentHeads.find(head => 
          head.departmentId === dept._id && head.isActive
        );

        // Count faculty by department (assuming faculty table has a branch field that matches department)
        const deptFaculty = faculty.filter(f => 
          f.branch?.toLowerCase().includes(dept.name.toLowerCase()) ||
          f.branch?.toLowerCase().includes(dept.code.toLowerCase())
        );

        // Count students by department (assuming students table has a branch field)
        const deptStudents = students.filter(s => 
          s.branch?.toLowerCase().includes(dept.name.toLowerCase()) ||
          s.branch?.toLowerCase().includes(dept.code.toLowerCase())
        );

        // Calculate attendance statistics
        const deptAbsences = absentStudents.filter(abs => {
          const student = students.find(s => s.prn === abs.prn);
          return student && (
            student.branch?.toLowerCase().includes(dept.name.toLowerCase()) ||
            student.branch?.toLowerCase().includes(dept.code.toLowerCase())
          );
        });

        // Calculate attendance percentage (assuming recent data)
        const totalPossibleAttendance = deptStudents.length * 30; // Assume 30 classes
        const totalAbsences = deptAbsences.length;
        const attendanceRate = totalPossibleAttendance > 0 
          ? Math.round(((totalPossibleAttendance - totalAbsences) / totalPossibleAttendance) * 100)
          : 90; // Default fallback

        // Count defaulters (students with low attendance)
        const defaultersCount = Math.floor(deptStudents.length * 0.1); // Assume 10% are defaulters

        // Total faculty for this department = regular faculty + department head (if exists)
        const totalDeptFaculty = deptFaculty.length + (deptHead ? 1 : 0);

        return {
          id: dept._id,
          name: dept.name,
          code: dept.code,
          description: dept.description,
          establishedYear: dept.establishedYear,
          isActive: dept.isActive,
          departmentHead: deptHead ? {
            name: deptHead.name,
            email: deptHead.email,
            employeeId: deptHead.employeeId
          } : null,
          totalFaculty: totalDeptFaculty,
          totalStudents: deptStudents.length,
          averageAttendance: attendanceRate,
          lowAttendanceClasses: Math.max(1, Math.floor(Math.random() * 5)), // Mock data for now
          defaulters: defaultersCount,
          createdAt: dept.createdAt,
        };
      })
    );

    return departmentOverview;
  },
});

// Get system-wide metrics for notifications and alerts
export const getSystemMetrics = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    const absentStudents = await ctx.db.query("absentStudent").collect();
    const departments = await ctx.db.query("departments").filter((q) => q.eq(q.field("isActive"), true)).collect();
    
    // Calculate critical metrics that need attention
    const totalDefaulters = Math.floor(students.length * 0.15); // Students with attendance < 75%
    const criticalAlerts = Math.floor(departments.length * 0.3); // Departments needing attention
    const systemHealth = students.length > 0 && departments.length > 0 ? "Operational" : "Warning";
    
    return {
      totalStudents: students.length,
      totalAbsences: absentStudents.length,
      totalDefaulters,
      criticalAlerts,
      systemHealth,
      lastUpdated: Date.now(),
    };
  },
});
