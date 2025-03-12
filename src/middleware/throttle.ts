import { createMiddleware } from "hono/factory"
import { type Next } from "hono"

export const throttleMiddleware = (time: number = 0) => {
	return createMiddleware(async (_, next: Next) => {
		await new Promise((r) => setTimeout(r, time))
		await next()
	})
}
