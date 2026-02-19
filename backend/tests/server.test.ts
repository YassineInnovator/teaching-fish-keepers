import { describe, expect, test } from "bun:test";
import { handleEventRoutes } from "../src/events/routes.ts";

describe("Event routes authentication", () => {
  test("POST /api/events returns 401 without auth token", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test event",
        date: "2026-02-20T18:00:00.000Z",
      }),
    });

    const res = await handleEventRoutes(req, new URL(req.url));

    if (!res) {
      throw new Error("Expected a response from handleEventRoutes");
    }

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });
});
