import { todos } from "@/db.ts"
import { z } from "zod"
import type { Todo, TodoResponse, TodoRequest } from "@/types/todo.ts"
import settings from "@/settings.json" assert { type: "json" }

export const getTodos = async (): Promise<TodoResponse> => {
	return { todos }
}

export const createTodo = async (todo: TodoRequest): Promise<Todo> => {
	const uniqueId = new Date().getTime()

	if (!todo.title) {
		throw new Error("Title is required")
	}

	const newTodo = { ...todo, done: todo.done || false, id: uniqueId }

	if (todos.length >= settings.todoListLimit) {
		throw new Error("Todo list limit reached")
	}

	todos.push(newTodo)

	return newTodo
}

export const updateTodoById = async (id: number = 0, todo: TodoRequest): Promise<Todo> => {
	const safeId = z.number().parse(id)

	if (!safeId) {
		throw new Error("ID is required")
	}

	const index = todos.findIndex((t) => t.id === safeId)

	if (index === -1) {
		throw new Error("Todo not found")
	}

	todos[index] = { ...todos[index], ...todo }

	return todos[index]
}

export const deleteTodoById = async (id: number = 0): Promise<number> => {
	const safeId = z.number().parse(id)

	if (!safeId) {
		throw new Error("ID is required")
	}

	const index = todos.findIndex((t) => t.id === safeId)

	if (index === -1) {
		throw new Error("Todo not found")
	}

	todos.splice(index, 1)

	return id
}
