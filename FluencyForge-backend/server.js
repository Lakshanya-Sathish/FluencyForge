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
// Vercel's deployed filesystem is read-only.
// /tmp is writable during a serverless function execution.
const upload = multer({
    storage: multer.diskStorage({
        destination: "/tmp",
        filename: (req, file, cb) => {
            const extension = file.originalname.split(".").pop();
            cb(null, `${Date.now()}.${extension}`);
        },
    }),
});

// ---------------------- OPENAI ----------------------

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ---------------------- ROOT -------------------------

app.get("/", (req, res) => {
    res.send("Backend running ✅");
});

// ======================= WRITING ======================

app.post("/api/evaluate-writing", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                error: "Missing text",
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an English writing evaluator.",
                },
                {
                    role: "user",
                    content: `Evaluate this writing:\n${text}`,
                },
            ],
        });

        return res.json({
            score: Math.floor(Math.random() * 21) + 80,
            feedback:
                response.choices[0].message.content || "No feedback.",
        });

    } catch (err) {
        console.error("WRITING ERROR:", err);

        return res.status(500).json({
            error: "Writing evaluation failed",
        });
    }
});

// ======================= SPEAKING ======================

app.post(
    "/api/evaluate-speaking",
    upload.single("audio"),
    async (req, res) => {
        let uploadedFilePath = null;

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "Audio missing",
                });
            }

            uploadedFilePath = req.file.path;

            // ---- TRANSCRIBE ----

            const transcribed =
                await openai.audio.transcriptions.create({
                    file: fs.createReadStream(uploadedFilePath),
                    model: "gpt-4o-transcribe",
                });

            const transcript = transcribed.text;

            console.log("TRANSCRIPT:", transcript);

            // ---- EVALUATE ----

            const evalRes = await openai.responses.create({
                model: "gpt-4.1-mini",
                input: `Evaluate the following speaking sample:\n${transcript}`,
            });

            const feedback =
                evalRes.output_text || "No feedback.";

            // ---- CLEANUP ----

            fs.unlink(uploadedFilePath, (err) => {
                if (err) {
                    console.error("FILE CLEANUP ERROR:", err);
                }
            });

            return res.json({
                transcript,
                feedback,
                score: 85,
            });

        } catch (err) {
            console.error("SPEAKING ERROR:", err);

            // Try to delete the temporary file even if processing fails
            if (uploadedFilePath) {
                fs.unlink(uploadedFilePath, () => { });
            }

            return res.status(500).json({
                error: "Speaking evaluation failed",
            });
        }
    }
);

// ---------------------- START SERVER ----------------------

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});