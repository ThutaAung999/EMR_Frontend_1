import React, { useState } from "react";
import { useGetDiseases } from "../api/get-all-diseases";
import { usePagination } from "@mantine/hooks";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { useDeleteDisease } from "../api/delete-disease";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import { CreateDisease } from "./CreateDisease";
import Pagination from "../../../reusable-components/Pagination";
import UpdateDisease from "./UpdateDisease";
import { Button, Table, TextInput } from "@mantine/core";
import { IDisease } from "../model/IDisease";

const DiseaseList: React.FC = () => {
  const { data: diseasesData, error: diseasesError, isLoading: diseasesLoading } = useGetDiseases();
  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 7;
  const totalItems = diseasesData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { active, setPage, next, previous } = usePagination({ total: totalPages, initialPage: 1 });

  // Search and pagination logic
  const filterDiseases = (diseasesData: IDisease[]) => {
    return diseasesData.filter((disease) => {
      return (
        disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.description.toString().includes(searchQuery)
      );
    });
  };
  const filteredData = filterDiseases(diseasesData || []);
  const currentData = filteredData.slice((active - 1) * itemsPerPage, active * itemsPerPage);

  if (diseasesLoading) return <div>Loading...</div>;
  if (diseasesError) return <div>Error</div>;
  if (!diseasesData) return <div>No Diseases</div>;

  const handleDelete = (id: string) => {
    setSelectedDiseaseId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDiseaseId) {
      mutationDelete.mutate(selectedDiseaseId);
    }
    setConfirmOpen(false);
    setSelectedDiseaseId(null);
  };

  const handleUpdate = (disease: IDisease) => {
    setSelectedDisease(disease);
    setUpdateModalOpen(true);
  };

  const rows =
    currentData?.map((disease) => {
      return (
        <tr key={disease._id}>
          <td className="py-2 px-4">{disease.name}</td>
          <td className="py-2 px-4">{disease.description}</td>
          <td className="py-2 px-4 w-24 whitespace-nowrap flex   gap-2">
            <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(disease._id)}>
              <IconTrash size={16} />
            </Button>
            <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(disease)}>
              <IconEdit size={16} />
            </Button>
          </td>
        </tr>
      );
    }) || [];

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateDisease />
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
          <thead className="bg-gray-200"    >
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <Pagination active={active} totalPages={totalPages} setPage={setPage} next={next} previous={previous} />

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedDisease && (
          <UpdateDisease disease={selectedDisease} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
