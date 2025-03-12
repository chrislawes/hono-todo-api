import { z } from "zod"

export const TodoSchema = z
	.object(
		{
			title: z
				.string({
					required_error: "Title is required",
					invalid_type_error: "Title must be a string"
				})
				.min(1)
				.max(100),
			done: z
				.boolean({
					required_error: "Done is required",
					invalid_type_error: "Done must be a boolean"
				})
				.default(false)
		},
		{
			required_error: "Todo is required",
			invalid_type_error: "Todo must be an object"
		}
	)
	.strict()

export const updateTodoSchema = TodoSchema.partial()
