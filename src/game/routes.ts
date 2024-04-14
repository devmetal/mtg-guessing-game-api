import getUser from "@/auth/getUser";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import { validator } from "hono/validator";
import { z } from "zod";

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

game.get("/", async (c) => {
  return c.text("ok");
});

game.get("/:id", paramsValidator, async (c) => {
  const { id } = c.req.valid("param");
  return c.text("ok");
});

game.post("/", async (c) => {
  return c.text("ok");
});

game.patch("/:id", paramsValidator, async (c) => {
  const { id } = c.req.valid("param");
  return c.text("ok");
});

export default game;
