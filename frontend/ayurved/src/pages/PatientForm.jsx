// import React, { useState } from "react";

// export default function PatientForm() {
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "",
//       dob: "",
//       gender: "",
//       age: "",
//       contact: { phone: "", email: "" },
//     },
//     vitals: {
//       height_cm: "",
//       weight_kg: "",
//       bmi: "",
//       bp: "",
//       pulseRate: "",
//       respirationRate: "",
//       temperature: "",
//     },
//     ayurvedaProfile: {
//       prakriti: "",
//       doshaImbalance: "",
//       agni: "",
//       tastePref: [],
//       foodProperties: [],
//       season: "",
//     },
//     lifestyle: {
//       dietType: "",
//       mealFreq: "",
//       waterIntake_l: "",
//       bowel: "",
//       sleepPattern: "",
//       physicalActivity: "",
//       stressLevel: "",
//     },
//     medicalInfo: {
//       allergies: [],
//       conditions: [],
//       medications: [],
//       labReports: {
//         bloodSugarFasting: "",
//         cholesterol: "",
//         hb: "",
//       },
//     },
//     dietaryPreferences: {
//       avoidFoods: [],
//       preferredFoods: [],
//       restrictedByReligion: "No",
//     },
//     goals: { shortTerm: "", longTerm: "" },
//     attachments: [],
//     calculated: { age: "", bmi: "" },
//   });

//   // --- Handle Nested Updates ---
//   const handleChange = (path, value) => {
//     setFormData((prev) => {
//       const updated = { ...prev };
//       let ref = updated;
//       const keys = path.split(".");
//       keys.slice(0, -1).forEach((k) => {
//         if (!ref[k]) ref[k] = {};
//         ref = ref[k];
//       });
//       ref[keys[keys.length - 1]] = value;
//       return updated;
//     });
//   };

//   // --- Auto Calculate Age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const dob = new Date(formData.personalInfo.dob);
//       const age = new Date().getFullYear() - dob.getFullYear();
//       handleChange("personalInfo.age", age);
//       handleChange("calculated.age", age);
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       handleChange("vitals.bmi", bmi);
//       handleChange("calculated.bmi", bmi);
//     }
//   };

//   // --- Handle File Upload ---
//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files).map((file) => ({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }));
//     handleChange("attachments", files);
//   };

//   // --- Submit ---
// const handleSubmit = async () => {
//   try {
//     setLoading(true);

//     const res = await axios.post("http://localhost:3000/generate", formData);

//     setPlan(res.data); // plan used in your Diet Chart UI
//     alert("Diet plan generated and saved!");
//   } catch (err) {
//     console.error(err);
//     alert("Error generating diet plan");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       {/* --- Step 1: Personal Info --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 1: Personal Info</h2>
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="border p-2 w-full"
//           value={formData.personalInfo.fullName}
//           onChange={(e) =>
//             handleChange("personalInfo.fullName", e.target.value)
//           }
//         />
//         <input
//           type="date"
//           className="border p-2 w-full"
//           value={formData.personalInfo.dob}
//           onChange={(e) => handleChange("personalInfo.dob", e.target.value)}
//           onBlur={handleAutoCalc}
//         />
//         <select
//           className="border p-2 w-full"
//           value={formData.personalInfo.gender}
//           onChange={(e) => handleChange("personalInfo.gender", e.target.value)}
//         >
//           <option value="">Select Gender</option>
//           <option>Male</option>
//           <option>Female</option>
//           <option>Other</option>
//         </select>
//         <input
//           type="number"
//           placeholder="Age"
//           className="border p-2 w-full"
//           value={formData.personalInfo.age}
//           readOnly
//         />
//         <input
//           type="text"
//           placeholder="Phone"
//           className="border p-2 w-full"
//           value={formData.personalInfo.contact.phone}
//           onChange={(e) =>
//             handleChange("personalInfo.contact.phone", e.target.value)
//           }
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 w-full"
//           value={formData.personalInfo.contact.email}
//           onChange={(e) =>
//             handleChange("personalInfo.contact.email", e.target.value)
//           }
//         />
//       </div>

//       {/* --- Step 2: Vitals --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 2: Vitals</h2>
//         <input
//           type="number"
//           placeholder="Height (cm)"
//           className="border p-2 w-full"
//           value={formData.vitals.height_cm}
//           onChange={(e) => handleChange("vitals.height_cm", +e.target.value)}
//           onBlur={handleAutoCalc}
//         />
//         <input
//           type="number"
//           placeholder="Weight (kg)"
//           className="border p-2 w-full"
//           value={formData.vitals.weight_kg}
//           onChange={(e) => handleChange("vitals.weight_kg", +e.target.value)}
//           onBlur={handleAutoCalc}
//         />
//         <input
//           type="text"
//           placeholder="BMI"
//           className="border p-2 w-full"
//           value={formData.vitals.bmi}
//           readOnly
//         />
//         <input
//           type="text"
//           placeholder="Blood Pressure"
//           className="border p-2 w-full"
//           value={formData.vitals.bp}
//           onChange={(e) => handleChange("vitals.bp", e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Pulse Rate"
//           className="border p-2 w-full"
//           value={formData.vitals.pulseRate}
//           onChange={(e) => handleChange("vitals.pulseRate", +e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Respiration Rate"
//           className="border p-2 w-full"
//           value={formData.vitals.respirationRate}
//           onChange={(e) =>
//             handleChange("vitals.respirationRate", +e.target.value)
//           }
//         />
//         <input
//           type="text"
//           placeholder="Temperature (°F/°C)"
//           className="border p-2 w-full"
//           value={formData.vitals.temperature}
//           onChange={(e) => handleChange("vitals.temperature", e.target.value)}
//         />
//       </div>

//       {/* --- Step 3: Ayurveda Profile --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 3: Ayurveda Profile</h2>
//         <select
//           className="border p-2 w-full"
//           value={formData.ayurvedaProfile.prakriti}
//           onChange={(e) => handleChange("ayurvedaProfile.prakriti", e.target.value)}
//         >
//           <option value="">Select Prakriti</option>
//           <option>Vata</option>
//           <option>Pitta</option>
//           <option>Kapha</option>
//           <option>Mixed</option>
//         </select>
//         <select
//           className="border p-2 w-full"
//           value={formData.ayurvedaProfile.doshaImbalance}
//           onChange={(e) =>
//             handleChange("ayurvedaProfile.doshaImbalance", e.target.value)
//           }
//         >
//           <option value="">Select Dosha Imbalance</option>
//           <option>↑ Vata</option>
//           <option>↑ Pitta</option>
//           <option>↑ Kapha</option>
//           <option>Balanced</option>
//         </select>
//         <select
//           className="border p-2 w-full"
//           value={formData.ayurvedaProfile.agni}
//           onChange={(e) => handleChange("ayurvedaProfile.agni", e.target.value)}
//         >
//           <option value="">Select Agni</option>
//           <option>Manda</option>
//           <option>Sama</option>
//           <option>Tikshna</option>
//           <option>Vishama</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Taste Preferences (comma separated)"
//           className="border p-2 w-full"
//           value={formData.ayurvedaProfile.tastePref.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "ayurvedaProfile.tastePref",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <input
//           type="text"
//           placeholder="Food Properties (comma separated)"
//           className="border p-2 w-full"
//           value={formData.ayurvedaProfile.foodProperties.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "ayurvedaProfile.foodProperties",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <select
//           className="border p-2 w-full"
//           value={formData.ayurvedaProfile.season}
//           onChange={(e) => handleChange("ayurvedaProfile.season", e.target.value)}
//         >
//           <option value="">Select Season</option>
//           <option>Summer</option>
//           <option>Winter</option>
//           <option>Rainy</option>
//           <option>All</option>
//         </select>
//       </div>

//       {/* --- Step 4: Lifestyle --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 4: Lifestyle</h2>
//         <select
//           className="border p-2 w-full"
//           value={formData.lifestyle.dietType}
//           onChange={(e) => handleChange("lifestyle.dietType", e.target.value)}
//         >
//           <option value="">Select Diet Type</option>
//           <option>Vegetarian</option>
//           <option>Non-Vegetarian</option>
//           <option>Vegan</option>
//         </select>
//         <input
//           type="number"
//           placeholder="Meal Frequency"
//           className="border p-2 w-full"
//           value={formData.lifestyle.mealFreq}
//           onChange={(e) => handleChange("lifestyle.mealFreq", +e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Water Intake (litres/day)"
//           className="border p-2 w-full"
//           value={formData.lifestyle.waterIntake_l}
//           onChange={(e) => handleChange("lifestyle.waterIntake_l", +e.target.value)}
//         />
//         <select
//           className="border p-2 w-full"
//           value={formData.lifestyle.bowel}
//           onChange={(e) => handleChange("lifestyle.bowel", e.target.value)}
//         >
//           <option value="">Bowel Habits</option>
//           <option>Normal</option>
//           <option>Constipated</option>
//           <option>Loose</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Sleep Pattern"
//           className="border p-2 w-full"
//           value={formData.lifestyle.sleepPattern}
//           onChange={(e) => handleChange("lifestyle.sleepPattern", e.target.value)}
//         />
//         <select
//           className="border p-2 w-full"
//           value={formData.lifestyle.physicalActivity}
//           onChange={(e) =>
//             handleChange("lifestyle.physicalActivity", e.target.value)
//           }
//         >
//           <option value="">Physical Activity</option>
//           <option>Low</option>
//           <option>Moderate</option>
//           <option>High</option>
//         </select>
//         <select
//           className="border p-2 w-full"
//           value={formData.lifestyle.stressLevel}
//           onChange={(e) => handleChange("lifestyle.stressLevel", e.target.value)}
//         >
//           <option value="">Stress Level</option>
//           <option>Low</option>
//           <option>Moderate</option>
//           <option>High</option>
//         </select>
//       </div>

