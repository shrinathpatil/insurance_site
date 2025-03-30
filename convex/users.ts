import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const loginUser = query({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(
        (q) =>
          q.eq(q.field("email"), args.email) && q.eq(q.field("role"), "admin")
      )
      .first();
    if (!user) {
      const e = new Error();
      e.message = "User not found!";
      e.name = "UserNotFoundError";
      throw e;
    }
    if (user.password !== args.password) {
      const e = new Error();
      e.message = "Invalid credentials";
      e.name = "InvalidCredentialsError";
      throw e;
    }
    return user;
  },
});
