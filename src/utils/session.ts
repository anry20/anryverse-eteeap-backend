import { Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import config from "../config/config";

export type SessionPayload = {
  userId: string;
  username: string;
  email: string;
  role: string;
};

export async function createSession(res: Response, payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3h") // token validity
    .sign(config.authorizationSecret);

  res.cookie("session", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    expires: expiresAt, // cookie expires in 3h
    path: "/",
  });
}

export async function decryptSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, config.authorizationSecret, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to verify session:", error);
    }
    return null;
  }
}

export function deleteSession(res: Response) {
  res.clearCookie("session", { path: "/" });
}
