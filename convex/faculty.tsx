"use strict"
import {v} from "convex/values";
import { mutation } from "./_generated/server";

export const addFaculty = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.number(),
    branch: v.string(),
    organization: v.string(),
    picture: v.string(),
    qualification: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("faculty", args);
  },
});