import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'CRUD Backend API using Express + TypeScript + Prisma + Docker API',
        version: '1.0.0',
        endpoints: {
            'POST   /api/tasks': 'Create task',
            'GET    /api/tasks': 'List tasks',
            'GET    /api/tasks/:id': 'Get one task',
            'PATCH  /api/tasks/:id': 'Update task',
            'DELETE /api/tasks/:id': 'Delete task',
        },
    });
});

app.get("/health", (req, res) => {
    res.json({message: "Health check is ok"});
})

app.use("/api/tasks", taskRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
})