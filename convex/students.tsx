"use strict";
import {v} from "convex/values";
import { mutation } from "./_generated/server";

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
    return await ctx.db.insert("absentStudent", args);
  },
});

// 2) Mutation: Add a record to the 'allAtudents' table
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