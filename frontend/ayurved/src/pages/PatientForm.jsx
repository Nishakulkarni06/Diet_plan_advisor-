// // src/PatientForm.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// /*
//   Updated PatientForm:
//   - Initial form is empty (not prefilled) so user fills values.
//   - Many fields replaced with selects/datalists/quick-add controls to reduce typing.
//   - Array fields support quick-add with suggestions (datalist) and remove.
//   - All original logic (calculate age/BMI, attachments, submit -> POST /generate -> navigate) unchanged.
// */

// export default function PatientForm() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const emptyPatient = {
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
//       labReports: { bloodSugarFasting: "", cholesterol: "", hb: "" },
//     },
//     dietaryPreferences: {
//       avoidFoods: [],
//       preferredFoods: [],
//       restrictedByReligion: "No",
//     },
//     goals: {
//       shortTerm: "",
//       longTerm: "",
//     },
//     attachments: [],
//     calculated: { age: "", bmi: "" },
//   };

//   const [formData, setFormData] = useState(emptyPatient);

//   // Predefined option lists (feel free to extend)
//   const genderOptions = ["Male", "Female", "Other"];
//   const prakritiOptions = ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha"];
//   const doshaOptions = ["Vata", "Pitta", "Kapha"];
//   const agniOptions = ["Manda", "Madhyam", "Tikshna"];
//   const seasonOptions = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];
//   const dietTypeOptions = ["Vegetarian", "Vegan", "Eggetarian", "Pescatarian", "Non-Vegetarian"];
//   const bowelOptions = ["Constipated", "Normal", "Loose"];
//   const physicalActivityOptions = ["Sedentary", "Light", "Moderate", "Active"];
//   const stressOptions = ["Low", "Moderate", "High"];
//   const mealFreqOptions = [1, 2, 3, 4, 5, 6];

//   // Small helpers to update nested state
//   const updateNested = (section, key, value) => {
//     setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
//   };

//   const updateDeep = (path, value) => {
//     setFormData((prev) => {
//       const copy = JSON.parse(JSON.stringify(prev));
//       let cur = copy;
//       for (let i = 0; i < path.length - 1; i++) {
//         if (cur[path[i]] === undefined) cur[path[i]] = {};
//         cur = cur[path[i]];
//       }
//       cur[path[path.length - 1]] = value;
//       return copy;
//     });
//   };

//   // Array helpers (for tastePref, allergies, foods, etc.)
//   const addToArray = (section, key, value) => {
//     if (!value || value.toString().trim() === "") return;
//     setFormData((prev) => ({
//       ...prev,
//       [section]: { ...prev[section], [key]: [...(prev[section][key] || []), value] },
//     }));
//   };

//   const removeFromArray = (section, key, idx) => {
//     setFormData((prev) => {
//       const arr = [...(prev[section][key] || [])].filter((_, i) => i !== idx);
//       return { ...prev, [section]: { ...prev[section], [key]: arr } };
//     });
//   };

//   // Attachments
//   const handleAttachmentsChange = (files) => {
//     const arr = Array.from(files || []).map((f) => ({ name: f.name, file: f }));
//     setFormData((prev) => ({ ...prev, attachments: arr }));
//   };

//   // Calculate age & BMI (same logic)
//   const getCalculatedFormData = () => {
//     const updated = JSON.parse(JSON.stringify(formData));

//     if (updated.personalInfo.dob) {
//       const dobYear = new Date(updated.personalInfo.dob).getFullYear();
//       const age = new Date().getFullYear() - dobYear;
//       updated.personalInfo.age = age;
//       updated.calculated.age = age;
//     }

//     if (updated.vitals.height_cm && updated.vitals.weight_kg) {
//       const h = Number(updated.vitals.height_cm) / 100;
//       if (h > 0) {
//         const bmi = (Number(updated.vitals.weight_kg) / (h * h)).toFixed(1);
//         updated.vitals.bmi = bmi;
//         updated.calculated.bmi = bmi;
//       }
//     }

//     return updated;
//   };

