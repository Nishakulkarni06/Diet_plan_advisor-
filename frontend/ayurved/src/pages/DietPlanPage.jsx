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

// --- Helper Icons for UI Polish ---
const BreakfastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 9a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /><path fillRule="evenodd" d="M18 11H2v4a2 2 0 002 2h12a2 2 0 002-2v-4z" clipRule="evenodd" /></svg>;
const LunchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const DinnerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 00.553.894l4 2A1 1 0 0011 17z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

const defaultFormData = {
    personalInfo: { fullName: "Patient" },
    vitals: {},
    calculated: {},
};

export default function DietPlanPage() {
    const location = useLocation();
    // **FIX**: Get the entire formData object passed from the previous page
    const passedFormData = location.state?.formData;

    const [plan, setPlan] = useState(null);
    const [formData, setFormData] = useState(passedFormData || defaultFormData);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLatestPlan(); }, []);

    // --- YOUR CORE LOGIC (UNCHANGED) ---
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
            
            // **FIX**: If API returns fresh data, merge it without overwriting initial data
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

    // --- RE-THEMED: STYLISH GREEN PDF GENERATOR ---
    const generatePDF = () => {
        if (!plan?.recommendedMeals?.length) {
            alert("❌ No diet plan to generate PDF.");
            return;
        }
        const doc = new jsPDF("p", "pt", "a4");
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 40;

        const addPageContent = () => {
            // Header (Green Theme)
            doc.setFillColor(16, 185, 129); // emerald-500
            doc.rect(0, 0, pageWidth, 80, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(255, 255, 255);
            doc.text("Personalized Diet Plan", margin, 40);
            doc.setFontSize(12);
            doc.setTextColor(209, 250, 229); // emerald-100
            doc.text(`For: ${formData.personalInfo.fullName}`, margin, 60);

            // Sidebar
            doc.setFillColor(240, 253, 244); // emerald-50
            doc.rect(margin, 100, 150, pageHeight - 160, "F");
            doc.setFont("helvetica", "bold");
            doc.setTextColor(5, 102, 72); // emerald-800
            doc.setFontSize(11);
            doc.text("Patient Summary", margin + 15, 120);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(20, 83, 45); // emerald-700
            // **FIX**: Correctly access age and BMI
            doc.text(`Age: ${formData.calculated?.age || formData.personalInfo?.age || "-"}`, margin + 15, 145);
            doc.text(`BMI: ${formData.calculated?.bmi || formData.vitals?.bmi || "-"}`, margin + 15, 160);
            
            doc.setFont("helvetica", "bold");
            doc.text("General Advice", margin + 15, 200);
            const tips = doc.splitTextToSize("• Stay hydrated.\n• Eat mindfully.\n• Prefer fresh, seasonal foods.\n• Avoid eating late at night.", 120);
            doc.setFont("helvetica", "normal");
            doc.text(tips, margin + 15, 215);

            // Footer
            doc.setFillColor(16, 185, 129); // emerald-500
            doc.rect(0, pageHeight - 40, pageWidth, 40, "F");
            doc.setFontSize(9);
            doc.setTextColor(209, 250, 229); // emerald-100
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 18);
            doc.text("Ayurvedic Diet Advisor", pageWidth - margin, pageHeight - 18, { align: "right" });
        };
        
        addPageContent();
        let y = 120;
        const contentX = margin + 150 + 20;
        const contentWidth = pageWidth - contentX - margin;

        plan.recommendedMeals.forEach((day) => {
            const dayTitle = `Day ${day.day}`;
            const mealText = `Breakfast:\n${day.breakfast || "-"}\n\nLunch:\n${day.lunch || "-"}\n\nDinner:\n${day.dinner || "-"}`;
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(6, 78, 59); // emerald-900
            const titleHeight = doc.getTextDimensions(dayTitle).h;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const bodyLines = doc.splitTextToSize(mealText, contentWidth);
            const bodyHeight = bodyLines.length * 12;
            const blockHeight = titleHeight + bodyHeight + 30;

            if (y + blockHeight > pageHeight - 60) {
                doc.addPage();
                addPageContent();
                y = 120;
            }
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text(dayTitle, contentX, y);
            y += titleHeight + 5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(20, 83, 45); // emerald-700
            doc.text(bodyLines, contentX, y);
            y += bodyHeight + 20;
        });

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
        <div className="min-h-screen bg-emerald-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-emerald-900 tracking-tight">Your Diet Plan</h1>
                        <p className="text-slate-500 mt-2">A 7-day holistic meal plan for <span className="font-semibold text-emerald-600">{formData.personalInfo.fullName}</span>.</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <motion.button whileTap={{ scale: 0.95 }} onClick={generatePDF} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-200/80 hover:bg-emerald-700 transition">
                            <DownloadIcon /> Download PDF
                        </motion.button>
                        <Link to="/" className="px-3 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-100 transition" title="Edit Form">✏️</Link>
                    </div>
                </header>

                <main className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">Loading your plan...</div>
                            ) : plan?.recommendedMeals?.length > 0 ? (
                                plan.recommendedMeals.map((day, i) => (
                                    <motion.article
                                        key={day.day}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                                        className="bg-white p-5 rounded-xl shadow-md border border-slate-200/80 hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
                                    >
                                        <h3 className="text-lg font-bold text-emerald-700 mb-4">Day {day.day}</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3"><BreakfastIcon /><p><span className="font-semibold text-slate-700">Breakfast:</span> {day.breakfast || "—"}</p></div>
                                            <div className="flex items-start gap-3"><LunchIcon /><p><span className="font-semibold text-slate-700">Lunch:</span> {day.lunch || "—"}</p></div>
                                            <div className="flex items-start gap-3"><DinnerIcon /><p><span className="font-semibold text-slate-700">Dinner:</span> {day.dinner || "—"}</p></div>
                                        </div>
                                    </motion.article>
                                ))
                            ) : (
                                <div className="p-8 text-center bg-white rounded-xl shadow-md text-slate-500">
                                    Could not find a diet plan. <Link to="/" className="text-emerald-600 font-semibold">Create a new one.</Link>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <aside className="relative">
                        <div className="sticky top-8">
                           <SummaryCard patient={formData} mealDistribution={mealLengths} />
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}

