import React from "react";
import { FaUserMd, FaPills, FaFileMedical, FaDisease, FaUser } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";

const Dashboard: React.FC = () => {
  return (
    <section className="w-4/5 grow bg-green-300 h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4">
      <header className="bg-green-500 text-white p-4 rounded-md">
        <h1 className="text-3xl font-bold">EMR Dashboard</h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
            <div className="flex items-center space-x-4">
              <FaUser className="text-4xl text-blue-500" />
              <div>
                <p className="text-xl">John Doe</p>
                <p className="text-gray-600">Age: 45</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Doctor Information</h2>
            <div className="flex items-center space-x-4">
              <FaUserMd className="text-4xl text-green-500" />
              <div>
                <p className="text-xl">Dr. Smith</p>
                <p className="text-gray-600">Cardiologist</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Medications</h2>
            <div className="flex items-center space-x-4">
              <FaPills className="text-4xl text-red-500" />
              <div>
                <p className="text-xl">Aspirin</p>
                <p className="text-gray-600">Dosage: 75mg</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Medical Reports</h2>
            <div className="flex items-center space-x-4">
              <FaFileMedical className="text-4xl text-purple-500" />
              <div>
                <p className="text-xl">Last Report</p>
                <p className="text-gray-600">Date: 2024-06-15</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Disease Information</h2>
            <div className="flex items-center space-x-4">
              <FaDisease className="text-4xl text-yellow-500" />
              <div>
                <p className="text-xl">Hypertension</p>
                <p className="text-gray-600">Diagnosed: 2020</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Medical Services</h2>
            <div className="flex items-center space-x-4">
              <MdMedicalServices className="text-4xl text-orange-500" />
              <div>
                <p className="text-xl">Service 1</p>
                <p className="text-gray-600">Description</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Dashboard;
