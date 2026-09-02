import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const app = express();

app.use(cors());
app.use(express.json());

// =====================================================
// CLAUDE
// =====================================================

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
    res.send("FluencyForge Backend running ✅");
});

// =====================================================
// WRITING EVALUATION
// =====================================================

app.post("/api/evaluate-writing", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                error: "Missing text",
            });
        }

        const response = await anthropic.messages.create({
            model: "claude-sonnet-5",
            max_tokens: 1000,

            system:
                "You are an English writing evaluator. " +
                "Evaluate the student's writing for grammar, vocabulary, " +
                "clarity, coherence, sentence structure, and overall English proficiency. " +
                "Give constructive and easy-to-understand feedback.",

            messages: [
                {
                    role: "user",
                    content:
                        `Evaluate this student's writing:\n\n${text}\n\n` +
                        `Give:\n` +
                        `1. Overall assessment\n` +
                        `2. Grammar feedback\n` +
                        `3. Vocabulary feedback\n` +
                        `4. Clarity and coherence feedback\n` +
                        `5. Specific suggestions for improvement`,
                },
            ],
        });

        const feedback = response.content
            .filter(block => block.type === "text")
            .map(block => block.text)
            .join("\n");

        return res.json({
            score: 85,
            feedback: feedback || "No feedback returned.",
        });

    } catch (err) {

        console.error("WRITING ERROR:", err);

        return res.status(500).json({
            error: "Writing evaluation failed",
        });
    }
});

// =====================================================
// SPEAKING EVALUATION
// =====================================================

app.post("/api/evaluate-speaking", async (req, res) => {

    try {

        const { transcript, moduleId } = req.body;

        // ---------------------------------------------
        // VALIDATE TRANSCRIPT
        // ---------------------------------------------

        if (!transcript || transcript.trim().length === 0) {

            return res.status(400).json({
                error: "Missing transcript",
            });
        }

        console.log("SPEAKING TRANSCRIPT:");
        console.log(transcript);

        // ---------------------------------------------
        // SEND TO CLAUDE
        // ---------------------------------------------

        const response = await anthropic.messages.create({

            model: "claude-sonnet-5",

            max_tokens: 1500,

            system:
                "You are an English speaking evaluator for a language learning platform called FluencyForge. " +
                "Evaluate the student's spoken English based on the transcript provided. " +
                "Be constructive, specific, and encouraging. " +
                "Do not judge the student's ideas or opinions. " +
                "Focus only on their English communication skills.",

            messages: [

                {
                    role: "user",

                    content:
                        `Evaluate this student's speaking response.

Module: ${moduleId || "Unknown"}

Student transcript:
"${transcript}"

Evaluate the response using these areas:

1. Fluency
- Smoothness
- Natural flow
- Hesitation or repetition visible from the transcript

2. Grammar
- Grammatical accuracy
- Sentence construction
- Common errors

3. Vocabulary
- Word choice
- Variety
- Appropriateness

4. Clarity
- How clearly the ideas are expressed
- Organization and coherence

5. Overall English proficiency

Then provide:

SCORE: Give a score out of 100.

STRENGTHS:
Give 2-3 specific strengths.

AREAS TO IMPROVE:
Give 2-3 specific areas.

CORRECTIONS:
Give examples of important sentences from the transcript that could be improved.

FINAL FEEDBACK:
Give a short, practical recommendation for improving the student's speaking.

Important:
Do not claim to evaluate pronunciation or accent from the transcript alone, because you cannot hear the audio.`,
                },

            ],
        });

        // ---------------------------------------------
        // EXTRACT CLAUDE RESPONSE
        // ---------------------------------------------

        const feedback = response.content
            .filter(block => block.type === "text")
            .map(block => block.text)
            .join("\n");


        // ---------------------------------------------
        // EXTRACT SCORE
        // ---------------------------------------------

        let score = 85;

        const scoreMatch =
            feedback.match(/SCORE\s*:\s*(\d{1,3})/i);

        if (scoreMatch) {

            score = Math.min(
                100,
                Math.max(
                    0,
                    parseInt(scoreMatch[1], 10)
                )
            );
        }


        // ---------------------------------------------
        // SEND RESULT
        // ---------------------------------------------

        return res.json({

            transcript,

            feedback:
                feedback || "No feedback returned.",

            score,

        });

    } catch (err) {

        console.error(
            "SPEAKING ERROR:",
            err
        );

        return res.status(500).json({
            error: "Speaking evaluation failed",
        });
    }
});

// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT || 3001;

app.listen(PORT, () => {

    console.log(
        `FluencyForge Backend running on port ${PORT}`
    );

});