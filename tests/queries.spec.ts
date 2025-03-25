import { expect, describe, it } from "vitest"
import {
	createTodo,
	getTodos,
	updateTodoById,
	deleteTodoById
} from "@/api/todos/queries.ts"

describe("Todo Queries: getTodos", () => {
	it("should be able to get all todos, and it should be empty by default", async () => {
		const list = await getTodos()
		expect(list).toBeDefined()
		expect(list.todos).toBeDefined()
		expect(list.todos.length).toBe(0)
	})
})

describe("Todo Queries: createTodo", () => {
	it("should be able to create a new todo, with a title and done status", async () => {
		const todo = await createTodo({ title: "Test", done: false })
		expect(todo).toBeDefined()
		expect(todo.title).toBe("Test")
		expect(todo.done).toBe(false)
		expect(todo.id).toBeDefined()
		expect(todo.createdAt).toBeDefined()
		expect(todo.updatedAt).toBeDefined()
	})

	it("should have one todo after creating one", async () => {
		const list = await getTodos()
		expect(list.todos.length).toBe(1)
		const newTodo = list.todos[0]
		expect(newTodo.id).toBeDefined()
		expect(newTodo.createdAt).toBeDefined()
		expect(newTodo.updatedAt).toBeDefined()
	})

	it("should throw an error if title is not provided", async () => {
		await expect(createTodo({})).rejects.toThrow()
		await expect(createTodo({ done: true })).rejects.toThrow()
	})

	// todo: test create past list limit (dynamic settings)
})

describe("Todo Queries: updateTodoById", () => {
	it("should update a todo by id", async () => {
		const todo = await createTodo({ title: "Test", done: false })
		const updatedTodo = await updateTodoById(todo.id, {
			title: "Updated",
			done: true
		})
		expect(updatedTodo).toBeDefined()
		expect(updatedTodo.title).toBe("Updated")
		expect(updatedTodo.done).toBe(true)
		expect(updatedTodo.id).toBe(todo.id)
		expect(updatedTodo.createdAt).toBe(todo.createdAt)
		expect(updatedTodo.updatedAt).toBeDefined()
		expect(updatedTodo.updatedAt).not.toBe(todo.updatedAt)
	})

	it("should throw an error if updating id by invalid id", async () => {
		await expect(
			updateTodoById("", { title: "Updated", done: true })
		).rejects.toThrow()
	})

	it("should delete a todo by id", async () => {
		const todo = await createTodo({ title: "Test", done: false })
		const deletedTodo = await deleteTodoById(todo.id)
		expect(deletedTodo).toBeDefined()
		expect(deletedTodo).toBe(todo.id)
	})

	it("should throw an error if deleting id by invalid id", async () => {
		await expect(deleteTodoById(0)).rejects.toThrow()
	})

	it("should throw an error if deleting id by non-number id", async () => {
		await expect(deleteTodoById("0")).rejects.toThrow()
	})
})
