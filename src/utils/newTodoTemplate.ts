import type { Todo, TodoRequest } from "@/types/todo.ts"
import { v4 as uuidv4 } from "uuid"

export const newTodoTemplate = (todo: TodoRequest): Todo => {
	return {
		id: uuidv4(),
		title: todo.title || "New todo",
		done: todo.done || false,
		createdAt: new Date(),
		updatedAt: new Date()
	}
}
