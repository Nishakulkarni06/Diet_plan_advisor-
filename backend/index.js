
import path from "path";
import { fileURLToPath } from "url";
import express from "express"; 
import cors from "cors";
import fs from "fs"; 
import admin from "firebase-admin";
import axios from "axios";


 
const app = express();
app.use(cors());
app.use(express.json());

// --- ES module compatible __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize Firebase Admin ---
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// --- Edit a patient plan by ID (Firestore) ---
app.put("/patient-plan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await db.collection("dietPlans").doc(id).update(updatedData);
    res.json({ success: true });
  } catch (err) {
    console.error("Update patient plan error:", err);
    res.status(500).json({ error: "Failed to update patient plan" });
  }
});

// --- Generate Diet Plan & Save to Firestore ---
app.post("/generate", async (req, res) => {
  try {
    const patientData = req.body;
    if (!patientData) return res.status(400).json({ error: "Patient data required" });

    // Fetch food items from Firestore
    const snapshot = await db.collection("foodItems").get();
    const foodData = snapshot.docs.map(doc => doc.data());

    // Combine patient + food data
    const combinedData = { ...patientData, foodData };

    // Call external diet API
    const response = await axios.post(
      "https://fourdietapi-1.onrender.com/generate_plan",
      combinedData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.DIET_PLANNER_API_KEY || "1234",
        },
        timeout: 60000,
      }
    );

    const dietPlan = response.data;
    let recommendedMeals = dietPlan.recommendedMeals || dietPlan.weekly_plan || dietPlan.recommendations || [];

    // Save the plan to Firestore
    const docRef = await db.collection("dietPlans").add({
      patient: patientData.personalInfo,
      vitals: patientData.vitals,
      lifestyle: patientData.lifestyle,
      ayurvedaProfile: patientData.ayurvedaProfile,
      dietaryPreferences: patientData.dietaryPreferences,
      goals: patientData.goals,
      dietPlan,
      recommendedMeals,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Return consistent structure to frontend
    return res.json({
      id: docRef.id,
      recommendedMeals,
      fullPlan: dietPlan,
    });
  } catch (err) {
    console.error("❌ Backend error:", err.response?.data || err.message);
    if (err.code === "ECONNABORTED") {
      return res.status(408).json({ error: "Request timeout - API took too long to respond" });
    }
    res.status(500).json({ error: "Failed to generate plan: " + (err.message || "Unknown error") });
  }
});

// --- Fetch latest saved diet plan from Firestore ---
app.get("/fetch-latest-plan", async (req, res) => {
  try {
    const snapshot = await db.collection("dietPlans").orderBy("createdAt", "desc").limit(1).get();
    if (snapshot.empty) {
      return res.json({ recommendedMeals: [] });
    }
    const doc = snapshot.docs[0].data();
    res.json({
      recommendedMeals: doc.recommendedMeals || [],
      fullPlan: doc.dietPlan || {},
      patientInfo: {
        personalInfo: doc.patient || {},
        vitals: doc.vitals || {},
        lifestyle: doc.lifestyle || {},
        ayurvedaProfile: doc.ayurvedaProfile || {},
        dietaryPreferences: doc.dietaryPreferences || {},
        goals: doc.goals || {},
        calculated: doc.calculated || {},
      },
    });
  } catch (err) {
    console.error("Fetch latest plan error:", err);
    res.status(500).json({ error: "Failed to fetch latest plan" });
  }
});

// --- Fetch a specific patient plan by ID from Firestore ---
app.get("/patient-plan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("dietPlans").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Patient plan not found" });
    }
    const data = doc.data();
    res.json({
      recommendedMeals: data.recommendedMeals || [],
      fullPlan: data.dietPlan || {},
      patientInfo: {
        personalInfo: data.patient || {},
        vitals: data.vitals || {},
        lifestyle: data.lifestyle || {},
        ayurvedaProfile: data.ayurvedaProfile || {},
        dietaryPreferences: data.dietaryPreferences || {},
        goals: data.goals || {},
        calculated: data.calculated || {},
      },
    });
  } catch (err) {
    console.error("❌ Fetch patient plan error:", err);
    res.status(500).json({ error: "Failed to fetch patient plan" });
  }
});


// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const foodItemsSnapshot = await db.collection("foodItems").get();
    const dietPlansSnapshot = await db.collection("dietPlans").get();
    res.json({
      status: "OK",
      message: "Diet Plan Advisor API is running",
      database: {
        foodItems: foodItemsSnapshot.size,
        dietPlans: dietPlansSnapshot.size,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch database stats" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Diet Plan Advisor API",
    endpoints: ["/generate", "/fetch-latest-plan", "/patient-plan/:id", "/health"],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
