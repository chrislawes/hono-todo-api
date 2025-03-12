import { expect, describe, it, vi } from "vitest"
import { throttleMiddleware } from "@/middleware/throttle.ts"

describe("Throttle Middleware", () => {
	it("should throttle requests", async () => {
		// Mock setTimeout
		vi.useFakeTimers()

		// Create a mock next function
		const next = vi.fn()

		// Create middleware with 100ms delay
		const middleware = throttleMiddleware(100)

		// Start the middleware execution
		const middlewarePromise = middleware({} as any, next)

		// Verify next hasn't been called yet
		expect(next).not.toHaveBeenCalled()

		// Advance timers by 100ms
		vi.advanceTimersByTime(100)

		// Wait for the middleware to complete
		await middlewarePromise

		// Verify next was called after the delay
		expect(next).toHaveBeenCalledTimes(1)

		// Restore real timers
		vi.useRealTimers()
	})
})
