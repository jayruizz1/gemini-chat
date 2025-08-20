import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder in the root of the project
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(cors());

// Gemini AI client
const ai = new GoogleGenAI({});

// Endpoint to talk to Gemini
app.post("/api/chat", async (req, res) => {
  const message = req.body?.message || "";
  if (!message) return res.json({ reply: "Please type something!" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    const text = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Error talking to AI." });
  }
});

// Fallback: serve index.html for any unknown route
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
