// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FaUserMd,
//   FaUtensils,
//   FaClipboardList,
//   FaChartPie,
//   FaPrint,
// } from "react-icons/fa";
// import { FiSearch, FiBell, FiLogOut, FiPlus, FiSun, FiMoon } from "react-icons/fi";
// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   const [active, setActive] = useState("overview");

//   // Theme (dark / light) persisted in localStorage
//   const [theme, setTheme] = useState(() => {
//     try {
//       return localStorage.getItem("theme") || "light";
//     } catch (e) {
//       return "light";
//     }
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     if (theme === "dark") {
//       root.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//     }

//     // Add a temporary class to animate the theme change smoothly
//     root.classList.add("theme-transition");
//     const t = setTimeout(() => root.classList.remove("theme-transition"), 350);

//     try {
//       localStorage.setItem("theme", theme);
//     } catch (e) {}

//     return () => clearTimeout(t);
//   }, [theme]);

//   const stats = [
//     { id: 1, title: "Active Patients", value: 128, delta: "+4%" },
//     { id: 2, title: "Active Diet Plans", value: 342, delta: "+1.2%" },
//     { id: 3, title: "Recipes", value: 1024, delta: "+0.8%" },
//     { id: 4, title: "Reports", value: 76, delta: "-0.5%" },
//   ];

//   const recentPatients = [
//     { name: "Rohit Sharma", age: 45, gender: "M", plan: "Balance Vata" },
//     { name: "Geeta Patel", age: 32, gender: "F", plan: "Kapha Light" },
//     { name: "Arjun Rao", age: 27, gender: "M", plan: "Pitta Calm" },
//     { name: "Sana Khan", age: 39, gender: "F", plan: "Digestive Care" },
//   ];

//   const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

//   return (
//     <div className="relative min-h-screen transition-colors duration-300 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-800 dark:text-gray-100 overflow-hidden">
//       {/* Floating background blobs */}
//       <motion.div
//         className="absolute -left-40 -top-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
//         style={{ background: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.28), rgba(16,185,129,0) 40%)" }}
//         animate={{ scale: [1, 1.15, 1] }}
//         transition={{ duration: 10, repeat: Infinity }}
//       />
//       <motion.div
//         className="absolute -right-48 -bottom-40 w-[520px] h-[520px] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
//         style={{ background: "radial-gradient(circle at 80% 80%, rgba(34,197,94,0.28), rgba(34,197,94,0) 40%)" }}
//         animate={{ scale: [1, 1.2, 1] }}
//         transition={{ duration: 12, repeat: Infinity }}
//       />

//       {/* Top bar */}
//       <motion.header
//         initial={{ y: -30, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="relative z-20 flex items-center justify-between px-6 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-green-100 dark:border-slate-800"
//       >
//         <div className="flex items-center gap-4">
//           <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Ayurvedic Diet Admin</h2>
//           <span className="text-sm text-gray-500 dark:text-gray-300">Doctor Dashboard</span>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <input
//               className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900"
//               placeholder="Search patients, recipes..."
//             />
//             <FiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
//           </div>

//           <button className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition">
//             <FiBell className="text-xl text-gray-600 dark:text-gray-300" />
//           </button>

//           {/* Theme toggle */}
//           <button
//             onClick={toggleTheme}
//             aria-pressed={theme === "dark"}
//             aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
//             title="Toggle theme"
//             className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition flex items-center"
//           >
//             {theme === "dark" ? (
//               <FiSun className="text-xl text-yellow-400" />
//             ) : (
//               <FiMoon className="text-xl text-gray-600" />
//             )}
//           </button>

//           <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
//             <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">DR</div>
//             <div className="text-sm">
//               <div className="font-medium text-gray-800 dark:text-gray-100">Dr. Patel</div>
//               <div className="text-xs text-gray-400 dark:text-gray-300">Administrator</div>
//             </div>
//           </div>

//           <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition">
//             <FiLogOut className="text-xl text-red-600" />
//           </button>
//         </div>
//       </motion.header>

//       <div className="relative z-10 flex gap-6 px-6 py-8">
//         {/* Sidebar */}
//         <aside className="w-64 hidden md:block">
//           <motion.nav
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-green-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
//           >
//             <ul className="space-y-1">
//               <li>
//                 <button
//                   onClick={() => setActive("overview")}
//                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
//                     active === "overview" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
//                   }`}
//                 >
//                   <FaChartPie />
//                   Overview
//                 </button>
//               </li>

//               <li>
//                 <Link
//                   to="/patients"
//                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
//                     active === "patients" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
//                   }`}
//                 >
//                   <FaUserMd />
//                   Patients
//                 </Link>
//               </li>

//               <li>
//                 <button
//                   onClick={() => setActive("plans")}
//                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
//                     active === "plans" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
//                   }`}
//                 >
//                   <FaUtensils />
//                   Diet Plans
//                 </button>
//               </li>

//               <li>
//                 <button
//                   onClick={() => setActive("reports")}
//                   className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
//                     active === "reports" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
//                   }`}
//                 >
//                   <FaClipboardList />
//                   Reports
//                 </button>
//               </li>
//             </ul>

//             <div className="mt-6">
//               <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transform transition">
//                 <FiPlus />
//                 New Diet Plan
//               </button>
//             </div>
//           </motion.nav>
//         </aside>

//         {/* Main content */}
//         <main className="flex-1">
//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.25 }}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
//           >
//             {stats.map((s, i) => (
//               <motion.div
//                 key={s.id}
//                 whileHover={{ y: -6 }}
//                 className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-5 shadow"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-sm text-gray-500 dark:text-gray-300">{s.title}</div>
//                     <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{s.value}</div>
//                   </div>
//                   <div className="text-sm text-green-600 font-semibold">{s.delta}</div>
//                 </div>

//                 {/* mini sparkline */}
//                 <div className="mt-4 h-8 flex items-end gap-1">
//                   {[3, 6, 2, 8, 5, 7, 4].map((h, idx) => (
//                     <div key={idx} className={`w-2 rounded`} style={{ height: `${h * 6}px`, background: `linear-gradient(180deg, rgba(34,197,94,1), rgba(34,197,94,0.35))` }} />
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left column - Recent patients & quick actions */}
//             <motion.section
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.35 }}
//               className="col-span-2"
//             >
//               <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-5 shadow">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Patients</h3>
//                   <div className="text-sm text-gray-500 dark:text-gray-300">Updated 2m ago</div>
//                 </div>