//   // convert attachments to data URLs
//   const filesToDataUrls = (attachments) => {
//     return Promise.all(
//       (attachments || []).map((a) => {
//         if (a.file) {
//           return new Promise((res, rej) => {
//             const reader = new FileReader();
//             reader.onload = () => res({ name: a.name, dataUrl: reader.result });
//             reader.onerror = rej;
//             reader.readAsDataURL(a.file);
//           });
//         }
//         return Promise.resolve(a);
//       })
//     );
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e?.preventDefault?.();
//     try {
//       setLoading(true);
//       const updated = getCalculatedFormData();

//       // attachments
//       const attachmentsData = await filesToDataUrls(updated.attachments || []);
//       updated.attachments = attachmentsData;

//       setFormData(updated);
//       await axios.post("http://localhost:3000/generate", updated);

//       navigate("/diet-plan", { state: { patient: updated.personalInfo } });
//     } catch (err) {
//       console.error("Backend error:", err.response?.data || err.message);
//       alert("Error generating diet plan. See console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Small UI primitives
//   const Input = ({ label, ...rest }) => (
//     <div>
//       <label className="block text-sm text-gray-700 mb-1">{label}</label>
//       <input className="w-full border rounded p-2" {...rest} />
//     </div>
//   );

//   const Select = ({ label, options = [], value, onChange }) => (
//     <div>
//       <label className="block text-sm text-gray-700 mb-1">{label}</label>
//       <select className="w-full border rounded p-2" value={value} onChange={(e) => onChange(e.target.value)}>
//         <option value="">— select —</option>
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   // Reusable quick-add field with datalist suggestions
//   const DatalistAdd = ({ label, suggestions = [], items = [], onAdd, onRemove, placeholder = "" }) => {
//     const [val, setVal] = useState("");
//     return (
//       <div>
//         <label className="block text-sm text-gray-700 mb-1">{label}</label>
//         <div className="flex gap-2">
//           <input
//             list={`${label}-list`}
//             value={val}
//             onChange={(e) => setVal(e.target.value)}
//             placeholder={placeholder}
//             className="flex-1 border rounded p-2"
//           />
//           <datalist id={`${label}-list`}>
//             {suggestions.map((s) => (
//               <option key={s} value={s} />
//             ))}
//           </datalist>
//           <button
//             type="button"
//             onClick={() => {
//               onAdd(val);
//               setVal("");
//             }}
//             className="px-3 py-2 bg-green-600 text-white rounded"
//           >
//             Add
//           </button>
//         </div>

//         <div className="mt-2 flex flex-wrap gap-2">
//           {items.map((it, i) => (
//             <span key={i} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm">
//               {it}
//               <button type="button" onClick={() => onRemove(i)} className="text-red-500 font-bold">
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Suggestion lists for foods / common items
//   const commonFoods = ["moong dal", "ghee", "pomegranate", "leafy greens", "rice", "dal", "roti", "curd", "banana"];
//   const commonAllergies = ["None", "Peanuts", "Dairy", "Gluten", "Seafood"];
//   const commonConditions = ["Hypertension", "Diabetes", "Thyroid", "PCOS", "Asthma"];

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">🩺 New Patient — Fill Details</h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Personal Info */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Personal Info</h3>
//           <div className="grid grid-cols-3 gap-4">
//             <Input
//               label="Full name"
//               value={formData.personalInfo.fullName}
//               onChange={(e) => updateNested("personalInfo", "fullName", e.target.value)}
//               placeholder="e.g., Rohan Verma"
//             />
//             <Input
//               label="DOB"
//               type="date"
//               value={formData.personalInfo.dob}
//               onChange={(e) => updateNested("personalInfo", "dob", e.target.value)}
//             />
//             <Select
//               label="Gender"
//               options={genderOptions}
//               value={formData.personalInfo.gender}
//               onChange={(v) => updateNested("personalInfo", "gender", v)}
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4 mt-3">
//             <Input label="Age (auto)" readOnly value={formData.personalInfo.age} />
//             <Input
//               label="Phone"
//               value={formData.personalInfo.contact.phone}
//               onChange={(e) => updateDeep(["personalInfo", "contact", "phone"], e.target.value)}
//               placeholder="+91xxxxxxxxxx"
//             />
//             <Input
//               label="Email"
//               type="email"
//               value={formData.personalInfo.contact.email}
//               onChange={(e) => updateDeep(["personalInfo", "contact", "email"], e.target.value)}
//               placeholder="name@example.com"
//             />
//           </div>
//         </section>

