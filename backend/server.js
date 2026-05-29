require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend Running ✅"));

app.post("/api/ai", async(req, res) => {
    try {
        const messages = req.body.messages || [];
        const model = req.body.model || "meta-llama/llama-3.3-70b-instruct";
        const max_tokens = req.body.max_tokens || 1000;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Guru AI Code Reviewer",
            },
            body: JSON.stringify({ model, messages, max_tokens }),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ error: { message: data.error ? .message || "OpenRouter error" } });
        }

        const text = data.choices ? .[0] ? .message ? .content || "No response";
        res.json({ content: [{ type: "text", text }] });
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));