// // src/DietPlanPage.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";

// export default function DietPlanPage() {
//   const location = useLocation();
//   const passedPatient = location.state?.patient;

//   const [plan, setPlan] = useState(null);
//   const [formData, setFormData] = useState({
//     personalInfo: passedPatient || { fullName: "Patient" },
//     vitals: {},
//     calculated: {},
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchLatestPlan();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // normalizeMeals (identical)
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

//   const fetchLatestPlan = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/fetch-latest-plan"
//       );
//       const rawMeals =
//         res.data?.recommendedMeals ||
//         res.data?.fullPlan?.weekly_plan ||
//         res.data?.fullPlan?.recommendations ||
//         [];
//       const normalized = normalizeMeals(rawMeals);
//       setPlan({ recommendedMeals: normalized });

//       if (res.data?.patientInfo)
//         setFormData((prev) => ({
//           ...prev,
//           personalInfo: { ...prev.personalInfo, ...res.data.patientInfo },
//         }));
//     } catch (err) {
//       console.error("Failed to fetch latest plan", err);
//       setPlan({ recommendedMeals: [] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generatePDF = () => {
//     if (!plan || !plan.recommendedMeals || plan.recommendedMeals.length === 0) {
//       alert("❌ No diet plan to generate PDF.");
//       return;
//     }
//     const doc = new jsPDF("p", "pt", "a4");
//     const pageWidth = doc.internal.pageSize.width;

//     doc.setFillColor(76, 175, 80);
//     doc.rect(0, 0, pageWidth, 50, "F");
//     doc.setFontSize(20);
//     doc.setTextColor(255, 255, 255);
//     doc.text(
//       `Diet Plan for ${formData.personalInfo.fullName}`,
//       pageWidth / 2,
//       32,
//       { align: "center" }
//     );

//     let y = 70;
//     plan.recommendedMeals.forEach((day) => {
//       doc.setFillColor(230, 230, 250);
//       if (typeof doc.roundedRect === "function")
//         doc.roundedRect(14, y - 4, pageWidth - 28, 60, 5, 5, "F");
//       else doc.rect(14, y - 4, pageWidth - 28, 60, "F");

//       doc.setFontSize(14);
//       doc.setTextColor(0, 0, 0);
//       doc.text(`Day ${day.day}`, 20, y);

//       doc.setFontSize(12);
//       doc.text(`Breakfast: ${day.breakfast}`, 20, y + 18);
//       doc.text(`Lunch: ${day.lunch}`, 20, y + 32);
//       doc.text(`Dinner: ${day.dinner}`, 20, y + 46);

//       y += 70;
//       if (y > 750) {
//         doc.addPage();
//         y = 50;
//       }
//     });

