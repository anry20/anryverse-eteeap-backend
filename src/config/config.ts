import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  authorizationSecret: Uint8Array;
}

const config: Config = {
  port: Number(process.env.PORT)!,
  nodeEnv: process.env.NODE_ENV!,
  authorizationSecret: new TextEncoder().encode(
    process.env.AUTHORIZATION_SECRET!
  ),
};

export default config;
