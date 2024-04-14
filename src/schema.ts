import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("name").notNull().unique(),
  password: text("password").notNull(),
});

export const games = sqliteTable("games", {
  id: integer("id").primaryKey(),
  started: integer("started", { mode: "timestamp_ms" }).notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const puzzles = sqliteTable("puzzles", {
  id: integer("id").primaryKey(),
  cId: text("cid").notNull(),
  score: real("score"),
  cmcGuessed: integer("cmc_guessed"),
  cmcActual: integer("cmc_actual").notNull(),
  colorsGuessed: text("colors_guessed", { mode: "json" }).$type<string[]>(),
  colorsActual: text("colors_actual", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  gameId: integer("game_id")
    .references(() => games.id)
    .notNull(),
});

export type User = typeof users.$inferSelect;
