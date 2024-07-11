import React, { useState } from "react";
import { Button, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useDeleteEmr } from "../api/delete-emr";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import { NavLink } from "react-router-dom";

import { IEmr, IEmrDTO } from "../model/emr.model"; // Import IEmrDTO
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import Pagination from "../../../components/reusable-components/Pagination";

import useGetEmrs from "../api/get-all-emrs";
import UpdateEmr from "../routes/UpdateEmr";

import { GiMedicalPack } from "react-icons/gi";


export const EmrList: React.FC = () => {
  
  const { data, error, isLoading } = useGetEmrs();
  
  
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

  if (error) {
    return <p>Error fetching emr data: {error.message}</p>;
  }
  if(isLoading) {
    return <p>Loading...</p>;
  }

  const filterEmrs = (emrs: IEmr[]) => {
    return emrs.filter((emr) => {
      
      const emrDiseases = emr.diseases ?? [];
      const emrMedicines = emr.medicines ?? [];
      const emrPatients = emr.patients ?? [];

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
      const emrDiseases = emr.diseases ??[];
      const emrMedicines = emr.medicines || [];
      const emrPatients = emr.patients || [];

// Adjusted JSX for table row
return (
  <tr key={emr._id}>
    <td className="py-2 px-4">{emrDiseases.map((disease) => disease.name).join(", ")}</td>
    <td className="py-2 px-4">{emrMedicines.map((medicine) => medicine.name).join(", ")}</td>
    <td className="py-2 px-4">{emrPatients.map((patient) => patient.name).join(", ")}</td>
    <td className="py-2 px-4">{emr.notes}</td>
    <td className="py-2 px-4 whitespace-nowrap flex flex-wrap gap-2">
      <Button
        className="text-white bg-red-600 hover:bg-red-500"
        onClick={() => handleDelete(emr._id)}
      >
        <IconTrash size={16} />
      </Button>
      <Button
        className="text-white bg-yellow-500 hover:bg-yellow-400"
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
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex flex-row justify-between items-start min-w-full">
        <NavLink to="/emrs/create">
          <Button leftIcon={<GiMedicalPack size={18} />}>Add EMR</Button>
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

      <div className="h-full w-full overflow-x-auto">
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          className="bg-white shadow-sm rounded-lg"
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Diseases</th>
              <th className="py-2 px-4">Medicines</th>
              <th className="py-2 px-4">Patients</th>
              <th className="py-2 px-4">Notes</th>
              <th className="py-2 px-4">Action</th>
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