//                 <div className="divide-y">
//                   {recentPatients.map((p, idx) => (
//                     <div key={idx} className="py-3 flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-slate-700 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">{p.name.split(" ")[0][0]}</div>
//                         <div>
//                           <div className="font-medium text-gray-800 dark:text-gray-100">{p.name}</div>
//                           <div className="text-sm text-gray-400 dark:text-gray-300">Age: {p.age} • {p.gender}</div>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <div className="text-sm text-gray-500 dark:text-gray-300">{p.plan}</div>
//                         <button className="px-3 py-1 rounded-lg bg-green-50 dark:bg-slate-700 text-green-600 dark:text-green-300 text-sm font-medium hover:bg-green-100 dark:hover:bg-slate-600 transition">Open</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Diet Plan Generator */}
//               <div className="mt-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-5 shadow">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Auto Diet Chart Generator</h3>
//                   <div className="text-sm text-gray-500 dark:text-gray-300">AI Assisted • Ayurveda rules</div>
//                 </div>

//                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Generate a balanced, Ayurveda-aligned diet chart quickly for selected patient profiles. Customize tastes (Rasa), food properties (Hot/Cold), and caloric goals.</p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium shadow hover:scale-105 transition">
//                     <FaUtensils /> Generate for Selected
//                   </button>

//                   <button className="flex items-center gap-3 px-4 py-2 rounded-xl border border-green-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-green-600 dark:text-green-300 font-medium hover:bg-green-50 dark:hover:bg-slate-700 transition">
//                     <FaClipboardList /> Generate Template
//                   </button>
//                 </div>
//               </div>
//             </motion.section>

//             {/* Right column - Charts & Reports */}
//             <motion.aside
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//             	transition={{ delay: 0.45 }}
//             	className="space-y-6"
//           	>
//             	<div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-4 shadow">
//               	<div className="flex items-start justify-between gap-3">
//                 	<div>
//                   	<h4 className="text-sm text-gray-500 dark:text-gray-300">Weekly Intake Overview</h4>
//                   	<div className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-2">Calories · Rasa Distribution</div>
//                 	</div>

//                 	<div className="flex items-center gap-2">
//                   	<button className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition"><FaPrint className="text-gray-600 dark:text-gray-300" /></button>
//                 	</div>
//               	</div>

//               	{/* simple donut-like placeholder */}
//               	<div className="mt-4 flex items-center justify-center">
//                 	<div className="w-44 h-44 rounded-full bg-gradient-to-br from-green-100 to-white dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-inner">
//                   	<div className="w-28 h-28 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
//                     	<div className="text-sm text-gray-400 dark:text-gray-300">Avg Cal</div>
//                     	<div className="text-xl font-bold text-gray-800 dark:text-gray-100">2100</div>
//                   	</div>
//                 	</div>
//               	</div>
//             	</div>

