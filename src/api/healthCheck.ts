import { Hono, type Context } from "hono"

export const healthCheck = new Hono()

// GET /api/ping
healthCheck.get("/", async (c: Context) => {
	return c.json({ message: "🏓 pong!" }, 200)
})
