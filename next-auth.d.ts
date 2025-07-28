// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string; // <- add this
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
	}
}
