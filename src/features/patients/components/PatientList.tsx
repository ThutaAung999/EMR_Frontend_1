import React, { useState } from "react";
import useGetPatients from "../api/get-all-patients";
import { Button, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useDeletePatient } from "../api/delete-patients";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import CreatePatient from "./CreatePatient";

import { IPatient } from "../model/IPatient";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import UpdatePatient from "./UpdatePatient";
import Pagination from "../../../reusable-components/Pagination";

export const PatientList: React.FC = () => {
  const { data, error, isLoading } = useGetPatients();
  const mutationDelete = useDeletePatient();


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 7;
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { active, setPage, next, previous } = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  if (isLoading ) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
 
  const filterPatients = (patients: IPatient[]) => {
    return patients.filter((patient) => {

      const patientDiseases =patient.diseases ?? [];
      const patientDoctors=patient.doctors ?? [];

      
      const diseasesText = patientDiseases
        .map((disease) => disease.name)
        .join(", ");
      const doctorsText = patientDoctors
        .map((doctor) => doctor.name)
        .join(", ");

      return (
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.age.toString().includes(searchQuery) ||
        diseasesText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctorsText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredData = filterPatients(data || []);
  const currentData = filteredData.slice((active - 1) * itemsPerPage, active * itemsPerPage);

  const handleDelete = (id: string) => {
    setSelectedPatientId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPatientId) {
      mutationDelete.mutate(selectedPatientId);
    }
    setConfirmOpen(false);
    setSelectedPatientId(null);
  };

  const handleUpdate = (patient: IPatient) => {
    setSelectedPatient(patient);
    setUpdateModalOpen(true);
  };

  const rows = currentData?.map((patient) => {
    const patientDiseases = patient.diseases ?? [] ;
      
    const patientDoctors = patient.doctors ?? [] ;

    return (
      <tr key={patient._id}>
        <td className="py-2 px-4">{patient.name}</td>
        <td className="py-2 px-4">{patient.age}</td>
        <td className="py-2 px-4">{patientDiseases.map((disease) => disease.name).join(", ")}</td>
        <td className="py-2 px-4">{patientDoctors.map((doctor) => doctor.name).join(", ")}</td>
        <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
            <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(patient._id)}>
            <IconTrash size={16} />
          </Button>
          <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(patient)}>
            <IconEdit size={16} />
          </Button>
        </td>
      </tr>
    );
  }) || [];

  return (
      <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreatePatient />
        <TextInput
          className="w-80"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb="md"
          icon={<IconSearch size={16} />}
        />
      </div>

      <div className="h-full w-full">
        <Table striped highlightOnHover verticalSpacing="md" className="bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Age</th>
              <th className="py-2 px-4">Diseases</th>
              <th className="py-2 px-4">Doctors</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <Pagination active={active} totalPages={totalPages} setPage={setPage} next={next} previous={previous} />

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedPatient && (
          <UpdatePatient patient={selectedPatient} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default PatientList;
