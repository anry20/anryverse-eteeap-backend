import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  authorizationSecret: Uint8Array;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  authorizationSecret: new TextEncoder().encode(
    process.env.AUTHORIZATION_SECRET || "default_secret_key"
  ),
};

export default config;
