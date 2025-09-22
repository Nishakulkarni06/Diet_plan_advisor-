

// // src/pages/DietPlanPage.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = {
//   personalInfo: { fullName: "Patient" },
//   vitals: {},
//   calculated: {},
// };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({
//   value,
//   onSave,
//   mealType,
//   isEditing,
//   editValue,
//   setEditValue,
//   startEdit,
//   cancelEdit,
//   rowIdx,
// }) => {
//   return (
//     <td className="px-4 py-2 border-b">
//       {isEditing ? (
//         <input
//           className="w-full border px-2 py-1 rounded"
//           value={editValue}
//           onChange={(e) => setEditValue(e.target.value)}
//           autoFocus
//         />
//       ) : (
//         <div className="flex justify-between items-center">
//           <span>{value || "-"}</span>
//           <button
//             className="text-blue-500 hover:text-blue-700 px-1"
//             onClick={() => startEdit(rowIdx, mealType.toLowerCase(), value)}
//             title={`Edit ${mealType}`}
//           >
//             ✏️
//           </button>
//         </div>
//       )}
//       {isEditing && (
//         <div className="flex gap-1 mt-1">
//           <button
//             className="px-2 py-1 bg-green-600 text-white rounded text-xs"
//             onClick={() => onSave(editValue)}
//           >
//             Save
//           </button>
//           <button
//             className="px-2 py-1 bg-gray-300 rounded text-xs"
//             onClick={cancelEdit}
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </td>
//   );
// };

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;

//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;

//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized
//           .slice(0, idx)
//           .reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data[0].value + data[1].value + data[2].value || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const passedPatient = location.state?.patient;

//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState({ row: null, meal: null });
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals || rawMeals.length === 0) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || day.Day || i + 1,
//       breakfast:
//         day.breakfast ||
//         day.meals?.breakfast?.items?.map((it) => it.Dish_Name).join(", ") ||
//         "",
//       lunch:
//         day.lunch ||
//         day.meals?.lunch?.items?.map((it) => it.Dish_Name).join(", ") ||
//         "",
//       dinner:
//         day.dinner ||
//         day.meals?.dinner?.items?.map((it) => it.Dish_Name).join(", ") ||
//         "",
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals =
//         res.data?.recommendedMeals ||
//         res.data?.fullPlan?.weekly_plan ||
//         res.data?.fullPlan?.recommendations ||
//         [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals =
//         res.data?.recommendedMeals ||
//         res.data?.fullPlan?.weekly_plan ||
//         res.data?.fullPlan?.recommendations ||
//         [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (row, meal, value) => {
//     setEditingCell({ row, meal });
//     setEditValue(value);
//   };
//   const cancelEdit = () => setEditingCell({ row: null, meal: null });
//   const handleMealEdit = (row, meal, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       updated.recommendedMeals[row][meal] = newVal;
//       return updated;
//     });
//     cancelEdit();
//   };

//   /* ---------- PDF Generation ---------- */
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan to export.");
//     const doc = new jsPDF("p", "pt", "a4");
//     const pageWidth = doc.internal.pageSize.width;
//     const margin = 40;
//     let y = 80;

//     doc.setFontSize(18);
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, margin, 40);

//     plan.recommendedMeals.forEach((day) => {
//       if (y > 750) {
//         doc.addPage();
//         y = 80;
//       }
//       doc.setFontSize(12);
//       doc.text(`Day ${day.day}`, margin, y);
//       doc.text(`Breakfast: ${day.breakfast || "-"}`, margin, y + 16);
//       doc.text(`Lunch: ${day.lunch || "-"}`, margin, y + 32);
//       doc.text(`Dinner: ${day.dinner || "-"}`, margin, y + 48);
//       y += 70;
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
//   };

  
//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += (m.breakfast || "").length;
//       l += (m.lunch || "").length;
//       d += (m.dinner || "").length;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

  

//   /* ---------- Render ---------- */
//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">
//               Diet Plan for {formData.personalInfo.fullName}
//             </h1>
//             <div className="flex gap-2">
//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 onClick={generatePDF}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//               > 
//                 <DownloadIcon />
//                 Download PDF
//               </motion.button>
//             </div>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-2 border-b">Day</th>
//                     <th className="px-4 py-2 border-b">Breakfast</th>
//                     <th className="px-4 py-2 border-b">Lunch</th>
//                     <th className="px-4 py-2 border-b">Dinner</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {plan.recommendedMeals.map((day, i) => (
//                     <tr key={i} className="hover:bg-slate-50">
//                       <td className="px-4 py-2 border-b font-bold text-emerald-700">
//                         {day.day}
//                       </td>
//                       <EditableMealCell
//                         value={day.breakfast}
//                         onSave={(val) => handleMealEdit(i, "breakfast", val)}
//                         mealType="Breakfast"
//                         isEditing={editingCell.row === i && editingCell.meal === "breakfast"}
//                         editValue={editValue}
//                         setEditValue={setEditValue}
//                         startEdit={startEdit}
//                         cancelEdit={cancelEdit}
//                         rowIdx={i}
//                       />
//                       <EditableMealCell
//                         value={day.lunch}
//                         onSave={(val) => handleMealEdit(i, "lunch", val)}
//                         mealType="Lunch"
//                         isEditing={editingCell.row === i && editingCell.meal === "lunch"}
//                         editValue={editValue}
//                         setEditValue={setEditValue}
//                         startEdit={startEdit}
//                         cancelEdit={cancelEdit}
//                         rowIdx={i}
//                       />
//                       <EditableMealCell
//                         value={day.dinner}
//                         onSave={(val) => handleMealEdit(i, "dinner", val)}
//                         mealType="Dinner"
//                         isEditing={editingCell.row === i && editingCell.meal === "dinner"}
//                         editValue={editValue}
//                         setEditValue={setEditValue}
//                         startEdit={startEdit}
//                         cancelEdit={cancelEdit}
//                         rowIdx={i}
//                       />
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="mt-6">
//                 <SummaryCard patient={formData} mealDistribution={mealLengths} />
//               </div>
//             </div>
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
//         ]}
//       />
//     </div>
//   </motion.div>
// );









// // src/pages/DietPlanPage.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = { personalInfo: { fullName: "Patient" }, vitals: {}, calculated: {} };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({ value, onSave, isEditing, editValue, setEditValue, startEdit, cancelEdit, rowIdx, field }) => (
//   <td className="px-4 py-2 border-b">
//     {isEditing ? (
//       <input
//         className="w-full border px-2 py-1 rounded"
//         value={editValue}
//         onChange={(e) => setEditValue(e.target.value)}
//         autoFocus
//       />
//     ) : (
//       <div className="flex justify-between items-center">
//         <span>{value ?? "-"}</span>
//         <button
//           className="text-blue-500 hover:text-blue-700 px-1"
//           onClick={() => startEdit(rowIdx, field, value)}
//           title={`Edit ${field}`}
//         >
//           ✏️
//         </button>
//       </div>
//     )}
//     {isEditing && (
//       <div className="flex gap-1 mt-1">
//         <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
//           Save
//         </button>
//         <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
//           Cancel
//         </button>
//       </div>
//     )}
//   </td>
// );

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState({ row: null, field: null });
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || i + 1,
//       meals: day.meals,
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (row, field, value) => {
//     setEditingCell({ row, field });
//     setEditValue(value);
//   };
//   const cancelEdit = () => setEditingCell({ row: null, field: null });
//   const handleMealEdit = (row, field, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       const meals = updated.recommendedMeals[row].meals;
//       for (let mealType of ["breakfast", "lunch", "dinner"]) {
//         if (meals[mealType]?.items) {
//           meals[mealType].items = meals[mealType].items.map((it) =>
//             it.Dish_Name === field ? { ...it, Dish_Name: newVal } : it
//           );
//         }
//       }
//       return updated;
//     });
//     cancelEdit();
//   };

//   /* ---------- PDF Generation ---------- */
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan to export.");
//     const doc = new jsPDF("p", "pt", "a4");
//     const margin = 40;
//     let y = 80;
//     doc.setFontSize(18);
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, margin, 40);

//     plan.recommendedMeals.forEach((day) => {
//       if (y > 700) {
//         doc.addPage();
//         y = 80;
//       }
//       doc.setFontSize(12);
//       doc.text(`Day ${day.day}`, margin, y);
//       y += 20;
//       ["breakfast", "lunch", "dinner"].forEach((meal) => {
//         const items = day.meals[meal]?.items || [];
//         items.forEach((it) => {
//           doc.text(
//             `${meal.charAt(0).toUpperCase() + meal.slice(1)} - ${it.Dish_Name}: ${it.Adjusted_Serving_Size_g} g | ${it.Adjusted_Calories_kcal} kcal | P:${it.Protein_g} | C:${it.Carbohydrates_g} | F:${it.Fat_g} | Rasa:${it.Ayurvedic_Rasa} / Guna:${it.Ayurvedic_Guna} / Virya:${it.Ayurvedic_Virya} | Notes:${it.Notes}`,
//             margin,
//             y
//           );
//           y += 16;
//         });
//         y += 8;
//       });
//       y += 10;
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
//   };

