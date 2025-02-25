export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const JWT_RESET_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET!
);

export const ACCESS_TOKEN_EXPIRES_IN = "1h";
export const REFRESH_TOKEN_EXPIRES_IN = "1d";
export const RESET_TOKEN_EXPIRES_IN = "30m";

export const COOKIE_CONFIG = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as const,
};

export const ACCESS_TOKEN_MAX_AGE = 60 * 60; // 1 hour
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
