import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { throttleMiddleware } from "@/middleware/throttle.ts"
import todos from "@/api/todos/index.ts"
import { healthCheck } from "@/api/healthCheck.ts"
import { settings } from "@/settings.ts"

const app = new Hono()
const port = settings.port

app.use(cors())
app.use(logger())
app.use(throttleMiddleware(settings.throttleTime))

app.basePath("/api").route("/ping", healthCheck).route("/todos", todos)

console.log(`Server is running on http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port
})
