import React, { useState, useCallback, useEffect } from "react";
import { useGetMedicines1 } from "../api/get-all-medicines";
import { useDeleteMedicine } from "../api/delete-medicine";
import { IMedicine } from "../model/IMedicine";
import { Button, Table } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import CreateMedicine from "./CreateMedicine";
import UpdateMedicine from "./UpdateMedicine";
import Pagination1 from "../../../components/reusable-components/Patination1";
import useDebounce from "../../sharedHooks/debounce.hook";
import { notifications } from "@mantine/notifications";
import { FiChevronDown, FiChevronRight, FiChevronUp } from "react-icons/fi";
import SearchInput from "../../../components/reusable-components/SearchInput";

const MedicineList: React.FC = () => {

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const query = {
    page,
    limit,
    search: debouncedSearchQuery,
    sortBy,
    sortOrder,
  };


  const {
    data: medicines,
    error,
    isLoading,
    refetch,
  } = useGetMedicines1(query);

  /* if(medicines){
    console.log('medicines :',medicines?.data)
  }
 */

  const mutationDelete = useDeleteMedicine();


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleDelete = useCallback((id: string) => {
    setSelectedMedicineId(id);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedMedicineId) {
      mutationDelete.mutate(selectedMedicineId, {
        onSuccess: () => {
          setPage(1);
          notifications.show({
            title: "Success",
            message: "Medicine deleted successfully",
            color: "green",
            autoClose: 3000,
            icon: <IconTrash size={20} />,
          });
        },
        onError: (error) => {
          console.error("Error deleting medicine:", error);
        },
      });
    }
    setConfirmOpen(false);
    setSelectedMedicineId(null);
  }, [selectedMedicineId, mutationDelete]);

  const handleUpdate = useCallback((medicine: IMedicine) => {
    setSelectedMedicine(medicine);
    setUpdateModalOpen(true);
  }, []);

  const handleSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(column);
        setSortOrder("asc");
      }
    },
    [sortBy, sortOrder]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setPage(1);
    },
    []
  );

  useEffect(() => {
    refetch();
  }, [page, limit, debouncedSearchQuery, sortBy, sortOrder, refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching medicines: {error.message}</div>;

  const getSortIcon = (column: string) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? (
        <FiChevronUp size={16} />
      ) : (
        <FiChevronDown size={16} />
      );
    }
    return <FiChevronRight size={16} />;
  };

  //-----------------------------------------------------------

  const rows =
    medicines?.data?.map((medicine) => {
      const medicineDiseases = medicine?.diseases ?? [];
      //console.log('medicineDiseases :',medicineDiseases);
      return (
        <tr key={medicine._id}>
          <td className="py-2 px-4">{medicine.name}</td>
          <td className="py-2 px-4">{medicine.manufacturer}</td>
          <td className="py-2 px-4">
            {medicineDiseases.map((disease) => disease.name).join(", ")}
          </td>
          <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              onClick={() => handleDelete(medicine._id)}
            >
              <IconTrash size={16} />
            </Button>
            <Button
              className="text-white bg-yellow-500 hover:bg-yellow-400"
              onClick={() => handleUpdate(medicine)}
            >
              <IconEdit size={16} />
            </Button>
          </td>
        </tr>
      );
    }) || [];

  //-----------------------------------------------------------

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateMedicine />
        <SearchInput
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="h-full w-full">
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          className="bg-white shadow-sm rounded-lg"
        >
          <thead className="bg-gray-200">
            <tr>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <span className="flex">Name {getSortIcon("name")}</span>
              </th>

              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("manufacturer")}
              >
                <span className="flex">
                  Manufacturer {getSortIcon("manufacturer")}
                </span>
              </th>

              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("diseases")}
              >
                <span className="flex">Diseases {getSortIcon("diseases")}</span>
              </th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <div>
            Page {page} of {medicines?.totalPages}
          </div>

          <Pagination1
            total={medicines?.totalPages || 1}
            page={page}
            onChange={setPage}
          />
        </div>

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
