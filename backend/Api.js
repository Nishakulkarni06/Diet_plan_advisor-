import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import { db } from "./firebase.js";


dotenv.config({ path: "./Api.env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.post("/generate", async (req, res) => {
//   try {
//     // ✅ No prompt needed from frontend now

//     // Read JSON files
//     const file1Path = path.join(process.cwd(), "patient.json");
//     const file2Path = path.join(process.cwd(), "food.json");

//     const file1Data = JSON.parse(fs.readFileSync(file1Path, "utf-8"));
//     const file2Data = JSON.parse(fs.readFileSync(file2Path, "utf-8"));

//     // Combine data into a single string
//     const combinedInput = `
// Patient Data: ${JSON.stringify(file1Data, null, 2)}
// Food Dataset: ${JSON.stringify(file2Data, null, 2)}
// `;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // ✅ Fixed instruction, no need to pass anything from frontend
//     const chat = model.startChat({
//       history: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `You are given two JSON files: 
// 1) Ayurvedic dish dataset (food.json)
// 2) Patient profile (patient.json)

// Generate a 7-day meal plan as a JSON object with this exact structure:
// {
//   "Monday": { "breakfast": ["Dish1", "Dish2"], "lunch": ["Dish3"], "dinner": ["Dish4"] },
//   "Tuesday": { ... },
//   ...
//   "Sunday": { ... }
// }

//  Rules:
// - Only output valid JSON.
// - Each day must have breakfast, lunch, dinner keys.
// - Each value must be an array of dish names from food.json.
// - No explanation, no extra text — just the JSON object.

// Now create the plan based on the patient's health data.`
//             }
//           ]
//         }
//       ]
//     });

//     const result = await chat.sendMessage(combinedInput);
//     const text = result.response.text();

//     res.status(200).json({ response: text });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "An internal server error occurred." });
//   }
// });


app.post("/generate", async (req, res) => {
  try {
    const { patientNumber } = req.body;
    console.log("Received patientNumber from frontend:", patientNumber);

    if (!patientNumber) {
      return res.status(400).json({ error: "Patient number is required" });
    }

    // // Fetch patient data from Firestore
    // const patientRef = db.collection("patient").doc(patientNumber);
    // const patientDoc = await patientRef.get();

    //  console.log("Patient document exists?", patientDoc.exists);

    // if (!patientDoc.exists) {
    //   return res.status(404).json({ error: "Patient not found" });
    // }

    // const patientData = patientDoc.data();

const patientQuery = await db.collection("patient")
  .where("patientNumber", "==", patientNumber)
  .limit(1)
  .get();

if (patientQuery.empty) {
  return res.status(404).json({ error: "Patient not found" });
}

const patientData = patientQuery.docs[0].data();

    // Read food.json (can also move this to Firestore later)
    const file2Path = path.join(process.cwd(), "food.json");
    const foodData = JSON.parse(fs.readFileSync(file2Path, "utf-8"));

    // Combine into a single string for Gemini
    const combinedInput = `
Patient Data: ${JSON.stringify(patientData, null, 2)}
Food Dataset: ${JSON.stringify(foodData, null, 2)}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are given two JSON inputs: 
1) Ayurvedic dish dataset (food.json)
2) Patient profile (from Firestore)

Generate a 7-day meal plan as a JSON object with this exact structure:
{
  "Monday": { "breakfast": ["Dish1", "Dish2"], "lunch": ["Dish3"], "dinner": ["Dish4"] },
  "Tuesday": { ... },
  ...
  "Sunday": { ... }
}

Rules:
- Only output valid JSON.
- Each day must have breakfast, lunch, dinner keys.
- Each value must be an array of dish names from food.json.
- No explanation, no extra text — just the JSON object.

Now create the plan based on the patient's health data.`
            }
          ]
        }
      ]
    });

    const result = await chat.sendMessage(combinedInput);
    const text = result.response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Error:", error);
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


