import { ACCESS_TOKEN_EXPIRES_IN } from "@/constants";
import * as jose from "jose";

export async function generateAccessToken(userId: number): Promise<string> {
	// Ensure we're creating a valid payload object
	const payload = { id: userId };

	return new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
		.sign(new TextEncoder().encode(process.env.JWT_ACCESS_SECRET));
}

export async function generateToken(
	payload: jose.JWTPayload,
	secret: string,
	expiresIn: string
): Promise<string> {
	return new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.sign(new TextEncoder().encode(secret));
}

export async function verifyToken(
	token: string,
	secret: string
): Promise<jose.JWTPayload | null> {
	try {
		const { payload } = await jose.jwtVerify(
			token,
			new TextEncoder().encode(secret)
		);

		return payload;
	} catch (error) {
		console.error("Token verification error:", error);
		return null;
	}
}
