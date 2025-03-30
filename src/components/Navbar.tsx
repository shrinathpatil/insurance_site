"use client";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";

const Navbar = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      try {
        const loggedUser = localStorage.getItem("convex-loggedIn-user");
        if (!loggedUser) {
          console.log(loggedUser);
          // router.push("/");
        } else {
          const userDetails = await fetchQuery(api.users.getUser, {
            userId: loggedUser as Id<"users">,
          });
          if (userDetails) {
            setUser({ name: userDetails.name, email: userDetails.email });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("convex-loggedIn-user");
    toast.success("Logged out successfully!");
    router.push("/");
  };
  return (
    <div className="sticky z-20 top-0 left-0 w-screen px-8 py-2 flex items-center bg-white shadow-md gap-4">
      <div className="flex items-center gap-4 flex-1/4">
        <h1 className="font-bold text-lg text-blue-500">{"Hello ! "}</h1>
        <span className="font-semibold text-md text-black/90">
          <Link className="cursor-pointer text-sm capitalize" href="/home">
            {user && user?.name}
          </Link>
        </span>
      </div>

      <div className="flex items-center gap-8 flex-1/4 justify-end">
        <Link
          className="cursor-pointer text-sm font-semibold"
          href="/policy/add"
          title="save policy"
        >
          Create New Policy
        </Link>
        <span title="logout" onClick={handleLogout}>
          <LogOutIcon size={24} color="red" className="cursor-pointer" />
        </span>
      </div>
    </div>
  );
};
export default Navbar;
