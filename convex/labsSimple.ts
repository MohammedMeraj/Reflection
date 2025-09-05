import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new lab
export const createLab = mutation({
  args: {
    name: v.string(),
    labId: v.string(),
    classId: v.optional(v.id("classes")),
    divisionId: v.optional(v.id("divisions")),
    rollNumberStart: v.number(),
    rollNumberEnd: v.number(),
    year: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    departmentId: v.id("departments"),  // Bind to department
  },
  handler: async (ctx, args) => {
    // Check for overlapping roll numbers in the same context (class or division)
    const existingLabs = await ctx.db.query("labs").collect();
    
    const contextLabs = existingLabs.filter(lab => {
      if (args.divisionId) {
        return lab.divisionId === args.divisionId;
      } else if (args.classId) {
        return lab.classId === args.classId && !lab.divisionId;
      }
      return false;
    });

    // Check for overlapping roll numbers
    const hasOverlap = contextLabs.some(lab => 
      (args.rollNumberStart >= lab.rollNumberStart && args.rollNumberStart <= lab.rollNumberEnd) ||
      (args.rollNumberEnd >= lab.rollNumberStart && args.rollNumberEnd <= lab.rollNumberEnd) ||
      (args.rollNumberStart <= lab.rollNumberStart && args.rollNumberEnd >= lab.rollNumberEnd)
    );

    if (hasOverlap) {
      throw new Error("Roll number range overlaps with existing lab");
    }

    // Get class and division names for the lab
    let className = "";
    let divisionName = "";

    if (args.classId) {
      const classDoc = await ctx.db.get(args.classId);
      className = classDoc?.name || "";
    }

    if (args.divisionId) {
      const divisionDoc = await ctx.db.get(args.divisionId);
      divisionName = divisionDoc?.name || "";
      
      // If we have a division, get the class name from the division's class
      if (divisionDoc?.classId) {
        const classDoc = await ctx.db.get(divisionDoc.classId);
        className = classDoc?.name || "";
      }
    }

    // Create the lab
    const labId = await ctx.db.insert("labs", {
      ...args,
      className,
      divisionName,
    });

    return labId;
  },
});

// Get all labs with enhanced data
export const getAllLabs = query({
  args: {},
  handler: async (ctx) => {
    const labs = await ctx.db.query("labs").collect();
    
    // Enhance each lab with class and division names
    const enhancedLabs = await Promise.all(
      labs.map(async (lab) => {
        let className = lab.className || "";
        let divisionName = lab.divisionName || "";

        // If we don't have cached names, fetch them
        if (!className && lab.classId) {
          const classDoc = await ctx.db.get(lab.classId);
          className = classDoc?.name || "";
        }

        if (!divisionName && lab.divisionId) {
          const divisionDoc = await ctx.db.get(lab.divisionId);
          divisionName = divisionDoc?.name || "";
        }

        return {
          ...lab,
          className,
          divisionName,
        };
      })
    );

    // Sort by creation date (newest first)
    return enhancedLabs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get labs by department ID
export const getLabsByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const labs = await ctx.db
      .query("labs")
      .filter(q => q.eq(q.field("departmentId"), args.departmentId))
      .collect();
    
    // Enhance each lab with class and division names
    const enhancedLabs = await Promise.all(
      labs.map(async (lab) => {
        let className = lab.className || "";
        let divisionName = lab.divisionName || "";

        // If we don't have cached names, fetch them
        if (!className && lab.classId) {
          const classDoc = await ctx.db.get(lab.classId);
          className = classDoc?.name || "";
        }

        if (!divisionName && lab.divisionId) {
          const divisionDoc = await ctx.db.get(lab.divisionId);
          divisionName = divisionDoc?.name || "";
        }

        return {
          ...lab,
          className,
          divisionName,
        };
      })
    );

    // Sort by creation date (newest first)
    return enhancedLabs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get labs for a specific class
export const getLabsByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const labs = await ctx.db
      .query("labs")
      .filter(q => q.eq(q.field("classId"), args.classId))
      .collect();

    return labs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get labs for a specific division
export const getLabsByDivision = query({
  args: { divisionId: v.id("divisions") },
  handler: async (ctx, args) => {
    const labs = await ctx.db
      .query("labs")
      .filter(q => q.eq(q.field("divisionId"), args.divisionId))
      .collect();

    return labs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Update a lab
export const updateLab = mutation({
  args: {
    labId: v.id("labs"),
    name: v.optional(v.string()),
    rollNumberStart: v.optional(v.number()),
    rollNumberEnd: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { labId, ...updates } = args;
    
    // If updating roll numbers, check for overlaps
    if (updates.rollNumberStart !== undefined || updates.rollNumberEnd !== undefined) {
      const lab = await ctx.db.get(labId);
      if (!lab) throw new Error("Lab not found");

      const newStart = updates.rollNumberStart ?? lab.rollNumberStart;
      const newEnd = updates.rollNumberEnd ?? lab.rollNumberEnd;

      // Check for overlaps with other labs in the same context
      const existingLabs = await ctx.db.query("labs").collect();
      const contextLabs = existingLabs.filter(l => {
        if (l._id === labId) return false; // Exclude current lab
        
        if (lab.divisionId) {
          return l.divisionId === lab.divisionId;
        } else if (lab.classId) {
          return l.classId === lab.classId && !l.divisionId;
        }
        return false;
      });

      const hasOverlap = contextLabs.some(l => 
        (newStart >= l.rollNumberStart && newStart <= l.rollNumberEnd) ||
        (newEnd >= l.rollNumberStart && newEnd <= l.rollNumberEnd) ||
        (newStart <= l.rollNumberStart && newEnd >= l.rollNumberEnd)
      );

      if (hasOverlap) {
        throw new Error("Updated roll number range overlaps with existing lab");
      }
    }

    await ctx.db.patch(labId, updates);
    return labId;
  },
});

// Delete a lab
export const deleteLab = mutation({
  args: { labId: v.id("labs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.labId);
    return true;
  },
});

// Get available roll number range for a class/division
export const getAvailableRollRange = query({
  args: { 
    classId: v.optional(v.id("classes")),
    divisionId: v.optional(v.id("divisions"))
  },
  handler: async (ctx, args) => {
    const existingLabs = await ctx.db.query("labs").collect();
    
    const contextLabs = existingLabs.filter(lab => {
      if (args.divisionId) {
        return lab.divisionId === args.divisionId;
      } else if (args.classId) {
        return lab.classId === args.classId && !lab.divisionId;
      }
      return false;
    });

    if (contextLabs.length === 0) {
      return { nextStart: 1, suggestedEnd: 30 };
    }

    const maxEnd = Math.max(...contextLabs.map(lab => lab.rollNumberEnd));
    const nextStart = maxEnd + 1;
    
    return { 
      nextStart, 
      suggestedEnd: nextStart + 29,
      existingRanges: contextLabs.map(lab => ({
        name: lab.name,
        start: lab.rollNumberStart,
        end: lab.rollNumberEnd
      }))
    };
  },
});
