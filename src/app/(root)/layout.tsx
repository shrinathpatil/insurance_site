"use client";
import Navbar from "@/components/Navbar";
import { fetchQuery } from "convex/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedUser = localStorage.getItem("convex-loggedIn-user");
        if (!loggedUser) {
          router.push("/");
        } else {
          const userDetails = await fetchQuery(api.users.getUser, {
            userId: loggedUser as Id<"users">,
          });
          if (!userDetails) {
            localStorage.removeItem("convex-loggedIn-user");
            router.push("/");
          }
        }
      } catch (e) {
        console.log(e);
        toast.error("Login to access this page!");
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