//     const today = new Date();
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(
//       `Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
//       pageWidth - 14,
//       doc.internal.pageSize.height - 10,
//       { align: "right" }
//     );

//     doc.save(`DietPlan_${formData.personalInfo.fullName}.pdf`);
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">📋 Diet Plan</h1>

//       {loading ? (
//         <p>Loading plan...</p>
//       ) : plan?.recommendedMeals?.length > 0 ? (
//         <>
//           <div className="mt-2 p-4 border rounded bg-gray-50">
//             <h2 className="text-xl font-semibold">
//               Diet Plan for {formData.personalInfo.fullName}
//             </h2>

//             {plan.recommendedMeals.map((day, i) => (
//               <div key={i} className="mt-2 p-2 border-b rounded bg-white">
//                 <h3 className="font-semibold">Day {day.day}</h3>
//                 <p>
//                   <strong>Breakfast:</strong> {day.breakfast}
//                 </p>
//                 <p>
//                   <strong>Lunch:</strong> {day.lunch}
//                 </p>
//                 <p>
//                   <strong>Dinner:</strong> {day.dinner}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 flex gap-3">
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//               onClick={generatePDF}
//             >
//               📄 Download PDF
//             </button>
//             <button
//               className="px-4 py-2 bg-gray-200 rounded"
//               onClick={fetchLatestPlan}
//             >
//               🔄 Refresh
//             </button>
//             <Link to="/form" className="px-4 py-2 bg-gray-100 rounded">
//               ✏️ Edit Form
//             </Link>
//           </div>
//         </>
//       ) : (
//         <p className="text-gray-600">
//           No diet plan found. Generate one from the{" "}
//           <Link to="/form" className="text-blue-600">
//             Form
//           </Link>
//           .
//         </p>
//       )}
//     </div>
//   );
// }



// src/pages/DietPlanPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";

const Icon = ({ children, className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">{children}</svg>
);
const BreakfastIcon = () => (
  <Icon className="h-5 w-5 text-amber-500"><path d="M3 7a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 000 2h14a1 1 0 000-2H5z" /></Icon>
);
const LunchIcon = () => (
  <Icon className="h-5 w-5 text-teal-500"><path d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" /></Icon>
);
const DinnerIcon = () => (
  <Icon className="h-5 w-5 text-emerald-500"><path d="M4 6h16v2H4zM4 10h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" /></Icon>
);
const DownloadIcon = () => (
  <Icon className="h-5 w-5"><path d="M12 3v10m0 0l4-4m-4 4l-4-4M4 19h16" strokeWidth="1.5" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" /></Icon>
);

const defaultFormData = {
  personalInfo: { fullName: "Patient" },
  vitals: {},
  calculated: {},
};

export default function DietPlanPage() {
  const location = useLocation();
  const passedFormData = location.state?.formData;

  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState(passedFormData || defaultFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLatestPlan(); /* eslint-disable-line */ }, []);

  const normalizeMeals = (rawMeals) => {
    if (!rawMeals || rawMeals.length === 0) return [];
    return rawMeals.map((day, i) => ({
      day: day.day || day.Day || i + 1,
      breakfast: day.breakfast || day.meals?.breakfast?.items?.map((it) => it.Dish_Name).join(", ") || "",
      lunch: day.lunch || day.meals?.lunch?.items?.map((it) => it.Dish_Name).join(", ") || "",
      dinner: day.dinner || day.meals?.dinner?.items?.map((it) => it.Dish_Name).join(", ") || "",
    }));
  };

  const fetchLatestPlan = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/fetch-latest-plan");
      const rawMeals = res.data?.recommendedMeals || res.data?.fullPlan?.weekly_plan || res.data?.fullPlan?.recommendations || [];
      setPlan({ recommendedMeals: normalizeMeals(rawMeals) });

      if (res.data?.patientInfo) {
        setFormData((prev) => ({
          ...prev,
          ...res.data.patientInfo,
          personalInfo: { ...prev.personalInfo, ...res.data.patientInfo.personalInfo },
          vitals: { ...prev.vitals, ...res.data.patientInfo.vitals },
          calculated: { ...prev.calculated, ...res.data.patientInfo.calculated },
        }));
      }
    } catch (err) {
      console.error("Failed to fetch latest plan", err);
      setPlan({ recommendedMeals: [] });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!plan?.recommendedMeals?.length) {
      alert("❌ No diet plan to generate PDF.");
      return;
    }
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;

    const addHeader = () => {
      doc.setFillColor(237, 253, 245);
      doc.rect(0, 0, pageWidth, 90, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(6, 78, 59);
      doc.text("Ayurvedic Diet Plan", margin, 48);
      doc.setFontSize(11);
      doc.setTextColor(16, 185, 129);
      doc.text(`For: ${formData.personalInfo.fullName || "Patient"}`, margin, 66);
    };

    const addFooter = () => {
      doc.setFillColor(244, 255, 250);
      doc.rect(0, pageHeight - 50, pageWidth, 50, "F");
      doc.setFontSize(9);
      doc.setTextColor(90, 120, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 28);
    };

    addHeader();

    let y = 110;
    const rightCol = margin + 220;
    const contentWidth = pageWidth - rightCol - margin;

    plan.recommendedMeals.forEach((day) => {
      if (y > pageHeight - 140) {
        doc.addPage();
        addHeader();
        y = 110;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(6, 78, 59);
      doc.text(`Day ${day.day}`, rightCol, y);
      y += 18;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(40, 60, 50);

      const mealText = `Breakfast: ${day.breakfast || "-"}\n\nLunch: ${day.lunch || "-"}\n\nDinner: ${day.dinner || "-"}`;
      const lines = doc.splitTextToSize(mealText, contentWidth);
      doc.text(lines, rightCol, y);
      y += lines.length * 12 + 16;
    });

    addFooter();
    const safeName = (formData.personalInfo.fullName || "Patient").replace(/\s+/g, "_");
    doc.save(`DietPlan_${safeName}.pdf`);
  };

  const mealLengths = useMemo(() => {
    if (!plan?.recommendedMeals) return { b: 0, l: 0, d: 0 };
    let b = 0, l = 0, d = 0;
    plan.recommendedMeals.forEach((m) => {
      b += (m.breakfast || "").length;
      l += (m.lunch || "").length;
      d += (m.dinner || "").length;
    });
    const total = Math.max(1, b + l + d);
    return { b: (b / total) * 100, l: (l / total) * 100, d: (d / total) * 100 };
  }, [plan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fdf9] to-white p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left aside - minimal brand only */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100 sticky top-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">DR</div>
              <div>
                <div className="text-sm font-semibold text-emerald-900">Ayurvedic Diet Admin</div>
                <div className="text-xs text-slate-400">Doctor Dashboard</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">&nbsp;</div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-6">
          <header className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-emerald-900">Your Diet Plan</h1>
              <p className="text-sm text-slate-500 mt-1">A 7-day holistic meal plan for <span className="font-semibold text-emerald-700">{formData.personalInfo.fullName}</span></p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={generatePDF} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition">
                <DownloadIcon />
                <span>Download PDF</span>
              </motion.button>
              <Link to="/" className="px-3 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-50 transition" title="Edit Form">✏️</Link>
            </div>
          </header>

          <section className="space-y-4">
            <AnimatePresence>
              {loading ? (
                <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow">Loading your plan...</div>
              ) : plan?.recommendedMeals?.length > 0 ? (
                plan.recommendedMeals.map((day, i) => (
                  <motion.article key={day.day} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-white p-5 rounded-2xl shadow border border-slate-100">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-emerald-700">Day {day.day}</h3>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div className="flex items-start gap-3"><BreakfastIcon /><p className="text-sm"><span className="font-semibold text-slate-700">Breakfast:</span> {day.breakfast || '—'}</p></div>
                      <div className="flex items-start gap-3"><LunchIcon /><p className="text-sm"><span className="font-semibold text-slate-700">Lunch:</span> {day.lunch || '—'}</p></div>
                      <div className="flex items-start gap-3"><DinnerIcon /><p className="text-sm"><span className="font-semibold text-slate-700">Dinner:</span> {day.dinner || '—'}</p></div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl shadow">Could not find a diet plan. <Link to="/" className="text-emerald-600 font-semibold">Create a new one.</Link></div>
              )}
            </AnimatePresence>
          </section>
        </main>

        {/* Right summary only */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-6">
            <SummaryCard patient={formData} mealDistribution={mealLengths} />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Presentational children ---------- */

const SummaryCard = ({ patient, mealDistribution }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-center">
        <h3 className="text-lg font-bold">Plan Summary</h3>
        <p className="text-xs text-emerald-100 mt-1">Meal Distribution</p>
      </div>
      <div className="p-6 space-y-4">
        <DonutChart data={[
          { name: 'Breakfast', value: mealDistribution.b, color: '#f59e0b' },
          { name: 'Lunch', value: mealDistribution.l, color: '#14b8a6' },
          { name: 'Dinner', value: mealDistribution.d, color: '#10b981' }
        ]} />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" />Breakfast</span><span className="font-semibold">{Math.round(mealDistribution.b)}%</span></div>
          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500" />Lunch</span><span className="font-semibold">{Math.round(mealDistribution.l)}%</span></div>
          <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" />Dinner</span><span className="font-semibold">{Math.round(mealDistribution.d)}%</span></div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 text-center">
          <div>
            <div className="text-xs text-slate-400">Age</div>
            <div className="text-lg font-bold text-slate-800">{patient.calculated?.age || patient.personalInfo?.age || '-'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">BMI</div>
            <div className="text-lg font-bold text-slate-800">{patient.calculated?.bmi || patient.vitals?.bmi || '-'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DonutChart = ({ data }) => {
  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const normalized = data.map(item => ({ ...item, value: Math.max(0, item.value || 0) }));
  const sum = normalized.reduce((s, it) => s + it.value, 0) || 1;

  const paths = normalized.map((item, idx) => {
    const valuePct = (item.value / sum) * 100;
    const dash = (valuePct / 100) * circumference;
    const offset = circumference - dash - (normalized.slice(0, idx).reduce((acc, it) => acc + ((it.value / sum) * circumference), 0));
    return { ...item, dash, offset };
  }).reverse();

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#eef2f3" strokeWidth={strokeWidth} />
        <AnimatePresence>
          {paths.map((p, i) => (
            <motion.circle key={p.name}
              cx={size/2} cy={size/2} r={radius}
              fill="none"
              stroke={p.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${p.dash} ${circumference - p.dash}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: p.offset }}
              transition={{ duration: 0.9, ease: "easeInOut", delay: i * 0.08 }}
              strokeLinecap="round"
            />
          ))}
        </AnimatePresence>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-slate-800">{Math.round((data[0].value + data[1].value + data[2].value) || 100)}%</span>
        <span className="text-xs text-slate-400">Distribution</span>
      </div>
    </div>
  );
};
