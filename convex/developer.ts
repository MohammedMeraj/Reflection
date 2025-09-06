import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Generate a unique secret key for super admin
function generateSecretKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique institute ID
function generateInstituteId(): string {
  const prefix = 'INST';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}

// Create a new super admin
export const createSuperAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    institute: v.string(),
    accessActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingSuperAdmin = await ctx.db
      .query("superAdmins")
      .filter(q => q.eq(q.field("email"), args.email))
      .first();

    if (existingSuperAdmin) {
      throw new Error("Super admin with this email already exists");
    }

    // Generate unique institute ID and secret key
    const instituteId = generateInstituteId();
    const secretKey = generateSecretKey();

    const superAdminId = await ctx.db.insert("superAdmins", {
      ...args,
      instituteId,
      secretKey,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return superAdminId;
  },
});

// Get all super admins
export const getAllSuperAdmins = query({
  args: {},
  handler: async (ctx) => {
    const superAdmins = await ctx.db.query("superAdmins").collect();
    
    // Sort by creation date (newest first)
    return superAdmins.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get super admin by ID
export const getSuperAdminById = query({
  args: { id: v.id("superAdmins") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update super admin
export const updateSuperAdmin = mutation({
  args: {
    id: v.id("superAdmins"),
    name: v.string(),
    email: v.string(),
    institute: v.string(),
    accessActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;

    // Check if email already exists for other super admins
    const existingSuperAdmin = await ctx.db
      .query("superAdmins")
      .filter(q => q.and(
        q.eq(q.field("email"), args.email),
        q.neq(q.field("_id"), id)
      ))
      .first();

    if (existingSuperAdmin) {
      throw new Error("Another super admin with this email already exists");
    }

    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Toggle super admin access
export const toggleSuperAdminAccess = mutation({
  args: {
    id: v.id("superAdmins"),
    accessActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      accessActive: args.accessActive,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Delete super admin
export const deleteSuperAdmin = mutation({
  args: { id: v.id("superAdmins") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Regenerate secret key for super admin
export const regenerateSecretKey = mutation({
  args: { id: v.id("superAdmins") },
  handler: async (ctx, args) => {
    const newSecretKey = generateSecretKey();
    
    await ctx.db.patch(args.id, {
      secretKey: newSecretKey,
      updatedAt: Date.now(),
    });

    return newSecretKey;
  },
});

// Get super admin statistics
export const getSuperAdminStats = query({
  args: {},
  handler: async (ctx) => {
    const allSuperAdmins = await ctx.db.query("superAdmins").collect();
    
    const totalSuperAdmins = allSuperAdmins.length;
    const activeSuperAdmins = allSuperAdmins.filter(admin => admin.accessActive).length;
    const inactiveSuperAdmins = totalSuperAdmins - activeSuperAdmins;
    
    // Get unique institutes
    const uniqueInstitutes = new Set(allSuperAdmins.map(admin => admin.institute));
    const totalInstitutes = uniqueInstitutes.size;

    return {
      totalSuperAdmins,
      activeSuperAdmins,
      inactiveSuperAdmins,
      totalInstitutes,
    };
  },
});

// Developer Authentication Functions

// Create a new developer (for manual setup)
export const createDeveloper = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    password: v.string(),
    access: v.string(),
  },
  handler: async (ctx, args) => {
    const developerId = await ctx.db.insert("developers", {
      username: args.username,
      email: args.email,
      password: args.password,
      access: args.access,
    });
    
    return developerId;
  },
});

// Get developer by email and password
export const authenticateDeveloper = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const developer = await ctx.db
      .query("developers")
      .filter((q) => q.eq(q.field("email"), args.email))
      .filter((q) => q.eq(q.field("password"), args.password))
      .first();
    
    return developer;
  },
});

// Get developer by username and password (for login)
export const authenticateDeveloperByUsername = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const developer = await ctx.db
      .query("developers")
      .filter((q) => q.eq(q.field("username"), args.username))
      .filter((q) => q.eq(q.field("password"), args.password))
      .first();
    
    return developer;
  },
});

// Get all developers
export const getAllDevelopers = query({
  handler: async (ctx) => {
    const developers = await ctx.db.query("developers").collect();
    return developers;
  },
});

// Developer Logs Functions

// Create a new dev log entry
export const createDevLog = mutation({
  args: {
    developerId: v.id("developers"),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("devLogs", {
      developerId: args.developerId,
    });
    
    return logId;
  },
});

// Get all dev logs
export const getAllDevLogs = query({
  handler: async (ctx) => {
    const logs = await ctx.db.query("devLogs").collect();
    return logs;
  },
});

// Get dev logs by developer ID
export const getDevLogsByDeveloper = query({
  args: {
    developerId: v.id("developers"),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("devLogs")
      .filter((q) => q.eq(q.field("developerId"), args.developerId))
      .collect();
    
    return logs;
  },
});

// Manual setup function to add the default developer
export const setupDefaultDeveloper = mutation({
  handler: async (ctx) => {
    // Check if developer already exists
    const existingDeveloper = await ctx.db
      .query("developers")
      .filter((q) => q.eq(q.field("email"), "mdmomin7517@gmail.com"))
      .first();
    
    if (!existingDeveloper) {
      const developerId = await ctx.db.insert("developers", {
        username: "zmerajDeveloper",
        email: "mdmomin7517@gmail.com",
        password: "dev@IrreflexDeveloper@850128502",
        access: "totalControl",
      });
      
      return { success: true, developerId, message: "Default developer created successfully" };
    } else {
      return { success: false, message: "Developer already exists" };
    }
  },
});
