

// src/pages/DietPlanPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";

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
const defaultFormData = {
  personalInfo: { fullName: "Patient" },
  vitals: {},
  calculated: {},
};

/* ---------- EditableMealCell ---------- */
const EditableMealCell = ({
  value,
  onSave,
  mealType,
  isEditing,
  editValue,
  setEditValue,
  startEdit,
  cancelEdit,
  rowIdx,
}) => {
  return (
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
          <span>{value || "-"}</span>
          <button
            className="text-blue-500 hover:text-blue-700 px-1"
            onClick={() => startEdit(rowIdx, mealType.toLowerCase(), value)}
            title={`Edit ${mealType}`}
          >
            ✏️
          </button>
        </div>
      )}
      {isEditing && (
        <div className="flex gap-1 mt-1">
          <button
            className="px-2 py-1 bg-green-600 text-white rounded text-xs"
            onClick={() => onSave(editValue)}
          >
            Save
          </button>
          <button
            className="px-2 py-1 bg-gray-300 rounded text-xs"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </div>
      )}
    </td>
  );
};

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
        normalized
          .slice(0, idx)
          .reduce((acc, it) => acc + (it.value / sum) * circumference, 0);
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
          {Math.round(data[0].value + data[1].value + data[2].value || 100)}%
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
  const passedPatient = location.state?.patient;

  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState(passedFormData || defaultFormData);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState({ row: null, meal: null });
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (patientId) fetchPatientPlan(patientId);
    else fetchLatestPlan();
  }, [patientId]);

  const normalizeMeals = (rawMeals) => {
    if (!rawMeals || rawMeals.length === 0) return [];
    return rawMeals.map((day, i) => ({
      day: day.day || day.Day || i + 1,
      breakfast:
        day.breakfast ||
        day.meals?.breakfast?.items?.map((it) => it.Dish_Name).join(", ") ||
        "",
      lunch:
        day.lunch ||
        day.meals?.lunch?.items?.map((it) => it.Dish_Name).join(", ") ||
        "",
      dinner:
        day.dinner ||
        day.meals?.dinner?.items?.map((it) => it.Dish_Name).join(", ") ||
        "",
    }));
  };

  const fetchPatientPlan = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/patient-plan/${id}`);
      const rawMeals =
        res.data?.recommendedMeals ||
        res.data?.fullPlan?.weekly_plan ||
        res.data?.fullPlan?.recommendations ||
        [];
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
      const rawMeals =
        res.data?.recommendedMeals ||
        res.data?.fullPlan?.weekly_plan ||
        res.data?.fullPlan?.recommendations ||
        [];
      setPlan({ recommendedMeals: normalizeMeals(rawMeals) });
    } catch (err) {
      console.error(err);
      setPlan({ recommendedMeals: [] });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Meal Editing ---------- */
  const startEdit = (row, meal, value) => {
    setEditingCell({ row, meal });
    setEditValue(value);
  };
  const cancelEdit = () => setEditingCell({ row: null, meal: null });
  const handleMealEdit = (row, meal, newVal) => {
    setPlan((prev) => {
      const updated = { ...prev };
      updated.recommendedMeals[row][meal] = newVal;
      return updated;
    });
    cancelEdit();
  };

  /* ---------- PDF Generation ---------- */
  const generatePDF = () => {
    if (!plan?.recommendedMeals?.length) return alert("No plan to export.");
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    let y = 80;

    doc.setFontSize(18);
    doc.text(`Diet Plan for ${formData.personalInfo.fullName}`, margin, 40);

    plan.recommendedMeals.forEach((day) => {
      if (y > 750) {
        doc.addPage();
        y = 80;
      }
      doc.setFontSize(12);
      doc.text(`Day ${day.day}`, margin, y);
      doc.text(`Breakfast: ${day.breakfast || "-"}`, margin, y + 16);
      doc.text(`Lunch: ${day.lunch || "-"}`, margin, y + 32);
      doc.text(`Dinner: ${day.dinner || "-"}`, margin, y + 48);
      y += 70;
    });

    doc.save(`DietPlan_${formData.personalInfo.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  
  const mealLengths = useMemo(() => {
    if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
    let b = 0,
      l = 0,
      d = 0;
    plan.recommendedMeals.forEach((m) => {
      b += (m.breakfast || "").length;
      l += (m.lunch || "").length;
      d += (m.dinner || "").length;
    });
    const total = Math.max(1, b + l + d);
    return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
  }, [plan]);

  

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-[#f7fdf9] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <main className="col-span-12 lg:col-span-12">
          <header className="flex justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-emerald-900">
              Diet Plan for {formData.personalInfo.fullName}
            </h1>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={generatePDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg"
              > 
                <DownloadIcon />
                Download PDF
              </motion.button>
            </div>
          </header>

          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">
              Loading your plan...
            </div>
          ) : plan?.recommendedMeals?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-2xl shadow border border-slate-100">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Day</th>
                    <th className="px-4 py-2 border-b">Breakfast</th>
                    <th className="px-4 py-2 border-b">Lunch</th>
                    <th className="px-4 py-2 border-b">Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.recommendedMeals.map((day, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-2 border-b font-bold text-emerald-700">
                        {day.day}
                      </td>
                      <EditableMealCell
                        value={day.breakfast}
                        onSave={(val) => handleMealEdit(i, "breakfast", val)}
                        mealType="Breakfast"
                        isEditing={editingCell.row === i && editingCell.meal === "breakfast"}
                        editValue={editValue}
                        setEditValue={setEditValue}
                        startEdit={startEdit}
                        cancelEdit={cancelEdit}
                        rowIdx={i}
                      />
                      <EditableMealCell
                        value={day.lunch}
                        onSave={(val) => handleMealEdit(i, "lunch", val)}
                        mealType="Lunch"
                        isEditing={editingCell.row === i && editingCell.meal === "lunch"}
                        editValue={editValue}
                        setEditValue={setEditValue}
                        startEdit={startEdit}
                        cancelEdit={cancelEdit}
                        rowIdx={i}
                      />
                      <EditableMealCell
                        value={day.dinner}
                        onSave={(val) => handleMealEdit(i, "dinner", val)}
                        mealType="Dinner"
                        isEditing={editingCell.row === i && editingCell.meal === "dinner"}
                        editValue={editValue}
                        setEditValue={setEditValue}
                        startEdit={startEdit}
                        cancelEdit={cancelEdit}
                        rowIdx={i}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6">
                <SummaryCard patient={formData} mealDistribution={mealLengths} />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl shadow">
              No diet plan found.{" "}
              <Link to="/" className="text-emerald-600 font-semibold">
                Create a new one.
              </Link>
            </div>
          )}
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
          { name: "Dinner", value: mealDistribution.d, color: "#10b981" },
        ]}
      />
    </div>
  </motion.div>
);
