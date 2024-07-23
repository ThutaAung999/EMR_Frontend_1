import React, { useCallback, useEffect, useState } from "react";
import { Button, Table } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { FiChevronDown, FiChevronRight, FiChevronUp } from "react-icons/fi";

import { useDeletePatient } from "../api/delete-patients";
import useDebounce from "../../sharedHooks/debounce.hook";
import useGetPatients1 from "../api/get-all-patients";

import CreatePatient from "./CreatePatient";
import UpdatePatient from "./UpdatePatient";
import { IPatient } from "../model/IPatient";

import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import SearchInput from "../../../components/reusable-components/SearchInput";
import Pagination1 from "../../../components/reusable-components/Patination1";

export const PatientList: React.FC = () => {
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

  const { data: patients, error, isLoading, refetch } = useGetPatients1(query);

  const mutationDelete = useDeletePatient();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const handleDelete = useCallback((id: string) => {
    setSelectedPatientId(id);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedPatientId) {
      mutationDelete.mutate(selectedPatientId, {
        onSuccess: () => {
          setPage(1);
          notifications.show({
            title: "Success",
            message: "Patient deleted successfully",
            color: "green",
            autoClose: 3000,
            icon: <IconTrash size={20} />,
          });
        },
        onError: (error) => {
          console.error("Error deleting patient:", error);
        },
      });
    }
    setConfirmOpen(false);
    setSelectedPatientId(null);
  }, [selectedPatientId, mutationDelete]);

  const handleUpdate = useCallback((patient: IPatient) => {
    setSelectedPatient(patient);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const rows = patients?.data?.map((patient) => {
    const patientDiseases = patient?.diseases ?? [];
    const patientDoctors = patient.doctors ?? [];

    return (
      <tr key={patient._id}>
        <td className="py-2 px-4">{patient.name}</td>
        <td className="py-2 px-4">{patient.age}</td>
        <td className="py-2 px-4">
          {patientDiseases.map((disease) => disease.name).join(", ")}
        </td>
        <td className="py-2 px-4">
          {patientDoctors.map((doctor) => doctor.name).join(", ")}
        </td>
        <td className="py-2 px-4 w-24 whitespace-nowrap flex flex-col lg:flex-row gap-2">
          <Button
            className="text-white bg-red-600 hover:bg-red-500"
            onClick={() => handleDelete(patient._id)}
          >
            <IconTrash size={16} />
          </Button>
          <Button
            className="text-white bg-yellow-500 hover:bg-yellow-400"
            onClick={() => handleUpdate(patient)}
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
        <CreatePatient />
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
                onClick={() => handleSort("age")}
              >
                <span className="flex">Age {getSortIcon("age")}</span>
              </th>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("diseases")}
              >
                <span className="flex">Diseases {getSortIcon("diseases")}</span>
              </th>
              <th className="py-2 px-4">Doctors</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <div>
            Page {page} of {patients?.totalPages}
          </div>
          <Pagination1
            total={patients?.totalPages || 1}
            page={page}
            onChange={setPage}
          />
        </div>

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
