import React, { useState } from "react";
import { useGetMedicines } from "../api/get-all-medicines";
import { Button, Table, TextInput } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { useDeleteMedicine } from "../api/delete-medicine";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import { mapIdsToDiseases } from "../../patients/components/util";
import { IMedicine } from "../model/IMedicine";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import UpdateMedicine from "./UpdateMedicine";
import Pagination from "../../../reusable-components/Pagination";
import { useGetDiseases } from "../../diseases/api/get-all-diseases";
import CreateMedicine from "./CreateMedicine";

export const MedicineList: React.FC = () => {
  const { data, error, isLoading } = useGetMedicines();
  const mutationDelete = useDeleteMedicine();

  const { data: diseases, error: diseasesError, isLoading: diseasesLoading } = useGetDiseases();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(null);
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
  if (diseasesError) return <div>An error occurred while fetching diseases: {diseasesError.message}</div>;

  const filterMedicines = (medicines: IMedicine[]) => {
    return medicines.filter((medicine) => {
      const medicineDiseases = mapIdsToDiseases(
        (medicine.diseases ?? []).map((d) => d._id),
        diseases || []
      );
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

  const rows = currentData?.map((medicine) => {
    const medicineDiseases = mapIdsToDiseases(
      (medicine.diseases ?? []).map((d) => d._id),
      diseases || []
    );

    return (
      <tr key={medicine._id}>
        <td className="py-2 px-4">{medicine.name}</td>
        <td className="py-2 px-4">{medicine.manufacturer}</td>
        <td className="py-2 px-4">{medicineDiseases.map((disease) => disease.name).join(", ")}</td>
        <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
          <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(medicine._id)}>
            <IconTrash size={16} />
          </Button>
          <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(medicine)}>
            <IconEdit size={16} />
          </Button>
        </td>
      </tr>
    );
  }) || [];

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
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
        <Table striped highlightOnHover verticalSpacing="md" className="bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Manufacturer</th>
              <th className="py-2 px-4">Diseases</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <Pagination active={active} totalPages={totalPages} setPage={setPage} next={next} previous={previous} />

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedMedicine && (
          <UpdateMedicine medicine={selectedMedicine} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default MedicineList;
