import { Hono } from "hono";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import auth from "./auth/routes";

const app = new Hono();

app.use(logger());

app.route("/api/auth", auth);
app.onError((err, c) => {
  console.error(err.message);
  console.error(err.stack);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.text("Internal Server Error", 500);
});

export default {
  port: Number(Bun.env.PORT) ?? 8080,
  fetch: app.fetch,
};
