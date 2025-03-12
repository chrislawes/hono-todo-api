import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import { throttleMiddleware } from "@/middleware/throttle.ts"
import { logger } from "hono/logger"
import todos from "@/api/todos/index.ts"
import { healthCheck } from "@/api/healthCheck.ts"
import settings from "@/settings.json" assert { type: "json" }

export const app = new Hono()
const port = settings.port

app.use(cors())

if (!process.env.TEST) {
	app.use(throttleMiddleware(settings.throttleTimeMS))
	app.use(logger())
}

app.basePath("/api").route("/ping", healthCheck).route("/todos", todos)

serve({
	fetch: app.fetch,
	port
})
