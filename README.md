# 🔥 Hono TODO API

Simple [Hono](https://hono.dev/) API, creates CRUD endpoints for testing a Todo frontend.

Built with TypeScript, Zod for input validation, and Vitest for (vi)testing.

Ready to power your todo application! 🚀

### ☝️ Endpoints

```js
GET / api / todos
```

```js
POST / api / todos
```

```
{
    "title": string
    "done"?: boolean
}
```

```js
PUT /api/todos/:id
```

```
{
    "title"?: string
    "done"?: boolean
}
```

```js
DELETE /api/todos/:id
```

### 🏃‍♂️ Running

```shell
bun i
bun run dev
```

### 🧪 Testing

```shell
bun run test
```