const SummaryCard = ({ patient, mealDistribution }) => {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white text-center">
                <h3 className="text-xl font-bold">Plan Summary</h3>
                <p className="text-sm text-emerald-200">Meal Distribution</p>
            </div>
            <div className="p-6 space-y-6">
                <DonutChart data={[
                    { name: 'Breakfast', value: mealDistribution.b, color: '#f59e0b' }, // amber-500
                    { name: 'Lunch', value: mealDistribution.l, color: '#14b8a6' }, // teal-500
                    { name: 'Dinner', value: mealDistribution.d, color: '#10b981' } // emerald-500
                ]} />
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"/>Breakfast</span><span className="font-semibold">{Math.round(mealDistribution.b)}%</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"/>Lunch</span><span className="font-semibold">{Math.round(mealDistribution.l)}%</span></div>
                    <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"/>Dinner</span><span className="font-semibold">{Math.round(mealDistribution.d)}%</span></div>
                </div>
                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 text-center">
                    <div>
                        <div className="text-xs text-slate-500">Age</div>
                        <div className="text-lg font-bold text-slate-800">{patient.calculated?.age || patient.personalInfo?.age || "-"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">BMI</div>
                        <div className="text-lg font-bold text-slate-800">{patient.calculated?.bmi || patient.vitals?.bmi || "-"}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DonutChart = ({ data }) => {
    const size = 150;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let total = 0;

    const paths = data.map(item => {
        const dashOffset = circumference * (1 - (total + item.value) / 100);
        total += item.value;
        return { ...item, dashOffset };
    }).reverse();

    return (
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
                <AnimatePresence>
                    {paths.map((p, i) => (
                        <motion.circle
                            key={p.name}
                            cx={size/2} cy={size/2} r={radius}
                            fill="none"
                            stroke={p.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: p.dashOffset }}
                            transition={{ duration: 0.8, ease: "easeInOut", delay: i * 0.15 }}
                        />
                    ))}
                </AnimatePresence>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-800">100%</span>
                <span className="text-sm font-medium text-slate-500">Total</span>
            </div>
        </div>
    );
};