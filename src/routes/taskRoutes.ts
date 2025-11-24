import {Router} from "express";
import {createTask, getTasks, getTaskById, updateTask} from "../controllers/taskController";

const router = Router();

router.post("/", createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);

export default router;