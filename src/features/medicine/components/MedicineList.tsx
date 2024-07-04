import React, { useState } from "react";
import { useGetMedicines } from "../api/get-all-medicines";
import { Button, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useDeleteMedicine } from "../api/delete-medicine";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import CreateMedicine from "./CreateMedicine";
import { mapIdsToDiseases } from "../../patients/components/util";
import { IMedicine } from "../model/IMedicine";

import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { UpdateMedicine } from "./UpdateMedicine";
import Pagination from "../../../reusable-components/Pagination";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";

export const MedicineList: React.FC = () => {
  const { data, error, isLoading } = useGetMedicines();
  const mutationDelete = useDeleteMedicine();

  const {data: diseases,error: diseasesError,isLoading: diseasesLoading} = useGetDiseases();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [ selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(null);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 7;
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { active, setPage, next, previous } = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  if (isLoading || diseasesLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (diseasesError)
    return (
      <div>
        An error occurred while fetching diseases: {diseasesError.message}
      </div>
    );

  const filterMedicines = (medicines: IMedicine[]) => {
    return medicines.filter((medicine) => {
      const medicineDiseases = mapIdsToDiseases(
        (medicine.diseases ?? []).map((d) => d._id),
        diseases || []
      );
      // console.log("medicineDiseases :", {medicineDiseases}) ;
      const diseasesText = medicineDiseases
        .map((disease) => disease.name)
        .join(", ");

      return (
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.manufacturer.toString().includes(searchQuery) ||
        diseasesText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredData = filterMedicines(data || []);
  const currentData = filteredData.slice(
    (active - 1) * itemsPerPage,
    active * itemsPerPage
  );

  const handleDelete = (id: string) => {
    setSelectedMedicineId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMedicineId) {
      mutationDelete.mutate(selectedMedicineId);
    }
    setConfirmOpen(false);
    setSelectedMedicineId(null);
  };

  const handleUpdate = (medicine: IMedicine) => {
    setSelectedMedicine(medicine);
    setUpdateModalOpen(true);
  };

  const rows =
    currentData?.map((medicine) => {
      const medicineDiseases = mapIdsToDiseases(
        (medicine.diseases ?? []).map((d) => d._id),
        diseases || []
      );

      return (
        <tr key={medicine._id}>
          <td>{medicine.name}</td>
          <td>{medicine.manufacturer}</td>
          <td>{medicineDiseases.map((disease) => disease.name).join(", ")}</td>

          <td style={{ width: "10px", whiteSpace: "nowrap" }}>
            <Button
              className="text-white bg-red-600"
              onClick={() => handleDelete(medicine._id)}
            >
              <IconTrash size={16} />
            </Button>
            <Button
              className="text-black bg-yellow-300 mx-6"
              onClick={() => handleUpdate(medicine)}
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
        <CreateMedicine />
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
              <th>Manufacturer</th>
              <th>Diseases</th>
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
        {updateModalOpen && selectedMedicine && (
          <UpdateMedicine
            medicine={selectedMedicine}
            closeModal={() => setUpdateModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default MedicineList;
