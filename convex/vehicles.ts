import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getVehicleModels = query({
  handler: async (ctx) => {
    const user = await ctx.db.query("vehicleModels").collect();
    return user;
  },
});
