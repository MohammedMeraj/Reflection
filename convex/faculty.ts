import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to generate unique faculty ID
const generateFacultyId = (name: string, email: string): string => {
  const namePrefix = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  const emailPrefix = email.split('@')[0].slice(0, 3).toUpperCase();
  const currentYear = new Date().getFullYear();
  return `FAC_${namePrefix}${emailPrefix}_${currentYear}`;
};

// Check faculty ID uniqueness
export const checkFacultyIdUniqueness = query({
  args: { 
    name: v.string(), 
    email: v.string() 
  },
  handler: async (ctx, args) => {
    const facultyId = generateFacultyId(args.name, args.email);
    
    // Check if ID already exists
    const existingFaculty = await ctx.db
      .query("departmentFaculty")
      .filter((q) => q.eq(q.field("facultyId"), facultyId))
      .first();
    
    return {
      id: facultyId,
      isUnique: !existingFaculty
    };
  },
});

// Create new faculty
export const createFaculty = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    assignedClasses: v.array(v.id("classes")),
    departmentId: v.optional(v.id("departments")),
    qualification: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const facultyId = generateFacultyId(args.name, args.email);
    
    // Check if ID already exists
    const existingFaculty = await ctx.db
      .query("departmentFaculty")
      .filter((q) => q.eq(q.field("facultyId"), facultyId))
      .first();
    
    if (existingFaculty) {
      throw new Error("Faculty ID already exists. Please try with different details.");
    }

    // Check if email already exists
    const existingEmail = await ctx.db
      .query("departmentFaculty")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    
    if (existingEmail) {
      throw new Error("Email already exists. Please use a different email.");
    }

    const now = Date.now();
    
    return await ctx.db.insert("departmentFaculty", {
      name: args.name,
      email: args.email,
      facultyId,
      departmentId: args.departmentId,
      assignedClasses: args.assignedClasses,
      assignedDivisions: [],
      isClassCoordinator: false,
      qualification: args.qualification,
      isActive: true,
      createdAt: now,
    });
  },
});

