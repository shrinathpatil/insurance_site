import AddPolicy from "@/components/Addpolicy";
import { IdCard } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Policy",
  description: "create new policy",
};

const SavePolicyPage = () => {
  return (
    <div className="w-screen my-4">
      <h1 className="ml-8 text-lg text-black/80 hover:text-black flex items-center gap-4 font-bold cursor-pointer">
        Create New Policy Details
        <IdCard size={24} color="gray" className="hover:stroke-blue-400" />
      </h1>
      <AddPolicy />
    </div>
  );
};
export default SavePolicyPage;
