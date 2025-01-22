import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todo from '@/api/todo.ts'

const app = new Hono()
const port = 3000

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api', todo)

console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