// Update faculty
export const updateFaculty = mutation({
  args: {
    id: v.id("departmentFaculty"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    assignedClasses: v.optional(v.array(v.id("classes"))),
    assignedDivisions: v.optional(v.array(v.id("divisions"))),
    qualification: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If email is being updated, check uniqueness
    if (updates.email) {
      const existingEmail = await ctx.db
        .query("departmentFaculty")
        .filter((q) => 
          q.and(
            q.eq(q.field("email"), updates.email),
            q.neq(q.field("_id"), id)
          )
        )
        .first();
      
      if (existingEmail) {
        throw new Error("Email already exists. Please use a different email.");
      }
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete faculty
export const deleteFaculty = mutation({
  args: { id: v.id("departmentFaculty") },
  handler: async (ctx, args) => {
    const faculty = await ctx.db.get(args.id);
    if (!faculty) {
      throw new Error("Faculty not found");
    }

    // If faculty is a CC, remove them from classes/divisions
    if (faculty.isClassCoordinator && faculty.coordinatorFor) {
      if (faculty.coordinatorFor.type === "class") {
        await ctx.db.patch(faculty.coordinatorFor.classId, {
          classCoordinatorId: undefined,
          updatedAt: Date.now(),
        });
      } else if (faculty.coordinatorFor.type === "division") {
        await ctx.db.patch(faculty.coordinatorFor.divisionId, {
          classCoordinatorId: undefined,
          updatedAt: Date.now(),
        });
      }
    }

    return await ctx.db.delete(args.id);
  },
});

// Assign faculty as class coordinator
export const assignClassCoordinator = mutation({
  args: {
    facultyId: v.id("departmentFaculty"),
    target: v.union(
      v.object({
        type: v.literal("class"),
        classId: v.id("classes")
      }),
      v.object({
        type: v.literal("division"),
        divisionId: v.id("divisions")
      })
    )
  },
  handler: async (ctx, args) => {
    console.log("🔄 assignClassCoordinator called with:", JSON.stringify(args, null, 2));
    
    const faculty = await ctx.db.get(args.facultyId);
    if (!faculty) {
      throw new Error("Faculty not found");
    }

    console.log("👤 Found faculty:", faculty.name);

    // Check if target already has a coordinator
    if (args.target.type === "class") {
      const existingClass = await ctx.db.get(args.target.classId);
      if (!existingClass) {
        throw new Error("Class not found");
      }
      if (existingClass?.classCoordinatorId) {
        throw new Error("This class already has a coordinator");
      }
      console.log("🎓 Assigning to class:", existingClass.name);
    } else {
      const existingDivision = await ctx.db.get(args.target.divisionId);
      if (!existingDivision) {
        throw new Error("Division not found");
      }
      if (existingDivision?.classCoordinatorId) {
        throw new Error("This division already has a coordinator");
      }
      console.log("📚 Assigning to division:", existingDivision.name);
    }

    // Update faculty as coordinator
    await ctx.db.patch(args.facultyId, {
      isClassCoordinator: true,
      coordinatorFor: args.target,
      updatedAt: Date.now(),
    });

    // Update class or division with coordinator
    if (args.target.type === "class") {
      await ctx.db.patch(args.target.classId, {
        classCoordinatorId: args.facultyId,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.target.divisionId, {
        classCoordinatorId: args.facultyId,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Remove faculty as class coordinator
export const removeClassCoordinator = mutation({
  args: { facultyId: v.id("departmentFaculty") },
  handler: async (ctx, args) => {
    const faculty = await ctx.db.get(args.facultyId);
    if (!faculty || !faculty.isClassCoordinator) {
      throw new Error("Faculty is not a coordinator");
    }

    // Remove from class or division
    if (faculty.coordinatorFor) {
      if (faculty.coordinatorFor.type === "class") {
        await ctx.db.patch(faculty.coordinatorFor.classId, {
          classCoordinatorId: undefined,
          updatedAt: Date.now(),
        });
      } else if (faculty.coordinatorFor.type === "division") {
        await ctx.db.patch(faculty.coordinatorFor.divisionId, {
          classCoordinatorId: undefined,
          updatedAt: Date.now(),
        });
      }
    }

    // Update faculty
    await ctx.db.patch(args.facultyId, {
      isClassCoordinator: false,
      coordinatorFor: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get all faculty with coordinator info
export const getAllFaculty = query({
  args: { departmentId: v.optional(v.id("departments")) },
  handler: async (ctx, args) => {
    let faculty = await ctx.db
      .query("departmentFaculty")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Filter by department if specified
    if (args.departmentId) {
      faculty = faculty.filter(f => f.departmentId === args.departmentId);
    }

    // Get coordinator information
    const facultyWithInfo = await Promise.all(
      faculty.map(async (fac) => {
        let coordinatorInfo = null;
        
        if (fac.isClassCoordinator && fac.coordinatorFor) {
          if (fac.coordinatorFor.type === "class") {
            const classInfo = await ctx.db.get(fac.coordinatorFor.classId);
            coordinatorInfo = {
              type: "class" as const,
              name: classInfo?.name,
              year: classInfo?.year,
              classId: classInfo?.classId
            };
          } else {
            const divisionInfo = await ctx.db.get(fac.coordinatorFor.divisionId);
            if (divisionInfo) {
              const classInfo = await ctx.db.get(divisionInfo.classId);
              coordinatorInfo = {
                type: "division" as const,
                name: `${classInfo?.name} - Division ${divisionInfo.name}`,
                year: classInfo?.year,
                divisionId: divisionInfo.divisionId
              };
            }
          }
        }

        // Get assigned classes info
        const assignedClassesInfo = await Promise.all(
          fac.assignedClasses.map(async (classId: any) => {
            const classInfo = await ctx.db.get(classId);
            return classInfo ? {
              id: classInfo._id,
              name: classInfo.name,
              year: classInfo.year,
              classId: classInfo.classId
            } : null;
          })
        );

        return {
          ...fac,
          coordinatorInfo,
          assignedClassesInfo: assignedClassesInfo.filter(Boolean)
        };
      })
    );

    return facultyWithInfo;
  },
});

// Get available faculty for coordinator assignment
export const getAvailableFacultyForCC = query({
  args: { departmentId: v.optional(v.id("departments")) },
  handler: async (ctx, args) => {
    let availableFaculty = await ctx.db
      .query("departmentFaculty")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("isClassCoordinator"), false)
        )
      )
      .collect();

    // Filter by department if specified
    if (args.departmentId) {
      availableFaculty = availableFaculty.filter(f => f.departmentId === args.departmentId);
    }

    return availableFaculty;
  },
});
