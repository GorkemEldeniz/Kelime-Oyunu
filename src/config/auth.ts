import { ACCESS_TOKEN_MAX_AGE } from "@/constants";

export const COOKIE_CONFIG = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE),
	path: "/",
};