//         {/* Vitals */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Vitals (enter numbers)</h3>
//           <div className="grid grid-cols-4 gap-4">
//             <Input
//               label="Height (cm)"
//               type="number"
//               value={formData.vitals.height_cm}
//               onChange={(e) => updateNested("vitals", "height_cm", e.target.value)}
//               placeholder="e.g., 175"
//             />
//             <Input
//               label="Weight (kg)"
//               type="number"
//               value={formData.vitals.weight_kg}
//               onChange={(e) => updateNested("vitals", "weight_kg", e.target.value)}
//               placeholder="e.g., 70"
//             />
//             <Input label="BMI (auto)" readOnly value={formData.vitals.bmi} />
//             <Input label="BP" value={formData.vitals.bp} onChange={(e) => updateNested("vitals", "bp", e.target.value)} placeholder="120/80" />
//           </div>

//           <div className="grid grid-cols-3 gap-4 mt-3">
//             <Input label="Pulse" type="number" value={formData.vitals.pulseRate} onChange={(e) => updateNested("vitals", "pulseRate", e.target.value)} />
//             <Input label="Respiration" type="number" value={formData.vitals.respirationRate} onChange={(e) => updateNested("vitals", "respirationRate", e.target.value)} />
//             <Input label="Temperature" value={formData.vitals.temperature} onChange={(e) => updateNested("vitals", "temperature", e.target.value)} />
//           </div>
//         </section>

//         {/* Ayurveda */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Ayurveda Profile</h3>
//           <div className="grid grid-cols-3 gap-4">
//             <Select label="Prakriti" options={prakritiOptions} value={formData.ayurvedaProfile.prakriti} onChange={(v) => updateNested("ayurvedaProfile", "prakriti", v)} />
//             <Select label="Dosha Imbalance" options={doshaOptions} value={formData.ayurvedaProfile.doshaImbalance} onChange={(v) => updateNested("ayurvedaProfile", "doshaImbalance", v)} />
//             <Select label="Agni" options={agniOptions} value={formData.ayurvedaProfile.agni} onChange={(v) => updateNested("ayurvedaProfile", "agni", v)} />
//           </div>

//           <div className="grid grid-cols-2 gap-4 mt-3">
//             <DatalistAdd
//               label="Taste Preferences"
//               suggestions={["sweet", "bitter", "astringent", "sour", "salty", "pungent"]}
//               items={formData.ayurvedaProfile.tastePref}
//               onAdd={(v) => addToArray("ayurvedaProfile", "tastePref", v)}
//               onRemove={(i) => removeFromArray("ayurvedaProfile", "tastePref", i)}
//               placeholder="Select or type taste"
//             />
//             <DatalistAdd
//               label="Food Properties"
//               suggestions={["cool", "warm", "light", "heavy", "oily", "dry", "moist"]}
//               items={formData.ayurvedaProfile.foodProperties}
//               onAdd={(v) => addToArray("ayurvedaProfile", "foodProperties", v)}
//               onRemove={(i) => removeFromArray("ayurvedaProfile", "foodProperties", i)}
//               placeholder="Select or type property"
//             />
//           </div>

//           <div className="mt-3">
//             <Select label="Season" options={seasonOptions} value={formData.ayurvedaProfile.season} onChange={(v) => updateNested("ayurvedaProfile", "season", v)} />
//           </div>
//         </section>

