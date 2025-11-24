import {Request, Response} from 'express';
import {prisma} from "../prisma";
import {z} from 'zod';

const createTaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
})

export const createTask = async (req: Request, res: Response) => {
    const result = createTaskSchema.safeParse(req.body);
    if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
            const key = issue.path[0] as string;
            if (!errors[key]) errors[key] = [];
            errors[key].push(issue.message);
        });
        return res.status(400).json({ errors });
    }

    const task = await prisma.task.create({data: result.data});
    return res.status(200).json(task);
}