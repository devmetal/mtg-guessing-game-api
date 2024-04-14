import { test, beforeAll, describe, expect } from "bun:test";
import { app } from "@/index";
import { rest } from "@/test/helper";
import { db } from "@/database";
import { games } from "@/schema";

const req = rest(app);
const login = rest(app)("/api/auth/login");

let token: () => string;

const authReq = (url: string) =>
  req(url)({ Authorization: `Bearer ${token()}` });

beforeAll(async () => {
  const response = await login(null)("POST", {
    email: "test@test.com",
    password: "12345",
  });

  const body = await response.json();
  token = () => body.token;

  // create test games
  await db.insert(games).values({ started: new Date(), userId: 1 });
  await db.insert(games).values({ started: new Date(), userId: 1 });
  await db.insert(games).values({ started: new Date(), userId: 2 });
});

describe("GET /api/game", () => {
  test("without token should respond 401", async () => {
    const response = await req("/api/game")(null)("GET");
    expect(response.status).toBe(401);
  });

  test("should respond with user games", async () => {
    const response = await authReq("/api/game")("GET");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(2);
  });
});

describe("GET /api/game/:id", () => {
  const cases = [
    ["abc", 400],
    ["1abc", 400],
    ["1.11", 400],
    [null, 400],
    [false, 400],
    [true, 400],
    ["1", 200],
    [1, 200],
    [111, 404],
    [3, 404],
  ] as const;

  test.each(cases)("/%p respond %p", async (id, r) => {
    const response = await authReq(`/api/game/${id}`)("GET");
    expect(response.status).toBe(r);
  });

  test("without token should respond 401", async () => {
    const response = await req("/api/game/1")(null)("GET");
    expect(response.status).toBe(401);
  });
});
