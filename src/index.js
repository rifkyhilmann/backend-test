const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ 1. Create Post
app.post("/posts", async (req, res) => {
    try {
        const { title, content, status } = req.body;

        const post = await prisma.post.create({
            data: { title, content, status: status || "DRAFT" },
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ 2. Get All Posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await prisma.post.findMany();

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ 3. Get Post by ID
app.get("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({ 
            where: { 
                id 
            } 
        });

        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ 4. Update Post
app.put("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, status } = req.body;
        const updatedPost = await prisma.post.update({
        where: { id },
        data: { title, content, status },
        });
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ 5. Delete Post
app.delete("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("Server running on port 3001"));
