// src/components/PatientForm.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser, FiFileText, FiHeart, FiDroplet, FiPlus, FiUploadCloud, FiPaperclip, FiX, FiDownload
} from "react-icons/fi";
import { GiStomach, GiSpoon } from "react-icons/gi";
import { FaRulerVertical, FaWeight, FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import { db } from "../Firebase";
import { collection, addDoc, serverTimestamp ,doc, setDoc} from "firebase/firestore";
import axios from "axios"; 
import jsPDF from "jspdf";
import "jspdf-autotable";


// A reusable input field wrapper for consistent styling and animation
const InputField = ({ icon, label, children }) => (
  <div className="relative">
    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-500">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

const handleViewDietPlan = (patient) => {
  navigate("/diet-plan", { state: { patient } });
};

export default function PatientForm() {
  const [formData, setFormData] = useState({
    fullName: "", patientNumber: "", dob: "", age: "", gender: "Male", height: "", weight: "",
    bmi: "", prakriti: "pitta", conditions: "", meds: "", allergies: "", bp: "", bowel: "Normal",
    waterIntake: "", dietType: "Vegetarian", mealFreq: 3, foodProperties: [], testPref: [],
    goals: "",
  });

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-calculate Age from Date of Birth
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age > 0 ? age : "" }));
    }
  }, [formData.dob]);

  // Auto-calculate BMI from Height and Weight
  useEffect(() => {
    const heightM = parseFloat(formData.height) / 100;
    const weightKg = parseFloat(formData.weight);
    if (heightM > 0 && weightKg > 0) {
      const bmiValue = (weightKg / (heightM * heightM)).toFixed(2);
      setFormData(prev => ({ ...prev, bmi: bmiValue }));
    } else {
      setFormData(prev => ({ ...prev, bmi: "" }));
    }
  }, [formData.height, formData.weight]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentValues = prev[category];
      if (checked) {
        return { ...prev, [category]: [...currentValues, value] };
      } else {
        return { ...prev, [category]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const newFiles = [...e.dataTransfer.files];
    if (newFiles && newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }


  const [mealPlan, setMealPlan] = useState(null);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!formData.patientNumber) {
//     alert("Please enter a patient number");
//     return;
//   }

//   try {
//     // Reset the table while generating new chart
//     setMealPlan(null);

//     // Step 1: Save patient data in Firestore
//     const patientRef = collection(db, "patient");
//     const newPatient = await addDoc(patientRef, {
//       ...formData,
//       attachments: files.map(file => file.name),
//       createdAt: serverTimestamp(),
//     });

//     // Step 2: Call Gemini API to generate chart
//     const res = await axios.post("http://localhost:3000/generate", {
//       patientNumber: formData.patientNumber,
//     });

//     const generatedChart = res.data.response || "No chart generated.";

//     // Step 3: Parse the Gemini response as JSON for the table
//     let clean = generatedChart.replace(/```json|```/g, "").trim();
//     let jsonPlan;
//     try {
//       jsonPlan = JSON.parse(clean);
//     } catch (parseErr) {
//       console.error("Error parsing Gemini response:", parseErr);
//       jsonPlan = null;
//     }

//     // Step 4: Save Gemini response in Firestore under this patient
//     await addDoc(collection(db, "patient", newPatient.id, "charts"), {
//       chart: generatedChart,
//       createdAt: serverTimestamp(),
//     });

//     // Step 5: Update frontend state to display the table
//     setMealPlan(jsonPlan);

//     alert("✅ Patient data and chart saved successfully!");

//     // Reset form
//     setFormData({
//       fullName: "", patientNumber: "", dob: "", age: "", gender: "Male",
//       height: "", weight: "", bmi: "", prakriti: "pitta", conditions: "",
//       meds: "", allergies: "", bp: "", bowel: "Normal", waterIntake: "",
//       dietType: "Vegetarian", mealFreq: 3, foodProperties: [], testPref: [],
//       goals: "",
//     });
//     setFiles([]);

//   } catch (error) {
//     console.error("❌ Error adding patient:", error);
//     alert("Failed to save patient data!");
//   }
// };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.patientNumber) {
    alert("Please enter a patient number");
    return;
  }

  try {
    // Reset meal plan in UI
    setMealPlan(null);

    // Step 1: Save patient basic data
    const patientRef = collection(db, "patient");
    const newPatient = await addDoc(patientRef, {
      ...formData,
      attachments: files.map(file => file.name),
      createdAt: serverTimestamp(),
    });

    // Step 2: Call Gemini API to generate diet chart
    const res = await axios.post("http://localhost:3000/generate", {
      patientNumber: formData.patientNumber,
    });

    const generatedChart = res.data.response || "No chart generated.";

    // Step 3: Parse JSON from Gemini
    let clean = generatedChart.replace(/```json|```/g, "").trim();
    let jsonPlan = null;
    try {
      jsonPlan = JSON.parse(clean);
    } catch (parseErr) {
      console.error("Error parsing Gemini response:", parseErr);
      jsonPlan = null;
    }

    // Step 4: Save the diet plan under this patient in Firestore
    // Firestore allows storing arrays of objects, so jsonPlan works perfectly
    await setDoc(doc(db, "patient", newPatient.id), {
      ...formData,
      attachments: files.map(file => file.name),
      createdAt: serverTimestamp(),
      dietPlan: jsonPlan,  // <-- store the generated diet plan here
    });

    // Step 5: Update UI
    setMealPlan(jsonPlan);

    alert("✅ Patient data and diet chart saved successfully!");

    // Reset form
    setFormData({
      fullName: "",
      patientNumber: "",
      dob: "",
      age: "",
      gender: "Male",
      height: "",
      weight: "",
      bmi: "",
      prakriti: "pitta",
      conditions: "",
      meds: "",
      allergies: "",
      bp: "",
      bowel: "Normal",
      waterIntake: "",
      dietType: "Vegetarian",
      mealFreq: 3,
      foodProperties: [],
      testPref: [],
      goals: "",
    });
    setFiles([]);
  } catch (error) {
    console.error("❌ Error saving patient or diet chart:", error);
    alert("Failed to save patient data or diet chart!");
  }
};


const downloadPDF = () => {
  if (!mealPlan) return;

  // Initialize jsPDF
  const doc = new jsPDF();

  // Prepare table data
  const head = [["Day", "Breakfast", "Lunch", "Dinner"]];
  const body = Object.entries(mealPlan).map(([day, meals]) => [
    day,
    meals.breakfast.map(d => d.name).join(", "),
    meals.lunch.map(d => d.name).join(", "),
    meals.dinner.map(d => d.name).join(", "),
  ]);

  // Generate table
  autoTable(doc, {
    head,
    body,
    startY: 20,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [34, 197, 94] }, // green header
  });

  // Save PDF
  doc.save("meal-plan.pdf");
};



  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-800 dark:text-gray-100 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Background Blobs */}
      <motion.div className="absolute -left-40 -top-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40" style={{ background: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.28), rgba(16,185,129,0) 40%)" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity }} />
      <motion.div className="absolute -right-48 -bottom-40 w-[520px] h-[520px] rounded-full mix-blend-multiply filter blur-3xl opacity-30" style={{ background: "radial-gradient(circle at 80% 80%, rgba(34,197,94,0.28), rgba(34,197,94,0) 40%)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity }} />

      <main className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700 dark:text-green-300">New Patient Intake Form</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Enter the patient's details to generate a new health profile.</p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-green-100 dark:border-slate-800 rounded-2xl p-8 shadow-lg">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            
            {/* Section: Basic Information */}
            <motion.div variants={itemVariants} className="lg:col-span-3 border-b-2 border-green-200 dark:border-slate-700 pb-4 mb-2">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 flex items-center gap-3"><FiUser /> Basic Information</h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={<FiUser />} label="Full Name">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition" required />
              </InputField>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <InputField icon={<FiFileText />} label="Patient Number">
                <input type="text" name="patientNumber" value={formData.patientNumber} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition" required />
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={<FaBirthdayCake />} label="Date of Birth">
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition" required />
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={<FiUser />} label="Age (auto-calculated)">
                <input type="number" name="age" value={formData.age} readOnly className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm focus:outline-none" />
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Gender</label>
              <div className="flex gap-4 items-center bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                {["Male", "Female", "Other"].map(gender => (
                  <label key={gender} className={`flex-1 text-center cursor-pointer px-4 py-1.5 rounded-md transition ${formData.gender === gender ? 'bg-green-600 text-white shadow' : 'hover:bg-green-50 dark:hover:bg-slate-700'}`}>
                    <input type="radio" name="gender" value={gender} checked={formData.gender === gender} onChange={handleChange} className="sr-only" />
                    {gender}
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Section: Physical Metrics */}
            <motion.div variants={itemVariants} className="lg:col-span-3 border-b-2 border-green-200 dark:border-slate-700 pb-4 mb-2 mt-6">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 flex items-center gap-3"><FiHeart /> Physical Metrics</h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={<FaRulerVertical />} label="Height (cm)">
                <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition" />
              </InputField>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <InputField icon={<FaWeight />} label="Weight (kg)">
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition" />
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={<FiFileText />} label="BMI (auto-calculated)">
                <input type="text" name="bmi" value={formData.bmi} readOnly className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 shadow-sm focus:outline-none" />
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField icon={<FiDroplet />} label="Blood Pressure">
                <input type="text" name="bp" placeholder="e.g., 120/80 mmHg" value={formData.bp} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition" />
              </InputField>
            </motion.div>

            {/* Section: Medical & Lifestyle */}
            <motion.div variants={itemVariants} className="lg:col-span-3 border-b-2 border-green-200 dark:border-slate-700 pb-4 mb-2 mt-6">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 flex items-center gap-3"><GiStomach /> Medical & Lifestyle</h2>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1">
              <InputField icon={<FiHeart />} label="Existing Conditions">
                <textarea name="conditions" value={formData.conditions} onChange={handleChange} rows="3" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition"></textarea>
              </InputField>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1">
              <InputField icon={<FiPlus />} label="Medications">
                <textarea name="meds" value={formData.meds} onChange={handleChange} rows="3" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition"></textarea>
              </InputField>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1">
              <InputField icon={<FiPlus />} label="Allergies">
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="3" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 transition"></textarea>
              </InputField>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">Prakriti (Constitution)</label>
              <div className="flex gap-4 items-center bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
                {["Vata", "Pitta", "Kapha"].map(type => (
                  <label key={type} className={`flex-1 text-center cursor-pointer px-4 py-1.5 rounded-md transition ${formData.prakriti === type.toLowerCase() ? 'bg-green-600 text-white shadow' : 'hover:bg-green-50 dark:hover:bg-slate-700'}`}>
                    <input type="radio" name="prakriti" value={type.toLowerCase()} checked={formData.prakriti === type.toLowerCase()} onChange={handleChange} className="sr-only" />
                    {type}
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Section: Attachments */}
            <motion.div variants={itemVariants} className="lg:col-span-3 border-b-2 border-green-200 dark:border-slate-700 pb-4 mb-2 mt-6">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 flex items-center gap-3"><FiPaperclip /> Attachments</h2>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div 
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-green-500 bg-green-100/50 dark:bg-green-900/50' : 'border-gray-300 dark:border-slate-600 hover:border-green-400'}`}
              >
                <FiUploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  {isDragging ? "Drop files here" : "Drag & drop files here, or click to select"}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">PDF or JPG files accepted</p>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg" className="hidden" onChange={(e) => setFiles(prev => [...prev, ...e.target.files])} />
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Uploaded Files:</h3>
                  {files.map((file, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between bg-green-50 dark:bg-slate-800 p-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiFileText className="text-green-600 dark:text-green-300"/>
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                        <FiX className="text-red-500"/>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="lg:col-span-3 mt-8 flex justify-end">
              <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800">
                <FiPlus />
                Generate Chart
              </button>
            </motion.div>

          </motion.div>
        </form>
      </main>

      {mealPlan && (
        <div>
  <table className="w-full border-collapse border border-green-300 bg-white shadow-lg rounded-lg mt-6">
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
          <td className="border border-green-300 px-4 py-2 font-semibold text-green-700">{day}</td>
          {["breakfast", "lunch", "dinner"].map((mealType) => (
            <td key={mealType} className="border border-green-300 px-4 py-2">
              {meals[mealType].map((dish, i) => (
                <div key={i}>
                  <strong>{dish.name}</strong> ({dish.calories} kcal, {dish.protein}g protein)
                </div>
              ))}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>

 <button 
      onClick={downloadPDF} 
      className="flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      <FiDownload /> Download PDF
    </button>

</div>
  
)

}

    </div>
  );
}