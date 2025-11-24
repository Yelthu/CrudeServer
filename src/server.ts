import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({message: "Health check is ok"});
})

app.use("/tasks", taskRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
})