//       {/* --- Step 5: Medical Info --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 5: Medical Info</h2>
//         <input
//           type="text"
//           placeholder="Allergies (comma separated)"
//           className="border p-2 w-full"
//           value={formData.medicalInfo.allergies.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "medicalInfo.allergies",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <input
//           type="text"
//           placeholder="Conditions (comma separated)"
//           className="border p-2 w-full"
//           value={formData.medicalInfo.conditions.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "medicalInfo.conditions",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <input
//           type="text"
//           placeholder="Medications (comma separated)"
//           className="border p-2 w-full"
//           value={formData.medicalInfo.medications.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "medicalInfo.medications",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <input
//           type="text"
//           placeholder="Blood Sugar Fasting"
//           className="border p-2 w-full"
//           value={formData.medicalInfo.labReports.bloodSugarFasting}
//           onChange={(e) =>
//             handleChange("medicalInfo.labReports.bloodSugarFasting", e.target.value)
//           }
//         />
//         <input
//           type="text"
//           placeholder="Cholesterol"
//           className="border p-2 w-full"
//           value={formData.medicalInfo.labReports.cholesterol}
//           onChange={(e) =>
//             handleChange("medicalInfo.labReports.cholesterol", e.target.value)
//           }
//         />
//         <input
//           type="text"
//           placeholder="HB"
//           className="border p-2 w-full"
//           value={formData.medicalInfo.labReports.hb}
//           onChange={(e) => handleChange("medicalInfo.labReports.hb", e.target.value)}
//         />
//       </div>

//       {/* --- Step 6: Dietary Preferences & Goals --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">
//           Step 6: Dietary Preferences & Goals
//         </h2>
//         <input
//           type="text"
//           placeholder="Foods to Avoid (comma separated)"
//           className="border p-2 w-full"
//           value={formData.dietaryPreferences.avoidFoods.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "dietaryPreferences.avoidFoods",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <input
//           type="text"
//           placeholder="Preferred Foods (comma separated)"
//           className="border p-2 w-full"
//           value={formData.dietaryPreferences.preferredFoods.join(", ")}
//           onChange={(e) =>
//             handleChange(
//               "dietaryPreferences.preferredFoods",
//               e.target.value.split(",").map((s) => s.trim())
//             )
//           }
//         />
//         <select
//           className="border p-2 w-full"
//           value={formData.dietaryPreferences.restrictedByReligion}
//           onChange={(e) =>
//             handleChange("dietaryPreferences.restrictedByReligion", e.target.value)
//           }
//         >
//           <option>No</option>
//           <option>Yes</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Short-term Goal"
//           className="border p-2 w-full"
//           value={formData.goals.shortTerm}
//           onChange={(e) => handleChange("goals.shortTerm", e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Long-term Goal"
//           className="border p-2 w-full"
//           value={formData.goals.longTerm}
//           onChange={(e) => handleChange("goals.longTerm", e.target.value)}
//         />
//       </div>

//       {/* --- Step 7: Attachments --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 7: Attachments</h2>
//         <input
//           type="file"
//           multiple
//           className="border p-2 w-full"
//           onChange={handleFileUpload}
//         />
//         <ul className="list-disc ml-5">
//           {formData.attachments.map((file, i) => (
//             <li key={i}>
//               {file.name} ({(file.size / 1024).toFixed(1)} KB)
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* --- Submit --- */}
//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         Save Patient JSON
//       </button>
//     </div>
//   );
// }



// import React, { useState } from "react";
// import axios from "axios";

// export default function PatientForm() {
//   const [formData, setFormData] = useState({
//     personalInfo: { fullName: "", dob: "", gender: "", age: "", contact: { phone: "", email: "" } },
//     vitals: { height_cm: "", weight_kg: "", bmi: "", bp: "", pulseRate: "", respirationRate: "", temperature: "" },
//     ayurvedaProfile: { prakriti: "", doshaImbalance: "", agni: "", tastePref: [], foodProperties: [], season: "" },
//     lifestyle: { dietType: "", mealFreq: "", waterIntake_l: "", bowel: "", sleepPattern: "", physicalActivity: "", stressLevel: "" },
//     medicalInfo: { allergies: [], conditions: [], medications: [], labReports: { bloodSugarFasting: "", cholesterol: "", hb: "" } },
//     dietaryPreferences: { avoidFoods: [], preferredFoods: [], restrictedByReligion: "No" },
//     goals: { shortTerm: "", longTerm: "" },
//     attachments: [],
//     calculated: { age: "", bmi: "" },
//   });

//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // --- Handle Nested Updates ---
//   const handleChange = (path, value) => {
//     setFormData((prev) => {
//       const updated = { ...prev };
//       let ref = updated;
//       const keys = path.split(".");
//       keys.slice(0, -1).forEach((k) => { if (!ref[k]) ref[k] = {}; ref = ref[k]; });
//       ref[keys[keys.length - 1]] = value;
//       return updated;
//     });
//   };

//   // --- Auto calculate age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const dob = new Date(formData.personalInfo.dob);
//       const age = new Date().getFullYear() - dob.getFullYear();
//       handleChange("personalInfo.age", age);
//       handleChange("calculated.age", age);
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       handleChange("vitals.bmi", bmi);
//       handleChange("calculated.bmi", bmi);
//     }
//   };

//   // --- Handle file uploads ---
//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files).map((file) => ({
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }));
//     handleChange("attachments", files);
//   };

//   // --- Submit form & get diet plan ---
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.post("http://localhost:3000/generate", formData);
//       setPlan(res.data);
//       alert("✅ Diet plan generated successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error generating diet plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       {/* --- Personal Info --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 1: Personal Info</h2>
//         <input type="text" placeholder="Full Name" className="border p-2 w-full"
//           value={formData.personalInfo.fullName} onChange={(e) => handleChange("personalInfo.fullName", e.target.value)} />
//         <input type="date" className="border p-2 w-full"
//           value={formData.personalInfo.dob} onChange={(e) => handleChange("personalInfo.dob", e.target.value)}
//           onBlur={handleAutoCalc} />
//         <select className="border p-2 w-full" value={formData.personalInfo.gender}
//           onChange={(e) => handleChange("personalInfo.gender", e.target.value)}>
//           <option value="">Select Gender</option>
//           <option>Male</option><option>Female</option><option>Other</option>
//         </select>
//         <input type="number" placeholder="Age" className="border p-2 w-full"
//           value={formData.personalInfo.age} readOnly />
//         <input type="text" placeholder="Phone" className="border p-2 w-full"
//           value={formData.personalInfo.contact.phone}
//           onChange={(e) => handleChange("personalInfo.contact.phone", e.target.value)} />
//         <input type="email" placeholder="Email" className="border p-2 w-full"
//           value={formData.personalInfo.contact.email}
//           onChange={(e) => handleChange("personalInfo.contact.email", e.target.value)} />
//       </div>

//       {/* --- Vitals --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 2: Vitals</h2>
//         <input type="number" placeholder="Height (cm)" className="border p-2 w-full"
//           value={formData.vitals.height_cm} onChange={(e) => handleChange("vitals.height_cm", +e.target.value)}
//           onBlur={handleAutoCalc} />
//         <input type="number" placeholder="Weight (kg)" className="border p-2 w-full"
//           value={formData.vitals.weight_kg} onChange={(e) => handleChange("vitals.weight_kg", +e.target.value)}
//           onBlur={handleAutoCalc} />
//         <input type="text" placeholder="BMI" className="border p-2 w-full" value={formData.vitals.bmi} readOnly />
//         <input type="text" placeholder="Blood Pressure" className="border p-2 w-full"
//           value={formData.vitals.bp} onChange={(e) => handleChange("vitals.bp", e.target.value)} />
//         <input type="number" placeholder="Pulse Rate" className="border p-2 w-full"
//           value={formData.vitals.pulseRate} onChange={(e) => handleChange("vitals.pulseRate", +e.target.value)} />
//         <input type="number" placeholder="Respiration Rate" className="border p-2 w-full"
//           value={formData.vitals.respirationRate} onChange={(e) => handleChange("vitals.respirationRate", +e.target.value)} />
//         <input type="text" placeholder="Temperature (°F/°C)" className="border p-2 w-full"
//           value={formData.vitals.temperature} onChange={(e) => handleChange("vitals.temperature", e.target.value)} />
//       </div>

//       {/* --- Ayurveda Profile --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Step 3: Ayurveda Profile</h2>
//         <select className="border p-2 w-full" value={formData.ayurvedaProfile.prakriti}
//           onChange={(e) => handleChange("ayurvedaProfile.prakriti", e.target.value)}>
//           <option value="">Select Prakriti</option><option>Vata</option><option>Pitta</option><option>Kapha</option><option>Mixed</option>
//         </select>
//         <select className="border p-2 w-full" value={formData.ayurvedaProfile.doshaImbalance}
//           onChange={(e) => handleChange("ayurvedaProfile.doshaImbalance", e.target.value)}>
//           <option value="">Select Dosha Imbalance</option><option>↑ Vata</option><option>↑ Pitta</option><option>↑ Kapha</option><option>Balanced</option>
//         </select>
//         <select className="border p-2 w-full" value={formData.ayurvedaProfile.agni}
//           onChange={(e) => handleChange("ayurvedaProfile.agni", e.target.value)}>
//           <option value="">Select Agni</option><option>Manda</option><option>Sama</option><option>Tikshna</option><option>Vishama</option>
//         </select>
//         <input type="text" placeholder="Taste Preferences (comma separated)" className="border p-2 w-full"
//           value={formData.ayurvedaProfile.tastePref.join(", ")}
//           onChange={(e) => handleChange("ayurvedaProfile.tastePref", e.target.value.split(",").map(s => s.trim()))} />
//         <input type="text" placeholder="Food Properties (comma separated)" className="border p-2 w-full"
//           value={formData.ayurvedaProfile.foodProperties.join(", ")}
//           onChange={(e) => handleChange("ayurvedaProfile.foodProperties", e.target.value.split(",").map(s => s.trim()))} />
//         <select className="border p-2 w-full" value={formData.ayurvedaProfile.season}
//           onChange={(e) => handleChange("ayurvedaProfile.season", e.target.value)}>
//           <option value="">Select Season</option><option>Summer</option><option>Winter</option><option>Rainy</option><option>All</option>
//         </select>
//       </div>

