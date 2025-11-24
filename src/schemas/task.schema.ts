import {z} from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
});

// Query params: pagination, search, filter
export const querySchema = z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    completed: z.enum(["true", "false"]).optional(),
});

// ID param validation
export const idSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a valid number"),
});

// Handle Zod Error for consistency across all routes
export const handleZodError = (error: z.ZodError) => ({
    message: "Validation failed",
    errors: z.treeifyError(error),
});
