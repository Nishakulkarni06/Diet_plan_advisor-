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
import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function PatientForm() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "Rohan Verma",
      dob: "1980-05-15",
      gender: "Male",
      age: 45,
      contact: { phone: "+919876543210", email: "rohan.verma@example.com" },
    },
    vitals: {
      height_cm: 175,
      weight_kg: 82,
      bmi: 26.8,
      bp: "140/90",
      pulseRate: 78,
      respirationRate: 16,
      temperature: "98.4",
    },
    ayurvedaProfile: {
      prakriti: "Pitta-Kapha",
      doshaImbalance: "Pitta",
      agni: "Tikshna",
      tastePref: ["sweet", "bitter", "astringent"],
      foodProperties: ["cool", "light", "dry"],
      season: "Summer",
    },
    lifestyle: {
      dietType: "Vegetarian",
      mealFreq: 3,
      waterIntake_l: 2.5,
      bowel: "Normal",
      sleepPattern: "11 PM - 6 AM",
      physicalActivity: "Moderate",
      stressLevel: "Moderate",
    },
    medicalInfo: {
      allergies: ["None reported"],
      conditions: ["Hypertension", "Prediabetes"],
      medications: ["Amlodipine 5mg"],
      labReports: { bloodSugarFasting: "115", cholesterol: "210", hb: "14.2" },
    },
    dietaryPreferences: {
      avoidFoods: ["spicy", "oily", "fermented"],
      preferredFoods: ["moong dal", "ghee", "pomegranate", "leafy greens"],
      restrictedByReligion: "No",
    },
    goals: {
      shortTerm: "Reduce pitta imbalance",
      longTerm: "Prevent diabetes",
    },
    attachments: [],
    calculated: { age: 45, bmi: 26.8 },
  });

  // --- Auto-calculate age & BMI ---
  const handleAutoCalc = () => {
    if (formData.personalInfo.dob) {
      const age =
        new Date().getFullYear() - new Date(formData.personalInfo.dob).getFullYear();
      formData.personalInfo.age = age;
      formData.calculated.age = age;
    }
    if (formData.vitals.height_cm && formData.vitals.weight_kg) {
      const h = formData.vitals.height_cm / 100;
      const bmi = (formData.vitals.weight_kg / (h * h)).toFixed(1);
      formData.vitals.bmi = bmi;
      formData.calculated.bmi = bmi;
    }
  };

  // --- Normalize meals ---
  const normalizeMeals = (rawMeals) => {
    if (!rawMeals || rawMeals.length === 0) return [];
    return rawMeals.map((day, i) => ({
      day: day.day || day.Day || i + 1,
      breakfast: day.breakfast || day.meals?.breakfast?.items?.map(i => i.Dish_Name).join(", ") || "",
      lunch: day.lunch || day.meals?.lunch?.items?.map(i => i.Dish_Name).join(", ") || "",
      dinner: day.dinner || day.meals?.dinner?.items?.map(i => i.Dish_Name).join(", ") || ""
    }));
  };

  // --- Fetch latest saved plan ---
  const fetchLatestPlan = async () => {
    try {
      const res = await axios.get("http://localhost:3000/fetch-latest-plan");
      const rawMeals = res.data?.recommendedMeals || res.data?.fullPlan?.weekly_plan || res.data?.fullPlan?.recommendations || [];
      const normalizedMeals = normalizeMeals(rawMeals);
      setPlan({ recommendedMeals: normalizedMeals });
    } catch (err) {
      console.error("Failed to fetch latest plan:", err);
    }
  };

  // --- Submit form & generate plan ---
  const handleSubmit = async () => {
    try {
      setLoading(true);
      handleAutoCalc();

      console.log("Sending patient data:", formData);
      await axios.post("http://localhost:3000/generate", formData);

      alert("✅ Diet plan saved!");
      await fetchLatestPlan(); // Fetch only after submission
    } catch (err) {
      console.error("Backend error:", err.response?.data || err.message);
      alert("❌ Error generating diet plan. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Generate Stylish PDF ---
  const generatePDF = () => {
    if (!plan || !plan.recommendedMeals || plan.recommendedMeals.length === 0) {
      alert("❌ No diet plan to generate PDF.");
      return;
    }

    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFillColor(76, 175, 80); // green header
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, pageWidth / 2, 32, { align: 'center' });

    let y = 70;

    plan.recommendedMeals.forEach((day) => {
      // Day box
      doc.setFillColor(230, 230, 250); // light lavender
      doc.roundedRect(14, y - 4, pageWidth - 28, 60, 5, 5, 'F');

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Day ${day.day}`, 20, y);

      doc.setFontSize(12);
      doc.text(`Breakfast: ${day.breakfast}`, 20, y + 18);
      doc.text(`Lunch: ${day.lunch}`, 20, y + 32);
      doc.text(`Dinner: ${day.dinner}`, 20, y + 46);

      y += 70;

      if (y > 750) { // create new page if overflow
        doc.addPage();
        y = 50;
      }
    });

    // --- Footer ---
    const today = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, pageWidth - 14, doc.internal.pageSize.height - 10, { align: 'right' });

    doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">🩺 Patient Form</h1>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        {loading ? "Generating..." : "Save & Generate Diet Chart"}
      </button>

      {plan?.recommendedMeals?.length > 0 && (
        <button
          onClick={generatePDF}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          📄 Download PDF
        </button>
      )}

      {plan?.recommendedMeals?.length > 0 ? (
        <div className="mt-6 p-4 border rounded-xl shadow-md bg-gray-50">
          <h2 className="text-xl font-semibold text-green-700">
            Diet Plan for {formData.personalInfo.fullName}
          </h2>
          {plan.recommendedMeals.map((day, i) => (
            <div key={i} className="mt-2 p-2 border-b rounded-md bg-white shadow-sm">
              <h3 className="font-semibold text-indigo-700">Day {day.day}</h3>
              <p><strong>Breakfast:</strong> {day.breakfast}</p>
              <p><strong>Lunch:</strong> {day.lunch}</p>
              <p><strong>Dinner:</strong> {day.dinner}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">
          No diet plan generated yet. Click the button above to generate.
        </p>
      )}
    </div>
  );
}
