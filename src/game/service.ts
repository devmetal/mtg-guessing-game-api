import { db } from "@/database";
import { games } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function getGamesByUser(uid: number) {
  const result = await db.select().from(games).where(eq(games.userId, uid));
  return result;
}

export async function getGameByIdAndUser(gid: number, uid: number) {
  const [result] = await db
    .select()
    .from(games)
    .where(and(eq(games.userId, uid), eq(games.id, gid)));

  return result;
}

export async function createGameForUser(uid: number) {
  const [result] = await db
    .insert(games)
    .values({ started: new Date(), userId: uid })
    .returning();

  return result;
}
