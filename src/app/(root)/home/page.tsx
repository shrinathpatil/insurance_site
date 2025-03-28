import ExpiredPolicies from "@/components/ExpiredPolicies";
import PolicyTable from "@/components/PolicyTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "this is insurance application for daily use!",
};
const HomePage = async () => {
  return (
    <>
      <div className="m-8 p-4 rounded-md border border-gray-200 ">
        <h1 className="text-lg text-black/90 font-bold my-2">Policy Details</h1>
        <PolicyTable />
      </div>
      <div className="m-8 p-4 rounded-md border border-gray-200 ">
        <h1 className="text-lg my-2 font-bold text-black/90">
          Policies Near Expiry
        </h1>
        <ExpiredPolicies />
      </div>
    </>
  );
};
export default HomePage;
