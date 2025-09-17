  // import express from "express";
  // import multer from "multer";
  // import cors from "cors";
  // import axios from "axios";
  // import csv from "csvtojson"; // npm install csvtojson

  // const app = express();
  // app.use(cors());

  // const upload = multer();

  // app.post(
  //   "/generate",
  //   upload.fields([{ name: "patientData" }, { name: "foodData" }]),
  //   async (req, res) => {
  //     try {
  //       if (!req.files?.patientData || !req.files?.foodData) {
  //         return res.status(400).json({ error: "Both files are required" });
  //       }

  //       // Parse patient JSON
  //       const patientJson = JSON.parse(req.files.patientData[0].buffer.toString("utf-8"));

  //       // Convert CSV to JSON
  //       const foodCsvBuffer = req.files.foodData[0].buffer.toString("utf-8");
  //       const foodJson = await csv().fromString(foodCsvBuffer);

  //       // Combine both
  //       const combinedData = {
  //         ...patientJson,
  //         foodData: foodJson,
  //       };

  //       // Send combined JSON to API
  //       const response = await axios.post(
  //         "https://fourdietapi-1.onrender.com/generate_plan",
  //         combinedData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             "X-API-Key": process.env.DIET_PLANNER_API_KEY || "1234",
  //           },
  //         }
  //       );

  //       // Forward API response to frontend
  //       res.json(response.data);

  //     } catch (err) {
  //       console.error("Backend error:", err.response?.data || err.message);
  //       res.status(500).json({ error: "Failed to generate plan" });
  //     }
  //   }
  // );

  // app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));



// backend/index.js
// backend/index.js
// server.js
// import express from "express";
// import cors from "cors";
// import admin from "firebase-admin";
// import axios from "axios";
// import fs from "fs";

// // Initialize Express
// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- Initialize Firebase Admin ---
// const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// // --- Generate Diet Plan & Save to Firestore ---
// app.post("/generate", async (req, res) => {
//   try {
//     const patientData = req.body;
//     if (!patientData) return res.status(400).json({ error: "Patient data required" });

//     // Fetch food items
//     const snapshot = await db.collection("foodItems").get();
//     const foodData = snapshot.docs.map(doc => doc.data());

//     // Combine patient + food data
//     const combinedData = { ...patientData, foodData };

//     // Call external diet API
//     const response = await axios.post(
//       "https://fourdietapi-1.onrender.com/generate_plan",
//       combinedData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": process.env.DIET_PLANNER_API_KEY || "1234",
//         },
//       }
//     );

//     const dietPlan = response.data;

//     // --- Save the plan to Firestore ---
//     await db.collection("dietPlans").add({
//       patient: patientData.personalInfo,
//       vitals: patientData.vitals,
//       lifestyle: patientData.lifestyle,
//       ayurvedaProfile: patientData.ayurvedaProfile,
//       dietaryPreferences: patientData.dietaryPreferences,
//       goals: patientData.goals,
//       dietPlan,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     // Return a consistent structure to frontend
//     res.json({
//       recommendedMeals: dietPlan.recommendedMeals || [],
//       fullPlan: dietPlan,
//     });

//     // Fetch latest saved diet plan
// app.get("/fetch-latest-plan", async (req, res) => {
//   try {
//     const snapshot = await db.collection("dietPlans").orderBy("createdAt", "desc").limit(1).get();
//     if (snapshot.empty) return res.json({ recommendedMeals: [] });
//     const doc = snapshot.docs[0].data();
//     res.json(doc.dietPlan); // send dietPlan object
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch latest plan" });
//   }
// });

//   } catch (err) {
//     console.error("Backend error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate and save plan" });
//   }
// });

// app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));





// import express from "express";
// import cors from "cors";
// import admin from "firebase-admin";
// import axios from "axios";
// import fs from "fs";

// // Initialize Express
// const app = express();
// app.use(cors());
// app.use(express.json());

// // --- Initialize Firebase Admin ---
// const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// // --- Generate Diet Plan & Save to Firestore ---
// app.post("/generate", async (req, res) => {
//   try {
//     const patientData = req.body;
//     if (!patientData) return res.status(400).json({ error: "Patient data required" });

