import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getPolicy = query({
  args: { policyId: v.id("policies") },
  handler: async (ctx, { policyId }) => {
    const policy = await ctx.db.get(policyId);
    if (!policy) throw new Error("Policy not found");
    return policy;
  },
});

export const getPolicies = query({
  handler: async (ctx) => {
    const policies = await ctx.db
      .query("policies")
      .withIndex("by_creation_time")
      .order("desc")
      .collect();
    return policies;
  },
});

export const getExpiredPolicies = query({
  handler: async (ctx) => {
    const result = await ctx.db
      .query("policies")
      .withIndex("by_creation_time")
      .order("asc")
      .collect();

    const policies: {
      _id: Id<"policies">;
      registeredOwnerName: string;
      vehicleUsedOwnerName: string;
      vehicleRegistrationNumber: string;
      customerMobileNumber: string;
      policyStartDate: string;
      policyEndDate: string;
      daysLeft: number;
      status: string;
    }[] = [];

    result.forEach((policy) => {
      const sDate1 = new Date(policy.policyEndDate);
      const sDate2 = new Date();

      sDate1.setHours(0, 0, 0, 0);
      sDate2.setHours(0, 0, 0, 0);

      //@ts-expect-error: diffTime is not in the type
      const diffTime = Math.floor((sDate1 - sDate2) / 86400000);

      if (diffTime <= 10) {
        policies.push({
          _id: policy._id,
          registeredOwnerName: policy.registeredOwnerName,
          vehicleUsedOwnerName: policy.vehicleUsedOwnerName,
          vehicleRegistrationNumber: policy.vehicleRegistrationNumber,
          customerMobileNumber: policy.customerMobileNumber,
          policyStartDate: policy.date,
          policyEndDate: policy.policyEndDate,
          daysLeft: diffTime,
          status: diffTime <= 0 ? "expired" : "near",
        });
      }
    });
    return policies;
  },
});

export const updatePolicy = mutation({
  args: {
    id: v.id("policies"),
    date: v.string(),
    registeredOwnerName: v.string(),
    vehicleUsedOwnerName: v.string(),
    policyEndDate: v.string(),
    vehicleManufacturingYear: v.string(),
    vehicleRegistrationNumber: v.string(),
    customerMobileNumber: v.string(),
    vehicleModel: v.string(),
    anyVehicleWork: v.string(),
    insuranceCompany: v.string(),
    insuranceAgency: v.string(),
    totalPremium: v.number(),
    netPremium: v.number(),
    idv: v.number(),
    cmCollectAmount: v.number(),
    paidAgency: v.number(),
    agentPayout: v.number(),
    netPayout: v.number(),
    directCmorAgent: v.string(),
    fileUrl: v.union(v.string(), v.literal("")),
    customerFileUrl: v.union(v.string(), v.literal("")),
    storageId: v.union(v.id("_storage"), v.literal("")),
    customerStorageId: v.union(v.id("_storage"), v.literal("")),
    newFile: v.boolean(),
    newCustomerFile: v.boolean(),
    oldFile: v.union(v.id("_storage"), v.literal("")),
    oldCustomerFile: v.union(v.id("_storage"), v.literal("")),
  },
  handler: async (ctx, { id, ...args }) => {
    let fileUrl = args.fileUrl;
    if (args.newFile) {
      if (args.oldFile) {
        await ctx.storage.delete(args.oldFile as Id<"_storage">);
      }

      const url = await ctx.storage.getUrl(args.storageId as Id<"_storage">);
      fileUrl = url || args.fileUrl;
    }

    let customerFileUrl = args.customerFileUrl;
    if (args.newCustomerFile) {
      if (args.oldCustomerFile) {
        await ctx.storage.delete(args.oldCustomerFile as Id<"_storage">);
      }

      const url = await ctx.storage.getUrl(
        args.customerStorageId as Id<"_storage">
      );
      customerFileUrl = url || args.customerFileUrl;
    }

    console.log(args);
    const updatedPolicy = await ctx.db.patch(id, {
      date: args.date,
      registeredOwnerName: args.registeredOwnerName,
      vehicleUsedOwnerName: args.vehicleUsedOwnerName,
      policyEndDate: args.policyEndDate,
      vehicleManufacturingYear: args.vehicleManufacturingYear,
      vehicleRegistrationNumber: args.vehicleRegistrationNumber,
      customerMobileNumber: args.customerMobileNumber,
      vehicleModel: args.vehicleModel,
      anyVehicleWork: args.anyVehicleWork,
      insuranceCompany: args.insuranceCompany,
      insuranceAgency: args.insuranceAgency,
      totalPremium: args.totalPremium,
      netPremium: args.netPremium,
      idv: args.idv,
      cmCollectAmount: args.cmCollectAmount,
      paidAgency: args.paidAgency,
      agentPayout: args.agentPayout,
      netPayout: args.netPayout,
      directCmorAgent: args.directCmorAgent,
      fileUrl,
      customerFileUrl,
      storageId: args.storageId,
      customerStorageId: args.customerStorageId,
    });
    return updatedPolicy;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createPolicy = mutation({
  args: {
    date: v.string(),
    registeredOwnerName: v.string(),
    vehicleUsedOwnerName: v.string(),
    policyEndDate: v.string(),
    vehicleManufacturingYear: v.string(),
    vehicleRegistrationNumber: v.string(),
    customerMobileNumber: v.string(),
    vehicleModel: v.string(),
    anyVehicleWork: v.string(),
    insuranceCompany: v.string(),
    insuranceAgency: v.string(),
    totalPremium: v.number(),
    netPremium: v.number(),
    idv: v.number(),
    cmCollectAmount: v.number(),
    paidAgency: v.number(),
    agentPayout: v.number(),
    netPayout: v.number(),
    directCmorAgent: v.string(),
    fileUrl: v.union(v.string(), v.literal("")),
    customerFileUrl: v.union(v.string(), v.literal("")),
    storageId: v.union(v.id("_storage"), v.literal("")),
    customerStorageId: v.union(v.id("_storage"), v.literal("")),
  },
  handler: async (ctx, args) => {
    //check if vehicle model already exists
    const vehicleModel = await ctx.db
      .query("vehicleModels")
      .filter((q) => q.eq(q.field("name"), args.vehicleModel))
      .first();

    //add vehicle model if it does not exist
    if (!vehicleModel) {
      await ctx.db.insert("vehicleModels", {
        name: args.vehicleModel,
      });
    }

    let fileUrl = "";
    if (args.storageId) {
      const url = await ctx.storage.getUrl(args.storageId);
      fileUrl = url || "";
    }

    let customerFileUrl = "";
    if (args.customerStorageId) {
      const url = await ctx.storage.getUrl(args.customerStorageId);
      customerFileUrl = url || "";
    }

    const policy = await ctx.db.insert("policies", {
      ...args,
      fileUrl,
      customerFileUrl,
    });

    return policy;
  },
});

export const deletePolicy = mutation({
  args: { id: v.id("policies") },
  handler: async (ctx, { id }) => {
    const policy = await ctx.db.get(id);

    if (policy?.storageId) {
      await ctx.storage.delete(policy?.storageId as Id<"_storage">);
    }

    if (policy?.customerStorageId) {
      await ctx.storage.delete(policy?.customerStorageId as Id<"_storage">);
    }
    await ctx.db.delete(id);
    return id;
  },
});
