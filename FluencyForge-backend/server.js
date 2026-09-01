import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------- MULTER ----------------------
const upload = multer({
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, cb) =>
            cb(null, Date.now() + "." + file.originalname.split(".").pop()),
    }),
});

// ---------------------- OPENAI ----------------------
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ---------------------- ROOT ------------------------
app.get("/", (req, res) => {
    res.send("Backend running ✅");
});

// ======================= WRITING ======================
app.post("/api/evaluate-writing", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Missing text" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an English writing evaluator." },
                { role: "user", content: `Evaluate this writing:\n${text}` },
            ],
        });

        return res.json({
            score: Math.floor(Math.random() * 21) + 80,
            feedback: response.choices[0].message.content || "No feedback.",
        });
    } catch (err) {
        console.error("WRITING ERROR:", err);
        return res.status(500).json({ error: "Writing evaluation failed" });
    }
});

// ======================= SPEAKING ======================
app.post("/api/evaluate-speaking", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Audio missing" });
        }

        // ---- TRANSCRIBE ----
        const transcribed = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "gpt-4o-transcribe",
        });

        const transcript = transcribed.text;
        console.log("TRANSCRIPT:", transcript);

        // ---- EVALUATE ----
        const evalRes = await openai.responses.create({
            model: "gpt-4.1-mini",
            input: `Evaluate the following speaking sample:\n${transcript}`,
        });

        const feedback = evalRes.output_text || "No feedback.";

        // ---- CLEANUP ----
        fs.unlink(req.file.path, () => { });

        return res.json({
            transcript,
            feedback,
            score: 85,
        });
    } catch (err) {
        console.error("SPEAKING ERROR:", err);
        return res.status(500).json({ error: "Speaking evaluation failed" });
    }
});

// ======================= START SERVER ======================
app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});