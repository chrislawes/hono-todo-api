export interface Todo {
	id?: string
	title: string
	done: boolean
	createdAt: Date
	updatedAt: Date
}

export interface TodoResponse {
	todos: Todo[]
}

export interface TodoRequest {
	title: string
	done: boolean
}
