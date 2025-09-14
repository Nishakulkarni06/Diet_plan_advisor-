import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs"; // ✅ Add file system module
import path from "path";

dotenv.config({ path: "./Api.env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // ✅ Read both JSON files
    const file1Path = path.join(process.cwd(),  "patient.json");
    const file2Path = path.join(process.cwd(), "food.json");

    const file1Data = JSON.parse(fs.readFileSync(file1Path, "utf-8"));
    const file2Data = JSON.parse(fs.readFileSync(file2Path, "utf-8"));

    // ✅ Convert JSON to string (Gemini expects text input)
    const combinedInput = `
Here is some data from two JSON files:

File 1: ${JSON.stringify(file1Data, null, 2)}
File 2: ${JSON.stringify(file2Data, null, 2)}

User Prompt: ${prompt}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful assistant. Always analyze JSON carefully and give structured, clear responses."
            }
          ]
        }
      ]
    });

    const result = await chat.sendMessage(combinedInput);
    const text = result.response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

app.get("/", (req, res) => {
  res.send("Gemini API server is running! Use POST /generate to interact.");
});

console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Not Loaded ❌");

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
