import { Hono, type Context } from "hono"
import { zValidator } from "@hono/zod-validator"
import { TodoSchema, updateTodoSchema } from "@/schemas/todo.ts"
import { getTodos, createTodo, updateTodoById, deleteTodoById } from "@/api/todos/queries.ts"
import type { Todo, TodoResponse } from "@/types/todo.ts"

export const todos = new Hono()

// GET /todos
todos.get("/", async (c: Context) => {
	const todos: TodoResponse = await getTodos()
	return c.json(todos, 200)
})

// POST /todos
// Body: { title: string, done: boolean }
todos.post("/", zValidator("json", TodoSchema), async (c: Context) => {
	const todo = await c.req.json<Todo>()

	try {
		const newTodo: Todo = await createTodo(todo)

		return c.json(
			{
				message: "Todo created!",
				todo: newTodo
			},
			201
		)
	} catch (error) {
		return c.json({ error: "Todo list limit reached" }, 400)
	}
})

// PUT /todos/:id
// Body: { title: string, done: boolean }
todos.put("/:id", zValidator("json", updateTodoSchema), async (c: Context) => {
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
todos.delete("/:id", async (c: Context) => {
	const id = parseInt(c.req.param("id"))

	try {
		await deleteTodoById(id)

		return c.json(
			{
				message: "Todo deleted!",
				id
			},
			200
		)
	} catch (error) {
		return c.json({ error: "Todo not found" }, 404)
	}
})

export default todos
