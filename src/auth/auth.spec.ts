import { test, expect, beforeAll, describe } from "bun:test";
import { app } from "@/index";
import { createUser } from "./service";

beforeAll(async () => {
  await createUser("test@test.com", "12345");
});

describe("POST /api/auth/register", () => {
  test("with valid datas", async () => {
    const response = await app.request("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test1@test.com", password: "12345" }),
    });

    expect(response.status).toBe(200);
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
