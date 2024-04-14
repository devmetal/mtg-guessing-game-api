import { test, beforeAll, describe, expect } from "bun:test";
import { app } from "@/index";
import { rest } from "@/test/helper";

const game = rest(app);
const login = rest(app)("/api/auth/login");

let token: () => string;

const gameAuthReq = (url: string) =>
  game(url)({ Authorization: `Bearer ${token()}` });

beforeAll(async () => {
  const response = await login(null)("POST", {
    email: "test@test.com",
    password: "12345",
  });

  const body = await response.json();
  token = () => body.token;
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
  ] as const;

  test.each(cases)("/%p respond %p", async (id, r) => {
    const response = await gameAuthReq(`/api/game/${id}`)("GET");
    expect(response.status).toBe(r);
  });

  test("without token should respond 401", async () => {
    const response = await game("/api/game/1")(null)("GET");
    expect(response.status).toBe(401);
  });
});
