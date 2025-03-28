"use client";
import Navbar from "@/components/Navbar";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await account.get();

        if (!user) {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };
    checkUser();
  }, []);
  return (
    <div className="w-screen">
      <Navbar />
      {children}
    </div>
  );
};
export default HomeLayout;