//     // Fetch food items
//     const snapshot = await db.collection("foodItems").get();
//     const foodData = snapshot.docs.map(doc => doc.data());

//     // Combine patient + food data
//     const combinedData = { ...patientData, foodData };

//     // Call external diet API
//     const response = await axios.post(
//       "https://fourdietapi-1.onrender.com/generate_plan",
//       combinedData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-API-Key": process.env.DIET_PLANNER_API_KEY || "1234",
//         },
//         timeout: 25000,
//       }
//     );

//     const dietPlan = response.data;

//     // --- Save the plan to Firestore ---
//     await db.collection("dietPlans").add({
//       patient: patientData.personalInfo,
//       vitals: patientData.vitals,
//       lifestyle: patientData.lifestyle,
//       ayurvedaProfile: patientData.ayurvedaProfile,
//       dietaryPreferences: patientData.dietaryPreferences,
//       goals: patientData.goals,
//       dietPlan,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     // Return a consistent structure to frontend
//     return res.json({
//       recommendedMeals: dietPlan.recommendedMeals || [],
//       fullPlan: dietPlan,
//     });

//   } catch (err) {
//     console.error("Backend error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to generate and save plan" });
//   }
// });

// // --- Fetch latest saved diet plan (top-level route) ---
// app.get("/fetch-latest-plan", async (req, res) => {
//   try {
//     const snapshot = await db.collection("dietPlans")
//       .orderBy("createdAt", "desc")
//       .limit(1)
//       .get();

//     if (snapshot.empty) return res.json({ recommendedMeals: [] });

//     const doc = snapshot.docs[0].data();

//     // doc.dietPlan should be whatever you saved earlier. Normalize response:
//     const dietPlan = doc.dietPlan || {};
//     const recommendedMeals = dietPlan.recommendedMeals || dietPlan.recommendations || [];

//     // Return structure frontend expects (recommendedMeals + fullPlan)
//     res.json({
//       recommendedMeals,
//       fullPlan: dietPlan
//     });

//   } catch (err) {
//     console.error("Fetch latest plan error:", err);
//     res.status(500).json({ error: "Failed to fetch latest plan" });
//   }
// });

// app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));






import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import axios from "axios";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// --- Generate Diet Plan & Save to Firestore ---
app.post("/generate", async (req, res) => {
  try {
    const patientData = req.body;
    if (!patientData) return res.status(400).json({ error: "Patient data required" });

    // Fetch food items
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
        timeout: 25000,
      }
    );

    const dietPlan = response.data;

    // --- Ensure recommendedMeals exists ---
    let recommendedMeals = dietPlan.recommendedMeals;
    if (!recommendedMeals || recommendedMeals.length === 0) {
      recommendedMeals = dietPlan.weekly_plan || dietPlan.recommendations || [];
    }

    // --- Save to Firestore ---
    await db.collection("dietPlans").add({
      patient: patientData.personalInfo,
      vitals: patientData.vitals,
      lifestyle: patientData.lifestyle,
      ayurvedaProfile: patientData.ayurvedaProfile,
      dietaryPreferences: patientData.dietaryPreferences,
      goals: patientData.goals,
      dietPlan,
      recommendedMeals, // Save normalized array
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Return consistent structure to frontend
    return res.json({
      recommendedMeals,
      fullPlan: dietPlan,
    });

  } catch (err) {
    console.error("Backend error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate and save plan" });
  }
});

// --- Fetch latest saved diet plan ---
app.get("/fetch-latest-plan", async (req, res) => {
  try {
    const snapshot = await db.collection("dietPlans")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) return res.json({ recommendedMeals: [] });

    const doc = snapshot.docs[0].data();

    res.json({
      recommendedMeals: doc.recommendedMeals || [],
      fullPlan: doc.dietPlan || {},
    });

  } catch (err) {
    console.error("Fetch latest plan error:", err);
    res.status(500).json({ error: "Failed to fetch latest plan" });
  }
});

app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));
