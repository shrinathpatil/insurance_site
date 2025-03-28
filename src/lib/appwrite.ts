import { projectId } from "@/constants";
import { Client, Account, Databases, Storage } from "appwrite";

export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(projectId); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID } from "appwrite";
