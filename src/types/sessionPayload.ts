/* eslint-disable @typescript-eslint/no-namespace */

import { SessionPayload } from "../utils/session";

declare global {
  namespace Express {
    interface Request {
      session?: SessionPayload;
    }
  }
}

export {};
