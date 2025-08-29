import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Existing faculty table (from the current structure)
  faculty: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.number(),
    branch: v.string(),
    organization: v.string(),
    picture: v.string(),
    qualification: v.string(),
  }),

  // Existing students table (from the current structure)
  students: defineTable({
    // Add student fields as needed
  }),

  // New departments table
  departments: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    code: v.string(), // Unique department code like "CSE", "IT", etc.
    establishedYear: v.optional(v.number()),
    headOfDepartment: v.optional(v.string()), // Department head name
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"])
    .index("by_created_at", ["createdAt"]),

  // New department heads table
  departmentHeads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    employeeId: v.string(), // Unique employee ID
    uniqueId: v.string(), // Auto-generated unique ID based on name
    departmentId: v.id("departments"),
    managementEnabled: v.boolean(), // Toggle for management access
    qualification: v.optional(v.string()),
    experience: v.optional(v.number()), // Years of experience
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    lastActiveAt: v.number(), // Last time they were active/toggled
  })
    .index("by_email", ["email"])
    .index("by_employee_id", ["employeeId"])
    .index("by_unique_id", ["uniqueId"])
    .index("by_department", ["departmentId"])
    .index("by_active", ["isActive"])
    .index("by_management_enabled", ["managementEnabled"])
    .index("by_created_at", ["createdAt"])
    .index("by_last_active", ["lastActiveAt"]),
});
