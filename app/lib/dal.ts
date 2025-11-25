import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { cache } from "react";

type VerifySessionReturn = {
  isAuth: true;
  userId: number;
};

export const verifySession = cache(async (): Promise<VerifySessionReturn> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});
