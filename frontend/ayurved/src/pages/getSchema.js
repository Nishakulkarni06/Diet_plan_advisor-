import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase.js"; // your Firebase config

// Helper to recursively get field structure
const extractSchema = (obj) => {
  const schema = {};
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      schema[key] = extractSchema(obj[key]); // recursive for nested objects
    } else if (Array.isArray(obj[key])) {
      schema[key] = `[${obj[key].length > 0 ? typeof obj[key][0] : "unknown"}]`;
    } else {
      schema[key] = typeof obj[key];
    }
  }
  return schema;
};

const getSchema = async () => {
  try {
    const colRef = collection(db, "dietPlans"); // or "patient"
    const docsSnap = await getDocs(colRef);

    docsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      console.log("Document ID:", docSnap.id);
      console.log("Full schema:", JSON.stringify(extractSchema(data), null, 2));
    });
  } catch (err) {
    console.error("Error fetching schema:", err);
  }
};

getSchema();
