import React, { useState } from "react";
import axios from "axios";

export default function DietPlan() {
  const [patientFile, setPatientFile] = useState(null);
  const [foodFile, setFoodFile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e, type) => {
    if (type === "patient") setPatientFile(e.target.files[0]);
    if (type === "food") setFoodFile(e.target.files[0]);
  };

  // Call backend to generate plan
  const generatePlan = async () => {
    if (!patientFile || !foodFile) {
      alert("Please upload both patientData.json and foodData.csv");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("patientData", patientFile);
      formData.append("foodData", foodFile);

      const res = await axios.post("http://localhost:3000/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Received plan from backend:", res.data); // ✅ Debugging
      setPlan(res.data);
    } catch (err) {
      console.error("Error generating plan:", err);
      alert("Failed to generate plan. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Ayurvedic Diet Plan Generator
      </h1>

      {/* File Upload Inputs */}
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="file"
          accept=".json"
          onChange={(e) => handleFileChange(e, "patient")}
        />
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, "food")}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePlan}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Diet Plan"}
      </button>

      {/* Display Diet Plan */}
      {plan?.weekly_plan?.length > 0 ? (
        <div className="mt-8 w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Diet Plan for {plan.plan_metadata?.patient_name || "Unknown"}
          </h2>

          <div className="overflow-x-auto border rounded-2xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="p-3 border">Day</th>
                  <th className="p-3 border">Breakfast</th>
                  <th className="p-3 border">Lunch</th>
                  <th className="p-3 border">Dinner</th>
                  <th className="p-3 border">Total Calories</th>
                </tr>
              </thead>
              <tbody>
                {plan.weekly_plan.map((day) => (
                  <tr key={day.day} className="even:bg-gray-50">
                    <td className="p-3 border font-bold text-center">
                      Day {day.day}
                    </td>
                    <td className="p-3 border">
                      {day.meals.breakfast?.items?.length > 0
                        ? day.meals.breakfast.items.map((item, i) => (
                            <div key={i}>
                              <strong>{item.Dish_Name}</strong> (
                              {item.Calories_kcal} kcal)
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td className="p-3 border">
                      {day.meals.lunch?.items?.length > 0
                        ? day.meals.lunch.items.map((item, i) => (
                            <div key={i}>
                              <strong>{item.Dish_Name}</strong> (
                              {item.Calories_kcal} kcal)
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td className="p-3 border">
                      {day.meals.dinner?.items?.length > 0
                        ? day.meals.dinner.items.map((item, i) => (
                            <div key={i}>
                              <strong>{item.Dish_Name}</strong> (
                              {item.Calories_kcal} kcal)
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td className="p-3 border text-center">
                      {day.daily_total_calories_kcal || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && (
          <p className="text-gray-600 mt-6">
            No diet plan data available yet. Upload files and click generate.
          </p>
        )
      )}
    </div>
  );
}

