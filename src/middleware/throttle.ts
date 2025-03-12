import { createMiddleware } from "hono/factory"
import { type Next, type MiddlewareHandler } from "hono"

export const throttleMiddleware = (time: number = 0): MiddlewareHandler => {
	return createMiddleware(async (_, next: Next): Promise<void> => {
		await new Promise((r) => setTimeout(r, time))
		return await next()
	})
}
