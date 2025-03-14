import { Hono, type Context } from "hono"

export const healthCheck = new Hono()

// GET /ping
healthCheck.get("/", async (c: Context) => {
	return c.json({ message: "🏓 Pong!" }, 200)
})
