// // src/pages/DietPlanPage.jsx
// import { useLocation, useNavigate } from "react-router-dom";

// export default function DietPlanPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const patient = location.state?.patient; // get patient data from navigation

//   if (!patient?.dietPlan) {
//     return (
//       <div className="p-6 text-center">
//         <h2 className="text-xl font-semibold text-red-500">
//           No diet plan available.
//         </h2>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 min-h-screen bg-gray-100 dark:bg-slate-900">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
//           Diet Plan - {patient.fullName}
//         </h2>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//         >
//           Back
//         </button>
//       </div>

//       <table className="w-full border-collapse border border-green-300 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
//         <thead>
//           <tr className="bg-green-600 text-white">
//             <th className="border border-green-300 px-4 py-2">Day</th>
//             <th className="border border-green-300 px-4 py-2">Breakfast</th>
//             <th className="border border-green-300 px-4 py-2">Lunch</th>
//             <th className="border border-green-300 px-4 py-2">Dinner</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(patient.dietPlan).map(([day, meals]) => (
//             <tr key={day} className="text-center hover:bg-green-50 dark:hover:bg-slate-700">
//               <td className="border border-green-300 px-4 py-2 font-semibold text-green-700 dark:text-green-300">
//                 {day}
//               </td>

//               {/* Breakfast */}
//               <td className="border border-green-300 px-4 py-2">
//                 {Array.isArray(meals.breakfast)
//                   ? meals.breakfast.map((dish, i) => (
//                       <div key={i}>
//                         <strong>{dish.name || dish.food || dish}</strong>
//                         {dish.qty && ` - ${dish.qty}`}
//                         {dish.calories && ` (${dish.calories} kcal)`}
//                       </div>
//                     ))
//                   : meals.breakfast || "—"}
//               </td>

//               {/* Lunch */}
//               <td className="border border-green-300 px-4 py-2">
//                 {Array.isArray(meals.lunch)
//                   ? meals.lunch.map((dish, i) => (
//                       <div key={i}>
//                         <strong>{dish.name || dish.food || dish}</strong>
//                         {dish.qty && ` - ${dish.qty}`}
//                         {dish.calories && ` (${dish.calories} kcal)`}
//                       </div>
//                     ))
//                   : meals.lunch || "—"}
//               </td>

//               {/* Dinner */}
//               <td className="border border-green-300 px-4 py-2">
//                 {Array.isArray(meals.dinner)
//                   ? meals.dinner.map((dish, i) => (
//                       <div key={i}>
//                         <strong>{dish.name || dish.food || dish}</strong>
//                         {dish.qty && ` - ${dish.qty}`}
//                         {dish.calories && ` (${dish.calories} kcal)`}
//                       </div>
//                     ))
//                   : meals.dinner || "—"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// src/pages/DietPlanPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../Firebase";

// export default function DietPlanPage() {
//   const { id } = useParams();              // Get patient ID from URL
//   const location = useLocation();          // Get passed state
//   const [patient, setPatient] = useState(location.state?.patient || null);
//   const [loading, setLoading] = useState(!patient);

//   useEffect(() => {
//     // If patient data not passed via state, fetch from Firebase
//     if (!patient) {
//       const fetchPatient = async () => {
//         try {
//           const docRef = doc(db, "dietPlans", id);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             setPatient({ id: docSnap.id, ...docSnap.data() });
//           } else {
//             console.log("No such patient!");
//           }
//         } catch (err) {
//           console.error("Error fetching patient:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchPatient();
//     }
//   }, [id, patient]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Diet Plan - {patient?.fullName}
//       </h1>

//       <table className="w-full border-collapse border border-green-300 shadow-lg rounded-lg">
//         <thead>
//           <tr className="bg-green-600 text-white">
//             <th className="border border-green-300 px-4 py-2">Day</th>
//             <th className="border border-green-300 px-4 py-2">Breakfast</th>
//             <th className="border border-green-300 px-4 py-2">Lunch</th>
//             <th className="border border-green-300 px-4 py-2">Dinner</th>
//           </tr>
//         </thead>
//         <tbody>
//           {patient?.dietPlan &&
//             Object.entries(patient.dietPlan).map(([day, meals]) => (
//               <tr key={day} className="text-center hover:bg-green-50">
//                 <td className="border border-green-300 px-4 py-2 font-semibold text-green-700">
//                   {day}
//                 </td>
//                 {["breakfast", "lunch", "dinner"].map((meal) => (
//                   <td key={meal} className="border border-green-300 px-4 py-2">
//                     {Array.isArray(meals[meal])
//                       ? meals[meal].map((dish, i) => (
//                           <div key={i}>
//                             <strong>{dish.name || dish.food || dish}</strong>
//                             {dish.qty && ` - ${dish.qty}`}
//                             {dish.calories && ` (${dish.calories} kcal)`}
//                           </div>
//                         ))
//                       : meals[meal] || "—"}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// src/pages/DietPlanPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../Firebase";

// export default function DietPlanPage() {
//   const { id } = useParams();              // Get patient ID from URL
//   const location = useLocation();          // Get passed state
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(location.state?.patient || null);
//   const [loading, setLoading] = useState(!patient);


// useEffect(() => {
//   if (!patient) {
//     const fetchPatient = async () => {
//       try {
//         const docRef = doc(db, "dietPlans", id); // make sure collection name is correct
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = { id: docSnap.id, ...docSnap.data() };

//           // 🔹 LOG the whole schema
//           console.log("==== FULL DIET PLAN SCHEMA ====");
//           console.log(JSON.stringify(data, null, 2)); // pretty print
//           console.log("==== END OF SCHEMA ====");

