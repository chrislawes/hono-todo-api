import { expect, describe, it } from "vitest"
import { app } from "@/index.ts"

describe("Root API: GET /", () => {
	it("should return 404", async () => {
		const res = await app.request("/")
		expect(res.status).toBe(404)
	})
})

describe("Healthcheck API: GET /api/ping", () => {
	it("should show valid response", async () => {
		const res = await app.request("/api/ping")
		const data = await res.json()
		expect(data).toBeDefined()
		expect(data.message).toBe("🏓 Pong!")
		expect(res.status).toBe(200)
	})
})

describe("Todo API: GET /api/todos", () => {
	it("should get a list of todos", async () => {
		const res = await app.request("/api/todos")
		expect(await res.json()).toBeDefined() // { todos: [] }
		expect(res.status).toBe(200)
	})
})

// TODO: test create todo
// TODO: test update todo
// TODO: test delete todo
