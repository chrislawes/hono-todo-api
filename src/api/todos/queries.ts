import { todos } from "@/db.ts"
import { z } from "zod"
import { validate } from "uuid"
import { newTodoTemplate } from "@/utils/newTodoTemplate.ts"
import type { Todo, TodoResponse, TodoRequest } from "@/types/todo.ts"
import settings from "@/settings.json" assert { type: "json" }

// Get all todos
export const getTodos = async (): Promise<TodoResponse> => {
	return { todos }
}

// Create a new todo
export const createTodo = async (todo: TodoRequest): Promise<Todo> => {
	if (!todo.title) {
		throw new Error("Title is required")
	}

	const newTodo = newTodoTemplate(todo)

	if (todos.length >= settings.todoListLimit) {
		throw new Error("Todo list limit reached")
	}

	todos.push(newTodo)

	return newTodo
}

// Update a todo by id
export const updateTodoById = async (
	id: string = "",
	todo: TodoRequest
): Promise<Todo> => {
	const safeId = z.string().parse(id)

	if (!safeId) {
		throw new Error("ID is required")
	}

	if (!validate(safeId)) {
		throw new Error("Invalid UUID")
	}

	const index = todos.findIndex((t) => `${t.id}` === `${safeId}`)

	if (index === -1) {
		throw new Error("Todo not found 1")
	}

	todos[index] = {
		...todos[index],
		...todo,
		updatedAt: new Date()
	}

	return todos[index]
}

// Delete a todo by id
export const deleteTodoById = async (id: string = ""): Promise<string> => {
	const safeId = z.string().parse(id)

	if (!safeId) {
		throw new Error("ID is required")
	}

	if (!validate(safeId)) {
		throw new Error("Invalid UUID")
	}

	const index = todos.findIndex((t) => t.id === safeId)

	if (index === -1) {
		throw new Error("Todo not found 2")
	}

	todos.splice(index, 1)

	return id
}
