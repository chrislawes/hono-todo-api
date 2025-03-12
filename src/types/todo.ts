export interface Todo {
	id?: number
	title: string
	done: boolean
}

export interface TodoResponse {
	todos: Todo[]
}

export interface TodoRequest {
	title: string
	done: boolean
}
