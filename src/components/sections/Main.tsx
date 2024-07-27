import React, { Suspense, lazy } from "react";
import { NavItem } from "../../constants/nav-items";
import Header from "../Header";
import Footer from "../Footer";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../../features/auth/providers/ProtectRoute";
import { Loader } from "@mantine/core";

const Dashboard = lazy(() => import("../dashboard"));
const PatientList = lazy(
  () => import("../../features/patients/components/PatientList")
);
const DiseaseList = lazy(
  () => import("../../features/diseases/components/DiseaseList")
);
const MedicineList = lazy(
  () => import("../../features/medicine/components/MedicineList")
);
const EmrList = lazy(() => import("../../features/emrs/components/EmrList"));
const TagList = lazy(() => import("../../features/tags/components/TagList"));
const CreatePatient = lazy(
  () => import("../../features/patients/components/CreatePatient")
);
const CreateEmr = lazy(() => import("../../features/emrs/routes/CreateEmr"));
const Signup = lazy(() => import("../../features/auth/routes/Signup"));
const Login = lazy(() => import("../../features/auth/routes/Login"));

const Main: React.FC<{ activeNavIndex: number; navItems: NavItem[] }> = () => {
  return (
    <section className="flex-grow h-screen overflow-auto flex flex-col justify-between items-center">
      <Header />

      <div className="w-full flex-grow flex flex-col justify-start items-center gap-2 p-4">
        <Suspense
          fallback={
            <div className="flex justify-center my-4">
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
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
            <Route
              path="/tags"
              element={
                <ProtectedRoute>
                  <TagList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </section>
  );
};

export default Main;
