import {Request, Response} from 'express';
import {prisma} from "../prisma";
import {
    createTaskSchema,
    querySchema,
    idSchema,
} from "../schemas/task.schema";

export const createTask = async (req: Request, res: Response) => {
    const result = createTaskSchema.safeParse(req.body);
    if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
            const key = issue.path[0] as string;
            if (!errors[key]) errors[key] = [];
            errors[key].push(issue.message);
        });
        return res.status(400).json({errors});
    }

    const task = await prisma.task.create({data: result.data});
    return res.status(200).json(task);
}

export const getTasks = async (req: Request, res: Response) => {
    const parseResult = querySchema.safeParse(req.query);

    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid query parameters",
            issues: parseResult.error.issues,
        });
    }

    const {completed, search, page = "1", limit = "10"} = parseResult.data;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const where: {
        completed?: boolean;
        title?: { contains: string; mode: "insensitive" };
    } = {};

    if (completed !== undefined) {
        where.completed = completed === "true";
    }

    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive",
        };
    }

    const totalItems = await prisma.task.count({where});

    const tasks = await prisma.task.findMany({
        where,
        orderBy: {createdAt: "desc"},
        skip,
        take: limitNum,
    });

    return res.status(200).json({
        data: tasks,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalItems,
            totalPages: Math.ceil(totalItems / limitNum),
            hasNextPage: pageNum * limitNum < totalItems,
            hasPrevPage: pageNum > 1,
        },
    });
};

export const getTaskById = async (req: Request, res: Response) => {
    const parseResult = idSchema.safeParse(req.params);

    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid task ID",
            issues: parseResult.error.issues,
        });
    }

    const id = parseInt(parseResult.data.id);

    const task = await prisma.task.findUnique({where: {id}});

    if (!task) {
        return res.status(404).json({message: "Task not found"});
    }

    return res.json(task);
};
