import { Hono } from 'hono'
import type { Todo } from '@/types/todo.ts'

let todos: Todo[] = []

const todo = new Hono()

// GET /todos
todo.get('/todos', async (c) => {
  // TEMP: Simulate slow response
  await new Promise((r) => setTimeout(r, 250))
  return c.json(todos)
})

// POST /todos
// Body: { title: string, done: boolean }
todo.post('/todos', async (c) => {
  const todo = await c.req.json<Todo>()
  todos.push({
    id: new Date().getTime(),
    title: todo.title,
    done: todo.done
  })
  return c.text('Todo created!')
})

// PUT /todos/:id
// Body: { title: string, done: boolean }
todo.put('/todos/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const todo = await c.req.json<Todo>()
  todos = todos.map((t) => t.id === id ? { ...t, ...todo } : t)
  return c.text('Todo updated!')
})

// DELETE /todos/:id
todo.delete('/todos/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  todos = todos.filter((t) => t.id !== id)
  return c.text('Todo deleted!')
})

export default todo