//         {/* Lifestyle */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Lifestyle</h3>
//           <div className="grid grid-cols-3 gap-4">
//             <Select label="Diet Type" options={dietTypeOptions} value={formData.lifestyle.dietType} onChange={(v) => updateNested("lifestyle", "dietType", v)} />
//             <Select label="Meals per day" options={mealFreqOptions} value={formData.lifestyle.mealFreq} onChange={(v) => updateNested("lifestyle", "mealFreq", v)} />
//             <Select
//               label="Water intake (L)"
//               options={["0.5", "1", "1.5", "2", "2.5", "3"]}
//               value={formData.lifestyle.waterIntake_l}
//               onChange={(v) => updateNested("lifestyle", "waterIntake_l", v)}
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4 mt-3">
//             <Select label="Bowel" options={bowelOptions} value={formData.lifestyle.bowel} onChange={(v) => updateNested("lifestyle", "bowel", v)} />
//             <Input label="Sleep pattern" value={formData.lifestyle.sleepPattern} onChange={(e) => updateNested("lifestyle", "sleepPattern", e.target.value)} placeholder="e.g., 11 PM - 6 AM" />
//             <Select label="Physical activity" options={physicalActivityOptions} value={formData.lifestyle.physicalActivity} onChange={(v) => updateNested("lifestyle", "physicalActivity", v)} />
//           </div>

//           <div className="mt-3">
//             <Select label="Stress level" options={stressOptions} value={formData.lifestyle.stressLevel} onChange={(v) => updateNested("lifestyle", "stressLevel", v)} />
//           </div>
//         </section>

//         {/* Medical Info */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Medical Info</h3>

//           <div className="grid grid-cols-2 gap-4">
//             <DatalistAdd
//               label="Allergies"
//               suggestions={commonAllergies}
//               items={formData.medicalInfo.allergies}
//               onAdd={(v) => addToArray("medicalInfo", "allergies", v)}
//               onRemove={(i) => removeFromArray("medicalInfo", "allergies", i)}
//               placeholder="Add allergy"
//             />
//             <DatalistAdd
//               label="Conditions"
//               suggestions={commonConditions}
//               items={formData.medicalInfo.conditions}
//               onAdd={(v) => addToArray("medicalInfo", "conditions", v)}
//               onRemove={(i) => removeFromArray("medicalInfo", "conditions", i)}
//               placeholder="Add condition"
//             />
//           </div>

//           <div className="mt-4">
//             <DatalistAdd
//               label="Medications"
//               suggestions={["Amlodipine 5mg", "Metformin", "Levothyroxine"]}
//               items={formData.medicalInfo.medications}
//               onAdd={(v) => addToArray("medicalInfo", "medications", v)}
//               onRemove={(i) => removeFromArray("medicalInfo", "medications", i)}
//               placeholder="Add medication"
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-4 mt-3">
//             <Input label="Fasting blood sugar" value={formData.medicalInfo.labReports.bloodSugarFasting} onChange={(e) => updateDeep(["medicalInfo", "labReports", "bloodSugarFasting"], e.target.value)} />
//             <Input label="Cholesterol" value={formData.medicalInfo.labReports.cholesterol} onChange={(e) => updateDeep(["medicalInfo", "labReports", "cholesterol"], e.target.value)} />
//             <Input label="Hb" value={formData.medicalInfo.labReports.hb} onChange={(e) => updateDeep(["medicalInfo", "labReports", "hb"], e.target.value)} />
//           </div>
//         </section>

//         {/* Dietary Preferences */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Dietary Preferences</h3>

//           <div className="grid grid-cols-2 gap-4">
//             <DatalistAdd
//               label="Avoid Foods"
//               suggestions={commonFoods}
//               items={formData.dietaryPreferences.avoidFoods}
//               onAdd={(v) => addToArray("dietaryPreferences", "avoidFoods", v)}
//               onRemove={(i) => removeFromArray("dietaryPreferences", "avoidFoods", i)}
//               placeholder="Add food to avoid"
//             />
//             <DatalistAdd
//               label="Preferred Foods"
//               suggestions={commonFoods}
//               items={formData.dietaryPreferences.preferredFoods}
//               onAdd={(v) => addToArray("dietaryPreferences", "preferredFoods", v)}
//               onRemove={(i) => removeFromArray("dietaryPreferences", "preferredFoods", i)}
//               placeholder="Add preferred food"
//             />
//           </div>

//           <div className="mt-3">
//             <label className="block text-sm text-gray-700 mb-1">Restricted By Religion</label>
//             <select className="w-full border rounded p-2" value={formData.dietaryPreferences.restrictedByReligion} onChange={(e) => updateNested("dietaryPreferences", "restrictedByReligion", e.target.value)}>
//               <option>No</option>
//               <option>Yes</option>
//             </select>
//           </div>
//         </section>

