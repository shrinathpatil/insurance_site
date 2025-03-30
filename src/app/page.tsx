"use client";
import { fetchQuery } from "convex/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
type LoginData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = localStorage.getItem("convex-loggedIn-user");

        if (user) {
          const loggedUser = await fetchQuery(api.users.getUser, {
            userId: user as Id<"users">,
          });

          if (loggedUser) {
            toast.success(`Welcome Back, ${loggedUser.name}`);
            router.push("/home");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password } = loginData;
    if (email === "") {
      toast.error("Please fill email address !");
      return;
    }
    if (password === "") {
      toast.error("Please fill password !");
      return;
    }
    try {
      const user = await fetchQuery(api.users.loginUser, { email, password });

      if (user) {
        localStorage.setItem("convex-loggedIn-user", user._id);
        toast.success("Logged in successfully!");
        router.push("/home");
      }
    } catch (e) {
      const error = e as Error;
      console.log(error.message);
      toast.error("Please Check Your email and password!");
    }
  };
  return (
    <div className="w-screen flex items-center justify-center min-h-screen bg-cover max-md:bg-no-repeat max-md:bg-center max-md:bg-cover bg-[url(/assets/bgimage.jpg)]">
      <form className="min-w-[300px] w-[400px] bg-black/50 backdrop-blur-md flex border border-gray-300 rounded-md flex-col items-center gap-4 p-4">
        <h1 className="text-lg my-2 text-white font-bold">Log In</h1>
        <input
          type="email"
          name="email"
          placeholder="abc@email.com"
          className="text-white placeholder:text-white outline-none border w-full border-gray-200 rounded-md p-2 focus:border-blue-400 "
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="text-white placeholder:text-white outline-none border w-full border-gray-200 rounded-md p-2 focus:border-blue-400 "
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-blue-500 font-bold text-sm outline-none cursor-pointer rounded-md p-2 w-full text-white"
        >
          Log In
        </button>
      </form>
    </div>
  );
};
export default LoginPage;
