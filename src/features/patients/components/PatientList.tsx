import React, { useState } from "react";
import useGetPatients from "../api/get-all-patients";
import { Button, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useDeletePatient } from "../api/delete-patients";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import CreatePatient from "./CreatePatient";
import { mapIdsToDiseases, mapIdsToDoctors } from "./util";
import { IPatient } from "../model/IPatient";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import UpdatePatient from "./UpdatePatient";
import Pagination from "../../../reusable-components/Pagination";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";
import { useGetDoctors } from "../../doctors/api/get-all-doctors";

export const PatientList: React.FC = () => {

  const { data, error, isLoading } = useGetPatients();
  const mutationDelete = useDeletePatient();

  const { data: diseases, error: diseasesError, isLoading: diseasesLoading } = useGetDiseases();
  const { data: doctors, error: doctorsError, isLoading: doctorsLoading } = useGetDoctors();

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

  if (isLoading || diseasesLoading || doctorsLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (diseasesError) return <div>An error occurred while fetching diseases: {diseasesError.message}</div>;
  if (doctorsError) return <div>An error occurred while fetching doctors: {doctorsError.message}</div>;

  const filterPatients = (patients: IPatient[]) => {
    return patients.filter((patient) => {
      const patientDiseases = mapIdsToDiseases(
        (patient.diseases ?? []).map((d) => d._id),
        diseases || []
      );
      const patientDoctors = mapIdsToDoctors(
        (patient.doctors ?? []).map((d) => d._id),
        doctors || []
      );

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
  const currentData = filteredData.slice(
    (active - 1) * itemsPerPage,
    active * itemsPerPage
  );

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
    const patientDiseases = mapIdsToDiseases(
      (patient.diseases ?? []).map((d) => d._id),
      diseases || []
    );
    const patientDoctors = mapIdsToDoctors(
      (patient.doctors ?? []).map((d) => d._id),
      doctors || []
    );

    return (
      <tr key={patient._id}>
        <td>{patient.name}</td>
        <td>{patient.age}</td>
        <td>{patientDiseases.map((disease) => disease.name).join(", ")}</td>
        <td>{patientDoctors.map((doctor) => doctor.name).join(", ")}</td>
        <td style={{ width: "10px", whiteSpace: "nowrap" }}>
          <Button
            className="text-white bg-red-600"
            onClick={() => handleDelete(patient._id )}
          >
            <IconTrash size={16} />
          </Button>
          <Button
            className="text-black bg-yellow-300 mx-6"
            onClick={() => handleUpdate(patient)}
          >
            <IconEdit size={16} />
          </Button>
        </td>
      </tr>
    );
  }) || [];

  return (
    <section className="h-full w-full">
      <div className="flex flex-row justify-between items-start min-w-full">
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
        <Table striped highlightOnHover verticalSpacing="md">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Diseases</th>
              <th>Doctors</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <Pagination
          active={active}
          totalPages={totalPages}
          setPage={setPage}
          next={next}
          previous={previous}
        />
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        {updateModalOpen && selectedPatient && (
          <UpdatePatient
            patient={selectedPatient}
            closeModal={() => setUpdateModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default PatientList;