//           setPatient(data);
//         } else {
//           console.log("No such patient!");
//         }
//       } catch (err) {
//         console.error("Error fetching patient:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatient();
//   }
// }, [id, patient]);


//   //         else {
//   //           console.log("No such patient!");
//   //         }
//   //       } catch (err) {
//   //         console.error("Error fetching patient:", err);
//   //       } finally {
//   //         setLoading(false);
//   //       }
//   //     };

//   //     fetchPatient();
//   //   }
//   // }, [id, patient]);

//   if (loading) return <div className="p-6">Loading...</div>;

//   if (!patient)
//     return (
//       <div className="p-6 text-center text-red-500">
//         Patient not found.
//         <button
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           onClick={() => navigate(-1)}
//         >
//           Go Back
//         </button>
//       </div>
//     );

//   if (!patient.dietPlan || Object.keys(patient.dietPlan).length === 0)
//     return (
//       <div className="p-6 text-center text-red-500">
//         No diet plan available for {patient.fullName}.
//         <button
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           onClick={() => navigate(-1)}
//         >
//           Go Back
//         </button>
//       </div>
//     );

//   return (
//     <div className="p-6 min-h-screen bg-gray-100 dark:bg-slate-900">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
//           Diet Plan - {patient.fullName}
//         </h2>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//         >
//           Back
//         </button>
//       </div>

//       <table className="w-full border-collapse border border-green-300 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
//         <thead>
//           <tr className="bg-green-600 text-white">
//             <th className="border border-green-300 px-4 py-2">Day</th>
//             <th className="border border-green-300 px-4 py-2">Breakfast</th>
//             <th className="border border-green-300 px-4 py-2">Lunch</th>
//             <th className="border border-green-300 px-4 py-2">Dinner</th>
//           </tr>
//         </thead>
//         {/* <tbody>
//           {Object.entries(patient.dietPlan).map(([day, meals]) => (
//             <tr key={day} className="text-center hover:bg-green-50 dark:hover:bg-slate-700">
//               <td className="border border-green-300 px-4 py-2 font-semibold text-green-700 dark:text-green-300">
//                 {day}
//               </td>

//               {["breakfast", "lunch", "dinner"].map((meal) => (
//                 <td key={meal} className="border border-green-300 px-4 py-2">
//                   {Array.isArray(meals[meal])
//                     ? meals[meal].map((dish, i) => (
//                         <div key={i}>
//                           <strong>{dish.name || dish.food || dish}</strong>
//                           {dish.qty && ` - ${dish.qty}`}
//                           {dish.calories && ` (${dish.calories} kcal)`}
//                         </div>
//                       ))
//                     : meals[meal] || "—"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody> */}

//         <tbody>
//   {patient.dietPlan &&
//     Object.entries(patient.dietPlan)
//       .filter(([day, meals]) =>
//         meals && (meals.breakfast || meals.lunch || meals.dinner)
//       ) // only include valid days
//       .map(([day, meals]) => (
//         <tr key={day} className="text-center hover:bg-green-50 dark:hover:bg-slate-700">
//           <td className="border border-green-300 px-4 py-2 font-semibold text-green-700 dark:text-green-300">
//             {day}
//           </td>
//           {["breakfast", "lunch", "dinner"].map((meal) => (
//             <td key={meal} className="border border-green-300 px-4 py-2">
//               {Array.isArray(meals[meal])
//                 ? meals[meal].map((dish, i) => (
//                     <div key={i}>
//                       <strong>{dish.name || dish.food || dish}</strong>
//                       {dish.qty && ` - ${dish.qty}`}
//                       {dish.calories && ` (${dish.calories} kcal)`}
//                     </div>
//                   ))
//                 : meals[meal] || "—"}
//             </td>
//           ))}
//         </tr>
//       ))}
// </tbody>

//       </table>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

export default function DietPlanPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!patient);

  useEffect(() => {
    if (!patient) {
      const fetchPatient = async () => {
        try {
          const docRef = doc(db, "dietPlans", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            console.log("Fetched document:", data);
            setPatient(data);
          } else {
            console.log("No such patient!");
          }
        } catch (err) {
          console.error("Error fetching patient:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id, patient]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!patient)
    return (
      <div className="p-6 text-center text-red-500">
        Patient not found.
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );

  const dietPlan = patient.dietPlan || patient.weekly_plan || {};

  if (!dietPlan || Object.keys(dietPlan).length === 0)
    return (
      <div className="p-6 text-center text-red-500">
        No diet plan available for {patient.fullName || "this patient"}.
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
          Diet Plan - {patient.fullName || "Patient"}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Back
        </button>
      </div>

      <table className="w-full border-collapse border border-green-300 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="border border-green-300 px-4 py-2">Day / Key</th>
            {Object.keys(dietPlan[Object.keys(dietPlan)[0]] || {}).map((meal) => (
              <th key={meal} className="border border-green-300 px-4 py-2">
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(dietPlan).map(([day, meals]) => (
            <tr key={day} className="text-center hover:bg-green-50 dark:hover:bg-slate-700">
              <td className="border border-green-300 px-4 py-2 font-semibold text-green-700 dark:text-green-300">
                {day}
              </td>
              {Object.keys(meals || {}).map((meal) => (
                <td key={meal} className="border border-green-300 px-4 py-2">
                  {Array.isArray(meals[meal])
                    ? meals[meal].map((item, i) => (
                        <div key={i}>
                          {typeof item === "object" ? JSON.stringify(item) : item}
                        </div>
                      ))
                    : typeof meals[meal] === "object"
                    ? JSON.stringify(meals[meal])
                    : meals[meal] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>


      </table>
    </div>
  );
}