//         {/* Goals */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Goals</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <Input label="Short-term goal" value={formData.goals.shortTerm} onChange={(e) => updateNested("goals", "shortTerm", e.target.value)} placeholder="e.g., Reduce pitta" />
//             <Input label="Long-term goal" value={formData.goals.longTerm} onChange={(e) => updateNested("goals", "longTerm", e.target.value)} placeholder="e.g., Prevent diabetes" />
//           </div>
//         </section>

//         {/* Attachments */}
//         <section className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-3">Attachments</h3>
//           <input type="file" multiple onChange={(e) => handleAttachmentsChange(e.target.files)} />
//           <div className="mt-2">
//             {formData.attachments?.length > 0 && (
//               <ul className="list-disc pl-5">
//                 {formData.attachments.map((a, i) => (
//                   <li key={i}>{a.name || a.file?.name}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </section>

//         {/* Submit */}
//         <div className="flex items-center gap-3">
//           <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>
//             {loading ? "Generating..." : "Save & Generate Diet Chart"}
//           </button>

//           <button
//             type="button"
//             className="px-4 py-2 bg-gray-200 rounded"
//             onClick={() => {
//               const calc = getCalculatedFormData();
//               setFormData(calc);
//               alert("Age & BMI calculated (preview updated)");
//             }}
//           >
//             Calculate Age & BMI
//           </button>

//           <button
//             type="button"
//             className="px-4 py-2 bg-gray-100 rounded"
//             onClick={() => {
//               setFormData(emptyPatient);
//             }}
//             title="Reset form"
//           >
//             Reset
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

















// src/components/PatientForm.jsx
import React, { useState, useMemo } from "react"; // CORRECTED THIS LINE
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Icon Components (for a polished look) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const LeafIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;

