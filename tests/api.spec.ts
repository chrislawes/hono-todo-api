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
		const data = await res.json()
		expect(data).toBeDefined() // { todos: [] }
		expect(data.todos).toBeInstanceOf(Array)
		expect(data.todos.length).toBe(0)
		expect(res.status).toBe(200)
	})
})

describe("Todo API: POST /api/todos", () => {
	it("should create a todo, when given a valid title", async () => {
		const res = await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: "New Todo",
				done: false
			})
		})
		const data = await res.json()

		expect(data).toBeDefined()
		expect(data.todo).toBeDefined()
		expect(data.todo.title).toBe("New Todo")
		expect(res.status).toBe(201)
	})

	it("todo list should be one item longer when we add one todo", async () => {
		const res = await app.request("/api/todos")
		const data = await res.json()
		const startLength = data.todos.length

		await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ title: "New Todo", done: false })
		})

		const res2 = await app.request("/api/todos")
		const data2 = await res2.json()

		expect(data2.todos.length).toBe(startLength + 1)
	})

	it("should not create a todo, when given an invalid title", async () => {
		const res = await app.request("/api/todos", {
			method: "POST",
			body: JSON.stringify({ title: "" })
		})
		const data = await res.json()

		expect(data).toBeDefined()
		expect(data.error).toBeDefined()
		expect(res.status).toBe(400)
	})

	it("should not create a todo, when given an invalid request body", async () => {
		const res = await app.request("/api/todos", {
			method: "POST",
			body: JSON.stringify({
				something: "else"
			})
		})
		const data = await res.json()

		expect(data).toBeDefined()
		expect(data.error).toBeDefined()
		expect(res.status).toBe(400)
	})
})

describe("Todo API: PUT /api/todos", () => {
	it("should update a todo, when given a valid title", async () => {
		const create = await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: "New Todo",
				done: false
			})
		})
		const createData = await create.json()

		const update = await app.request(`/api/todos/${createData.todo.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ title: "Updated Todo" })
		})
		const updateData = await update.json()

		expect(updateData).toBeDefined()
		expect(updateData.todo).toBeDefined()
		expect(updateData.todo.title).toBe("Updated Todo")
		expect(update.status).toBe(200)
	})

	it("should not update a todo, when given an invalid title", async () => {
		const create = await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: "New Todo",
				done: false
			})
		})
		const createData = await create.json()

		const update = await app.request(`/api/todos/${createData.todo.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ title: "" })
		})
		const updateData = await update.json()

		expect(updateData).toBeDefined()
		expect(updateData.error).toBeDefined()
		expect(update.status).toBe(400)
	})

	it("should not update a todo, when given an invalid put object", async () => {
		const create = await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: "New Todo",
				done: false
			})
		})
		const createData = await create.json()

		const update = await app.request(`/api/todos/${createData.todo.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ something: "else" })
		})
		const updateData = await update.json()

		expect(updateData).toBeDefined()
		expect(updateData.error).toBeDefined()
		expect(update.status).toBe(400)
	})
})

describe("Todo API: DELETE /api/todos", () => {
	it("should delete a todo, when given a valid id", async () => {
		const create = await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: "New Todo",
				done: false
			})
		})
		const createData = await create.json()

		const deleteTodo = await app.request(`/api/todos/${createData.todo.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
		const deleteData = await deleteTodo.json()

		expect(deleteData).toBeDefined()
		expect(deleteData.id).toBeDefined()
		expect(deleteData.id).toBe(createData.todo.id)
		expect(deleteTodo.status).toBe(200)
	})

	it("should not delete a todo, when given an invalid id", async () => {
		const deleteTodo = await app.request(`/api/todos/123`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
		const deleteData = await deleteTodo.json()

		expect(deleteData).toBeDefined()
		expect(deleteData.error).toBeDefined()
		expect(deleteTodo.status).toBe(404)
	})

	it("should only delete one todo at a time", async () => {
		const res = await app.request("/api/todos")
		const data = await res.json()

		const startLength = data.todos.length

		const create = await app.request("/api/todos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: "New Todo",
				done: false
			})
		})
		const createData = await create.json()

		const res2 = await app.request("/api/todos")
		const data2 = await res2.json()

		const midLength = data2.todos.length

		expect(midLength).toBe(startLength + 1)

		await app.request(`/api/todos/${createData.todo.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})

		const res3 = await app.request("/api/todos")
		const data3 = await res3.json()

		const endLength = data3.todos.length

		expect(endLength).toBe(startLength)
	})
})
