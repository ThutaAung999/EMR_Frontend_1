import React, { useState } from "react";
import { Button, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useDeleteEmr } from "../api/delete-emr";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import { NavLink } from "react-router-dom";
import {
  mapIdsToDiseases,
  mapIdsToPatients,
  mapIdsToMedicines,
} from "../../patients/components/util";
import { IEmr, IEmrDTO } from "../model/emr.model"; // Import IEmrDTO
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import Pagination from "../../../reusable-components/Pagination";

import { useGetDiseases } from "../../diseases/api/get-all-diseases";
import useGetEmrs from "../api/get-all-emrs";
import { useGetMedicines } from "../../medicine/api/get-all-medicines";
import useGetPatients from "../../patients/api/get-all-patients";
import UpdateEmr from "../routes/UpdateEmr";


import { GiMedicalPack } from "react-icons/gi";

export const EmrList: React.FC = () => {
  const { data, error, isLoading } = useGetEmrs();
  const {
    data: diseases,
    error: diseasesError,
    isLoading: diseasesLoading,
  } = useGetDiseases();
  const {
    data: medicines,
    error: medicinesError,
    isLoading: medicinesLoading,
  } = useGetMedicines();
  const {
    data: patients,
    error: patientsError,
    isLoading: patientsLoading,
  } = useGetPatients();

  const mutationDelete = useDeleteEmr();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmrId, setSelectedEmrId] = useState<string | null>(null);

  const [selectedEmr, setSelectedEmr] = useState<IEmr | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { active, setPage, next, previous } = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  if (isLoading || diseasesLoading || patientsLoading || medicinesLoading)
    return <div>Loading...</div>;
  if (error || diseasesError || patientsError || medicinesError)
    return <div>Error occurred </div>;

  const filterEmrs = (emrs: IEmr[]) => {
    return emrs.filter((emr) => {
      const emrDiseases = mapIdsToDiseases(
        (emr.diseases ?? []).map((d) => d._id),
        diseases || []
      );
      const emrMedicines = mapIdsToMedicines(
        (emr.medicines ?? []).map((d) => d._id),
        medicines || []
      );
      const emrPatients = mapIdsToPatients(
        (emr.patients ?? []).map((d) => d._id),
        patients || []
      );

      const diseasesText = emrDiseases
        .map((disease) => disease.name)
        .join(", ");
      const medicinesText = emrMedicines
        .map((doctor) => doctor.name)
        .join(", ");

      const patientsText = emrPatients
        .map((disease) => disease.name)
        .join(", ");

      return (
        emr.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diseasesText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicinesText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patientsText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredData = filterEmrs(data || []);
  const currentData = filteredData.slice(
    (active - 1) * itemsPerPage,
    active * itemsPerPage
  );

  const handleDelete = (id: string) => {
    setSelectedEmrId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => { 
    if (selectedEmrId) {
      mutationDelete.mutate(selectedEmrId);
    }
    setConfirmOpen(false);
    setSelectedEmrId(null);
  };

  const handleUpdate = (emr: IEmr) => {
    setSelectedEmr(emr);
    setUpdateModalOpen(true);
  };

  // Helper function to transform IEmr to IEmrDTO
  const transformToDTO = (emr: IEmr): IEmrDTO => {
    return {
      ...emr,
      patients: emr.patients.map((patient) => patient._id),
      diseases: emr.diseases.map((disease) => disease._id),
      medicines: emr.medicines.map((medicine) => medicine._id),
    };
  };

  const rows =
    currentData?.map((emr) => {
      const emrDiseases = mapIdsToDiseases(
        (emr.diseases ?? []).map((d) => d._id),
        diseases || []
      );

      const emrMedicines = mapIdsToMedicines(
        (emr.medicines ?? []).map((d) => d._id),
        medicines || []
      );

      const emrPatients = mapIdsToPatients(
        (emr.patients ?? []).map((d) => d._id),
        patients || []
      );

      return (
        <tr key={emr._id}>
          <td>{emrDiseases.map((disease) => disease.name).join(", ")}</td>
          <td>{emrMedicines.map((medicine) => medicine.name).join(", ")}</td>
          <td>{emrPatients.map((patient) => patient.name).join(", ")}</td>
          <td>{emr.notes}</td>
          <td style={{ width: "10px", whiteSpace: "nowrap" }}>
            <Button
              className="text-white bg-red-600"
              onClick={() => handleDelete(emr._id)}
            >
              <IconTrash size={16} />
            </Button>
            <Button
              className="text-black bg-yellow-300 mx-6"
              onClick={() => handleUpdate(emr)}
            >
              <IconEdit size={16} />
            </Button>
          </td>
        </tr>
      );
    }) || [];

  if (updateModalOpen && selectedEmr) {
    return (
      <UpdateEmr
        emr={transformToDTO(selectedEmr)} // Transform to IEmrDTO
        closeModal={() => setUpdateModalOpen(false)}
      />
    );
  }

  return (
    <section className="h-full w-full">
      <div className="flex flex-row justify-between items-start min-w-full">
        <NavLink to="/emrs/create">
        <Button  leftIcon={<GiMedicalPack size={18} />}>
          Add EMR
          </Button>
        </NavLink>
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
              <th>Diseases</th>
              <th>Medicines</th>
              <th>Patients</th>
              <th>Notes</th>
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
      </div>
    </section>
  );
};

export default EmrList;
