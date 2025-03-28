import EditPolicy from "@/components/EditPolicy";
import { DatabaseId, PolicyCollectionId } from "@/constants";
import { databases } from "@/lib/appwrite";
import { Edit } from "lucide-react";
import { Metadata } from "next";

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

  const data = await databases.getDocument(DatabaseId, PolicyCollectionId, id);

  const policyData = {
    id: data.$id,
    date: data.date,
    registeredOwnerName: data.registeredOwnerName,
    vehicleUsedOwnerName: data.vehicleUsedOwnerName,
    policyEndDate: data.policyEndDate,
    vehicleManufacturingYear: data.vehicleManufacturingYear,
    vehicleRegistrationNumber: data.vehicleRegistrationNumber,
    customerMobileNumber: data.customerMobileNumber,
    vehicleModel: data.vehicleModel,
    anyVehicleWork: data.anyVehicleWork,
    insuranceCompany: data.insuranceCompany,
    insuranceAgency: data.insuranceAgency,
    totalPremium: data.totalPremium,
    netPremium: data.netPremium,
    idv: data.idv,
    cmCollectAmount: data.cmCollectAmount,
    paidAgency: data.paidAgency,
    agentPayout: data.agentPayout,
    netPayout: data.netPayout,
    directCmorAgent: data.directCmorAgent,
    fileId: data.fileId,
  };

  return (
    <div className="w-screen my-4">
      <h1 className="ml-8 flex gap-4 items-center text-lg text-black/80 hover:text-black font-bold cursor-pointer">
        Edit Policy
        <Edit size={24} color="gray" className="hover:stroke-blue-400" />
      </h1>
      <EditPolicy policy={policyData} />
    </div>
  );
};
export default EditPolicyPage;
