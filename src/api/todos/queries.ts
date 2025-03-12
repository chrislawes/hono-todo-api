import { todos } from "@/db.ts"
import type { Todo, TodoResponse, TodoRequest } from "@/types/todo.ts"

export const getTodos = async (): Promise<TodoResponse> => {
	return { todos }
}

// export const getTodoById = async (id: number): Promise<Todo> => {
// 	const todo = todos.find((t) => t.id === id)
// 	if (!todo) {
// 		throw new Error("Todo not found")
// 	}
// 	return todo
// }

export const createTodo = async (todo: TodoRequest): Promise<Todo> => {
	const uniqueId = new Date().getTime()
	const newTodo = { ...todo, done: todo.done || false, id: uniqueId }

	todos.push(newTodo)

	return newTodo
}

export const updateTodoById = async (id: number, todo: TodoRequest): Promise<Todo> => {
	const index = todos.findIndex((t) => t.id === id)

	if (index === -1) {
		throw new Error("Todo not found")
	}

	todos[index] = { ...todos[index], ...todo }

	return todos[index]
}

export const deleteTodoById = async (id: number): Promise<TodoResponse> => {
	todos.filter((t) => t.id !== id)
	return { todos }
}
