// import React, { useState } from "react";
// import axios from "axios";

// function MealPlanTable() {
//   const [patientNumber, setPatientNumber] = useState("");
//   const [mealPlan, setMealPlan] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [expandedDish, setExpandedDish] = useState(null);

//   const generatePlan = async () => {
//     if (!patientNumber) {
//       alert("Please enter a patient number");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setMealPlan(null);

//     try {
//       const res = await axios.post("http://localhost:3000/generate", { patientNumber });

//       let clean = res.data.response.replace(/```json|```/g, "").trim();
//       const jsonPlan = JSON.parse(clean);

//       setMealPlan(jsonPlan);
//     } catch (err) {
//       console.error("Error:", err);

//       if (err.response) {
//         setError(err.response.data.error || "Something went wrong");
//       } else {
//         setError("Network error. Please check your backend server.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpand = (dishKey) => {
//     setExpandedDish(expandedDish === dishKey ? null : dishKey);
//   };

//   const renderMeals = (meals, mealType) => (
//     <td className="border border-green-300 px-4 py-2">
//       {meals[mealType].map((dish, i) => {
//         const key = `${mealType}-${i}`;
//         if (typeof dish === "string") {
//           return <div key={key}>{dish}</div>;
//         }
//         return (
//           <div key={key} className="mb-2">
//             <button
//               onClick={() => toggleExpand(key)}
//               className="text-green-700 font-semibold hover:underline"
//             >
//               {dish.name}
//             </button>
//             {expandedDish === key && (
//               <div className="mt-1 p-2 bg-green-50 text-sm text-gray-700 rounded-lg border border-green-200">
//                 <p><strong>Calories:</strong> {dish.calories} kcal</p>
//                 <p><strong>Protein:</strong> {dish.protein} g</p>
//                 <p><strong>Rasa:</strong> {dish.rasa?.join(", ")}</p>
//                 <p><strong>Guna:</strong> {dish.guna}</p>
//                 <p><strong>Virya:</strong> {dish.virya}</p>
//                 <p><strong>Dosha Effect:</strong> {dish.doshaEffect}</p>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </td>
//   );

//   return (
//     <div className="p-8 bg-green-50 min-h-screen">
//       <div className="mb-4 flex items-center gap-2">
//         <input
//           type="text"
//           placeholder="Enter Patient Number"
//           value={patientNumber}
//           onChange={(e) => setPatientNumber(e.target.value)}
//           className="border border-green-300 px-4 py-2 rounded-lg"
//         />
//         <button
//           onClick={generatePlan}
//           className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700"
//           disabled={loading}
//         >
//           {loading ? "Generating..." : "Generate 7-Day Meal Plan"}
//         </button>
//       </div>

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       {mealPlan && (
//         <table className="w-full border-collapse border border-green-300 bg-white shadow-lg rounded-lg">
//           <thead>
//             <tr className="bg-green-600 text-white">
//               <th className="border border-green-300 px-4 py-2">Day</th>
//               <th className="border border-green-300 px-4 py-2">Breakfast</th>
//               <th className="border border-green-300 px-4 py-2">Lunch</th>
//               <th className="border border-green-300 px-4 py-2">Dinner</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(mealPlan).map(([day, meals]) => (
//               <tr key={day} className="text-center hover:bg-green-50">
//                 <td className="border border-green-300 px-4 py-2 font-semibold text-green-700">
//                   {day}
//                 </td>
//                 {renderMeals(meals, "breakfast")}
//                 {renderMeals(meals, "lunch")}
//                 {renderMeals(meals, "dinner")}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default MealPlanTable;




