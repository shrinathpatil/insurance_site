import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  policies: defineTable({
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
    customerFileUrl: v.union(v.string(), v.literal("")),
    fileUrl: v.union(v.string(), v.literal("")),
    customerStorageId: v.union(v.id("_storage"), v.literal("")),
    storageId: v.union(v.id("_storage"), v.literal("")),
  }),
  vehicleModels: defineTable({
    name: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
  }),
});
