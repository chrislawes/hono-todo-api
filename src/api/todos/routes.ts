import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { TodoSchema, updateTodoSchema } from "@/schemas/todo.ts"
import {
	getTodos,
	// getTodoById,
	createTodo,
	updateTodoById
	// deleteTodoById
} from "@/api/todos/queries.ts"
import type { Todo, TodoResponse } from "@/types/todo.ts"

export const todos = new Hono()

// GET /todos
todos.get("/", async (c) => {
	const todos: TodoResponse = await getTodos()
	return c.json(todos, 200)
})

// POST /todos
// Body: { title: string, done: boolean }
todos.post("/", zValidator("json", TodoSchema), async (c) => {
	const todo = await c.req.json<Todo>()
	const newTodo: Todo = await createTodo(todo)

	return c.json(
		{
			message: "Todo created!",
			todo: newTodo
		},
		201
	)
})

// PUT /todos/:id
// Body: { title: string, done: boolean }
todos.put("/:id", zValidator("json", updateTodoSchema), async (c) => {
	const id = parseInt(c.req.param("id"))

	try {
		const todoEdit = await c.req.json<Todo>()

		const updatedTodo = await updateTodoById(id, todoEdit)

		return c.json(
			{
				message: "Todo updated!",
				todo: updatedTodo
			},
			200
		)
	} catch (error) {
		return c.json({ error: "Todo not found" }, 404)
	}
})

// DELETE /todos/:id
// TODO
todos.delete("/:id", (c) => {
	// const id = parseInt(c.req.param("id"))
	// if (isNaN(id)) {
	// 	return c.json({ error: "Invalid ID" }, 400)
	// }
	// todos = todos.filter((t) => t.id !== id)
	return c.json({ message: "Todo deleted!" }, 200)
})

export default todos
