import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { throttleMiddleware } from "@/middleware/throttle.ts"
import todos from "@/api/todos/index.ts"
import { healthCheck } from "@/api/healthCheck.ts"
import settings from "@/settings.json" assert { type: "json" }

export const app = new Hono()
const port = settings.port

if (!process.env.TEST) {
	app.use(cors())
	app.use(logger())
	app.use(throttleMiddleware(settings.throttleTimeMS))
}

app.basePath("/api").route("/ping", healthCheck).route("/todos", todos)

serve({
	fetch: app.fetch,
	port
})