//       {/* --- File Attachments --- */}
//       <div className="p-4 border rounded-xl shadow-md space-y-2">
//         <h2 className="text-lg font-semibold">Attachments</h2>
//         <input type="file" multiple className="border p-2 w-full" onChange={handleFileUpload} />
//         <ul className="list-disc ml-5">
//           {formData.attachments.map((file, i) => (
//             <li key={i}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
//           ))}
//         </ul>
//       </div>

//       {/* --- Submit --- */}
//       <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg">
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {/* --- Display generated diet plan --- */}
//       {plan && (
//         <div className="mt-6 p-4 border rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold">Diet Plan for {formData.personalInfo.fullName}</h2>
//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b">
//               <h3 className="font-semibold">Day {day.day}</h3>
//               <p>Breakfast: {day.breakfast}</p>
//               <p>Lunch: {day.lunch}</p>
//               <p>Dinner: {day.dinner}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }






// import React, { useState } from "react";
// import axios from "axios";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // --- Pre-filled formData for testing ---
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "Rohan Verma",
//       dob: "1980-05-15",
//       gender: "Male",
//       age: 43,
//       contact: { phone: "9999999999", email: "example@mail.com" },
//     },
//     vitals: {
//       height_cm: 175,
//       weight_kg: 82,
//       bmi: 26.8,
//       bp: "120/80",
//       pulseRate: 70,
//       respirationRate: 16,
//       temperature: "98.6",
//     },
//     ayurvedaProfile: {
//       prakriti: "Mixed",
//       doshaImbalance: "Balanced",
//       agni: "Sama",
//       tastePref: ["Sweet", "Bitter"],
//       foodProperties: ["Light", "Dry"],
//       season: "All",
//     },
//     lifestyle: {
//       dietType: "Vegetarian",
//       mealFreq: 3,
//       waterIntake_l: 2,
//       bowel: "Normal",
//       sleepPattern: "Regular",
//       physicalActivity: "Moderate",
//       stressLevel: "Moderate",
//     },
//     medicalInfo: {
//       allergies: [],
//       conditions: [],
//       medications: [],
//       labReports: { bloodSugarFasting: "90", cholesterol: "180", hb: "14" },
//     },
//     dietaryPreferences: { avoidFoods: [], preferredFoods: [], restrictedByReligion: "No" },
//     goals: { shortTerm: "Maintain weight", longTerm: "Improve digestion" },
//     attachments: [],
//     calculated: { age: 43, bmi: 26.8 },
//   });

//   // --- Handle nested updates ---
//   const handleChange = (path, value) => {
//     setFormData(prev => {
//       const updated = { ...prev };
//       let ref = updated;
//       const keys = path.split(".");
//       keys.slice(0, -1).forEach(k => { if (!ref[k]) ref[k] = {}; ref = ref[k]; });
//       ref[keys[keys.length - 1]] = value;
//       return updated;
//     });
//   };

//   // --- Auto calculate age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const dob = new Date(formData.personalInfo.dob);
//       const age = new Date().getFullYear() - dob.getFullYear();
//       handleChange("personalInfo.age", age);
//       handleChange("calculated.age", age);
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       handleChange("vitals.bmi", bmi);
//       handleChange("calculated.bmi", bmi);
//     }
//   };

//   // --- Submit form ---
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();

//       const res = await axios.post("http://localhost:3000/generate", formData);

