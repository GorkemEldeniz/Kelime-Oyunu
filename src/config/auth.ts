export const ACCESS_TOKEN_EXPIRES_IN = "1h";
export const REFRESH_TOKEN_EXPIRES_IN = "1d";
export const RESET_TOKEN_EXPIRES_IN = "30m";

export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000; // 1 hour
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 1000; // 1 day

export const COOKIE_CONFIG = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE),
};