//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += m.meals.breakfast?.items?.length || 0;
//       l += m.meals.lunch?.items?.length || 0;
//       d += m.meals.dinner?.items?.length || 0;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

//   /* ---------- Render ---------- */
//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">
//               Diet Plan for {formData.personalInfo.fullName}
//             </h1>
//             <motion.button
//               whileTap={{ scale: 0.97 }}
//               onClick={generatePDF}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//             >
//               <DownloadIcon />
//               Download PDF
//             </motion.button>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             plan.recommendedMeals.map((day, i) => (
//               <div key={i} className="mb-8">
//                 <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 border-b">Meal</th>
//                         <th className="px-4 py-2 border-b">Food Items & Portions</th>
//                         <th className="px-4 py-2 border-b">Calories</th>
//                         <th className="px-4 py-2 border-b">Protein</th>
//                         <th className="px-4 py-2 border-b">Carbs</th>
//                         <th className="px-4 py-2 border-b">Fat</th>
//                         <th className="px-4 py-2 border-b">Ayurvedic Properties (Rasa / Guna / Virya)</th>
//                         <th className="px-4 py-2 border-b">Notes / Purpose</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {["breakfast", "lunch", "dinner"].map((meal) =>
//                         day.meals[meal]?.items?.map((item, idx) => (
//                           <tr key={`${meal}-${idx}`} className="hover:bg-slate-50">
//                             <td className="px-4 py-2 border-b font-bold text-emerald-700">{meal.charAt(0).toUpperCase() + meal.slice(1)}</td>
//                             <EditableMealCell
//                               value={item.Dish_Name + " – " + item.Adjusted_Serving_Size_g + " g"}
//                               onSave={(val) => handleMealEdit(i, item.Dish_Name, val)}
//                               isEditing={editingCell.row === i && editingCell.field === item.Dish_Name}
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={startEdit}
//                               cancelEdit={cancelEdit}
//                               rowIdx={i}
//                               field={item.Dish_Name}
//                             />
//                             <td className="px-4 py-2 border-b">{item.Adjusted_Calories_kcal} kcal</td>
//                             <td className="px-4 py-2 border-b">{item.Protein_g} g</td>
//                             <td className="px-4 py-2 border-b">{item.Carbohydrates_g} g</td>
//                             <td className="px-4 py-2 border-b">{item.Fat_g} g</td>
//                             <td className="px-4 py-2 border-b">
//                               {item.Ayurvedic_Rasa} / {item.Ayurvedic_Guna} / {item.Ayurvedic_Virya}
//                             </td>
//                             <td className="px-4 py-2 border-b">{item.Notes}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}

//           <div className="mt-6">
//             <SummaryCard patient={formData} mealDistribution={mealLengths} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
//         ]}
//       />
//     </div>
//   </motion.div>
// );







