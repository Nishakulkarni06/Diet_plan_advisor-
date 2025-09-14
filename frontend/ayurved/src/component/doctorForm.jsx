import React, { useState } from "react";
import axios from "axios";

function MealPlanTable() {
  const [patientNumber, setPatientNumber] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    if (!patientNumber) {
      alert("Please enter a patient number");
      return;
    }

    setLoading(true);
    setError("");
    setMealPlan(null);

    try {
      const res = await axios.post("http://localhost:3000/generate", { patientNumber });

      let clean = res.data.response.replace(/```json|```/g, "").trim();
      const jsonPlan = JSON.parse(clean);

      setMealPlan(jsonPlan);
    } catch (err) {
      console.error("Error:", err);

      if (err.response) {
        // Backend responded with error status
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error. Please check your backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-green-50 min-h-screen">
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter Patient Number"
          value={patientNumber}
          onChange={(e) => setPatientNumber(e.target.value)}
          className="border border-green-300 px-4 py-2 rounded-lg"
        />
        <button
          onClick={generatePlan}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate 7-Day Meal Plan"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {mealPlan && (
        <table className="w-full border-collapse border border-green-300 bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border border-green-300 px-4 py-2">Day</th>
              <th className="border border-green-300 px-4 py-2">Breakfast</th>
              <th className="border border-green-300 px-4 py-2">Lunch</th>
              <th className="border border-green-300 px-4 py-2">Dinner</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(mealPlan).map(([day, meals]) => (
              <tr key={day} className="text-center hover:bg-green-50">
                <td className="border border-green-300 px-4 py-2 font-semibold text-green-700">
                  {day}
                </td>
                <td className="border border-green-300 px-4 py-2">
                  {meals.breakfast.join(", ")}
                </td>
                <td className="border border-green-300 px-4 py-2">
                  {meals.lunch.join(", ")}
                </td>
                <td className="border border-green-300 px-4 py-2">
                  {meals.dinner.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MealPlanTable;
