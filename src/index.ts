import { Hono } from "hono";
import { logger } from "hono/logger";
import auth from "./auth/routes";

const app = new Hono();

app.use(logger());

app.route("/api/auth", auth);

export default {
  port: Number(Bun.env.PORT) ?? 8080,
  fetch: app.fetch,
};
