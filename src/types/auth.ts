export type TokenType = "ACCESS" | "REFRESH";

export interface JWTPayload {
	userId: number;
	type: TokenType;
}

export interface CreateUserResult {
	user: {
		id: number;
		email: string;
		username: string;
	};
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}

export interface AuthUser {
	id: number;
	email: string;
	username: string;
}
