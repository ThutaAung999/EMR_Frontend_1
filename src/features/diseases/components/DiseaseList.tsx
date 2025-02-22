import React, { useState, useCallback, useEffect } from "react";
import { useGetDiseases1 } from "../api/get-all-diseases";
import { useDeleteDisease } from "../api/delete-disease";
import { IDisease } from "../model/IDisease";
import { Button, Loader, Table } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import CreateDisease from "./CreateDisease";
import UpdateDisease from "./UpdateDisease";
import Pagination1 from "../../../components/reusable-components/Patination1";
import useDebounce from "../../sharedHooks/debounce.hook";
import SearchInput from "../../../components/reusable-components/SearchInput";
import { notifications } from "@mantine/notifications";
import { FiChevronDown, FiChevronRight, FiChevronUp } from "react-icons/fi";

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();

  const [initialLoading, setInitialLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const query = {
    page,
    limit,
    search: debouncedSearchQuery,
    sortBy,
    sortOrder,
  };

  const { data: diseases, error, refetch, isFetching } = useGetDiseases1(query);
  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(
    null
  );
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  
  const handleDelete = useCallback((id: string) => {
    setSelectedDiseaseId(id);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedDiseaseId) {
      mutationDelete.mutate(selectedDiseaseId, {
        onSuccess: () => {
          setPage(1);
          notifications.show({
            title: "Success",
            message: "Disease deleted successfully",
            color: "green",
            autoClose: 3000,
            icon: <IconTrash size={20} />,
          });
        },
        onError: (error) => {
          console.error("Error deleting disease:", error);
        },
      });
    }
    setConfirmOpen(false);
    setSelectedDiseaseId(null);
  }, [selectedDiseaseId, mutationDelete]);

  const handleUpdate = useCallback((disease: IDisease) => {
    setSelectedDisease(disease);
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
    refetch().then(() => {
      setInitialLoading(false);
    });
  }, [page, limit, debouncedSearchQuery, sortBy, sortOrder, refetch]);

  if (error) return <div>Error fetching diseases: {error.message}</div>;

  if (initialLoading) {
    return (
      <div className="flex justify-center my-4">
        <Loader />
      </div>
    );
  }

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

  const rows =
    diseases?.data?.map((disease) => {
      return (
        <tr key={disease._id}>
          <td className="py-2 px-4">{disease.name}</td>
          <td className="py-2 px-4">{disease.description}</td>

          <td className="py-2 px-4 w-24 whitespace-nowrap flex flex-col lg:flex-row gap-2">
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              onClick={() => handleDelete(disease._id)}
            >
              <IconTrash size={16} />
            </Button>
            <Button
              className="text-white bg-yellow-500 hover:bg-yellow-400"
              onClick={() => handleUpdate(disease)}
            >
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
                onClick={() => handleSort("description")}
              >
                <span className="flex">
                  Description {getSortIcon("description")}
                </span>
              </th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        {isFetching ? (
          <div className="flex justify-center my-4">
            <Loader />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center my-4">No data found</p>
        ) : null}

        <div className="flex justify-between items-center mt-4">
          <div>
            Page {page} of {diseases?.totalPages}
          </div>
          <Pagination1
            total={diseases?.totalPages || 1}
            page={page}
            onChange={setPage}
          />
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        {updateModalOpen && selectedDisease && (
          <UpdateDisease
            disease={selectedDisease}
            closeModal={() => setUpdateModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
