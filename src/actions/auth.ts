"use server";
import { account, ID } from "@/lib/appwrite";

export const signUp = async (signUpData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { name, email, password } = signUpData;
    const user = await account.create(ID.unique(), email, password, name);

    console.log("user created successfully");
    console.log(user);

    await login({ email, password });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (loginData: { email: string; password: string }) => {
  try {
    const { email, password } = loginData;
    const user = await account.createEmailPasswordSession(email, password);

    if (user) {
      console.log("login success");
      // console.log(user);

      await account.client.setSession(user.$id);
    } else {
      console.log("login failed");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getSessionUser = async () => {
  try {
    const user = await account.get();
    console.log("active user", user);
  } catch (error) {
    console.log(error);
  }
};
