import { Skeleton } from "@/components/ui/skeleton";
import { IdCard } from "lucide-react";

const EditSkeleton = () => {
  return (
    <div className="w-screen my-4">
      <h1 className="ml-8 flex gap-4 items-center text-lg text-black/80 hover:text-black font-bold cursor-pointer">
        Create New Policy Details
        <IdCard size={24} color="gray" className="hover:stroke-blue-400" />
      </h1>

      <div className="rounded-xl border-gray-300 border mt-4 w-[96%] mx-auto p-8">
        <div className="grid grid-cols-2 grid-rows-8 gap-x-4 gap-y-16">
          {Array(16)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={`add-row-${index}`} className="h-[35px] w-full " />
            ))}
        </div>
      </div>
    </div>
  );
};
export default EditSkeleton;
