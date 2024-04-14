import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("name").notNull().unique(),
  password: text("password").notNull(),
});

export const games = sqliteTable("games", {
  id: integer("id").primaryKey(),
  started: integer("started", { mode: "timestamp_ms" }),
  userId: integer("user_id").references(() => users.id),
});

export const puzzles = sqliteTable("puzzles", {
  id: integer("id").primaryKey(),
  cId: text("cid").notNull(),
  score: real("score"),
  cmcGuessed: integer("cmc_guessed"),
  cmcActual: integer("cmc_actual"),
  colorsGuessed: text("colors_guessed", { mode: "json" }).$type<string[]>(),
  colorsActual: text("colors_actual", { mode: "json" }).$type<string[]>(),
  gameId: integer("game_id").references(() => games.id),
});
