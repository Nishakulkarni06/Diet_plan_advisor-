import { createRequire } from "module";
import admin from "firebase-admin";
import csv from "csvtojson";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Upload CSV
const uploadFoodCsv = async () => {
  try {
    const csvFilePath = "./foodData2.csv";
    const foodArray = await csv().fromFile(csvFilePath);

    const batch = db.batch();
    foodArray.forEach((food) => {
      const docRef = db.collection("foodItems").doc();
      batch.set(docRef, food);
    });

    await batch.commit();
    console.log("✅ Food data uploaded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error uploading food data:", err);
    process.exit(1);
  }
};

uploadFoodCsv();
