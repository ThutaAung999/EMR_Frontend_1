import React from "react";
import { NavItem } from "../App";
import Dashboard from "../components/dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PatientList from "../features/patients/components/PatientList";
import DiseaseList from "../features/diseases/components/DiseaseList";
import MedicineList from "../features/medicine/components/MedicineList";
import { EmrList } from "../features/emrs/components/EmrList";
import { Route, Routes } from "react-router-dom";
import TagList from "../features/tags/components/TagList";
import CreatePatient from "../features/patients/components/CreatePatient";
import CreateEmr from "../features/emrs/routes/CreateEmr";
import CreateEmrForm from "../features/emrs/routes/CreateEmr/CreateEmrForm";
import Signup from "../features/auth/routes/Signup";
import Login from "../features/auth/routes/Login";
import ProtectedRoute from "../features/auth/providers/ProtectRoute";

const Main: React.FC<{ activeNavIndex: number; navItems: NavItem[] }> = ({
  activeNavIndex,
  navItems,
}) => {
  return (
    <section className="flex-grow h-screen overflow-auto flex flex-col justify-between items-center">
      <Header />

      <div className="w-full flex-grow flex flex-col justify-start items-center gap-2 p-4">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* 
          <Route path="/" element={<Dashboard />} /> */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/create"
            element={
              <ProtectedRoute>
                <CreatePatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <MedicineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diseases"
            element={
              <ProtectedRoute>
                <DiseaseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emrs"
            element={
              <ProtectedRoute>
                <EmrList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emrs/create"
            element={
              <ProtectedRoute>
                <CreateEmr />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/emrs/create" element={<CreateEmrForm />} /> */}

          <Route
            path="/tags"
            element={
              <ProtectedRoute>
                <TagList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </section>
  );
};

export default Main;
