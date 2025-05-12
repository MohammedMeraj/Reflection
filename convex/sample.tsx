import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const getSample=query({
   args:{
     email:v.string()
   },
   handler:async(ctx, args)=>{
    const result=await ctx.db.query('sample').filter((q)=>q.eq(q.field('email'),args.email)).collect()
   },
})
export const addSample=mutation({
    args:{
          name:v.string(),
          email:v.string(),
          phone:v.number()
    },
    handler:async (ctx, args)=>{
        return await ctx.db.insert("sample",args);
    }
    
})