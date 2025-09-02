import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all subjects
export const getAllSubjects = query({
  args: {},
  handler: async (ctx) => {
    const subjects = await ctx.db.query("subjects").collect();
    return subjects;
  },
});

// Get subjects by department
export const getSubjectsByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    const subjects = await ctx.db
      .query("subjects")
      .filter((q) => q.eq(q.field("department"), args.department))
      .collect();
    return subjects;
  },
});

// Get subject by ID
export const getSubjectById = query({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    return subject;
  },
});

// Create a new subject
export const createSubject = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    credits: v.number(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate subject ID
    const namePrefix = args.name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    const codePrefix = args.code.replace(/\s+/g, '').toUpperCase();
    const subjectId = `SUB_${codePrefix}_${namePrefix}`;

    // Check if subject code already exists in the department
    const existingSubject = await ctx.db
      .query("subjects")
      .filter((q) => 
        q.and(
          q.eq(q.field("code"), args.code),
          q.eq(q.field("department"), args.department)
        )
      )
      .first();

    if (existingSubject) {
      throw new Error("Subject code already exists in this department");
    }

    const subject = await ctx.db.insert("subjects", {
      subjectId,
      name: args.name,
      code: args.code,
      credits: args.credits,
      department: args.department,
      isActive: true,
      createdAt: Date.now(),
    });

    return subject;
  },
});

// Update a subject
export const updateSubject = mutation({
  args: {
    id: v.id("subjects"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    credits: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Get the current subject
    const currentSubject = await ctx.db.get(id);
    if (!currentSubject) {
      throw new Error("Subject not found");
    }

    // If code is being updated, check for duplicates
    if (updates.code && updates.code !== currentSubject.code) {
      const existingSubject = await ctx.db
        .query("subjects")
        .filter((q) => 
          q.and(
            q.eq(q.field("code"), updates.code),
            q.eq(q.field("department"), currentSubject.department),
            q.neq(q.field("_id"), id)
          )
        )
        .first();

      if (existingSubject) {
        throw new Error("Subject code already exists in this department");
      }
    }

    // Generate new subject ID if relevant fields changed
    let newSubjectId = currentSubject.subjectId;
    if (updates.name || updates.code) {
      const name = updates.name || currentSubject.name;
      const code = updates.code || currentSubject.code;
      
      const namePrefix = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
      const codePrefix = code.replace(/\s+/g, '').toUpperCase();
      newSubjectId = `SUB_${codePrefix}_${namePrefix}`;
    }

    const updatedSubject = await ctx.db.patch(id, {
      ...updates,
      subjectId: newSubjectId,
    });

    return updatedSubject;
  },
});

// Delete a subject
export const deleteSubject = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    if (!subject) {
      throw new Error("Subject not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Toggle subject active status
export const toggleSubjectStatus = mutation({
  args: { 
    id: v.id("subjects"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    if (!subject) {
      throw new Error("Subject not found");
    }

    await ctx.db.patch(args.id, {
      isActive: args.isActive,
    });

    return { success: true };
  },
});

// Get subjects count by department
export const getSubjectsCount = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    const subjects = await ctx.db
      .query("subjects")
      .filter((q) => q.eq(q.field("department"), args.department))
      .collect();
    
    return {
      total: subjects.length,
      active: subjects.filter(s => s.isActive).length,
      inactive: subjects.filter(s => !s.isActive).length,
    };
  },
});
