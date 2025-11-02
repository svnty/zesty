import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string;
      email?: string;
      image?: string;
      slug?: string;
      role?: "ADMIN" | "STAFF" | "USER";
    }
  }
}

export default NextAuth(authOptions);