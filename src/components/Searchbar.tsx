import { SearchIcon } from "lucide-react";

const Searchbar = () => {
  return (
    <div className="flex items-center  rounded-md border border-gray-200 px-4 gap-2">
      <SearchIcon size={24} color="#dedede" className="cursor-pointer" />
      <input
        type="text"
        placeholder="Search For Policy"
        className="w-full py-2 px-2 outline-none text-sm text-gray-400"
      />
    </div>
  );
};
export default Searchbar;
