import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { authRouter } from "./auth-router";
import { uidRouter } from "./uid-router";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  uid: uidRouter,
});

export type AppRouter = typeof appRouter;
