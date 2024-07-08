import React from "react";
import { FaUserMd, FaPills, FaFileMedical, FaDisease, FaUser } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
      },
    }),
  };

  return (
    <section className="w-4/5 grow bg-green-300 h-screen overflow-y-auto flex flex-col justify-start items-center gap-2 p-4">
      <header className="bg-green-500 text-white p-4 rounded-md">
        <h1 className="text-3xl font-bold">EMR Dashboard</h1>
      </header>
      <main className="container mx-auto p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Patient Information",
              icon: <FaUser className="text-4xl text-blue-500" />,
              details: (
                <>
                  <p className="text-xl">Daw Mya</p>
                  <p className="text-gray-600">Age: 45</p>
                </>
              ),
            },
            {
              title: "Doctor Information",
              icon: <FaUserMd className="text-4xl text-green-500" />,
              details: (
                <>
                  <p className="text-xl">Dr. Aung Naing</p>
                  <p className="text-gray-600">Cardiologist</p>
                </>
              ),
            },
            {
              title: "Medications",
              icon: <FaPills className="text-4xl text-red-500" />,
              details: (
                <>
                  <p className="text-xl">Aspirin</p>
                  <p className="text-gray-600">Dosage: 75mg</p>
                </>
              ),
            },
            {
              title: "Medical Reports",
              icon: <FaFileMedical className="text-4xl text-purple-500" />,
              details: (
                <>
                  <p className="text-xl">Last Report</p>
                  <p className="text-gray-600">Date: 2024-06-15</p>
                </>
              ),
            },
            {
              title: "Disease Information",
              icon: <FaDisease className="text-4xl text-yellow-500" />,
              details: (
                <>
                  <p className="text-xl">Hypertension</p>
                  <p className="text-gray-600">Diagnosed: 2020</p>
                </>
              ),
            },
            {
              title: "Medical Services",
              icon: <MdMedicalServices className="text-4xl text-orange-500" />,
              details: (
                <>
                  <p className="text-xl">Service 1</p>
                  <p className="text-gray-600">Description</p>
                </>
              ),
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md min-h-[200px]"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
              <div className="flex items-center space-x-4">
                {item.icon}
                <div>{item.details}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Dashboard;
