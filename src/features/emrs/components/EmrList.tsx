import React, { useCallback, useEffect, useState } from "react";
import { Button, Table, Loader } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { GiMedicalPack } from "react-icons/gi";
import { FiChevronDown, FiChevronRight, FiChevronUp } from "react-icons/fi";
import { notifications } from "@mantine/notifications";

import { useDeleteEmr } from "../api/delete-emr";
import useGetEmrs from "../api/get-all-emrs";
import useDebounce from "../../sharedHooks/debounce.hook";
import UpdateEmr from "../routes/UpdateEmr";

import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import { IEmr, IEmrDTO } from "../model/emr.model";
import SearchInput from "../../../components/reusable-components/SearchInput";
import Pagination1 from "../../../components/reusable-components/Patination1";

export const EmrList: React.FC = () => {
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

  const { data: emrs, error, refetch, isFetching } = useGetEmrs(query); 

  const mutationDelete = useDeleteEmr();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmrId, setSelectedEmrId] = useState<string | null>(null);
  const [selectedEmr, setSelectedEmr] = useState<IEmr | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleUpdate = useCallback((emr: IEmr) => {
    setSelectedEmr(emr);
    setUpdateModalOpen(true);
  }, []);

  const handleDelete = (id: string) => {
    setSelectedEmrId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = useCallback(() => {
    if (selectedEmrId) {
      mutationDelete.mutate(selectedEmrId, {
        onSuccess: () => {
          setPage(1);
          notifications.show({
            title: "Success",
            message: "EMR deleted successfully",
            color: "green",
            autoClose: 3000,
            icon: <IconTrash size={20} />,
          });
        },
        onError: (error) => {
          console.error("Error deleting EMR:", error);
        },
      });
    }
    setConfirmOpen(false);
    setSelectedEmrId(null);
  }, [selectedEmrId, mutationDelete]);

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

  if (error) {
    return <p>Error fetching EMR data: {error.message}</p>;
  }

  if (initialLoading) {
    return <div className="flex justify-center my-4">
            <Loader />
          </div>
  }

  const transformToDTO = (emr: IEmr): IEmrDTO => {
    return {
      ...emr,
      patients: emr.patients.map((patient) => patient._id),
      diseases: emr.diseases.map((disease) => disease._id),
      medicines: emr.medicines.map((medicine) => medicine._id),
    };
  };

  const rows =
    emrs?.data?.map((emr) => {
      const emrDiseases = emr?.diseases ?? [];
      const emrPatients = emr?.patients ?? [];
      const emrMedicines = emr?.medicines ?? [];
      return (
        <tr key={emr._id}>
          <td className="py-2 px-4">
            {emrDiseases.map((disease) => disease.name).join(", ")}
          </td>
          <td className="py-2 px-4">
            {emrPatients.map((patient) => patient.name).join(", ")}
          </td>
          <td className="py-2 px-4">
            {emrMedicines.map((medicine) => medicine.name).join(", ")}
          </td>
          <td className="py-2 px-4">{emr.notes}</td>
          <td className="py-2 px-4 w-24 whitespace-nowrap flex flex-col lg:flex-row gap-2">
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
        emr={transformToDTO(selectedEmr)}
        closeModal={() => setUpdateModalOpen(false)}
      />
    );
  }

  //--------------------------------------------------------------------------------------------------------------------------------

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <NavLink to="/emrs/create">
          <Button leftIcon={<GiMedicalPack size={18} />}>Add EMR</Button>
        </NavLink>
        <SearchInput
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
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
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("diseases.name")}
              >
                <span className="flex">
                  Disease {getSortIcon("diseases.name")}
                </span>
              </th>

              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("patients.name")}
              >
                <span className="flex">
                  Patient {getSortIcon("patients.name")}
                </span>
              </th>

              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("medicines.name")}
              >
                <span className="flex">
                  Medicine {getSortIcon("medicines.name")}
                </span>
              </th>

              <th className="py-2 px-4">Notes</th>
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
            Page {page} of {emrs?.totalPages}
          </div>
          <Pagination1
            total={emrs?.totalPages || 1}
            page={page}
            onChange={setPage}
          />
        </div>

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
