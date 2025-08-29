"use strict";
import {v} from "convex/values";
import { mutation, query } from "./_generated/server";

// 1) Mutation: Add an absent student record to the 'absentStudent' table
export const addAbsentStudent = mutation({
  args: {
    prn: v.number(),
    subject: v.string(),
    lectureNumber: v.number(),
    facultyid:v.string(),
    class:v.string(),
    division:v.string(),
    sessionType:v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("absentStudent", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// 2) Mutation: Add a record to the 'students' table
export const addStudent = mutation({
  args: {
    rollNo: v.number(),
    organization: v.string(),
    prn: v.number(),
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    currentClass: v.number(),
    currentDivision: v.string(),
    phone: v.number(),
    branch: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("students", args);
  },
});

// 3) Query: Get all students
export const getAllStudents = query({
  handler: async (ctx) => {
    return await ctx.db.query("students").collect();
  },
});

// 4) Query: Get absent students by faculty
export const getAbsentStudentsByFaculty = query({
  args: { facultyid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("absentStudent")
      .filter((q) => q.eq(q.field("facultyid"), args.facultyid))
      .collect();
  },
});

// 5) Query: Get absent students by class and division
export const getAbsentStudentsByClass = query({
  args: { 
    class: v.string(),
    division: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("absentStudent")
      .filter((q) => q.and(
        q.eq(q.field("class"), args.class),
        q.eq(q.field("division"), args.division)
      ))
      .collect();
  },
});

// 6) Query: Get student by PRN
export const getStudentByPRN = query({
  args: { prn: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("prn"), args.prn))
      .first();
  },
});