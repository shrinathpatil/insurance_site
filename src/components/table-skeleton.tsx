import { Skeleton } from "./ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="w-full  rounded-lg border border-gray-300">
      <div className=" flex flex-col justify-center">
        <div className="w-full px-4 py-2 flex items-center gap-x-4 hover:bg-gray-100/40  border-b border-gray-300 ">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={`cols-${index}`} className="w-full h-[30px]" />
            ))}
        </div>
        <div className="flex flex-col gap-y-2">
          {Array(5)
            .fill(0)
            .map((_, idx) => (
              <div
                key={`rows-${idx}`}
                className="w-full px-4 py-2 flex items-center gap-x-4  hover:bg-gray-100/40 "
              >
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={`cells-${i}`} className="w-full h-[30px]" />
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default TableSkeleton;
