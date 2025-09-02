import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all classes with their divisions
export const getAllClasses = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    
    // For each class, get its divisions
    const classesWithDivisions = await Promise.all(
      classes.map(async (cls) => {
        const divisions = await ctx.db
          .query("divisions")
          .filter(q => q.eq(q.field("classId"), cls._id))
          .collect();

        return {
          ...cls,
          divisions: divisions || [],
        };
      })
    );

    return classesWithDivisions.sort((a, b) => b.year - a.year);
  },
});

// Create a new class
export const createClass = mutation({
  args: {
    name: v.string(),
    year: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate unique class ID
    const namePrefix = args.name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
    const classId = `CLS_${namePrefix}_${args.year}`;

    // Check if class already exists
    const existing = await ctx.db
      .query("classes")
      .filter(q => q.eq(q.field("name"), args.name))
      .filter(q => q.eq(q.field("year"), args.year))
      .first();

    if (existing) {
      throw new Error("Class with this name and year already exists");
    }

    const newClassId = await ctx.db.insert("classes", {
      ...args,
      classId,
      isActive: true,
      createdAt: Date.now(),
    });

    return newClassId;
  },
});

// Create a new division for a class
export const createDivision = mutation({
  args: {
    classId: v.id("classes"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the class
    const cls = await ctx.db.get(args.classId);
    if (!cls) {
      throw new Error("Class not found");
    }

    // Check if division already exists in this class
    const existing = await ctx.db
      .query("divisions")
      .filter(q => q.eq(q.field("classId"), args.classId))
      .filter(q => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      throw new Error("Division already exists in this class");
    }

    // Generate unique division ID
    const divisionId = `DIV_${cls.classId}_${args.name.toUpperCase()}`;

    const newDivisionId = await ctx.db.insert("divisions", {
      ...args,
      divisionId,
      isActive: true,
      createdAt: Date.now(),
    });

    return newDivisionId;
  },
});

// Get divisions for a specific class
export const getDivisionsByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const divisions = await ctx.db
      .query("divisions")
      .filter(q => q.eq(q.field("classId"), args.classId))
      .collect();

    return divisions.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Update class
export const updateClass = mutation({
  args: {
    classId: v.id("classes"),
    name: v.optional(v.string()),
    year: v.optional(v.number()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { classId, ...updates } = args;
    await ctx.db.patch(classId, updates);
    return classId;
  },
});

// Delete class
export const deleteClass = mutation({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    // First, delete all divisions in this class
    const divisions = await ctx.db
      .query("divisions")
      .filter(q => q.eq(q.field("classId"), args.classId))
      .collect();

    for (const division of divisions) {
      await ctx.db.delete(division._id);
    }

    // Delete all labs in this class
    const labs = await ctx.db
      .query("labs")
      .filter(q => q.eq(q.field("classId"), args.classId))
      .collect();

    for (const lab of labs) {
      await ctx.db.delete(lab._id);
    }

    // Finally, delete the class
    await ctx.db.delete(args.classId);
    return true;
  },
});

// Delete division
export const deleteDivision = mutation({
  args: { divisionId: v.id("divisions") },
  handler: async (ctx, args) => {
    // Delete all labs in this division
    const labs = await ctx.db
      .query("labs")
      .filter(q => q.eq(q.field("divisionId"), args.divisionId))
      .collect();

    for (const lab of labs) {
      await ctx.db.delete(lab._id);
    }

    // Delete the division
    await ctx.db.delete(args.divisionId);
    return true;
  },
});