export default function PatientForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0); // For multi-step form

    // --- YOUR STATE & LOGIC (ENTIRELY UNCHANGED) ---
    const emptyPatient = {
        personalInfo: { fullName: "", dob: "", gender: "", age: "", contact: { phone: "", email: "" } },
        vitals: { height_cm: "", weight_kg: "", bmi: "", bp: "", pulseRate: "", respirationRate: "", temperature: "" },
        ayurvedaProfile: { prakriti: "", doshaImbalance: "", agni: "", tastePref: [], foodProperties: [], season: "" },
        lifestyle: { dietType: "", mealFreq: "", waterIntake_l: "", bowel: "", sleepPattern: "", physicalActivity: "", stressLevel: "" },
        medicalInfo: { allergies: [], conditions: [], medications: [], labReports: { bloodSugarFasting: "", cholesterol: "", hb: "" } },
        dietaryPreferences: { avoidFoods: [], preferredFoods: [], restrictedByReligion: "No" },
        goals: { shortTerm: "", longTerm: "" },
        attachments: [],
        calculated: { age: "", bmi: "" },
    };
    const [formData, setFormData] = useState(emptyPatient);

    const genderOptions = ["Male", "Female", "Other"];
    const prakritiOptions = ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha"];
    const doshaOptions = ["Vata", "Pitta", "Kapha"];
    const agniOptions = ["Manda", "Madhyam", "Tikshna"];
    const seasonOptions = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];
    const dietTypeOptions = ["Vegetarian", "Vegan", "Eggetarian", "Pescatarian", "Non-Vegetarian"];
    const bowelOptions = ["Constipated", "Normal", "Loose"];
    const physicalActivityOptions = ["Sedentary", "Light", "Moderate", "Active"];
    const commonFoods = ["moong dal", "ghee", "pomegranate", "leafy greens", "rice", "dal", "roti", "curd", "banana"];
    const commonAllergies = ["None", "Peanuts", "Dairy", "Gluten", "Seafood"];
    const commonConditions = ["Hypertension", "Diabetes", "Thyroid", "PCOS", "Asthma"];

    const updateNested = (section, key, value) => setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    const updateDeep = (path, value) => {
        setFormData((prev) => {
            const copy = JSON.parse(JSON.stringify(prev));
            let cur = copy;
            for (let i = 0; i < path.length - 1; i++) {
                if (cur[path[i]] === undefined) cur[path[i]] = {};
                cur = cur[path[i]];
            }
            cur[path[path.length - 1]] = value;
            return copy;
        });
    };
    const addToArray = (section, key, value) => {
        if (!value || value.toString().trim() === "") return;
        setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [key]: [...(prev[section][key] || []), value] } }));
    };
    const removeFromArray = (section, key, idx) => {
        setFormData((prev) => {
            const arr = [...(prev[section][key] || [])].filter((_, i) => i !== idx);
            return { ...prev, [section]: { ...prev[section], [key]: arr } };
        });
    };
    const handleAttachmentsChange = (files) => {
        const arr = Array.from(files || []).map((f) => ({ name: f.name, file: f }));
        setFormData((prev) => ({ ...prev, attachments: arr }));
    };
    const getCalculatedFormData = () => {
        const updated = JSON.parse(JSON.stringify(formData));
        if (updated.personalInfo.dob) {
            updated.personalInfo.age = new Date().getFullYear() - new Date(updated.personalInfo.dob).getFullYear();
            updated.calculated.age = updated.personalInfo.age;
        }
        if (updated.vitals.height_cm && updated.vitals.weight_kg) {
            const h = Number(updated.vitals.height_cm) / 100;
            if (h > 0) {
                updated.vitals.bmi = (Number(updated.vitals.weight_kg) / (h * h)).toFixed(1);
                updated.calculated.bmi = updated.vitals.bmi;
            }
        }
        return updated;
    };
    const filesToDataUrls = (attachments) => Promise.all((attachments || []).map((a) => a.file ? new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res({ name: a.name, dataUrl: r.result }); r.onerror = rej; r.readAsDataURL(a.file); }) : Promise.resolve(a)));
    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        try {
            setLoading(true);
            let updated = getCalculatedFormData();
            updated.attachments = await filesToDataUrls(updated.attachments || []);
            setFormData(updated);
            await axios.post("http://localhost:3000/generate", updated);
            navigate("/diet-plan", { state: { patient: updated.personalInfo } });
        } catch (err) {
            console.error("Backend error:", err.response?.data || err.message);
            alert("Error generating diet plan. See console.");
        } finally {
            setLoading(false);
        }
    };
    
    // --- NEW: UI Primitives & Components ---
    const Input = ({ label, ...rest }) => (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <input className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" {...rest} />
        </div>
    );
    const Select = ({ label, options = [], value, onChange }) => (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
            <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={value} onChange={(e) => onChange(e.target.value)}>
                <option value="">— select —</option>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
    const DatalistAdd = ({ label, suggestions = [], items = [], onAdd, onRemove, placeholder = "" }) => {
        const [val, setVal] = useState("");
        return (
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
                <div className="flex gap-2">
                    <input list={`${label}-list`} value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder} className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    <datalist id={`${label}-list`}>{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
                    <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => { onAdd(val); setVal(""); }} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">Add</motion.button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {items.map((it, i) => (
                        <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                            {it}
                            <button type="button" onClick={() => onRemove(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                        </motion.span>
                    ))}
                </div>
            </div>
        );
    };

    const steps = [
        { name: "Personal Info", icon: <UserIcon /> },
        { name: "Vitals & Ayurveda", icon: <HeartIcon /> },
        { name: "Lifestyle & Medical", icon: <LeafIcon /> },
        { name: "Preferences & Goals", icon: <ClipboardIcon /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Ayurvedic Diet Planner</h1>
                    <p className="text-slate-500 mt-2">Create a personalized, holistic diet plan in minutes.</p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* --- LEFT: Multi-step Form --- */}
                    <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80">
                        {/* Stepper Navigation */}
                        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
                            {steps.map((s, i) => (
                                <div key={s.name} className={`flex items-center gap-2 text-sm font-medium ${step >= i ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${step >= i ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {s.icon}
                                    </div>
                                    <span className="hidden sm:inline">{s.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Form Content */}
                        <AnimatePresence mode="wait">
                            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                                {step === 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <h3 className="sm:col-span-2 text-xl font-semibold text-slate-700">Personal & Contact Info</h3>
                                        <Input label="Full name" value={formData.personalInfo.fullName} onChange={(e) => updateNested("personalInfo", "fullName", e.target.value)} placeholder="e.g., Rohan Verma" />
                                        <Input label="DOB" type="date" value={formData.personalInfo.dob} onChange={(e) => updateNested("personalInfo", "dob", e.target.value)} />
                                        <Select label="Gender" options={genderOptions} value={formData.personalInfo.gender} onChange={(v) => updateNested("personalInfo", "gender", v)} />
                                        <Input label="Phone" value={formData.personalInfo.contact.phone} onChange={(e) => updateDeep(["personalInfo", "contact", "phone"], e.target.value)} placeholder="+91xxxxxxxxxx" />
                                        <Input label="Email" type="email" value={formData.personalInfo.contact.email} onChange={(e) => updateDeep(["personalInfo", "contact", "email"], e.target.value)} placeholder="name@example.com" />
                                    </div>
                                )}
                                {step === 1 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <h3 className="sm:col-span-2 text-xl font-semibold text-slate-700">Vitals & Ayurvedic Profile</h3>
                                        <Input label="Height (cm)" type="number" value={formData.vitals.height_cm} onChange={(e) => updateNested("vitals", "height_cm", e.target.value)} />
                                        <Input label="Weight (kg)" type="number" value={formData.vitals.weight_kg} onChange={(e) => updateNested("vitals", "weight_kg", e.target.value)} />
                                        <Input label="BP" value={formData.vitals.bp} onChange={(e) => updateNested("vitals", "bp", e.target.value)} placeholder="e.g. 120/80" />
                                        <Select label="Prakriti" options={prakritiOptions} value={formData.ayurvedaProfile.prakriti} onChange={(v) => updateNested("ayurvedaProfile", "prakriti", v)} />
                                        <Select label="Dosha Imbalance" options={doshaOptions} value={formData.ayurvedaProfile.doshaImbalance} onChange={(v) => updateNested("ayurvedaProfile", "doshaImbalance", v)} />
                                        <Select label="Agni" options={agniOptions} value={formData.ayurvedaProfile.agni} onChange={(v) => updateNested("ayurvedaProfile", "agni", v)} />
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-slate-700">Lifestyle & Medical History</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <Select label="Diet Type" options={dietTypeOptions} value={formData.lifestyle.dietType} onChange={(v) => updateNested("lifestyle", "dietType", v)} />
                                            <Select label="Physical activity" options={physicalActivityOptions} value={formData.lifestyle.physicalActivity} onChange={(v) => updateNested("lifestyle", "physicalActivity", v)} />
                                            <Select label="Water intake (L)" options={["0.5", "1", "1.5", "2", "2.5", "3"]} value={formData.lifestyle.waterIntake_l} onChange={(v) => updateNested("lifestyle", "waterIntake_l", v)} />
                                            <Select label="Bowel" options={bowelOptions} value={formData.lifestyle.bowel} onChange={(v) => updateNested("lifestyle", "bowel", v)} />
                                            <DatalistAdd label="Allergies" suggestions={commonAllergies} items={formData.medicalInfo.allergies} onAdd={(v) => addToArray("medicalInfo", "allergies", v)} onRemove={(i) => removeFromArray("medicalInfo", "allergies", i)} />
                                            <DatalistAdd label="Conditions" suggestions={commonConditions} items={formData.medicalInfo.conditions} onAdd={(v) => addToArray("medicalInfo", "conditions", v)} onRemove={(i) => removeFromArray("medicalInfo", "conditions", i)} />
                                        </div>
                                    </div>
                                )}
                                {step === 3 && (
                                     <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-slate-700">Preferences, Goals & Attachments</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <DatalistAdd label="Avoid Foods" suggestions={commonFoods} items={formData.dietaryPreferences.avoidFoods} onAdd={(v) => addToArray("dietaryPreferences", "avoidFoods", v)} onRemove={(i) => removeFromArray("dietaryPreferences", "avoidFoods", i)} />
                                            <DatalistAdd label="Preferred Foods" suggestions={commonFoods} items={formData.dietaryPreferences.preferredFoods} onAdd={(v) => addToArray("dietaryPreferences", "preferredFoods", v)} onRemove={(i) => removeFromArray("dietaryPreferences", "preferredFoods", i)} />
                                            <Input label="Short-term goal" value={formData.goals.shortTerm} onChange={(e) => updateNested("goals", "shortTerm", e.target.value)} placeholder="e.g., Reduce pitta" />
                                            <Input label="Long-term goal" value={formData.goals.longTerm} onChange={(e) => updateNested("goals", "longTerm", e.target.value)} placeholder="e.g., Prevent diabetes" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-600 mb-1">Attachments (Lab Reports, etc.)</label>
                                            <input type="file" multiple onChange={(e) => handleAttachmentsChange(e.target.files)} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="mt-10 pt-6 border-t border-slate-200 flex justify-between items-center">
                            <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md shadow-sm hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </motion.button>
                            {step < steps.length - 1 ? (
                                <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">
                                    Next
                                </motion.button>
                            ) : (
                                <motion.button type="submit" whileTap={{ scale: 0.95 }} disabled={loading} onClick={handleSubmit} className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-md shadow-lg hover:bg-cyan-600 disabled:bg-gray-400">
                                    {loading ? "Generating..." : "Save & Generate Plan"}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT: Sticky Preview Card --- */}
                    <div className="relative">
                         <div className="sticky top-8">
                            <PreviewCard formData={formData} onRefresh={() => setFormData(getCalculatedFormData())}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- NEW: The Eye-Catching Preview Card Component ---
const PreviewCard = ({ formData, onRefresh }) => {
    const bmi = Number(formData.calculated?.bmi || formData.vitals?.bmi || 0);
    const water = Number(formData.lifestyle?.waterIntake_l || 0);

    const bmiData = useMemo(() => {
        if (!bmi || bmi < 10 || bmi > 50) return { percent: 0, color: 'stroke-slate-300', label: 'N/A' };
        const percent = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100)); // Normalize 15-40 BMI range
        let color = 'stroke-cyan-400';
        let label = 'Healthy';
        if (bmi < 18.5) { color = 'stroke-yellow-400'; label = 'Underweight'; }
        else if (bmi >= 25 && bmi < 30) { color = 'stroke-orange-400'; label = 'Overweight'; }
        else if (bmi >= 30) { color = 'stroke-red-500'; label = 'Obese'; }
        return { percent, color, label };
    }, [bmi]);

    const waterPercent = useMemo(() => Math.min(100, (water / 3.5) * 100), [water]); // Assume 3.5L goal

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden"
        >
            <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                        {formData.personalInfo.fullName ? formData.personalInfo.fullName.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold truncate">{formData.personalInfo.fullName || "Patient Preview"}</h3>
                        <p className="text-sm text-indigo-200">
                            Age: {formData.calculated.age || "-"} • {formData.personalInfo.gender || "Gender"}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <h4 className="text-lg font-semibold text-slate-700 text-center">Health Snapshot</h4>
                
                {/* BMI Chart */}
                <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <motion.circle cx="50" cy="50" r="45" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                            <motion.circle
                                cx="50" cy="50" r="45"
                                className={bmiData.color}
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                pathLength="1"
                                initial={{ strokeDasharray: "0 1" }}
                                animate={{ strokeDasharray: `${bmiData.percent / 100} 1` }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-slate-800">{bmi || "-"}</span>
                            <span className="text-sm font-medium text-slate-500">BMI</span>
                            <span className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${bmiData.color.replace('stroke-', 'bg-').replace('-400', '-100').replace('-500', '-100')} ${bmiData.color.replace('stroke-', 'text-').replace('-400', '-700').replace('-500', '-700')}`}>
                                {bmiData.label}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Water Intake Bar */}
                <div>
                    <div className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                        <span>Daily Water Intake</span>
                        <span className="font-bold text-indigo-600">{water || "0"} L / 3.5 L</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${waterPercent}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <motion.button 
                    whileTap={{ scale: 0.97 }}
                    onClick={onRefresh} 
                    className="w-full mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-200 transition-colors"
                >
                    Refresh Snapshot
                </motion.button>
            </div>
        </motion.div>
    );
};