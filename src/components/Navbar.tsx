"use client";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState<{ name: string; email: string }>(null);
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      try {
        const loggedInUser = await account.get();
        if (loggedInUser) {
          setUser({ name: loggedInUser.name, email: loggedInUser.email });
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await account.deleteSession("current");
    router.push("/");
  };
  return (
    <div className="sticky top-0 left-0 w-screen px-8 py-2 flex items-center bg-white shadow-md gap-4">
      <div className="flex items-center gap-4 flex-1/4">
        <h1 className="font-bold text-lg text-blue-500">{"Hello ! "}</h1>
        <span className="font-semibold text-md text-black/90">
          <Link className="cursor-pointer text-sm" href="/home">
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