//       setPlan(res.data);
//       alert("✅ Diet plan generated and saved!");
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("❌ Error generating diet plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form (Test Mode)</h1>

//       {/* --- Submit Button --- */}
//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {/* --- Display Generated Plan --- */}
//       {plan?.recommendedMeals?.length > 0 && (
//         <div className="mt-6 p-4 border rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold">
//             Diet Plan for {formData.personalInfo.fullName}
//           </h2>

//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b">
//               <h3 className="font-semibold">Day {day.day}</h3>
//               <p><strong>Breakfast:</strong> {day.breakfast}</p>
//               <p><strong>Lunch:</strong> {day.lunch}</p>
//               <p><strong>Dinner:</strong> {day.dinner}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// PatientForm.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "Rohan Verma",
//       dob: "1980-05-15",
//       gender: "Male",
//       age: 45,
//       contact: { phone: "+919876543210", email: "rohan.verma@example.com" }
//     },
//     vitals: {
//       height_cm: 175,
//       weight_kg: 82,
//       bmi: 26.8,
//       bp: "140/90",
//       pulseRate: 78,
//       respirationRate: 16,
//       temperature: "98.4"
//     },
//     ayurvedaProfile: {
//       prakriti: "Pitta-Kapha",
//       doshaImbalance: "Pitta",
//       agni: "Tikshna",
//       tastePref: ["sweet", "bitter", "astringent"],
//       foodProperties: ["cool", "light", "dry"],
//       season: "Summer"
//     },
//     lifestyle: {
//       dietType: "Vegetarian",
//       mealFreq: 3,
//       waterIntake_l: 2.5,
//       bowel: "Normal",
//       sleepPattern: "11 PM - 6 AM",
//       physicalActivity: "Moderate",
//       stressLevel: "Moderate"
//     },
//     medicalInfo: {
//       allergies: ["None reported"],
//       conditions: ["Hypertension", "Prediabetes"],
//       medications: ["Amlodipine 5mg"],
//       labReports: { bloodSugarFasting: "115", cholesterol: "210", hb: "14.2" }
//     },
//     dietaryPreferences: {
//       avoidFoods: ["spicy", "oily", "fermented"],
//       preferredFoods: ["moong dal", "ghee", "pomegranate", "leafy greens"],
//       restrictedByReligion: "No"
//     },
//     goals: { shortTerm: "Reduce pitta imbalance", longTerm: "Prevent diabetes" },
//     attachments: [],
//     calculated: { age: 45, bmi: 26.8 }
//   });

//   // Auto calculate age and BMI
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age = new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
//       formData.personalInfo.age = age;
//       formData.calculated.age = age;
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       formData.vitals.bmi = bmi;
//       formData.calculated.bmi = bmi;
//     }
//   };

//   // --- Fetch latest saved plan from backend ---
//   const fetchLatestPlan = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       console.log("Latest plan response:", res.data);

//       const weeklyPlan = res.data?.dietPlan?.weekly_plan || [];
//       if (weeklyPlan.length === 0) {
//         setPlan(null);
//         return;
//       }

//       // Transform Firestore weekly_plan into frontend-friendly structure
//       const recommendedMeals = weeklyPlan.map(day => ({
//         day: day.day,
//         breakfast: day.meals.breakfast.items.map(i => i.Dish_Name).join(", "),
//         lunch: day.meals.lunch.items.map(i => i.Dish_Name).join(", "),
//         dinner: day.meals.dinner.items.map(i => i.Dish_Name).join(", ")
//       }));

//       setPlan({ recommendedMeals });
//     } catch (err) {
//       console.error("Failed to fetch latest plan:", err);
//     }
//   };

//   // Fetch latest plan on page load
//   useEffect(() => {
//     fetchLatestPlan();
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();

//       await axios.post("http://localhost:3000/generate", formData);
//       alert("✅ Diet plan saved!");
      
//       // Fetch the newly saved plan immediately
//       await fetchLatestPlan();
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("❌ Error generating diet plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>
//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {plan?.recommendedMeals?.length > 0 ? (
//         <div className="mt-6 p-4 border rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold">
//             Diet Plan for {formData.personalInfo.fullName}
//           </h2>
//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b">
//               <h3 className="font-semibold">Day {day.day}</h3>
//               <p><strong>Breakfast:</strong> {day.breakfast}</p>
//               <p><strong>Lunch:</strong> {day.lunch}</p>
//               <p><strong>Dinner:</strong> {day.dinner}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-500">No diet plan generated yet.</p>
//       )}
//     </div>
//   );
// }


// PatientForm.jsx
// import React, { useState } from "react";
// import axios from "axios";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "Rohan Verma",
//       dob: "1980-05-15",
//       gender: "Male",
//       age: 45,
//       contact: { phone: "+919876543210", email: "rohan.verma@example.com" },
//     },
//     vitals: {
//       height_cm: 175,
//       weight_kg: 82,
//       bmi: 26.8,
//       bp: "140/90",
//       pulseRate: 78,
//       respirationRate: 16,
//       temperature: "98.4",
//     },
//     ayurvedaProfile: {
//       prakriti: "Pitta-Kapha",
//       doshaImbalance: "Pitta",
//       agni: "Tikshna",
//       tastePref: ["sweet", "bitter", "astringent"],
//       foodProperties: ["cool", "light", "dry"],
//       season: "Summer",
//     },
//     lifestyle: {
//       dietType: "Vegetarian",
//       mealFreq: 3,
//       waterIntake_l: 2.5,
//       bowel: "Normal",
//       sleepPattern: "11 PM - 6 AM",
//       physicalActivity: "Moderate",
//       stressLevel: "Moderate",
//     },
//     medicalInfo: {
//       allergies: ["None reported"],
//       conditions: ["Hypertension", "Prediabetes"],
//       medications: ["Amlodipine 5mg"],
//       labReports: { bloodSugarFasting: "115", cholesterol: "210", hb: "14.2" },
//     },
//     dietaryPreferences: {
//       avoidFoods: ["spicy", "oily", "fermented"],
//       preferredFoods: ["moong dal", "ghee", "pomegranate", "leafy greens"],
//       restrictedByReligion: "No",
//     },
//     goals: {
//       shortTerm: "Reduce pitta imbalance",
//       longTerm: "Prevent diabetes",
//     },
//     attachments: [],
//     calculated: { age: 45, bmi: 26.8 },
//   });

//   // Auto calculate age and BMI
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age =
//         new Date().getFullYear() -
//         new Date(formData.personalInfo.dob).getFullYear();
//       formData.personalInfo.age = age;
//       formData.calculated.age = age;
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       formData.vitals.bmi = bmi;
//       formData.calculated.bmi = bmi;
//     }
//   };

//   // --- Fetch latest saved plan from backend ---
//   const fetchLatestPlan = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       console.log("Latest plan response:", res.data);

//       const weeklyPlan =
//         res.data?.fullPlan?.weekly_plan || res.data?.recommendedMeals || [];

//       if (weeklyPlan.length === 0) {
//         setPlan(null);
//         return;
//       }

//       const recommendedMeals = weeklyPlan.map((day) => ({
//         day: day.day,
//         breakfast:
//           day.meals?.breakfast?.items?.map((i) => i.Dish_Name).join(", ") || "",
//         lunch:
//           day.meals?.lunch?.items?.map((i) => i.Dish_Name).join(", ") || "",
//         dinner:
//           day.meals?.dinner?.items?.map((i) => i.Dish_Name).join(", ") || "",
//       }));

//       setPlan({ recommendedMeals });
//     } catch (err) {
//       console.error("Failed to fetch latest plan:", err);
//     }


    
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();

//       await axios.post("http://localhost:3000/generate", formData);
//       alert("✅ Diet plan saved!");

//       // Fetch the newly saved plan only after generating
//       await fetchLatestPlan();
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("❌ Error generating diet plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>
//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {plan?.recommendedMeals?.length > 0 ? (
//         <div className="mt-6 p-4 border rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold">
//             Diet Plan for {formData.personalInfo.fullName}
//           </h2>
//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b">
//               <h3 className="font-semibold">Day {day.day}</h3>
//               <p>
//                 <strong>Breakfast:</strong> {day.breakfast}
//               </p>
//               <p>
//                 <strong>Lunch:</strong> {day.lunch}
//               </p>
//               <p>
//                 <strong>Dinner:</strong> {day.dinner}
//               </p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-500">
//           No diet plan generated yet. Click the button above to generate.
//         </p>
//       )}
//     </div>
//   );
// }



// PatientForm.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "Rohan Verma",
//       dob: "1980-05-15",
//       gender: "Male",
//       age: 45,
//       contact: { phone: "+919876543210", email: "rohan.verma@example.com" },
//     },
//     vitals: {
//       height_cm: 175,
//       weight_kg: 82,
//       bmi: 26.8,
//       bp: "140/90",
//       pulseRate: 78,
//       respirationRate: 16,
//       temperature: "98.4",
//     },
//     ayurvedaProfile: {
//       prakriti: "Pitta-Kapha",
//       doshaImbalance: "Pitta",
//       agni: "Tikshna",
//       tastePref: ["sweet", "bitter", "astringent"],
//       foodProperties: ["cool", "light", "dry"],
//       season: "Summer",
//     },
//     lifestyle: {
//       dietType: "Vegetarian",
//       mealFreq: 3,
//       waterIntake_l: 2.5,
//       bowel: "Normal",
//       sleepPattern: "11 PM - 6 AM",
//       physicalActivity: "Moderate",
//       stressLevel: "Moderate",
//     },
//     medicalInfo: {  // <-- Added medicalInfo
//       allergies: ["None reported"],
//       conditions: ["Hypertension", "Prediabetes"],
//       medications: ["Amlodipine 5mg"],
//       labReports: {
//         bloodSugarFasting: "115",
//         cholesterol: "210",
//         hb: "14.2"
//       }
//     },
//     dietaryPreferences: {
//       avoidFoods: ["spicy", "oily", "fermented"],
//       preferredFoods: ["moong dal", "ghee", "pomegranate", "leafy greens"],
//       restrictedByReligion: "No",
//     },
//     goals: {
//       shortTerm: "Reduce pitta imbalance",
//       longTerm: "Prevent diabetes",
//     },
//     attachments: [],
//     calculated: { age: 45, bmi: 26.8 },
//   });

//   // --- Auto-calculate age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age =
//         new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
//       formData.personalInfo.age = age;
//       formData.calculated.age = age;
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       formData.vitals.bmi = bmi;
//       formData.calculated.bmi = bmi;
//     }
//   };

//   // --- Normalize meals ---
//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals || rawMeals.length === 0) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || day.Day || i + 1,
//       breakfast: day.breakfast || day.meals?.breakfast?.items?.map(i => i.Dish_Name).join(", ") || "",
//       lunch: day.lunch || day.meals?.lunch?.items?.map(i => i.Dish_Name).join(", ") || "",
//       dinner: day.dinner || day.meals?.dinner?.items?.map(i => i.Dish_Name).join(", ") || ""
//     }));
//   };

//   // --- Fetch latest saved plan ---
//   const fetchLatestPlan = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.recommendedMeals || res.data?.fullPlan?.weekly_plan || res.data?.fullPlan?.recommendations || [];
//       const normalizedMeals = normalizeMeals(rawMeals);
//       setPlan({ recommendedMeals: normalizedMeals });
//     } catch (err) {
//       console.error("Failed to fetch latest plan:", err);
//     }
//   };

//   // --- Submit form & generate plan ---
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();
//       console.log("Sending patient data:", formData);

//       await axios.post("http://localhost:3000/generate", formData);

//       alert("✅ Diet plan saved!");
//       await fetchLatestPlan();
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("❌ Error generating diet plan. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Auto-load latest plan on page load ---
//   useEffect(() => {
//     fetchLatestPlan();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {plan?.recommendedMeals?.length > 0 ? (
//         <div className="mt-6 p-4 border rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold">
//             Diet Plan for {formData.personalInfo.fullName}
//           </h2>
//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b">
//               <h3 className="font-semibold">Day {day.day}</h3>
//               <p><strong>Breakfast:</strong> {day.breakfast}</p>
//               <p><strong>Lunch:</strong> {day.lunch}</p>
//               <p><strong>Dinner:</strong> {day.dinner}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-500">
//           No diet plan generated yet. Click the button above to generate.
//         </p>
//       )}
//     </div>
//   );
// }


// PatientForm.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "Rohan Verma",
//       dob: "1980-05-15",
//       gender: "Male",
//       age: 45,
//       contact: { phone: "+919876543210", email: "rohan.verma@example.com" },
//     },
//     vitals: {
//       height_cm: 175,
//       weight_kg: 82,
//       bmi: 26.8,
//       bp: "140/90",
//       pulseRate: 78,
//       respirationRate: 16,
//       temperature: "98.4",
//     },
//     ayurvedaProfile: {
//       prakriti: "Pitta-Kapha",
//       doshaImbalance: "Pitta",
//       agni: "Tikshna",
//       tastePref: ["sweet", "bitter", "astringent"],
//       foodProperties: ["cool", "light", "dry"],
//       season: "Summer",
//     },
//     lifestyle: {
//       dietType: "Vegetarian",
//       mealFreq: 3,
//       waterIntake_l: 2.5,
//       bowel: "Normal",
//       sleepPattern: "11 PM - 6 AM",
//       physicalActivity: "Moderate",
//       stressLevel: "Moderate",
//     },
//     medicalInfo: {
//       allergies: ["None reported"],
//       conditions: ["Hypertension", "Prediabetes"],
//       medications: ["Amlodipine 5mg"],
//       labReports: { bloodSugarFasting: "115", cholesterol: "210", hb: "14.2" },
//     },
//     dietaryPreferences: {
//       avoidFoods: ["spicy", "oily", "fermented"],
//       preferredFoods: ["moong dal", "ghee", "pomegranate", "leafy greens"],
//       restrictedByReligion: "No",
//     },
//     goals: {
//       shortTerm: "Reduce pitta imbalance",
//       longTerm: "Prevent diabetes",
//     },
//     attachments: [],
//     calculated: { age: 45, bmi: 26.8 },
//   });

//   // --- Auto-calculate age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age =
//         new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
//       formData.personalInfo.age = age;
//       formData.calculated.age = age;
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       formData.vitals.bmi = bmi;
//       formData.calculated.bmi = bmi;
//     }
//   };

//   // --- Normalize meals from backend ---
//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals || rawMeals.length === 0) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || day.Day || i + 1,
//       breakfast: day.breakfast || day.meals?.breakfast?.items?.map(i => i.Dish_Name).join(", ") || "",
//       lunch: day.lunch || day.meals?.lunch?.items?.map(i => i.Dish_Name).join(", ") || "",
//       dinner: day.dinner || day.meals?.dinner?.items?.map(i => i.Dish_Name).join(", ") || ""
//     }));
//   };

//   // --- Fetch latest saved plan ---
//   const fetchLatestPlan = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.recommendedMeals || res.data?.fullPlan?.weekly_plan || res.data?.fullPlan?.recommendations || [];
//       const normalizedMeals = normalizeMeals(rawMeals);
//       setPlan({ recommendedMeals: normalizedMeals });
//     } catch (err) {
//       console.error("Failed to fetch latest plan:", err);
//     }
//   };

//   // --- Submit form & generate plan ---
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();

//       console.log("Sending patient data:", formData);
//       await axios.post("http://localhost:3000/generate", formData);

//       alert("✅ Diet plan saved!");
//       await fetchLatestPlan(); // Fetch only after submission
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("❌ Error generating diet plan. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Generate PDF ---
//   const generatePDF = () => {
//     if (!plan || !plan.recommendedMeals || plan.recommendedMeals.length === 0) {
//       alert("❌ No diet plan to generate PDF.");
//       return;
//     }

//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, 14, 20);

//     let y = 30;
//     plan.recommendedMeals.forEach((day) => {
//       doc.setFontSize(14);
//       doc.text(`Day ${day.day}`, 14, y);
//       y += 8;
//       doc.setFontSize(12);
//       doc.text(`Breakfast: ${day.breakfast}`, 14, y);
//       y += 6;
//       doc.text(`Lunch: ${day.lunch}`, 14, y);
//       y += 6;
//       doc.text(`Dinner: ${day.dinner}`, 14, y);
//       y += 10;

//       if (y > 270) { // Create new page if overflow
//         doc.addPage();
//         y = 20;
//       }
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {plan?.recommendedMeals?.length > 0 && (
//         <button
//           onClick={generatePDF}
//           className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           📄 Download PDF
//         </button>
//       )}

//       {plan?.recommendedMeals?.length > 0 ? (
//         <div className="mt-6 p-4 border rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold">
//             Diet Plan for {formData.personalInfo.fullName}
//           </h2>
//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b">
//               <h3 className="font-semibold">Day {day.day}</h3>
//               <p><strong>Breakfast:</strong> {day.breakfast}</p>
//               <p><strong>Lunch:</strong> {day.lunch}</p>
//               <p><strong>Dinner:</strong> {day.dinner}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-500">
//           No diet plan generated yet. Click the button above to generate.
//         </p>
//       )}
//     </div>
//   );
// }



// PatientForm.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: {
//       fullName: "Rohan Verma",
//       dob: "1980-05-15",
//       gender: "Male",
//       age: 45,
//       contact: { phone: "+919876543210", email: "rohan.verma@example.com" },
//     },
//     vitals: {
//       height_cm: 175,
//       weight_kg: 82,
//       bmi: 26.8,
//       bp: "140/90",
//       pulseRate: 78,
//       respirationRate: 16,
//       temperature: "98.4",
//     },
//     ayurvedaProfile: {
//       prakriti: "Pitta-Kapha",
//       doshaImbalance: "Pitta",
//       agni: "Tikshna",
//       tastePref: ["sweet", "bitter", "astringent"],
//       foodProperties: ["cool", "light", "dry"],
//       season: "Summer",
//     },
//     lifestyle: {
//       dietType: "Vegetarian",
//       mealFreq: 3,
//       waterIntake_l: 2.5,
//       bowel: "Normal",
//       sleepPattern: "11 PM - 6 AM",
//       physicalActivity: "Moderate",
//       stressLevel: "Moderate",
//     },
//     medicalInfo: {
//       allergies: ["None reported"],
//       conditions: ["Hypertension", "Prediabetes"],
//       medications: ["Amlodipine 5mg"],
//       labReports: { bloodSugarFasting: "115", cholesterol: "210", hb: "14.2" },
//     },
//     dietaryPreferences: {
//       avoidFoods: ["spicy", "oily", "fermented"],
//       preferredFoods: ["moong dal", "ghee", "pomegranate", "leafy greens"],
//       restrictedByReligion: "No",
//     },
//     goals: {
//       shortTerm: "Reduce pitta imbalance",
//       longTerm: "Prevent diabetes",
//     },
//     attachments: [],
//     calculated: { age: 45, bmi: 26.8 },
//   });

//   // --- Auto-calculate age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age =
//         new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
//       formData.personalInfo.age = age;
//       formData.calculated.age = age;
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       formData.vitals.bmi = bmi;
//       formData.calculated.bmi = bmi;
//     }
//   };

//   // --- Normalize meals ---
//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals || rawMeals.length === 0) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || day.Day || i + 1,
//       breakfast: day.breakfast || day.meals?.breakfast?.items?.map(i => i.Dish_Name).join(", ") || "",
//       lunch: day.lunch || day.meals?.lunch?.items?.map(i => i.Dish_Name).join(", ") || "",
//       dinner: day.dinner || day.meals?.dinner?.items?.map(i => i.Dish_Name).join(", ") || ""
//     }));
//   };

//   // --- Fetch latest saved plan ---
//   const fetchLatestPlan = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.recommendedMeals || res.data?.fullPlan?.weekly_plan || res.data?.fullPlan?.recommendations || [];
//       const normalizedMeals = normalizeMeals(rawMeals);
//       setPlan({ recommendedMeals: normalizedMeals });
//     } catch (err) {
//       console.error("Failed to fetch latest plan:", err);
//     }
//   };

//   // --- Submit form & generate plan ---
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();

//       console.log("Sending patient data:", formData);
//       await axios.post("http://localhost:3000/generate", formData);

//       alert("✅ Diet plan saved!");
//       await fetchLatestPlan(); // Fetch only after submission
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("❌ Error generating diet plan. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Generate Stylish PDF ---
//   const generatePDF = () => {
//     if (!plan || !plan.recommendedMeals || plan.recommendedMeals.length === 0) {
//       alert("❌ No diet plan to generate PDF.");
//       return;
//     }

//     const doc = new jsPDF('p', 'pt', 'a4');
//     const pageWidth = doc.internal.pageSize.width;

//     // --- Header ---
//     doc.setFillColor(76, 175, 80); // green header
//     doc.rect(0, 0, pageWidth, 50, 'F');
//     doc.setFontSize(20);
//     doc.setTextColor(255, 255, 255);
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, pageWidth / 2, 32, { align: 'center' });

//     let y = 70;

//     plan.recommendedMeals.forEach((day) => {
//       // Day box
//       doc.setFillColor(230, 230, 250); // light lavender
//       doc.roundedRect(14, y - 4, pageWidth - 28, 60, 5, 5, 'F');

//       doc.setFontSize(14);
//       doc.setTextColor(0, 0, 0);
//       doc.text(`Day ${day.day}`, 20, y);

//       doc.setFontSize(12);
//       doc.text(`Breakfast: ${day.breakfast}`, 20, y + 18);
//       doc.text(`Lunch: ${day.lunch}`, 20, y + 32);
//       doc.text(`Dinner: ${day.dinner}`, 20, y + 46);

//       y += 70;

//       if (y > 750) { // create new page if overflow
//         doc.addPage();
//         y = 50;
//       }
//     });

//     // --- Footer ---
//     const today = new Date();
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, pageWidth - 14, doc.internal.pageSize.height - 10, { align: 'right' });

//     doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg"
//       >
//         {loading ? "Generating..." : "Save & Generate Diet Chart"}
//       </button>

//       {plan?.recommendedMeals?.length > 0 && (
//         <button
//           onClick={generatePDF}
//           className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
//         >
//           📄 Download PDF
//         </button>
//       )}

//       {plan?.recommendedMeals?.length > 0 ? (
//         <div className="mt-6 p-4 border rounded-xl shadow-md bg-gray-50">
//           <h2 className="text-xl font-semibold text-green-700">
//             Diet Plan for {formData.personalInfo.fullName}
//           </h2>
//           {plan.recommendedMeals.map((day, i) => (
//             <div key={i} className="mt-2 p-2 border-b rounded-md bg-white shadow-sm">
//               <h3 className="font-semibold text-indigo-700">Day {day.day}</h3>
//               <p><strong>Breakfast:</strong> {day.breakfast}</p>
//               <p><strong>Lunch:</strong> {day.lunch}</p>
//               <p><strong>Dinner:</strong> {day.dinner}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-500">
//           No diet plan generated yet. Click the button above to generate.
//         </p>
//       )}
//     </div>
//   );
// }


// import React, { useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: { fullName: "", dob: "", gender: "", age: "", contact: { phone: "", email: "" } },
//     vitals: { height_cm: "", weight_kg: "", bmi: "", bp: "", pulseRate: "", respirationRate: "", temperature: "" },
//     ayurvedaProfile: { prakriti: "", doshaImbalance: "", agni: "", tastePref: [], foodProperties: [], season: "" },
//     lifestyle: { dietType: "", mealFreq: "", waterIntake_l: "", bowel: "", sleepPattern: "", physicalActivity: "", stressLevel: "" },
//     medicalInfo: { allergies: [], conditions: [], medications: [], labReports: { bloodSugarFasting: "", cholesterol: "", hb: "" } },
//     dietaryPreferences: { avoidFoods: [], preferredFoods: [], restrictedByReligion: "" },
//     goals: { shortTerm: "", longTerm: "" },
//     attachments: [],
//     calculated: { age: "", bmi: "" },
//   });

//   const handleInputChange = (section, field, value, nestedField = null) => {
//     setFormData(prev => {
//       const newData = { ...prev };
//       if (nestedField) {
//         newData[section][field][nestedField] = value;
//       } else {
//         newData[section][field] = value;
//       }
//       return newData;
//     });
//   };

//   const handleArrayChange = (section, field, index, value) => {
//     setFormData(prev => {
//       const arr = [...prev[section][field]];
//       arr[index] = value;
//       return { ...prev, [section]: { ...prev[section], [field]: arr } };
//     });
//   };

//   const addArrayItem = (section, field) => {
//     setFormData(prev => {
//       const arr = [...prev[section][field], ""];
//       return { ...prev, [section]: { ...prev[section], [field]: arr } };
//     });
//   };

//   const removeArrayItem = (section, field, index) => {
//     setFormData(prev => {
//       const arr = [...prev[section][field]];
//       arr.splice(index, 1);
//       return { ...prev, [section]: { ...prev[section], [field]: arr } };
//     });
//   };

//   // Auto calculate age and BMI
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age = new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
//       handleInputChange("personalInfo", "age", age);
//       handleInputChange("calculated", "age", age);
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       handleInputChange("vitals", "bmi", bmi);
//       handleInputChange("calculated", "bmi", bmi);
//     }
//   };

//   // Submit form & fetch latest plan
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();
//       await axios.post("http://localhost:3000/generate", formData);
//       alert("✅ Diet plan saved!");
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       setPlan(res.data);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("❌ Error generating diet plan. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate PDF
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan available");

//     const doc = new jsPDF();
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, 20, 20);
//     plan.recommendedMeals.forEach((day, i) => {
//       doc.text(`Day ${day.day}`, 20, 30 + i * 30);
//       doc.text(`Breakfast: ${day.breakfast}`, 20, 36 + i * 30);
//       doc.text(`Lunch: ${day.lunch}`, 20, 42 + i * 30);
//       doc.text(`Dinner: ${day.dinner}`, 20, 48 + i * 30);
//     });
//     doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       {/* Personal Info */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Personal Info</h2>
//         <input placeholder="Full Name" value={formData.personalInfo.fullName} onChange={e => handleInputChange("personalInfo","fullName",e.target.value)} className="border p-1 m-1"/>
//         <input type="date" placeholder="DOB" value={formData.personalInfo.dob} onChange={e => handleInputChange("personalInfo","dob",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Gender" value={formData.personalInfo.gender} onChange={e => handleInputChange("personalInfo","gender",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Phone" value={formData.personalInfo.contact.phone} onChange={e => handleInputChange("personalInfo","contact",e.target.value,"phone")} className="border p-1 m-1"/>
//         <input placeholder="Email" value={formData.personalInfo.contact.email} onChange={e => handleInputChange("personalInfo","contact",e.target.value,"email")} className="border p-1 m-1"/>
//       </div>

//       {/* Vitals */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Vitals</h2>
//         <input placeholder="Height (cm)" value={formData.vitals.height_cm} onChange={e => handleInputChange("vitals","height_cm",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Weight (kg)" value={formData.vitals.weight_kg} onChange={e => handleInputChange("vitals","weight_kg",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="BP" value={formData.vitals.bp} onChange={e => handleInputChange("vitals","bp",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Pulse Rate" value={formData.vitals.pulseRate} onChange={e => handleInputChange("vitals","pulseRate",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Respiration Rate" value={formData.vitals.respirationRate} onChange={e => handleInputChange("vitals","respirationRate",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Temperature" value={formData.vitals.temperature} onChange={e => handleInputChange("vitals","temperature",e.target.value)} className="border p-1 m-1"/>
//       </div>

//       {/* Ayurveda Profile */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Ayurveda Profile</h2>
//         <input placeholder="Prakriti" value={formData.ayurvedaProfile.prakriti} onChange={e => handleInputChange("ayurvedaProfile","prakriti",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Dosha Imbalance" value={formData.ayurvedaProfile.doshaImbalance} onChange={e => handleInputChange("ayurvedaProfile","doshaImbalance",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Agni" value={formData.ayurvedaProfile.agni} onChange={e => handleInputChange("ayurvedaProfile","agni",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Season" value={formData.ayurvedaProfile.season} onChange={e => handleInputChange("ayurvedaProfile","season",e.target.value)} className="border p-1 m-1"/>
//         <div>
//           <h3>Taste Preferences</h3>
//           {formData.ayurvedaProfile.tastePref.map((val,i)=>(
//             <div key={i}>
//               <input value={val} onChange={e=>handleArrayChange("ayurvedaProfile","tastePref",i,e.target.value)} className="border p-1 m-1"/>
//               <button onClick={()=>removeArrayItem("ayurvedaProfile","tastePref",i)} className="m-1 text-red-600">Remove</button>
//             </div>
//           ))}
//           <button onClick={()=>addArrayItem("ayurvedaProfile","tastePref")} className="m-1 bg-gray-200 px-2 rounded">Add Taste</button>
//         </div>
//         <div>
//           <h3>Food Properties</h3>
//           {formData.ayurvedaProfile.foodProperties.map((val,i)=>(
//             <div key={i}>
//               <input value={val} onChange={e=>handleArrayChange("ayurvedaProfile","foodProperties",i,e.target.value)} className="border p-1 m-1"/>
//               <button onClick={()=>removeArrayItem("ayurvedaProfile","foodProperties",i)} className="m-1 text-red-600">Remove</button>
//             </div>
//           ))}
//           <button onClick={()=>addArrayItem("ayurvedaProfile","foodProperties")} className="m-1 bg-gray-200 px-2 rounded">Add Property</button>
//         </div>
//       </div>

//       {/* Lifestyle */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Lifestyle</h2>
//         {Object.keys(formData.lifestyle).map(key=>(
//           <input key={key} placeholder={key} value={formData.lifestyle[key]} onChange={e=>handleInputChange("lifestyle",key,e.target.value)} className="border p-1 m-1"/>
//         ))}
//       </div>

//       {/* Medical Info */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Medical Info</h2>
//         {["allergies","conditions","medications"].map(field=>(
//           <div key={field}>
//             <h3>{field}</h3>
//             {formData.medicalInfo[field].map((val,i)=>(
//               <div key={i}>
//                 <input value={val} onChange={e=>handleArrayChange("medicalInfo",field,i,e.target.value)} className="border p-1 m-1"/>
//                 <button onClick={()=>removeArrayItem("medicalInfo",field,i)} className="m-1 text-red-600">Remove</button>
//               </div>
//             ))}
//             <button onClick={()=>addArrayItem("medicalInfo",field)} className="m-1 bg-gray-200 px-2 rounded">Add {field.slice(0,-1)}</button>
//           </div>
//         ))}
//         <div>
//           <h3>Lab Reports</h3>
//           {Object.keys(formData.medicalInfo.labReports).map(key=>(
//             <input key={key} placeholder={key} value={formData.medicalInfo.labReports[key]} onChange={e=>handleInputChange("medicalInfo","labReports",e.target.value,key)} className="border p-1 m-1"/>
//           ))}
//         </div>
//       </div>

//       {/* Dietary Preferences */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Dietary Preferences</h2>
//         {["avoidFoods","preferredFoods"].map(field=>(
//           <div key={field}>
//             <h3>{field}</h3>
//             {formData.dietaryPreferences[field].map((val,i)=>(
//               <div key={i}>
//                 <input value={val} onChange={e=>handleArrayChange("dietaryPreferences",field,i,e.target.value)} className="border p-1 m-1"/>
//                 <button onClick={()=>removeArrayItem("dietaryPreferences",field,i)} className="m-1 text-red-600">Remove</button>
//               </div>
//             ))}
//             <button onClick={()=>addArrayItem("dietaryPreferences",field)} className="m-1 bg-gray-200 px-2 rounded">Add {field.slice(0,-1)}</button>
//           </div>
//         ))}
//         <input placeholder="Restricted by Religion" value={formData.dietaryPreferences.restrictedByReligion} onChange={e=>handleInputChange("dietaryPreferences","restrictedByReligion",e.target.value)} className="border p-1 m-1"/>
//       </div>

//       {/* Goals */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Goals</h2>
//         <input placeholder="Short Term" value={formData.goals.shortTerm} onChange={e=>handleInputChange("goals","shortTerm",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Long Term" value={formData.goals.longTerm} onChange={e=>handleInputChange("goals","longTerm",e.target.value)} className="border p-1 m-1"/>
//       </div>

//       <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg">{loading ? "Generating..." : "Save & Generate Diet Chart"}</button>
//       {plan?.recommendedMeals?.length>0 && <button onClick={generatePDF} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg">📄 Download PDF</button>}
//     </div>
//   );
// }


// import React, { useState } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";

// export default function PatientForm() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: { fullName: "", dob: "", gender: "", age: "", contact: { phone: "", email: "" } },
//     vitals: { height_cm: "", weight_kg: "", bmi: "", bp: "", pulseRate: "", respirationRate: "", temperature: "" },
//     ayurvedaProfile: { prakriti: "", doshaImbalance: "", agni: "", tastePref: [], foodProperties: [], season: "" },
//     lifestyle: { dietType: "", mealFreq: "", waterIntake_l: "", bowel: "", sleepPattern: "", physicalActivity: "", stressLevel: "" },
//     medicalInfo: { allergies: [], conditions: [], medications: [], labReports: { bloodSugarFasting: "", cholesterol: "", hb: "" } },
//     dietaryPreferences: { avoidFoods: [], preferredFoods: [], restrictedByReligion: "" },
//     goals: { shortTerm: "", longTerm: "" },
//     attachments: [],
//     calculated: { age: "", bmi: "" },
//   });

//   // --- Input handlers ---
//   const handleInputChange = (section, field, value, nestedField = null) => {
//     setFormData(prev => {
//       const newData = { ...prev };
//       if (nestedField) {
//         newData[section][field][nestedField] = value;
//       } else {
//         newData[section][field] = value;
//       }
//       return newData;
//     });
//   };

//   const handleArrayChange = (section, field, index, value) => {
//     setFormData(prev => {
//       const arr = [...prev[section][field]];
//       arr[index] = value;
//       return { ...prev, [section]: { ...prev[section], [field]: arr } };
//     });
//   };

//   const addArrayItem = (section, field) => {
//     setFormData(prev => {
//       const arr = [...prev[section][field], ""];
//       return { ...prev, [section]: { ...prev[section], [field]: arr } };
//     });
//   };

//   const removeArrayItem = (section, field, index) => {
//     setFormData(prev => {
//       const arr = [...prev[section][field]];
//       arr.splice(index, 1);
//       return { ...prev, [section]: { ...prev[section], [field]: arr } };
//     });
//   };

//   // --- Auto calculate age & BMI ---
//   const handleAutoCalc = () => {
//     if (formData.personalInfo.dob) {
//       const age = new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
//       handleInputChange("personalInfo", "age", age);
//       handleInputChange("calculated", "age", age);
//     }
//     if (formData.vitals.height_cm && formData.vitals.weight_kg) {
//       const h = formData.vitals.height_cm / 100;
//       const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
//       handleInputChange("vitals", "bmi", bmi);
//       handleInputChange("calculated", "bmi", bmi);
//     }
//   };

//   // --- Submit form ---
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       handleAutoCalc();
//       await axios.post("http://localhost:3000/generate", formData);
//       alert("✅ Diet plan saved!");
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       setPlan(res.data);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("❌ Error generating diet plan. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Normalize meals for PDF ---
//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals || rawMeals.length === 0) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || day.Day || i + 1,
//       breakfast: day.breakfast || day.meals?.breakfast?.items?.map(i => i.Dish_Name).join(", ") || "Not specified",
//       lunch: day.lunch || day.meals?.lunch?.items?.map(i => i.Dish_Name).join(", ") || "Not specified",
//       dinner: day.dinner || day.meals?.dinner?.items?.map(i => i.Dish_Name).join(", ") || "Not specified"
//     }));
//   };

//   // --- Generate PDF ---
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan available");
//     const meals = normalizeMeals(plan.recommendedMeals);

//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, 20, 20);

//     let y = 40;
//     meals.forEach((day) => {
//       doc.setFontSize(14);
//       doc.text(`Day ${day.day}`, 20, y);
//       doc.setFontSize(12);
//       doc.text(`Breakfast: ${day.breakfast}`, 20, y + 8);
//       doc.text(`Lunch: ${day.lunch}`, 20, y + 16);
//       doc.text(`Dinner: ${day.dinner}`, 20, y + 24);
//       y += 40;
//       if (y > 750) { doc.addPage(); y = 40; }
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

//       {/* Personal Info */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Personal Info</h2>
//         <input placeholder="Full Name" value={formData.personalInfo.fullName} onChange={e => handleInputChange("personalInfo","fullName",e.target.value)} className="border p-1 m-1"/>
//         <input type="date" placeholder="DOB" value={formData.personalInfo.dob} onChange={e => handleInputChange("personalInfo","dob",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Gender" value={formData.personalInfo.gender} onChange={e => handleInputChange("personalInfo","gender",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Phone" value={formData.personalInfo.contact.phone} onChange={e => handleInputChange("personalInfo","contact",e.target.value,"phone")} className="border p-1 m-1"/>
//         <input placeholder="Email" value={formData.personalInfo.contact.email} onChange={e => handleInputChange("personalInfo","contact",e.target.value,"email")} className="border p-1 m-1"/>
//       </div>

//       {/* Vitals */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Vitals</h2>
//         {Object.keys(formData.vitals).map(key=>(<input key={key} placeholder={key} value={formData.vitals[key]} onChange={e=>handleInputChange("vitals",key,e.target.value)} className="border p-1 m-1"/>))}
//       </div>

//       {/* Ayurveda Profile */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Ayurveda Profile</h2>
//         <input placeholder="Prakriti" value={formData.ayurvedaProfile.prakriti} onChange={e=>handleInputChange("ayurvedaProfile","prakriti",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Dosha Imbalance" value={formData.ayurvedaProfile.doshaImbalance} onChange={e=>handleInputChange("ayurvedaProfile","doshaImbalance",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Agni" value={formData.ayurvedaProfile.agni} onChange={e=>handleInputChange("ayurvedaProfile","agni",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Season" value={formData.ayurvedaProfile.season} onChange={e=>handleInputChange("ayurvedaProfile","season",e.target.value)} className="border p-1 m-1"/>
//         <div>
//           <h3>Taste Preferences</h3>
//           {formData.ayurvedaProfile.tastePref.map((val,i)=>(
//             <div key={i}>
//               <input value={val} onChange={e=>handleArrayChange("ayurvedaProfile","tastePref",i,e.target.value)} className="border p-1 m-1"/>
//               <button onClick={()=>removeArrayItem("ayurvedaProfile","tastePref",i)} className="m-1 text-red-600">Remove</button>
//             </div>
//           ))}
//           <button onClick={()=>addArrayItem("ayurvedaProfile","tastePref")} className="m-1 bg-gray-200 px-2 rounded">Add Taste</button>
//         </div>
//         <div>
//           <h3>Food Properties</h3>
//           {formData.ayurvedaProfile.foodProperties.map((val,i)=>(
//             <div key={i}>
//               <input value={val} onChange={e=>handleArrayChange("ayurvedaProfile","foodProperties",i,e.target.value)} className="border p-1 m-1"/>
//               <button onClick={()=>removeArrayItem("ayurvedaProfile","foodProperties",i)} className="m-1 text-red-600">Remove</button>
//             </div>
//           ))}
//           <button onClick={()=>addArrayItem("ayurvedaProfile","foodProperties")} className="m-1 bg-gray-200 px-2 rounded">Add Property</button>
//         </div>
//       </div>

//       {/* Lifestyle */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Lifestyle</h2>
//         {Object.keys(formData.lifestyle).map(key=>(<input key={key} placeholder={key} value={formData.lifestyle[key]} onChange={e=>handleInputChange("lifestyle",key,e.target.value)} className="border p-1 m-1"/>))}
//       </div>

//       {/* Medical Info */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Medical Info</h2>
//         {["allergies","conditions","medications"].map(field=>(
//           <div key={field}>
//             <h3>{field}</h3>
//             {formData.medicalInfo[field].map((val,i)=>(
//               <div key={i}>
//                 <input value={val} onChange={e=>handleArrayChange("medicalInfo",field,i,e.target.value)} className="border p-1 m-1"/>
//                 <button onClick={()=>removeArrayItem("medicalInfo",field,i)} className="m-1 text-red-600">Remove</button>
//               </div>
//             ))}
//             <button onClick={()=>addArrayItem("medicalInfo",field)} className="m-1 bg-gray-200 px-2 rounded">Add {field.slice(0,-1)}</button>
//           </div>
//         ))}
//         <div>
//           <h3>Lab Reports</h3>
//           {Object.keys(formData.medicalInfo.labReports).map(key=>(
//             <input key={key} placeholder={key} value={formData.medicalInfo.labReports[key]} onChange={e=>handleInputChange("medicalInfo","labReports",e.target.value,key)} className="border p-1 m-1"/>
//           ))}
//         </div>
//       </div>

//       {/* Dietary Preferences */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Dietary Preferences</h2>
//         {["avoidFoods","preferredFoods"].map(field=>(
//           <div key={field}>
//             <h3>{field}</h3>
//             {formData.dietaryPreferences[field].map((val,i)=>(
//               <div key={i}>
//                 <input value={val} onChange={e=>handleArrayChange("dietaryPreferences",field,i,e.target.value)} className="border p-1 m-1"/>
//                 <button onClick={()=>removeArrayItem("dietaryPreferences",field,i)} className="m-1 text-red-600">Remove</button>
//               </div>
//             ))}
//             <button onClick={()=>addArrayItem("dietaryPreferences",field)} className="m-1 bg-gray-200 px-2 rounded">Add {field.slice(0,-1)}</button>
//           </div>
//         ))}
//         <input placeholder="Restricted by Religion" value={formData.dietaryPreferences.restrictedByReligion} onChange={e=>handleInputChange("dietaryPreferences","restrictedByReligion",e.target.value)} className="border p-1 m-1"/>
//       </div>

//       {/* Goals */}
//       <div className="p-4 border rounded-lg">
//         <h2 className="font-semibold text-lg">Goals</h2>
//         <input placeholder="Short Term" value={formData.goals.shortTerm} onChange={e=>handleInputChange("goals","shortTerm",e.target.value)} className="border p-1 m-1"/>
//         <input placeholder="Long Term" value={formData.goals.longTerm} onChange={e=>handleInputChange("goals","longTerm",e.target.value)} className="border p-1 m-1"/>
//       </div>

//       <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg">{loading ? "Generating..." : "Save & Generate Diet Chart"}</button>
//       {plan?.recommendedMeals?.length>0 && <button onClick={generatePDF} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg">📄 Download PDF</button>}
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function PatientForm() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: { fullName: "", dob: "", gender: "", age: "", contact: { phone: "", email: "" } },
    vitals: { height_cm: "", weight_kg: "", bmi: "", bp: "", pulseRate: "", respirationRate: "", temperature: "" },
    ayurvedaProfile: { prakriti: "", doshaImbalance: "", agni: "", tastePref: [], foodProperties: [], season: "" },
    lifestyle: { dietType: "", mealFreq: "", waterIntake_l: "", bowel: "", sleepPattern: "", physicalActivity: "", stressLevel: "" },
    medicalInfo: { allergies: [], conditions: [], medications: [], labReports: { bloodSugarFasting: "", cholesterol: "", hb: "" } },
    dietaryPreferences: { avoidFoods: [], preferredFoods: [], restrictedByReligion: "" },
    goals: { shortTerm: "", longTerm: "" },
    attachments: [],
    calculated: { age: "", bmi: "" },
  });

  // --- Handlers ---
  const handleInputChange = (section, field, value, nestedField = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (nestedField) newData[section][field][nestedField] = value;
      else newData[section][field] = value;
      return newData;
    });
  };

  const handleArrayChange = (section, field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[section][field]];
      arr[index] = value;
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const addArrayItem = (section, field) => {
    setFormData(prev => {
      const arr = [...prev[section][field], ""];
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const removeArrayItem = (section, field, index) => {
    setFormData(prev => {
      const arr = [...prev[section][field]];
      arr.splice(index, 1);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  // --- Auto Calculate Age & BMI ---
  const handleAutoCalc = () => {
    if (formData.personalInfo.dob) {
      const age = new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
      handleInputChange("personalInfo", "age", age);
      handleInputChange("calculated", "age", age);
    }
    if (formData.vitals.height_cm && formData.vitals.weight_kg) {
      const h = formData.vitals.height_cm / 100;
      const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
      handleInputChange("vitals", "bmi", bmi);
      handleInputChange("calculated", "bmi", bmi);
    }
  };

  // --- Submit Form ---
  const handleSubmit = async () => {
    try {
      setLoading(true);
      handleAutoCalc();
      await axios.post("http://localhost:3000/generate", formData);
      alert("✅ Diet plan saved!");
      const res = await axios.get("http://localhost:3000/fetch-latest-plan");
      setPlan(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Error generating diet plan. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Generate PDF ---
  // const generatePDF = () => {
  //   if (!plan?.recommendedMeals?.length) return alert("No plan available");

  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, 20, 20);

  //   plan.recommendedMeals.forEach((day, i) => {
  //     doc.setFontSize(12);
  //     doc.text(`Day ${day.day}`, 20, 30 + i * 40);
  //     doc.text(`Breakfast: ${day.breakfast}`, 25, 36 + i * 40);
  //     doc.text(`Lunch: ${day.lunch}`, 25, 42 + i * 40);
  //     doc.text(`Dinner: ${day.dinner}`, 25, 48 + i * 40);
  //   });

  //   doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
  // };

const generatePDF = () => {
  if (!plan?.recommendedMeals?.length) return alert("No plan available");

  const meals = plan.recommendedMeals; // or normalizeMeals if you already use that

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, 20, 20);

  let y = 40;

  const getMealText = meal => {
    if (!meal) return "Not Provided";
    if (Array.isArray(meal)) return meal.map(m => m.name || m).join(", "); // Handles array of objects or strings
    return meal.name || meal || "Not Provided"; // Handles single object or string
  };

  meals.forEach((day) => {
    doc.setFontSize(14);
    doc.text(`Day ${day.day || "1"}`, 20, y);
    doc.setFontSize(12);
    doc.text(`Breakfast: ${getMealText(day.breakfast)}`, 20, y + 8);
    doc.text(`Lunch: ${getMealText(day.lunch)}`, 20, y + 16);
    doc.text(`Dinner: ${getMealText(day.dinner)}`, 20, y + 24);
    y += 40;
    if (y > 750) {
      doc.addPage();
      y = 40;
    }
  });

  doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
};

  
  // --- Render Array Fields ---
  const renderArrayField = (section, field, label) => (
    <div className="mb-2">
      <h4 className="font-medium text-green-700">{label}</h4>
      <div className="flex flex-wrap gap-2 mt-1">
        {formData[section][field].map((val, i) => (
          <div key={i} className="flex items-center bg-green-100 px-2 py-1 rounded-full space-x-1">
            <input
              value={val}
              onChange={e => handleArrayChange(section, field, i, e.target.value)}
              className="border p-1 rounded-lg w-28"
            />
            <button onClick={() => removeArrayItem(section, field, i)} className="text-red-600 font-bold">x</button>
          </div>
        ))}
        <button onClick={() => addArrayItem(section, field)} className="bg-green-200 px-2 rounded-lg text-green-800 font-medium">Add</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 mx-auto space-y-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-6">🩺 Patient Form</h1>

      {/* Personal Info */}
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Personal Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Full Name" value={formData.personalInfo.fullName} onChange={e => handleInputChange("personalInfo","fullName",e.target.value)} className="border p-2 rounded-lg"/>
          <input type="date" placeholder="DOB" value={formData.personalInfo.dob} onChange={e => handleInputChange("personalInfo","dob",e.target.value)} className="border p-2 rounded-lg"/>
          <input placeholder="Gender" value={formData.personalInfo.gender} onChange={e => handleInputChange("personalInfo","gender",e.target.value)} className="border p-2 rounded-lg"/>
          <input placeholder="Phone" value={formData.personalInfo.contact.phone} onChange={e => handleInputChange("personalInfo","contact",e.target.value,"phone")} className="border p-2 rounded-lg"/>
          <input placeholder="Email" value={formData.personalInfo.contact.email} onChange={e => handleInputChange("personalInfo","contact",e.target.value,"email")} className="border p-2 rounded-lg"/>
        </div>
      </div>

      {/* Vitals */}
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(formData.vitals).map(key => (
            <input key={key} placeholder={key} value={formData.vitals[key]} onChange={e => handleInputChange("vitals", key, e.target.value)} className="border p-2 rounded-lg"/>
          ))}
        </div>
      </div>

      {/* Ayurveda
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Ayurveda Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["prakriti","doshaImbalance","agni","season"].map(key => (
            <input key={key} placeholder={key} value={formData.ayurvedaProfile[key]} onChange={e=>handleInputChange("ayurvedaProfile",key,e.target.value)} className="border p-2 rounded-lg"/>
          ))}
        </div>
        {renderArrayField("ayurvedaProfile","tastePref","Taste Preferences")}
        {renderArrayField("ayurvedaProfile","foodProperties","Food Properties")}
      </div> */}


{/* Ayurveda */}
<div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
  <h2 className="font-semibold text-xl text-green-700">Ayurveda Profile</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Prakriti */}
    <div>
      <label className="block font-medium text-green-700 mb-1">Prakriti</label>
      <select
        value={formData.ayurvedaProfile.prakriti}
        onChange={e => handleInputChange("ayurvedaProfile","prakriti",e.target.value)}
        className="border p-2 rounded-lg w-full"
      >
        <option value="">Select Prakriti</option>
        <option value="Vata">Vata</option>
        <option value="Pitta">Pitta</option>
        <option value="Kapha">Kapha</option>
        <option value="Vata-Pitta">Vata-Pitta</option>
        <option value="Pitta-Kapha">Pitta-Kapha</option>
        <option value="Vata-Kapha">Vata-Kapha</option>
      </select>
    </div>

    {/* Dosha Imbalance */}
    <div>
      <label className="block font-medium text-green-700 mb-1">Dosha Imbalance</label>
      <select
        value={formData.ayurvedaProfile.doshaImbalance}
        onChange={e => handleInputChange("ayurvedaProfile","doshaImbalance",e.target.value)}
        className="border p-2 rounded-lg w-full"
      >
        <option value="">Select Dosha Imbalance</option>
        <option value="Vata">Vata</option>
        <option value="Pitta">Pitta</option>
        <option value="Kapha">Kapha</option>
        <option value="Vata-Pitta">Vata-Pitta</option>
        <option value="Pitta-Kapha">Pitta-Kapha</option>
        <option value="Vata-Kapha">Vata-Kapha</option>
      </select>
    </div>

    {/* Agni */}
    <div>
      <label className="block font-medium text-green-700 mb-1">Agni</label>
      <select
        value={formData.ayurvedaProfile.agni}
        onChange={e => handleInputChange("ayurvedaProfile","agni",e.target.value)}
        className="border p-2 rounded-lg w-full"
      >
        <option value="">Select Agni</option>
        <option value="Manda (Weak)">Manda (Weak)</option>
        <option value="Madhyam (Moderate)">Madhyam (Moderate)</option>
        <option value="Teekshna (Strong)">Teekshna (Strong)</option>
      </select>
    </div>

    {/* Season */}
    <div>
      <label className="block font-medium text-green-700 mb-1">Season</label>
      <select
        value={formData.ayurvedaProfile.season}
        onChange={e => handleInputChange("ayurvedaProfile","season",e.target.value)}
        className="border p-2 rounded-lg w-full"
      >
        <option value="">Select Season</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Monsoon">Monsoon</option>
        <option value="Autumn">Autumn</option>
        <option value="Winter">Winter</option>
      </select>
    </div>

  </div>

  {renderArrayField("ayurvedaProfile","tastePref","Taste Preferences")}
  {renderArrayField("ayurvedaProfile","foodProperties","Food Properties")}
</div>



      {/* Lifestyle */}
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Lifestyle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData.lifestyle).map(key => (
            <input key={key} placeholder={key} value={formData.lifestyle[key]} onChange={e=>handleInputChange("lifestyle",key,e.target.value)} className="border p-2 rounded-lg"/>
          ))}
        </div>
      </div>

      {/* Medical Info */}
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Medical Info</h2>
        {["allergies","conditions","medications"].map(field=>renderArrayField("medicalInfo",field,field))}
        <div>
          <h4 className="font-medium text-green-700">Lab Reports</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
            {Object.keys(formData.medicalInfo.labReports).map(key=>(
              <input key={key} placeholder={key} value={formData.medicalInfo.labReports[key]} onChange={e=>handleInputChange("medicalInfo","labReports",e.target.value,key)} className="border p-2 rounded-lg"/>
            ))}
          </div>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Dietary Preferences</h2>
        {["avoidFoods","preferredFoods"].map(field=>renderArrayField("dietaryPreferences",field,field))}
        <input placeholder="Restricted by Religion" value={formData.dietaryPreferences.restrictedByReligion} onChange={e=>handleInputChange("dietaryPreferences","restrictedByReligion",e.target.value)} className="border p-2 rounded-lg w-full"/>
      </div>

      {/* Goals */}
      <div className="p-6 bg-white shadow-lg rounded-2xl space-y-4 border-l-4 border-green-600">
        <h2 className="font-semibold text-xl text-green-700">Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Short Term" value={formData.goals.shortTerm} onChange={e=>handleInputChange("goals","shortTerm",e.target.value)} className="border p-2 rounded-lg"/>
          <input placeholder="Long Term" value={formData.goals.longTerm} onChange={e=>handleInputChange("goals","longTerm",e.target.value)} className="border p-2 rounded-lg"/>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{loading ? "Generating..." : "Save & Generate Diet Chart"}</button>
        {plan?.recommendedMeals?.length>0 && <button onClick={generatePDF} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">📄 Download PDF</button>}
      </div>
    </div>
  );
}
