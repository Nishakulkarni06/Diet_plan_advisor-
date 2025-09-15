// src/pages/Patients/PatientList.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

/**
 * PatientList.jsx
 * - Client-side mock data + filtering/pagination
 * - Replace MOCK with API fetch (use react-query / axios) when ready
 */

const MOCK_PATIENTS = Array.from({ length: 28 }).map((_, i) => {
  const names = ["Rohit Sharma","Geeta Patel","Arjun Rao","Sana Khan","Priya Singh","Amit Deshmukh","Leela Nair","Karan Mehta"];
  const plans = ["Balance Vata","Kapha Light","Pitta Calm","Digestive Care","Detox Plan"];
  const genders = ["M","F"];
  return {
    id: `p-${i+1}`,
    name: names[i % names.length] + (i > 7 ? ` ${i}` : ""),
    age: 25 + (i % 30),
    gender: genders[i % 2],
    plan: plans[i % plans.length],
    rasa: ["Sweet","Sour","Bitter","Astringent","Pungent","Salty"][i % 6],
  };
});

export default function PatientList() {
  const [query, setQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const uniquePlans = useMemo(() => {
    return Array.from(new Set(MOCK_PATIENTS.map(p => p.plan)));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PATIENTS.filter(p => {
      if (genderFilter !== "all" && p.gender !== genderFilter) return false;
      if (planFilter !== "all" && p.plan !== planFilter) return false;
      if (!q) return true;
      return (`${p.name} ${p.plan} ${p.rasa}`).toLowerCase().includes(q);
    });
  }, [query, genderFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  function gotoPage(n) {
    setPage(Math.max(1, Math.min(totalPages, n)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Patients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Search, filter and open patient profiles quickly.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/patients/new" className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md">+ New Patient</Link>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="relative">
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, plan or rasa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
        </div>

        <select
          value={genderFilter}
          onChange={e => { setGenderFilter(e.target.value); setPage(1); }}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <option value="all">All genders</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>

        <select
          value={planFilter}
          onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        >
          <option value="all">All plans</option>
          {uniquePlans.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageData.map(p => (
          <motion.div
            key={p.id}
            whileHover={{ y: -6 }}
            className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-gray-100 dark:border-slate-700 rounded-2xl p-4 shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-slate-700 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-lg">
                  {p.name.split(" ")[0][0]}
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{p.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Age: {p.age} • {p.gender}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-300 mt-2">Rasa: <span className="font-medium text-gray-700 dark:text-gray-100">{p.rasa}</span></div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-green-600 dark:text-green-300 font-semibold">{p.plan}</div>
                <div className="flex gap-2">
                  <Link to={`/patients/${p.id}`} className="px-3 py-1 rounded-md bg-green-50 dark:bg-slate-700 text-green-600 dark:text-green-300 text-sm">Open</Link>
                  <button className="px-3 py-1 rounded-md border text-sm" onClick={() => alert(`Quick Plan for ${p.name} (mock)`)}>
                    Quick Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} patients
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => gotoPage(1)} disabled={page === 1} className="px-3 py-1 rounded-md border disabled:opacity-50">First</button>
          <button onClick={() => gotoPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded-md border disabled:opacity-50">Prev</button>
          <div className="px-3 py-1 border rounded-md bg-white dark:bg-slate-800">{page} / {totalPages}</div>
          <button onClick={() => gotoPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded-md border disabled:opacity-50">Next</button>
          <button onClick={() => gotoPage(totalPages)} disabled={page === totalPages} className="px-3 py-1 rounded-md border disabled:opacity-50">Last</button>
        </div>
      </div>
    </div>
  );
}
