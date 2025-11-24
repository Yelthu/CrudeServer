import {Request, Response} from 'express';
import {prisma} from "../prisma";
import {z} from "zod";
import {
    createTaskSchema,
    updateTaskSchema,
    querySchema,
    idSchema,
    handleZodError
} from "../schemas/task.schema";

export const createTask = async (req: Request, res: Response) => {
    const parseResult = createTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json(handleZodError(parseResult.error));
    }

    const task = await prisma.task.create({data: parseResult.data});
    return res.status(200).json(task);
}

export const getTasks = async (req: Request, res: Response) => {
    const parseResult = querySchema.safeParse(req.query);

    if (!parseResult.success) {
        return res.status(400).json(handleZodError(parseResult.error));
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
        return res.status(400).json(handleZodError(parseResult.error));
    }

    const id = parseInt(parseResult.data.id);

    const task = await prisma.task.findUnique({where: {id}});

    if (!task) {
        return res.status(404).json({message: "Task not found"});
    }

    return res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
    const idParsed = idSchema.safeParse(req.params);
    const bodyParsed = updateTaskSchema.safeParse(req.body);

    if (!idParsed.success)
        return res.status(400).json({message: "Invalid ID", issues: idParsed.error.issues});

    if (!bodyParsed.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: z.treeifyError(bodyParsed.error),
        });
    }

    const id = Number(idParsed.data.id);

    const existing = await prisma.task.findUnique({where: {id}});
    if (!existing) return res.status(404).json({message: "Task not found"});

    const task = await prisma.task.update({
        where: {id},
        data: bodyParsed.data,
    });

    return res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
    const parsed = idSchema.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json(handleZodError(parsed.error));
    }

    const id = Number(parsed.data.id);

    const existing = await prisma.task.findUnique({where: {id}});
    if (!existing) return res.status(404).json({message: "Task not found"});

    await prisma.task.delete({where: {id}});

    return res.json({message: "Task deleted successfully"});
};