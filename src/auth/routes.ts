import { Hono } from "hono";
import { z } from "zod";
import { validator } from "hono/validator";
import { sign, jwt } from "hono/jwt";
import {
  checkEmailAndPassword,
  createUser,
  getUserById,
  isUserAlready,
} from "./service";

const auth = new Hono();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const authValidator = validator("json", (value, c) => {
  const parsed = authSchema.safeParse(value);
  if (!parsed.success) {
    return c.text("Bad request", 401);
  }
  return parsed.data;
});

auth.post("/register", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");

  if (await isUserAlready(email)) {
    return c.text("Bad request", 401);
  }

  const user = await createUser(email, password);
  return c.json({ email: user.email, id: user.id });
});

auth.post("/login", authValidator, async (c) => {
  const { email, password } = c.req.valid("json");
  const user = await checkEmailAndPassword(email, password);

  if (!user) {
    return c.text("Bad request", 401);
  }

  const payload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5,
  };

  const token = await sign(payload, Bun.env.SECRET);
  return c.json({ token });
});

auth.get("/me", jwt({ secret: Bun.env.SECRET }), async (c) => {
  const { sub } = c.get("jwtPayload") as { sub: number };

  if (!sub || !Number.isInteger(sub)) {
    return c.text("Invalid token", 401);
  }

  const user = await getUserById(sub);
  return c.json({ email: user.email, id: user.id });
});

export default auth;
