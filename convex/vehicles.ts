import { query } from "./_generated/server";

export const getVehicleModels = query({
  handler: async (ctx) => {
    const user = await ctx.db.query("vehicleModels").collect();
    return user;
  },
});
