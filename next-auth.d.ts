import { DefaultSession } from "next-auth";
import mongoose from "mongoose";

declare module "next-auth" {
  interface Session {
    user: {
      _id: mongoose.Types.ObjectId;
    } & DefaultSession["user"];
  }
}
