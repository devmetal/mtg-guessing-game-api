import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import { validator } from "hono/validator";
import { z } from "zod";
import getUser from "@/auth/getUser";
import {
  createGameForUser,
  getGameByIdAndUser,
  getGamesByUser,
} from "./service";

const game = new Hono();

const paramsSchema = z.object({
  id: z
    .string()
    .min(1)
    .transform((v) => Number(v))
    .refine((v) => Number.isInteger(v)),
});

const paramsValidator = validator("param", (value, c) => {
  const parsed = paramsSchema.safeParse(value);
  if (!parsed.success) {
    throw new HTTPException(400);
  }
  return parsed.data;
});

game.use(jwt({ secret: Bun.env.SECRET }), getUser);

game.get("/", getUser, async (c) => {
  const games = await getGamesByUser(c.get("user").id);
  return c.json(games);
});

game.get("/:id", getUser, paramsValidator, async (c) => {
  const { id } = c.req.valid("param");
  const game = await getGameByIdAndUser(id, c.get("user").id);

  if (!game) {
    throw new HTTPException(404);
  }

  return c.json(game);
});

game.post("/", getUser, async (c) => {
  const game = await createGameForUser(c.get("user").id);
  return c.json(game);
});

export default game;