// src/pages/DietPlanPage.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = { personalInfo: { fullName: "Patient" }, vitals: {}, calculated: {} };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({ value, onSave, isEditing, editValue, setEditValue, startEdit, cancelEdit, rowIdx, field }) => (
//   <td className="px-4 py-2 border-b">
//     {isEditing ? (
//       <input
//         className="w-full border px-2 py-1 rounded"
//         value={editValue}
//         onChange={(e) => setEditValue(e.target.value)}
//         autoFocus
//       />
//     ) : (
//       <div className="flex justify-between items-center">
//         <span>{value ?? "-"}</span>
//         <button
//           className="text-blue-500 hover:text-blue-700 px-1"
//           onClick={() => startEdit(rowIdx, field, value)}
//           title={`Edit ${field}`}
//         >
//           ✏️
//         </button>
//       </div>
//     )}
//     {isEditing && (
//       <div className="flex gap-1 mt-1">
//         <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
//           Save
//         </button>
//         <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
//           Cancel
//         </button>
//       </div>
//     )}
//   </td>
// );

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState({ row: null, field: null });
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || i + 1,
//       meals: day.meals,
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (row, field, value) => {
//     setEditingCell({ row, field });
//     setEditValue(value);
//   };
//   const cancelEdit = () => setEditingCell({ row: null, field: null });
//   const handleMealEdit = (row, field, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       const meals = updated.recommendedMeals[row].meals;
//       for (let mealType of ["breakfast", "lunch", "dinner"]) {
//         if (meals[mealType]?.items) {
//           meals[mealType].items = meals[mealType].items.map((it) =>
//             it.Dish_Name === field ? { ...it, Dish_Name: newVal } : it
//           );
//         }
//       }
//       return updated;
//     });
//     cancelEdit();
//   };

//   /* ---------- PDF Generation ---------- */

// const generatePDF = () => {
//   if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

//   const doc = new jsPDF("p", "pt", "a4");
//   const margin = 40;
//   const pageWidth = doc.internal.pageSize.width;
//   const usableWidth = pageWidth - margin * 2;

//   // Adjusted column widths to fit the page
//   const colWidths = [50, 120, 50, 45, 45, 45, 100, 100];
//   const lineHeight = 14; // smaller line height to fit more text

//   let y = 60;
//   doc.setFontSize(18);
//   doc.setTextColor("#1f7a4d");
//   doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, margin, y);
//   y += 30;

//   plan.recommendedMeals.forEach((day) => {
//     if (y > 700) {
//       doc.addPage();
//       y = 60;
//     }

//     // Day header
//     doc.setFontSize(14);
//     doc.setTextColor("#2c7a4b");
//     doc.setFillColor(220, 245, 235);
//     doc.rect(margin, y - 12, usableWidth, 20, "F");
//     doc.text(`Day ${day.day}`, margin + 5, y);
//     y += 25;

//     // Table header
//     doc.setFontSize(10);
//     doc.setTextColor("#000000");
//     doc.setDrawColor(200);
//     doc.setLineWidth(0.5);

//     const headers = ["Meal", "Food & Portion", "Calories", "Protein", "Carbs", "Fat", "Ayurvedic Properties", "Notes / Purpose"];
//     let x = margin;
//     headers.forEach((h, i) => {
//       doc.rect(x, y, colWidths[i], lineHeight + 2);
//       const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
//       doc.text(splitHeader, x + 2, y + 12);
//       x += colWidths[i];
//     });
//     y += lineHeight + 2;

//     // Table rows
//     ["breakfast", "lunch", "dinner"].forEach((meal) => {
//       const items = day.meals[meal]?.items || [];
//       items.forEach((it) => {
//         const row = [
//           meal.charAt(0).toUpperCase() + meal.slice(1),
//           `${it.Dish_Name} – ${it.Adjusted_Serving_Size_g} g`,
//           `${it.Adjusted_Calories_kcal} kcal`,
//           `${it.Protein_g} g`,
//           `${it.Carbohydrates_g} g`,
//           `${it.Fat_g} g`,
//           `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
//           `${it.Notes || ""}`,
//         ];

//         // Determine dynamic row height
//         const cellHeights = row.map((cell, i) => {
//           const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//           return splitText.length * lineHeight + 4;
//         });
//         const rowHeight = Math.max(...cellHeights);

//         if (y + rowHeight > 750) {
//           doc.addPage();
//           y = 60;
//         }

//         // Draw cells
//         x = margin;
//         row.forEach((cell, i) => {
//           doc.rect(x, y, colWidths[i], rowHeight);
//           const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//           doc.text(splitText, x + 2, y + 12);
//           x += colWidths[i];
//         });
//         y += rowHeight;
//       });
//     });

//     y += 10;
//   });

//   doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
// };

//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += m.meals.breakfast?.items?.length || 0;
//       l += m.meals.lunch?.items?.length || 0;
//       d += m.meals.dinner?.items?.length || 0;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

//   /* ---------- Render ---------- */
//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">
//               Diet Plan for {formData.personalInfo.fullName}
//             </h1>
//             <motion.button
//               whileTap={{ scale: 0.97 }}
//               onClick={generatePDF}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//             >
//               <DownloadIcon />
//               Download PDF
//             </motion.button>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             plan.recommendedMeals.map((day, i) => (
//               <div key={i} className="mb-8">
//                 <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 border-b">Meal</th>
//                         <th className="px-4 py-2 border-b">Food Items & Portions</th>
//                         <th className="px-4 py-2 border-b">Calories</th>
//                         <th className="px-4 py-2 border-b">Protein</th>
//                         <th className="px-4 py-2 border-b">Carbs</th>
//                         <th className="px-4 py-2 border-b">Fat</th>
//                         <th className="px-4 py-2 border-b">Ayurvedic Properties (Rasa / Guna / Virya)</th>
//                         <th className="px-4 py-2 border-b">Notes / Purpose</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {["breakfast", "lunch", "dinner"].map((meal) =>
//                         day.meals[meal]?.items?.map((item, idx) => (
//                           <tr key={`${meal}-${idx}`} className="hover:bg-slate-50">
//                             <td className="px-4 py-2 border-b font-bold text-emerald-700">{meal.charAt(0).toUpperCase() + meal.slice(1)}</td>
//                             <EditableMealCell
//                               value={item.Dish_Name + " – " + item.Adjusted_Serving_Size_g + " g"}
//                               onSave={(val) => handleMealEdit(i, item.Dish_Name, val)}
//                               isEditing={editingCell.row === i && editingCell.field === item.Dish_Name}
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={startEdit}
//                               cancelEdit={cancelEdit}
//                               rowIdx={i}
//                               field={item.Dish_Name}
//                             />
//                             <td className="px-4 py-2 border-b">{item.Adjusted_Calories_kcal} kcal</td>
//                             <td className="px-4 py-2 border-b">{item.Protein_g} g</td>
//                             <td className="px-4 py-2 border-b">{item.Carbohydrates_g} g</td>
//                             <td className="px-4 py-2 border-b">{item.Fat_g} g</td>
//                             <td className="px-4 py-2 border-b">
//                               {item.Ayurvedic_Rasa} / {item.Ayurvedic_Guna} / {item.Ayurvedic_Virya}
//                             </td>
//                             <td className="px-4 py-2 border-b">{item.Notes}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}

//           <div className="mt-6">
//             <SummaryCard patient={formData} mealDistribution={mealLengths} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
//         ]}
//       />
//     </div>
//   </motion.div>
// );










// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Utility Function ---------- */
// const formatValue = (val) => {
//   if (val == null) return "-";
//   const fixed = val.toFixed(1);
//   return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
// };

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = { personalInfo: { fullName: "Patient" }, vitals: {}, calculated: {} };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({ value, onSave, isEditing, editValue, setEditValue, startEdit, cancelEdit, rowIdx, field }) => (
//   <td className="px-4 py-2 border-b">
//     {isEditing ? (
//       <input
//         className="w-full border px-2 py-1 rounded"
//         value={editValue}
//         onChange={(e) => setEditValue(e.target.value)}
//         autoFocus
//       />
//     ) : (
//       <div className="flex justify-between items-center">
//         <span>{value ?? "-"}</span>
//         <button
//           className="text-blue-500 hover:text-blue-700 px-1"
//           onClick={() => startEdit(rowIdx, field, value)}
//           title={`Edit ${field}`}
//         >
//           ✏️
//         </button>
//       </div>
//     )}
//     {isEditing && (
//       <div className="flex gap-1 mt-1">
//         <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
//           Save
//         </button>
//         <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
//           Cancel
//         </button>
//       </div>
//     )}
//   </td>
// );

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState({ row: null, field: null });
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || i + 1,
//       meals: day.meals,
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (row, field, value) => {
//     setEditingCell({ row, field });
//     setEditValue(value);
//   };
//   const cancelEdit = () => setEditingCell({ row: null, field: null });
//   const handleMealEdit = (row, field, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       const meals = updated.recommendedMeals[row].meals;
//       for (let mealType of ["breakfast", "lunch", "dinner"]) {
//         if (meals[mealType]?.items) {
//           meals[mealType].items = meals[mealType].items.map((it) =>
//             it.Dish_Name === field ? { ...it, Dish_Name: newVal } : it
//           );
//         }
//       }
//       return updated;
//     });
//     cancelEdit();
//   };

//   /* ---------- PDF Generation ---------- */
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

//     const doc = new jsPDF("p", "pt", "a4");
//     const margin = 40;
//     const pageWidth = doc.internal.pageSize.width;
//     const usableWidth = pageWidth - margin * 2;

//     // Adjusted column widths to fit the page
//     const colWidths = [50, 120, 50, 45, 45, 45, 100, 100];
//     const lineHeight = 14; // smaller line height to fit more text

//     let y = 60;
//     doc.setFontSize(18);
//     doc.setTextColor("#1f7a4d");
//     doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, margin, y);
//     y += 30;

//     plan.recommendedMeals.forEach((day) => {
//       if (y > 700) {
//         doc.addPage();
//         y = 60;
//       }

//       // Day header
//       doc.setFontSize(14);
//       doc.setTextColor("#2c7a4b");
//       doc.setFillColor(220, 245, 235);
//       doc.rect(margin, y - 12, usableWidth, 20, "F");
//       doc.text(`Day ${day.day}`, margin + 5, y);
//       y += 25;

//       // Table header
//       doc.setFontSize(10);
//       doc.setTextColor("#000000");
//       doc.setDrawColor(200);
//       doc.setLineWidth(0.5);

//       const headers = [
//         "Meal",
//         "Food & Portion",
//         "Calories",
//         "Protein",
//         "Carbs",
//         "Fat",
//         "Ayurvedic Properties",
//         "Notes / Purpose",
//       ];
//       let x = margin;
//       headers.forEach((h, i) => {
//         doc.rect(x, y, colWidths[i], lineHeight + 2);
//         const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
//         doc.text(splitHeader, x + 2, y + 12);
//         x += colWidths[i];
//       });
//       y += lineHeight + 2;

//       // Table rows
//       ["breakfast", "lunch", "dinner"].forEach((meal) => {
//         const items = day.meals[meal]?.items || [];
//         items.forEach((it) => {
//           const row = [
//             meal.charAt(0).toUpperCase() + meal.slice(1),
//             `${it.Dish_Name} – ${formatValue(it.Adjusted_Serving_Size_g)} g`,
//             `${formatValue(it.Adjusted_Calories_kcal)} kcal`,
//             `${formatValue(it.Protein_g)} g`,
//             `${formatValue(it.Carbohydrates_g)} g`,
//             `${formatValue(it.Fat_g)} g`,
//             `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
//             `${it.Notes || ""}`,
//           ];

//           // Determine dynamic row height
//           const cellHeights = row.map((cell, i) => {
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             return splitText.length * lineHeight + 4;
//           });
//           const rowHeight = Math.max(...cellHeights);

//           if (y + rowHeight > 750) {
//             doc.addPage();
//             y = 60;
//           }

//           // Draw cells
//           x = margin;
//           row.forEach((cell, i) => {
//             doc.rect(x, y, colWidths[i], rowHeight);
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             doc.text(splitText, x + 2, y + 12);
//             x += colWidths[i];
//           });
//           y += rowHeight;
//         });
//       });

//       y += 10;
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
//   };
 
 



//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += m.meals.breakfast?.items?.length || 0;
//       l += m.meals.lunch?.items?.length || 0;
//       d += m.meals.dinner?.items?.length || 0;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

//   /* ---------- Render ---------- */
//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">
//               Diet Plan for {formData.personalInfo.fullName}
//             </h1>
//             <motion.button
//               whileTap={{ scale: 0.97 }}
//               onClick={generatePDF}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//             >
//               <DownloadIcon />
//               Download PDF
//             </motion.button>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             plan.recommendedMeals.map((day, i) => (
//               <div key={i} className="mb-8">
//                 <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 border-b">Meal</th>
//                         <th className="px-4 py-2 border-b">Food Items & Portions</th>
//                         <th className="px-4 py-2 border-b">Calories</th>
//                         <th className="px-4 py-2 border-b">Protein</th>
//                         <th className="px-4 py-2 border-b">Carbs</th>
//                         <th className="px-4 py-2 border-b">Fat</th>
//                         <th className="px-4 py-2 border-b">Ayurvedic Properties (Rasa / Guna / Virya)</th>
//                         <th className="px-4 py-2 border-b">Notes / Purpose</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {["breakfast", "lunch", "dinner"].map((meal) =>
//                         day.meals[meal]?.items?.map((item, idx) => (
//                           <tr key={`${meal}-${idx}`} className="hover:bg-slate-50">
//                             <td className="px-4 py-2 border-b font-bold text-emerald-700">
//                               {meal.charAt(0).toUpperCase() + meal.slice(1)}
//                             </td>
//                             <EditableMealCell
//                               value={`${item.Dish_Name} – ${formatValue(item.Adjusted_Serving_Size_g)} g`}
//                               onSave={(val) => handleMealEdit(i, item.Dish_Name, val)}
//                               isEditing={editingCell.row === i && editingCell.field === item.Dish_Name}
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={startEdit}
//                               cancelEdit={cancelEdit}
//                               rowIdx={i}
//                               field={item.Dish_Name}
//                             />
//                             <td className="px-4 py-2 border-b">{formatValue(item.Adjusted_Calories_kcal)} kcal</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Protein_g)} g</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Carbohydrates_g)} g</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Fat_g)} g</td>
//                             <td className="px-4 py-2 border-b">
//                               {item.Ayurvedic_Rasa} / {item.Ayurvedic_Guna} / {item.Ayurvedic_Virya}
//                             </td>
//                             <td className="px-4 py-2 border-b">{item.Notes}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}

//           <div className="mt-6">
//             <SummaryCard patient={formData} mealDistribution={mealLengths} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
//         ]}
//       />
//     </div>
//   </motion.div>
// );






// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Utility Function ---------- */
// const formatValue = (val) => {
//   if (val == null) return "-";
//   const fixed = val.toFixed(1);
//   return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
// };

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = { personalInfo: { fullName: "Patient" }, vitals: {}, calculated: {} };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({ value, onSave, isEditing, editValue, setEditValue, startEdit, cancelEdit, rowIdx, field }) => (
//   <td className="px-4 py-2 border-b">
//     {isEditing ? (
//       <input
//         className="w-full border px-2 py-1 rounded"
//         value={editValue}
//         onChange={(e) => setEditValue(e.target.value)}
//         autoFocus
//       />
//     ) : (
//       <div className="flex justify-between items-center">
//         <span>{value ?? "-"}</span>
//         <button
//           className="text-blue-500 hover:text-blue-700 px-1"
//           onClick={() => startEdit(rowIdx, field, value)}
//           title={`Edit ${field}`}
//         >
//           ✏️
//         </button>
//       </div>
//     )}
//     {isEditing && (
//       <div className="flex gap-1 mt-1">
//         <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
//           Save
//         </button>
//         <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
//           Cancel
//         </button>
//       </div>
//     )}
//   </td>
// );

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState({ row: null, field: null });
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || i + 1,
//       meals: day.meals,
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (row, field, value) => {
//     setEditingCell({ row, field });
//     setEditValue(value);
//   };
//   const cancelEdit = () => setEditingCell({ row: null, field: null });
//   const handleMealEdit = (row, field, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       const meals = updated.recommendedMeals[row].meals;
//       for (let mealType of ["breakfast", "lunch", "dinner"]) {
//         if (meals[mealType]?.items) {
//           meals[mealType].items = meals[mealType].items.map((it) =>
//             it.Dish_Name === field ? { ...it, Dish_Name: newVal } : it
//           );
//         }
//       }
//       return updated;
//     });
//     cancelEdit();
//   };


//   /* ---------- PDF Generation ---------- */
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

//     const doc = new jsPDF("p", "pt", "a4");
//     const margin = 40;
//     const pageWidth = doc.internal.pageSize.width;
//     const usableWidth = pageWidth - margin * 2;

//     const colWidths = [50, 120, 50, 45, 45, 45, 100, 100];
//     const lineHeight = 14;

//     let y = 60;
//     doc.setFontSize(18);
//     doc.setTextColor("#1f7a4d");
//     doc.text(`${formData.personalInfo.fullName}`, margin, y); // Updated to show patient full name
//     y += 30;

//     plan.recommendedMeals.forEach((day) => {
//       if (y > 700) {
//         doc.addPage();
//         y = 60;
//       }

//       doc.setFontSize(14);
//       doc.setTextColor("#2c7a4b");
//       doc.setFillColor(220, 245, 235);
//       doc.rect(margin, y - 12, usableWidth, 20, "F");
//       doc.text(`Day ${day.day}`, margin + 5, y);
//       y += 25;

//       doc.setFontSize(10);
//       doc.setTextColor("#000000");
//       doc.setDrawColor(200);
//       doc.setLineWidth(0.5);

//       const headers = [
//         "Meal",
//         "Food & Portion",
//         "Calories",
//         "Protein",
//         "Carbs",
//         "Fat",
//         "Ayurvedic Properties",
//         "Notes / Purpose",
//       ];
//       let x = margin;
//       headers.forEach((h, i) => {
//         doc.rect(x, y, colWidths[i], lineHeight + 2);
//         const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
//         doc.text(splitHeader, x + 2, y + 12);
//         x += colWidths[i];
//       });
//       y += lineHeight + 2;

//       ["breakfast", "lunch", "dinner"].forEach((meal) => {
//         const items = day.meals[meal]?.items || [];
//         items.forEach((it) => {
//           const row = [
//             meal.charAt(0).toUpperCase() + meal.slice(1),
//             `${it.Dish_Name} – ${formatValue(it.Adjusted_Serving_Size_g)} g`,
//             `${formatValue(it.Adjusted_Calories_kcal)} kcal`,
//             `${formatValue(it.Protein_g)} g`,
//             `${formatValue(it.Carbohydrates_g)} g`,
//             `${formatValue(it.Fat_g)} g`,
//             `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
//             `${it.Notes || ""}`,
//           ];

//           const cellHeights = row.map((cell, i) => {
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             return splitText.length * lineHeight + 4;
//           });
//           const rowHeight = Math.max(...cellHeights);

//           if (y + rowHeight > 750) {
//             doc.addPage();
//             y = 60;
//           }

//           x = margin;
//           row.forEach((cell, i) => {
//             doc.rect(x, y, colWidths[i], rowHeight);
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             doc.text(splitText, x + 2, y + 12);
//             x += colWidths[i];
//           });
//           y += rowHeight;
//         });
//       });

//       y += 10;
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
//   };

//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += m.meals.breakfast?.items?.length || 0;
//       l += m.meals.lunch?.items?.length || 0;
//       d += m.meals.dinner?.items?.length || 0;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">
//               {formData.personalInfo.fullName}
//             </h1>
//             <motion.button
//               whileTap={{ scale: 0.97 }}
//               onClick={generatePDF}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//             >
//               <DownloadIcon />
//               Download PDF
//             </motion.button>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             plan.recommendedMeals.map((day, i) => (
//               <div key={i} className="mb-8">
//                 <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 border-b">Meal</th>
//                         <th className="px-4 py-2 border-b">Food Items & Portions</th>
//                         <th className="px-4 py-2 border-b">Calories</th>
//                         <th className="px-4 py-2 border-b">Protein</th>
//                         <th className="px-4 py-2 border-b">Carbs</th>
//                         <th className="px-4 py-2 border-b">Fat</th>
//                         <th className="px-4 py-2 border-b">Ayurvedic Properties (Rasa / Guna / Virya)</th>
//                         <th className="px-4 py-2 border-b">Notes / Purpose</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {["breakfast", "lunch", "dinner"].map((meal) =>
//                         day.meals[meal]?.items?.map((item, idx) => (
//                           <tr key={`${meal}-${idx}`} className="hover:bg-slate-50">
//                             <td className="px-4 py-2 border-b font-bold text-emerald-700">
//                               {meal.charAt(0).toUpperCase() + meal.slice(1)}
//                             </td>
//                             <EditableMealCell
//                               value={`${item.Dish_Name} – ${formatValue(item.Adjusted_Serving_Size_g)} g`}
//                               onSave={(val) => handleMealEdit(i, item.Dish_Name, val)}
//                               isEditing={editingCell.row === i && editingCell.field === item.Dish_Name}
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={startEdit}
//                               cancelEdit={cancelEdit}
//                               rowIdx={i}
//                               field={item.Dish_Name}
//                             />
//                             <td className="px-4 py-2 border-b">{formatValue(item.Adjusted_Calories_kcal)} kcal</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Protein_g)} g</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Carbohydrates_g)} g</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Fat_g)} g</td>
//                             <td className="px-4 py-2 border-b">
//                               {item.Ayurvedic_Rasa} / {item.Ayurvedic_Guna} / {item.Ayurvedic_Virya}
//                             </td>
//                             <td className="px-4 py-2 border-b">{item.Notes}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}

//           <div className="mt-6">
//             <SummaryCard patient={formData} mealDistribution={mealLengths} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
//         ]}
//       />
//     </div>
//   </motion.div>
// );



// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Utility Function ---------- */
// const formatValue = (val) => {
//   if (val == null) return "-";
//   const fixed = val.toFixed(1);
//   return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
// };

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = { personalInfo: { fullName: "Patient" }, vitals: {}, calculated: {} };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({
//   value,
//   onSave,
//   isEditing,
//   editValue,
//   setEditValue,
//   startEdit,
//   cancelEdit,
// }) => (
//   <td className="px-4 py-2 border-b">
//     {isEditing ? (
//       <input
//         className="w-full border px-2 py-1 rounded"
//         value={editValue}
//         onChange={(e) => setEditValue(e.target.value)}
//         autoFocus
//       />
//     ) : (
//       <div className="flex justify-between items-center">
//         <span>{value ?? "-"}</span>
//         <button
//           className="text-blue-500 hover:text-blue-700 px-1"
//           onClick={startEdit}
//         >
//           ✏️
//         </button>
//       </div>
//     )}
//     {isEditing && (
//       <div className="flex gap-1 mt-1">
//         <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
//           Save
//         </button>
//         <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
//           Cancel
//         </button>
//       </div>
//     )}
//   </td>
// );

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);
//   const [editingCell, setEditingCell] = useState({}); // {dayIdx, mealType, itemIdx, field}
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || i + 1,
//       meals: day.meals,
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (dayIdx, mealType, itemIdx, field, value) => {
//     setEditingCell({ dayIdx, mealType, itemIdx, field });
//     setEditValue(value);
//   };

//   const cancelEdit = () => setEditingCell({});

//   const handleMealEdit = (dayIdx, mealType, itemIdx, field, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       const item = updated.recommendedMeals[dayIdx].meals[mealType].items[itemIdx];
//       // Handle numeric fields properly
//       if (["Adjusted_Serving_Size_g", "Adjusted_Calories_kcal", "Protein_g", "Carbohydrates_g", "Fat_g"].includes(field)) {
//         item[field] = parseFloat(newVal) || 0;
//       } else {
//         item[field] = newVal;
//       }
//       return updated;
//     });
//     cancelEdit();
//   };

//   /* ---------- PDF Generation ---------- */
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

//     const doc = new jsPDF("p", "pt", "a4");
//     const margin = 40;
//     const pageWidth = doc.internal.pageSize.width;
//     const usableWidth = pageWidth - margin * 2;

//     const colWidths = [50, 120, 50, 45, 45, 45, 100, 100];
//     const lineHeight = 14;

//     let y = 60;
//     doc.setFontSize(18);
//     doc.setTextColor("#1f7a4d");
//     doc.text(`${formData.personalInfo.fullName}`, margin, y);
//     y += 30;

//     plan.recommendedMeals.forEach((day) => {
//       if (y > 700) {
//         doc.addPage();
//         y = 60;
//       }

//       doc.setFontSize(14);
//       doc.setTextColor("#2c7a4b");
//       doc.setFillColor(220, 245, 235);
//       doc.rect(margin, y - 12, usableWidth, 20, "F");
//       doc.text(`Day ${day.day}`, margin + 5, y);
//       y += 25;

//       doc.setFontSize(10);
//       doc.setTextColor("#000000");
//       doc.setDrawColor(200);
//       doc.setLineWidth(0.5);

//       const headers = [
//         "Meal",
//         "Food & Portion",
//         "Calories",
//         "Protein",
//         "Carbs",
//         "Fat",
//         "Ayurvedic Properties",
//         "Notes / Purpose",
//       ];
//       let x = margin;
//       headers.forEach((h, i) => {
//         doc.rect(x, y, colWidths[i], lineHeight + 2);
//         const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
//         doc.text(splitHeader, x + 2, y + 12);
//         x += colWidths[i];
//       });
//       y += lineHeight + 2;

//       ["breakfast", "lunch", "dinner"].forEach((meal) => {
//         const items = day.meals[meal]?.items || [];
//         items.forEach((it) => {
//           const row = [
//             meal.charAt(0).toUpperCase() + meal.slice(1),
//             `${it.Dish_Name} – ${formatValue(it.Adjusted_Serving_Size_g)} g`,
//             `${formatValue(it.Adjusted_Calories_kcal)} kcal`,
//             `${formatValue(it.Protein_g)} g`,
//             `${formatValue(it.Carbohydrates_g)} g`,
//             `${formatValue(it.Fat_g)} g`,
//             `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
//             `${it.Notes || ""}`,
//           ];

//           const cellHeights = row.map((cell, i) => {
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             return splitText.length * lineHeight + 4;
//           });
//           const rowHeight = Math.max(...cellHeights);

//           if (y + rowHeight > 750) {
//             doc.addPage();
//             y = 60;
//           }

//           x = margin;
//           row.forEach((cell, i) => {
//             doc.rect(x, y, colWidths[i], rowHeight);
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             doc.text(splitText, x + 2, y + 12);
//             x += colWidths[i];
//           });
//           y += rowHeight;
//         });
//       });

//       y += 10;
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
//   };

//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += m.meals.breakfast?.items?.length || 0;
//       l += m.meals.lunch?.items?.length || 0;
//       d += m.meals.dinner?.items?.length || 0;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">
//               {formData.personalInfo.fullName}
//             </h1>
//             <motion.button
//               whileTap={{ scale: 0.97 }}
//               onClick={generatePDF}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//             >
//               <DownloadIcon />
//               Download PDF
//             </motion.button>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             plan.recommendedMeals.map((day, dayIdx) => (
//               <div key={dayIdx} className="mb-8">
//                 <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 border-b">Meal</th>
//                         <th className="px-4 py-2 border-b">Food Items & Portions</th>
//                         <th className="px-4 py-2 border-b">Calories</th>
//                         <th className="px-4 py-2 border-b">Protein</th>
//                         <th className="px-4 py-2 border-b">Carbs</th>
//                         <th className="px-4 py-2 border-b">Fat</th>
//                         <th className="px-4 py-2 border-b">Ayurvedic Properties (Rasa / Guna / Virya)</th>
//                         <th className="px-4 py-2 border-b">Notes / Purpose</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {["breakfast", "lunch", "dinner"].map((mealType) =>
//                         day.meals[mealType]?.items?.map((item, itemIdx) => (
//                           <tr key={`${mealType}-${itemIdx}`} className="hover:bg-slate-50">
//                             <td className="px-4 py-2 border-b font-bold text-emerald-700">
//                               {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
//                             </td>

//                             {/* Dish Name */}
//                             <EditableMealCell
//                               value={item.Dish_Name}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Dish_Name"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Dish_Name", item.Dish_Name)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Dish_Name", val)}
//                             />

//                             {/* Serving Size */}
//                             <EditableMealCell
//                               value={formatValue(item.Adjusted_Serving_Size_g) + " g"}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Adjusted_Serving_Size_g"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Adjusted_Serving_Size_g", item.Adjusted_Serving_Size_g)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Adjusted_Serving_Size_g", val)}
//                             />

//                             {/* Calories */}
//                             <EditableMealCell
//                               value={formatValue(item.Adjusted_Calories_kcal) + " kcal"}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Adjusted_Calories_kcal"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Adjusted_Calories_kcal", item.Adjusted_Calories_kcal)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Adjusted_Calories_kcal", val)}
//                             />

//                             {/* Protein */}
//                             <EditableMealCell
//                               value={formatValue(item.Protein_g) + " g"}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Protein_g"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Protein_g", item.Protein_g)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Protein_g", val)}
//                             />

//                             {/* Carbs */}
//                             <EditableMealCell
//                               value={formatValue(item.Carbohydrates_g) + " g"}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Carbohydrates_g"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Carbohydrates_g", item.Carbohydrates_g)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Carbohydrates_g", val)}
//                             />

//                             {/* Fat */}
//                             <EditableMealCell
//                               value={formatValue(item.Fat_g) + " g"}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Fat_g"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Fat_g", item.Fat_g)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Fat_g", val)}
//                             />

//                             {/* Ayurvedic */}
//                             <EditableMealCell
//                               value={`${item.Ayurvedic_Rasa} / ${item.Ayurvedic_Guna} / ${item.Ayurvedic_Virya}`}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Ayurvedic"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Ayurvedic", `${item.Ayurvedic_Rasa} / ${item.Ayurvedic_Guna} / ${item.Ayurvedic_Virya}`)}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => {
//                                 const parts = val.split("/").map(p => p.trim());
//                                 handleMealEdit(dayIdx, mealType, itemIdx, "Ayurvedic_Rasa", parts[0] || "");
//                                 handleMealEdit(dayIdx, mealType, itemIdx, "Ayurvedic_Guna", parts[1] || "");
//                                 handleMealEdit(dayIdx, mealType, itemIdx, "Ayurvedic_Virya", parts[2] || "");
//                               }}
//                             />

//                             {/* Notes */}
//                             <EditableMealCell
//                               value={item.Notes || ""}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "Notes"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Notes", item.Notes || "")}
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Notes", val)}
//                             />
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}

//           <div className="mt-6">
//             <SummaryCard patient={formData} mealDistribution={mealLengths} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
//         ]}
//       />
//     </div>
//   </motion.div>
// );





// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { motion, AnimatePresence } from "framer-motion";

// /* ---------- Utility Function ---------- */
// const formatValue = (val) => {
//   if (val == null) return "-";
//   const fixed = val.toFixed(1);
//   return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
// };

// /* ---------- Icons ---------- */
// const Icon = ({ children, className = "h-5 w-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     {children}
//   </svg>
// );
// const DownloadIcon = () => (
//   <Icon className="h-5 w-5">
//     <path
//       d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
//       strokeWidth="1.5"
//       stroke="#ffffff"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </Icon>
// );

// /* ---------- Default Form Data ---------- */
// const defaultFormData = { personalInfo: { fullName: "Patient" }, vitals: {}, calculated: {} };

// /* ---------- EditableMealCell ---------- */
// const EditableMealCell = ({
//   value,
//   onSave,
//   isEditing,
//   editValue,
//   setEditValue,
//   startEdit,
//   cancelEdit
// }) => (
//   <td className="px-4 py-2 border-b">
//     {isEditing ? (
//       <input
//         className="w-full border px-2 py-1 rounded"
//         value={editValue}
//         onChange={(e) => setEditValue(e.target.value)}
//         autoFocus
//       />
//     ) : (
//       <div className="flex justify-between items-center">
//         <span>{value ?? "-"}</span>
//         <button className="text-blue-500 hover:text-blue-700 px-1" onClick={startEdit} title={`Edit`}>
//           ✏️
//         </button>
//       </div>
//     )}
//     {isEditing && (
//       <div className="flex gap-1 mt-1">
//         <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
//           Save
//         </button>
//         <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
//           Cancel
//         </button>
//       </div>
//     )}
//   </td>
// );

// /* ---------- DonutChart ---------- */
// const DonutChart = ({ data }) => {
//   const size = 140;
//   const strokeWidth = 14;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
//   const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
//   const paths = normalized
//     .map((item, idx) => {
//       const valuePct = (item.value / sum) * 100;
//       const dash = (valuePct / 100) * circumference;
//       const offset =
//         circumference -
//         dash -
//         normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
//       return { ...item, dash, offset };
//     })
//     .reverse();

//   return (
//     <div className="relative w-36 h-36 mx-auto">
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
//         <AnimatePresence>
//           {paths.map((p) => (
//             <motion.circle
//               key={p.name}
//               cx={size / 2}
//               cy={size / 2}
//               r={radius}
//               fill="none"
//               stroke={p.color}
//               strokeWidth={strokeWidth}
//               strokeDasharray={`${p.dash} ${circumference - p.dash}`}
//               initial={{ strokeDashoffset: circumference }}
//               animate={{ strokeDashoffset: p.offset }}
//               transition={{ duration: 0.9, ease: "easeInOut" }}
//               strokeLinecap="round"
//             />
//           ))}
//         </AnimatePresence>
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-2xl font-extrabold text-slate-800">
//           {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
//         </span>
//         <span className="text-xs text-slate-400">Distribution</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- DietPlanPage Component ---------- */
// export default function DietPlanPage() {
//   const location = useLocation();
//   const { id: patientId } = useParams();
//   const passedFormData = location.state?.formData;
//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState(passedFormData || defaultFormData);
//   const [loading, setLoading] = useState(true);

//   const [editingCell, setEditingCell] = useState({
//     dayIdx: null,
//     mealType: null,
//     itemIdx: null,
//     field: null
//   });
//   const [editValue, setEditValue] = useState("");

//   useEffect(() => {
//     if (patientId) fetchPatientPlan(patientId);
//     else fetchLatestPlan();
//   }, [patientId]);

//   const normalizeMeals = (rawMeals) => {
//     if (!rawMeals) return [];
//     return rawMeals.map((day, i) => ({
//       day: day.day || i + 1,
//       meals: day.meals
//     }));
//   };

//   const fetchPatientPlan = async (id) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       fetchLatestPlan();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/fetch-latest-plan");
//       const rawMeals = res.data?.fullPlan?.weekly_plan || [];
//       setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
//     } catch (err) {
//       console.error(err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- Meal Editing ---------- */
//   const startEdit = (dayIdx, mealType, itemIdx, field, value) => {
//     setEditingCell({ dayIdx, mealType, itemIdx, field });
//     setEditValue(value);
//   };
//   const cancelEdit = () => setEditingCell({ dayIdx: null, mealType: null, itemIdx: null, field: null });

//   const handleMealEdit = (dayIdx, mealType, itemIdx, field, newVal) => {
//     setPlan((prev) => {
//       const updated = { ...prev };
//       if (updated.recommendedMeals[dayIdx]?.meals[mealType]?.items[itemIdx]) {
//         updated.recommendedMeals[dayIdx].meals[mealType].items[itemIdx][field] = newVal;
//       }
//       return updated;
//     });
//     cancelEdit();
//   };

//   /* ---------- PDF Generation ---------- */
//   const generatePDF = () => {
//     if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

//     const doc = new jsPDF("p", "pt", "a4");
//     const margin = 40;
//     const pageWidth = doc.internal.pageSize.width;
//     const usableWidth = pageWidth - margin * 2;

//     const colWidths = [50, 140, 50, 45, 45, 45, 120, 100];
//     const lineHeight = 14;
//     let y = 60;

//     doc.setFontSize(18);
//     doc.setTextColor("#1f7a4d");
//     doc.text(`${formData.personalInfo.fullName}`, margin, y);
//     y += 30;

//     plan.recommendedMeals.forEach((day) => {
//       if (y > 700) {
//         doc.addPage();
//         y = 60;
//       }
//       doc.setFontSize(14);
//       doc.setTextColor("#2c7a4b");
//       doc.setFillColor(220, 245, 235);
//       doc.rect(margin, y - 12, usableWidth, 20, "F");
//       doc.text(`Day ${day.day}`, margin + 5, y);
//       y += 25;

//       doc.setFontSize(10);
//       doc.setTextColor("#000000");
//       doc.setDrawColor(200);
//       doc.setLineWidth(0.5);

//       const headers = [
//         "Meal",
//         "Food & Portion",
//         "Calories",
//         "Protein",
//         "Carbs",
//         "Fat",
//         "Ayurvedic Properties",
//         "Notes / Purpose"
//       ];
//       let x = margin;
//       headers.forEach((h, i) => {
//         doc.rect(x, y, colWidths[i], lineHeight + 2);
//         const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
//         doc.text(splitHeader, x + 2, y + 12);
//         x += colWidths[i];
//       });
//       y += lineHeight + 2;

//       ["breakfast", "lunch", "dinner"].forEach((meal) => {
//         const items = day.meals[meal]?.items || [];
//         items.forEach((it) => {
//           const row = [
//             meal.charAt(0).toUpperCase() + meal.slice(1),
//             `${it.Dish_Name} – ${formatValue(it.Adjusted_Serving_Size_g)} g`,
//             `${formatValue(it.Adjusted_Calories_kcal)} kcal`,
//             `${formatValue(it.Protein_g)} g`,
//             `${formatValue(it.Carbohydrates_g)} g`,
//             `${formatValue(it.Fat_g)} g`,
//             `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
//             `${it.Notes || ""}`
//           ];

//           const cellHeights = row.map((cell, i) => {
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             return splitText.length * lineHeight + 4;
//           });
//           const rowHeight = Math.max(...cellHeights);

//           if (y + rowHeight > 750) {
//             doc.addPage();
//             y = 60;
//           }

//           x = margin;
//           row.forEach((cell, i) => {
//             doc.rect(x, y, colWidths[i], rowHeight);
//             const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
//             doc.text(splitText, x + 2, y + 12);
//             x += colWidths[i];
//           });
//           y += rowHeight;
//         });
//       });

//       y += 10;
//     });

//     doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
//   };

//   const mealLengths = useMemo(() => {
//     if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
//     let b = 0,
//       l = 0,
//       d = 0;
//     plan.recommendedMeals.forEach((m) => {
//       b += m.meals.breakfast?.items?.length || 0;
//       l += m.meals.lunch?.items?.length || 0;
//       d += m.meals.dinner?.items?.length || 0;
//     });
//     const total = Math.max(1, b + l + d);
//     return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
//   }, [plan]);

//   return (
//     <div className="min-h-screen bg-[#f7fdf9] p-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
//         <main className="col-span-12 lg:col-span-12">
//           <header className="flex justify-between mb-6">
//             <h1 className="text-3xl font-extrabold text-emerald-900">{formData.personalInfo.fullName}</h1>
//             <motion.button
//               whileTap={{ scale: 0.97 }}
//               onClick={generatePDF}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
//             >
//               <DownloadIcon />
//               Download PDF
//             </motion.button>
//           </header>

//           {loading ? (
//             <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
//               Loading your plan...
//             </div>
//           ) : plan?.recommendedMeals?.length > 0 ? (
//             plan.recommendedMeals.map((day, dayIdx) => (
//               <div key={dayIdx} className="mb-8">
//                 <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100 table-fixed">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 border-b text-left w-1/12">Meal</th>
//                         <th className="px-4 py-2 border-b text-left w-3/12">Food & Portion</th>
//                         <th className="px-4 py-2 border-b text-left w-1/12">Calories</th>
//                         <th className="px-4 py-2 border-b text-left w-1/12">Protein</th>
//                         <th className="px-4 py-2 border-b text-left w-1/12">Carbs</th>
//                         <th className="px-4 py-2 border-b text-left w-1/12">Fat</th>
//                         <th className="px-4 py-2 border-b text-left w-2/12">Ayurvedic (Rasa / Guna / Virya)</th>
//                         <th className="px-4 py-2 border-b text-left w-2/12">Notes / Purpose</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {["breakfast", "lunch", "dinner"].map((mealType) =>
//                         day.meals[mealType]?.items?.map((item, itemIdx) => (
//                           <tr key={`${mealType}-${itemIdx}`} className="hover:bg-slate-50">
//                             <td className="px-4 py-2 border-b font-bold text-emerald-700">
//                               {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
//                             </td>
//                             <EditableMealCell
//                               value={`${item.Dish_Name} – ${formatValue(item.Adjusted_Serving_Size_g)} g`}
//                               isEditing={
//                                 editingCell.dayIdx === dayIdx &&
//                                 editingCell.mealType === mealType &&
//                                 editingCell.itemIdx === itemIdx &&
//                                 editingCell.field === "DishAndServing"
//                               }
//                               editValue={editValue}
//                               setEditValue={setEditValue}
//                               startEdit={() =>
//                                 startEdit(
//                                   dayIdx,
//                                   mealType,
//                                   itemIdx,
//                                   "DishAndServing",
//                                   `${item.Dish_Name} – ${item.Adjusted_Serving_Size_g}`
//                                 )
//                               }
//                               cancelEdit={cancelEdit}
//                               onSave={(val) => {
//                                 const parts = val.split("–").map((p) => p.trim());
//                                 handleMealEdit(dayIdx, mealType, itemIdx, "Dish_Name", parts[0] || "");
//                                 handleMealEdit(
//                                   dayIdx,
//                                   mealType,
//                                   itemIdx,
//                                   "Adjusted_Serving_Size_g",
//                                   parseFloat(parts[1]) || 0
//                                 );
//                               }}
//                             />
//                             <td className="px-4 py-2 border-b">{formatValue(item.Adjusted_Calories_kcal)} kcal</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Protein_g)} g</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Carbohydrates_g)} g</td>
//                             <td className="px-4 py-2 border-b">{formatValue(item.Fat_g)} g</td>
//                             <td className="px-4 py-2 border-b">
//                               {item.Ayurvedic_Rasa} / {item.Ayurvedic_Guna} / {item.Ayurvedic_Virya}
//                             </td>
//                             <td className="px-4 py-2 border-b">{item.Notes}</td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center bg-white rounded-2xl shadow">
//               No diet plan found.{" "}
//               <Link to="/" className="text-emerald-600 font-semibold">
//                 Create a new one.
//               </Link>
//             </div>
//           )}

//           <div className="mt-6">
//             <SummaryCard patient={formData} mealDistribution={mealLengths} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// /* ---------- SummaryCard ---------- */
// const SummaryCard = ({ patient, mealDistribution }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 6 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.12 }}
//     className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
//   >
//     <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
//       <h3 className="text-lg font-bold">Plan Summary</h3>
//       <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
//     </div>
//     <div className="p-6 space-y-4">
//       <DonutChart
//         data={[
//           { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
//           { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
//           { name: "Dinner", value: mealDistribution.d, color: "#10b981" }
//         ]}
//       />
//     </div>
//   </motion.div>
// );





import React, { useEffect, useState, useMemo } from "react"; 
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Utility Function ---------- */
const formatValue = (val) => {
  if (val == null) return "-";
  const fixed = val.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
};

/* ---------- Icons ---------- */
const Icon = ({ children, className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    {children}
  </svg>
);
const DownloadIcon = () => (
  <Icon className="h-5 w-5">
    <path
      d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16"
      strokeWidth="1.5"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

/* ---------- Default Form Data ---------- */
const defaultFormData = { personalInfo: { fullName: "Diet Plan For Patient" }, vitals: {}, calculated: {} };

/* ---------- EditableMealCell ---------- */
const EditableMealCell = ({
  value,
  onSave,
  isEditing,
  editValue,
  setEditValue,
  startEdit,
  cancelEdit
}) => (
  <td className="px-4 py-2 border-b">
    {isEditing ? (
      <input
        className="w-full border px-2 py-1 rounded"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        autoFocus
      />
    ) : (
      <div className="flex justify-between items-center">
        <span>{value ?? "-"}</span>
        <button className="text-blue-500 hover:text-blue-700 px-1" onClick={startEdit} title={`Edit`}>
          ✏️
        </button>
      </div>
    )}
    {isEditing && (
      <div className="flex gap-1 mt-1">
        <button className="px-2 py-1 bg-green-600 text-white rounded text-xs" onClick={() => onSave(editValue)}>
          Save
        </button>
        <button className="px-2 py-1 bg-gray-300 rounded text-xs" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    )}
  </td>
);

/* ---------- DonutChart ---------- */
const DonutChart = ({ data }) => {
  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = data.map((item) => ({ ...item, value: Math.max(0, item.value || 0) }));
  const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;
  const paths = normalized
    .map((item, idx) => {
      const valuePct = (item.value / sum) * 100;
      const dash = (valuePct / 100) * circumference;
      const offset =
        circumference -
        dash -
        normalized.slice(0, idx).reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
      return { ...item, dash, offset };
    })
    .reverse();

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
        <AnimatePresence>
          {paths.map((p) => (
            <motion.circle
              key={p.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={p.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${p.dash} ${circumference - p.dash}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: p.offset }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              strokeLinecap="round"
            />
          ))}
        </AnimatePresence>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-800">
          {Math.round(data.reduce((acc, item) => acc + item.value, 0) || 100)}%
        </span>
        <span className="text-xs text-slate-400">Distribution</span>
      </div>
    </div>
  );
};

/* ---------- DietPlanPage Component ---------- */
export default function DietPlanPage() {
  const location = useLocation();
  const { id: patientId } = useParams();
  const passedFormData = location.state?.formData;
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState(passedFormData || defaultFormData);
  const [loading, setLoading] = useState(true);

  const [editingCell, setEditingCell] = useState({
    dayIdx: null,
    mealType: null,
    itemIdx: null,
    field: null
  });
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (patientId) fetchPatientPlan(patientId);
    else fetchLatestPlan();
  }, [patientId]);

  const normalizeMeals = (rawMeals) => {
    if (!rawMeals) return [];
    return rawMeals.map((day, i) => ({
      day: day.day || i + 1,
      meals: day.meals
    }));
  };

  const fetchPatientPlan = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
      const rawMeals = res.data?.fullPlan?.weekly_plan || [];
      setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
    } catch (err) {
      console.error(err);
      fetchLatestPlan();
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestPlan = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/fetch-latest-plan");
      const rawMeals = res.data?.fullPlan?.weekly_plan || [];
      setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
    } catch (err) {
      console.error(err);
      setPlan({ recommendedMeals: [] });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Meal Editing ---------- */
  const startEdit = (dayIdx, mealType, itemIdx, field, value) => {
    setEditingCell({ dayIdx, mealType, itemIdx, field });
    setEditValue(value);
  };
  const cancelEdit = () => setEditingCell({ dayIdx: null, mealType: null, itemIdx: null, field: null });

  const handleMealEdit = (dayIdx, mealType, itemIdx, field, newVal) => {
    setPlan((prev) => {
      const updated = { ...prev };
      if (updated.recommendedMeals[dayIdx]?.meals[mealType]?.items[itemIdx]) {
        updated.recommendedMeals[dayIdx].meals[mealType].items[itemIdx][field] = newVal;
      }
      return updated;
    });
    cancelEdit();
  };

  /* ---------- PDF Generation ---------- */
  
  
  // const generatePDF = () => {
  //   if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

  //   const doc = new jsPDF("p", "pt", "a4");
  //   const margin = 40;
  //   const pageWidth = doc.internal.pageSize.width;
  //   const usableWidth = pageWidth - margin * 2;

  //   const colWidths = [50, 120, 50, 45, 45, 45, 100, 100];
  //   const lineHeight = 14;

  //   let y = 60;
  //   doc.setFontSize(18);
  //   doc.setTextColor("#1f7a4d");
  //   doc.text(`${formData.personalInfo.fullName}`, margin, y);
  //   y += 30;

  //   plan.recommendedMeals.forEach((day) => {
  //     if (y > 700) {
  //       doc.addPage();
  //       y = 60;
  //     }

  //     doc.setFontSize(14);
  //     doc.setTextColor("#2c7a4b");
  //     doc.setFillColor(220, 245, 235);
  //     doc.rect(margin, y - 12, usableWidth, 20, "F");
  //     doc.text(`Day ${day.day}`, margin + 5, y);
  //     y += 25;

  //     doc.setFontSize(10);
  //     doc.setTextColor("#000000");
  //     doc.setDrawColor(200);
  //     doc.setLineWidth(0.5);

  //     const headers = [
  //       "Meal",
  //       "Food & Portion",
  //       "Calories",
  //       "Protein",
  //       "Carbs",
  //       "Fat",
  //       "Ayurvedic Properties",
  //       "Notes / Purpose",
  //     ];
  //     let x = margin;
  //     headers.forEach((h, i) => {
  //       doc.rect(x, y, colWidths[i], lineHeight + 2);
  //       const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
  //       doc.text(splitHeader, x + 2, y + 12);
  //       x += colWidths[i];
  //     });
  //     y += lineHeight + 2;

  //     ["breakfast", "lunch", "dinner"].forEach((meal) => {
  //       const items = day.meals[meal]?.items || [];
  //       items.forEach((it) => {
  //         const row = [
  //           meal.charAt(0).toUpperCase() + meal.slice(1),
  //           `${it.Dish_Name} – ${formatValue(it.Adjusted_Serving_Size_g)} g`,
  //           `${formatValue(it.Adjusted_Calories_kcal)} kcal`,
  //           `${formatValue(it.Protein_g)} g`,
  //           `${formatValue(it.Carbohydrates_g)} g`,
  //           `${formatValue(it.Fat_g)} g`,
  //           `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
  //           `${it.Notes || ""}`,
  //         ];

  //         const cellHeights = row.map((cell, i) => {
  //           const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
  //           return splitText.length * lineHeight + 4;
  //         });
  //         const rowHeight = Math.max(...cellHeights);

  //         if (y + rowHeight > 750) {
  //           doc.addPage();
  //           y = 60;
  //         }

  //         x = margin;
  //         row.forEach((cell, i) => {
  //           doc.rect(x, y, colWidths[i], rowHeight);
  //           const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
  //           doc.text(splitText, x + 2, y + 12);
  //           x += colWidths[i];
  //         });
  //         y += rowHeight;
  //       });
  //     });

  //     y += 10;
  //   });

  //   doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
  // };

 const generatePDF = () => {
  if (!plan?.recommendedMeals?.length) return alert("No plan to export.");

  const doc = new jsPDF("p", "pt", "a4");
  const margin = 40;
  const pageWidth = doc.internal.pageSize.width;
  const usableWidth = pageWidth - margin * 2;

  // Adjusted column widths
  const colWidths = [50, 120, 50, 45, 45, 45, 100, 100];
  const lineHeight = 14;

  let y = 60;
  doc.setFontSize(18);
  doc.setTextColor("#1f7a4d");
  doc.text(`${formData.personalInfo.fullName}`, margin, y);
  y += 30;

  plan.recommendedMeals.forEach((day) => {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }

    doc.setFontSize(14);
    doc.setTextColor("#2c7a4b");
    doc.setFillColor(220, 245, 235);
    doc.rect(margin, y - 12, usableWidth, 20, "F");
    doc.text(`Day ${day.day}`, margin + 5, y);
    y += 25;

    doc.setFontSize(10);
    doc.setTextColor("#000000");
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);

    const headers = [
      "Meal",
      "Food & Portion",
      "Calories",
      "Protein",
      "Carbs",
      "Fat",
      "Ayurvedic Properties",
      "Notes / Purpose",
    ];

    // ---------- Draw table header ----------
    let x = margin;
    headers.forEach((h, i) => {
      // Wrap header text to fit column
      const splitHeader = doc.splitTextToSize(h, colWidths[i] - 4);
      const headerHeight = splitHeader.length * lineHeight + 4;

      doc.rect(x, y, colWidths[i], headerHeight); // header cell rectangle
      doc.text(splitHeader, x + 2, y + 12); // header text
      x += colWidths[i];
    });
    y += Math.max(lineHeight + 2, 16); // spacing after header

    // ---------- Draw table rows ----------
    ["breakfast", "lunch", "dinner"].forEach((meal) => {
      const items = day.meals[meal]?.items || [];
      items.forEach((it) => {
        const row = [
          meal.charAt(0).toUpperCase() + meal.slice(1),
          `${it.Dish_Name} – ${formatValue(it.Adjusted_Serving_Size_g)} g`,
          `${formatValue(it.Adjusted_Calories_kcal)} kcal`,
          `${formatValue(it.Protein_g)} g`,
          `${formatValue(it.Carbohydrates_g)} g`,
          `${formatValue(it.Fat_g)} g`,
          `${it.Ayurvedic_Rasa} / ${it.Ayurvedic_Guna} / ${it.Ayurvedic_Virya}`,
          `${it.Notes || ""}`,
        ];

        const cellHeights = row.map((cell, i) => {
          const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
          return splitText.length * lineHeight + 4;
        });
        const rowHeight = Math.max(...cellHeights);

        if (y + rowHeight > 750) {
          doc.addPage();
          y = 60;
        }

        x = margin;
        row.forEach((cell, i) => {
          doc.rect(x, y, colWidths[i], rowHeight);
          const splitText = doc.splitTextToSize(cell, colWidths[i] - 4);
          doc.text(splitText, x + 2, y + 12);
          x += colWidths[i];
        });
        y += rowHeight;
      });
    });

    y += 10;
  });

  doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
};

  const mealLengths = useMemo(() => {
    if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
    let b = 0,
      l = 0,
      d = 0;
    plan.recommendedMeals.forEach((m) => {
      b += m.meals.breakfast?.items?.length || 0;
      l += m.meals.lunch?.items?.length || 0;
      d += m.meals.dinner?.items?.length || 0;
    });
    const total = Math.max(1, b + l + d);
    return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
  }, [plan]);

  return (
    <div className="min-h-screen bg-[#f7fdf9] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <main className="col-span-12 lg:col-span-12">
          <header className="flex justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-emerald-900">{formData.personalInfo.fullName}</h1>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generatePDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              <DownloadIcon />
              Download PDF
            </motion.button>
          </header>

          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
              Loading your plan...
            </div>
          ) : plan?.recommendedMeals?.length > 0 ? (
            plan.recommendedMeals.map((day, dayIdx) => (
              <div key={dayIdx} className="mb-8">
                <h2 className="text-xl font-bold text-emerald-700 mb-2">Day {day.day}</h2>
                <div className="overflow-x-auto">
  <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100 table-fixed">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b text-left w-1/12">Meal</th>
        <th className="px-4 py-2 border-b text-left w-3/12">Food & Portion</th>
        <th className="px-4 py-2 border-b text-left w-1/12">Calories</th>
        <th className="px-4 py-2 border-b text-left w-1/12">Protein</th>
        <th className="px-4 py-2 border-b text-left w-1/12">Carbs</th>
        <th className="px-4 py-2 border-b text-left w-1/12">Fat</th>
        <th className="px-4 py-2 border-b text-left w-2/12">Ayurvedic (Rasa / Guna / Virya)</th>
        <th className="px-4 py-2 border-b text-left w-2/12">Notes / Purpose</th>
      </tr>
    </thead>

    {/* ---------- tbody starts here ---------- */}
    <tbody>
      {["breakfast", "lunch", "dinner"].map((mealType) =>
        day.meals[mealType]?.items?.map((item, itemIdx) => (
          <tr key={`${mealType}-${itemIdx}`} className="hover:bg-slate-50">
            <td className="px-4 py-2 border-b font-bold text-emerald-700">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </td>
            
            {/* All editable fields */}
            <EditableMealCell
              value={`${item.Dish_Name} – ${formatValue(item.Adjusted_Serving_Size_g)} g`}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.mealType === mealType && editingCell.itemIdx === itemIdx && editingCell.field === "DishAndServing"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "DishAndServing", `${item.Dish_Name} – ${item.Adjusted_Serving_Size_g}`)}
              cancelEdit={cancelEdit}
              onSave={(val) => {
                const parts = val.split("–").map((p) => p.trim());
                handleMealEdit(dayIdx, mealType, itemIdx, "Dish_Name", parts[0] || "");
                handleMealEdit(dayIdx, mealType, itemIdx, "Adjusted_Serving_Size_g", parseFloat(parts[1]) || 0);
              }}
            />
            
            <EditableMealCell
              value={`${formatValue(item.Adjusted_Calories_kcal)} kcal`}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.itemIdx === itemIdx && editingCell.field === "Adjusted_Calories_kcal"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Adjusted_Calories_kcal", item.Adjusted_Calories_kcal)}
              cancelEdit={cancelEdit}
              onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Adjusted_Calories_kcal", parseFloat(val) || 0)}
            />

            <EditableMealCell
              value={`${formatValue(item.Protein_g)} g`}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.itemIdx === itemIdx && editingCell.field === "Protein_g"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Protein_g", item.Protein_g)}
              cancelEdit={cancelEdit}
              onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Protein_g", parseFloat(val) || 0)}
            />

            <EditableMealCell
              value={`${formatValue(item.Carbohydrates_g)} g`}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.itemIdx === itemIdx && editingCell.field === "Carbohydrates_g"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Carbohydrates_g", item.Carbohydrates_g)}
              cancelEdit={cancelEdit}
              onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Carbohydrates_g", parseFloat(val) || 0)}
            />

            <EditableMealCell
              value={`${formatValue(item.Fat_g)} g`}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.itemIdx === itemIdx && editingCell.field === "Fat_g"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Fat_g", item.Fat_g)}
              cancelEdit={cancelEdit}
              onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Fat_g", parseFloat(val) || 0)}
            />

            <EditableMealCell
              value={`${item.Ayurvedic_Rasa} / ${item.Ayurvedic_Guna} / ${item.Ayurvedic_Virya}`}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.itemIdx === itemIdx && editingCell.field === "Ayurvedic"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Ayurvedic", `${item.Ayurvedic_Rasa} / ${item.Ayurvedic_Guna} / ${item.Ayurvedic_Virya}`)}
              cancelEdit={cancelEdit}
              onSave={(val) => {
                const parts = val.split("/").map((p) => p.trim());
                handleMealEdit(dayIdx, mealType, itemIdx, "Ayurvedic_Rasa", parts[0] || "");
                handleMealEdit(dayIdx, mealType, itemIdx, "Ayurvedic_Guna", parts[1] || "");
                handleMealEdit(dayIdx, mealType, itemIdx, "Ayurvedic_Virya", parts[2] || "");
              }}
            />

            <EditableMealCell
              value={item.Notes || ""}
              isEditing={editingCell.dayIdx === dayIdx && editingCell.itemIdx === itemIdx && editingCell.field === "Notes"}
              editValue={editValue}
              setEditValue={setEditValue}
              startEdit={() => startEdit(dayIdx, mealType, itemIdx, "Notes", item.Notes)}
              cancelEdit={cancelEdit}
              onSave={(val) => handleMealEdit(dayIdx, mealType, itemIdx, "Notes", val)}
            />
          </tr>
        ))
      )}
    </tbody>
    {/* ---------- tbody ends here ---------- */}

                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl shadow">
              No diet plan found.{" "}
              <Link to="/" className="text-emerald-600 font-semibold">
                Create a new one.
              </Link>
            </div>
          )}

          <div className="mt-6">
            <SummaryCard patient={formData} mealDistribution={mealLengths} />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- SummaryCard ---------- */
const SummaryCard = ({ patient, mealDistribution }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.12 }}
    className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
  >
    <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
      <h3 className="text-lg font-bold">Plan Summary</h3>
      <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
    </div>
    <div className="p-6 space-y-4">
      <DonutChart
        data={[
          { name: "Breakfast", value: mealDistribution.b, color: "#f59e0b" },
          { name: "Lunch", value: mealDistribution.l, color: "#14b8a6" },
          { name: "Dinner", value: mealDistribution.d, color: "#10b981" }
        ]}
      />
    </div>
  </motion.div>
);
