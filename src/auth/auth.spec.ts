import { test, expect, beforeAll, describe } from "bun:test";
import { app } from "@/index";
import { createUser } from "./service";
import { rest } from "@/test/helper";

const register = rest(app)("/api/auth/register");

beforeAll(async () => {
  await createUser("test@test.com", "12345");
});

describe("POST /api/auth/register", () => {
  test("with valid datas", async () => {
    const response = await register("POST", {
      email: "test1@test.com",
      password: "12345",
    });

    expect(response.status).toBe(200);
  });

  const cases = [
    ["e", "", "p", ""],
    ["email", "", "p", ""],
    ["email", null, "p", null],
    ["email", "invalid", "password", "12345"],
    ["email", "valid@valid.com", "password", "12"],
  ] as const;

  test.each(cases)("%p=%p, %p=%p respond 400", async (e, ev, p, pv) => {
    const response = await register("POST", {
      [e]: ev,
      [p]: pv,
    });

    expect(response.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  test("with valid datas", async () => {
    const response = await app.request("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@test.com", password: "12345" }),
    });

    expect(response.status).toBe(200);
  });
});
