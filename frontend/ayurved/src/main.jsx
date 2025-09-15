// src/main.jsx (or index.js)
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/Patients/PatientList";
import PatientForm from "./pages/PatientForm"; // 1. Import the new component

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/add-patient" element={<PatientForm />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);