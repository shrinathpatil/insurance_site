import EditPolicy from "@/components/EditPolicy";
import { fetchQuery } from "convex/nextjs";
import { Edit } from "lucide-react";
import { Metadata } from "next";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export const metadata: Metadata = {
  title: "Edit Policy",
  description: "edit policy ...",
};

const EditPolicyPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await fetchQuery(api.policies.getPolicy, {
    policyId: id as Id<"policies">,
  });

  return (
    <div className="w-screen my-4">
      <h1 className="ml-8 flex gap-4 items-center text-lg text-black/80 hover:text-black font-bold cursor-pointer">
        Edit Policy
        <Edit size={24} color="gray" className="hover:stroke-blue-400" />
      </h1>
      <EditPolicy policy={data} />
    </div>
  );
};
export default EditPolicyPage;