//             	<div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-4 shadow">
//               	<h4 className="text-sm text-gray-500 dark:text-gray-300">Quick Reports</h4>
//               	<div className="mt-3 grid grid-cols-1 gap-3">
//                 	<button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 hover:shadow-md transition">
//                   	<div className="text-sm">
//                     	<div className="font-medium text-gray-800 dark:text-gray-100">Printable Diet Chart</div>
//                     	<div className="text-xs text-gray-400 dark:text-gray-300">Generate PDF handout for patients</div>
//                   	</div>
//                   	<div className="text-green-600 dark:text-green-300 font-semibold">Export</div>
//                 	</button>

//                 	<button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 hover:shadow-md transition">
//                   	<div className="text-sm">
//                     	<div className="font-medium text-gray-800 dark:text-gray-100">Patient Progress Report</div>
//                     	<div className="text-xs text-gray-400 dark:text-gray-300">Glimpse of compliance & outcomes</div>
//                   	</div>
//                   	<div className="text-green-600 dark:text-green-300 font-semibold">Open</div>
//                 	</button>
//               	</div>
//             	</div>
//           	</motion.aside>
//         	</div>

//         	{/* Footer / Credits */}
//         	<div className="mt-8 text-sm text-gray-400 dark:text-gray-300">© {new Date().getFullYear()} Ayurvedic Diet Advisor • Secure & Privacy-first</div>
//       	</main>
//     	</div>

//     	{/* inline animation styles (blob + theme transition) */}
//     	<style>
//       	{`@keyframes floaty { 0%{ transform: translateY(0px)} 50%{ transform: translateY(-12px)} 100%{ transform: translateY(0px)} }
//         	.floaty{ animation: floaty 6s ease-in-out infinite; }
//         	/* theme transition class: applied to <html> briefly to smooth colors */
//         	.theme-transition, .theme-transition * { transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease; }
//       	`}
//     	</style>
//   	</div>
// 	);
// }
















// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaUtensils,
  FaClipboardList,
  FaChartPie,
  FaPrint,
} from "react-icons/fa";
import { FiSearch, FiBell, FiLogOut, FiPlus, FiSun, FiMoon } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [active, setActive] = useState("overview");

  // Theme (dark / light) persisted in localStorage
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Add a temporary class to animate the theme change smoothly
    root.classList.add("theme-transition");
    const t = setTimeout(() => root.classList.remove("theme-transition"), 350);

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}

    return () => clearTimeout(t);
  }, [theme]);

  const stats = [
    { id: 1, title: "Active Patients", value: 128, delta: "+4%" },
    { id: 2, title: "Active Diet Plans", value: 342, delta: "+1.2%" },
    { id: 3, title: "Recipes", value: 1024, delta: "+0.8%" },
    { id: 4, title: "Reports", value: 76, delta: "-0.5%" },
  ];

  const recentPatients = [
    { name: "Rohit Sharma", age: 45, gender: "M", plan: "Balance Vata" },
    { name: "Geeta Patel", age: 32, gender: "F", plan: "Kapha Light" },
    { name: "Arjun Rao", age: 27, gender: "M", plan: "Pitta Calm" },
    { name: "Sana Khan", age: 39, gender: "F", plan: "Digestive Care" },
  ];

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="relative min-h-screen transition-colors duration-300 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-800 dark:text-gray-100 overflow-hidden">
      {/* Floating background blobs */}
      <motion.div
        className="absolute -left-40 -top-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.28), rgba(16,185,129,0) 40%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-48 -bottom-40 w-[520px] h-[520px] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle at 80% 80%, rgba(34,197,94,0.28), rgba(34,197,94,0) 40%)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Top bar */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-6 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-green-100 dark:border-slate-800"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Ayurvedic Diet Admin</h2>
          <span className="text-sm text-gray-500 dark:text-gray-300">Doctor Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900"
              placeholder="Search patients, recipes..."
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
          </div>

          <button className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition">
            <FiBell className="text-xl text-gray-600 dark:text-gray-300" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title="Toggle theme"
            className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition flex items-center"
          >
            {theme === "dark" ? (
              <FiSun className="text-xl text-yellow-400" />
            ) : (
              <FiMoon className="text-xl text-gray-600" />
            )}
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">DR</div>
            <div className="text-sm">
              <div className="font-medium text-gray-800 dark:text-gray-100">Dr. Patel</div>
              <div className="text-xs text-gray-400 dark:text-gray-300">Administrator</div>
            </div>
          </div>

          <button className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition">
            <FiLogOut className="text-xl text-red-600" />
          </button>
        </div>
      </motion.header>

      <div className="relative z-10 flex gap-6 px-6 py-8">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block">
          <motion.nav
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-green-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
          >
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActive("overview")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    active === "overview" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <FaChartPie />
                  Overview
                </button>
              </li>

              <li>
                <Link
                  to="/patients"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    active === "patients" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <FaUserMd />
                  Patients
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setActive("plans")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    active === "plans" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <FaUtensils />
                  Diet Plans
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActive("reports")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    active === "reports" ? "bg-green-600 text-white" : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <FaClipboardList />
                  Reports
                </button>
              </li>
            </ul>

            <div className="mt-6">
              <Link to="/add-patient" className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg hover:scale-105 transform transition">
                <FiPlus />
                New Diet Plan
              </Link>
            </div>
          </motion.nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.id}
                whileHover={{ y: -6 }}
                className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-5 shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{s.title}</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{s.value}</div>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">{s.delta}</div>
                </div>

                {/* mini sparkline */}
                <div className="mt-4 h-8 flex items-end gap-1">
                  {[3, 6, 2, 8, 5, 7, 4].map((h, idx) => (
                    <div key={idx} className={`w-2 rounded`} style={{ height: `${h * 6}px`, background: `linear-gradient(180deg, rgba(34,197,94,1), rgba(34,197,94,0.35))` }} />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Recent patients & quick actions */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="col-span-2"
            >
              <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-5 shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Patients</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Updated 2m ago</div>
                </div>

                <div className="divide-y">
                  {recentPatients.map((p, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-slate-700 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">{p.name.split(" ")[0][0]}</div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">{p.name}</div>
                          <div className="text-sm text-gray-400 dark:text-gray-300">Age: {p.age} • {p.gender}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500 dark:text-gray-300">{p.plan}</div>
                        <button className="px-3 py-1 rounded-lg bg-green-50 dark:bg-slate-700 text-green-600 dark:text-green-300 text-sm font-medium hover:bg-green-100 dark:hover:bg-slate-600 transition">Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet Plan Generator */}
              <div className="mt-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-5 shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Auto Diet Chart Generator</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-300">AI Assisted • Ayurveda rules</div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Generate a balanced, Ayurveda-aligned diet chart quickly for selected patient profiles. Customize tastes (Rasa), food properties (Hot/Cold), and caloric goals.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium shadow hover:scale-105 transition">
                    <FaUtensils /> Generate for Selected
                  </button>

                  <button className="flex items-center gap-3 px-4 py-2 rounded-xl border border-green-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-green-600 dark:text-green-300 font-medium hover:bg-green-50 dark:hover:bg-slate-700 transition">
                    <FaClipboardList /> Generate Template
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Right column - Charts & Reports */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-6"
            >
              <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-4 shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm text-gray-500 dark:text-gray-300">Weekly Intake Overview</h4>
                    <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-2">Calories · Rasa Distribution</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-slate-800 transition"><FaPrint className="text-gray-600 dark:text-gray-300" /></button>
                  </div>
                </div>

                {/* simple donut-like placeholder */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full bg-gradient-to-br from-green-100 to-white dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-inner">
                    <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-400 dark:text-gray-300">Avg Cal</div>
                      <div className="text-xl font-bold text-gray-800 dark:text-gray-100">2100</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-green-100 dark:border-slate-700 rounded-2xl p-4 shadow">
                <h4 className="text-sm text-gray-500 dark:text-gray-300">Quick Reports</h4>
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 hover:shadow-md transition">
                    <div className="text-sm">
                      <div className="font-medium text-gray-800 dark:text-gray-100">Printable Diet Chart</div>
                      <div className="text-xs text-gray-400 dark:text-gray-300">Generate PDF handout for patients</div>
                    </div>
                    <div className="text-green-600 dark:text-green-300 font-semibold">Export</div>
                  </button>

                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 hover:shadow-md transition">
                    <div className="text-sm">
                      <div className="font-medium text-gray-800 dark:text-gray-100">Patient Progress Report</div>
                      <div className="text-xs text-gray-400 dark:text-gray-300">Glimpse of compliance & outcomes</div>
                    </div>
                    <div className="text-green-600 dark:text-green-300 font-semibold">Open</div>
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>

          {/* Footer / Credits */}
          <div className="mt-8 text-sm text-gray-400 dark:text-gray-300">© {new Date().getFullYear()} Ayurvedic Diet Advisor • Secure & Privacy-first</div>
        </main>
      </div>

      {/* inline animation styles (blob + theme transition) */}
      <style>
        {`@keyframes floaty { 0%{ transform: translateY(0px)} 50%{ transform: translateY(-12px)} 100%{ transform: translateY(0px)} }
          .floaty{ animation: floaty 6s ease-in-out infinite; }
          /* theme transition class: applied to <html> briefly to smooth colors */
          .theme-transition, .theme-transition * { transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease; }
        `}
      </style>
    </div>
  );
}