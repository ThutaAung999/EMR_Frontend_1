import React, { useCallback, useEffect, useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button, Loader, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FiChevronDown, FiChevronRight, FiChevronUp } from "react-icons/fi";

import { useGetTags1 } from "../api/get-all-tags";
import { useDeleteTag } from "../api/delete-tag";
import useDebounce from "../../sharedHooks/debounce.hook";


import { CreateTag } from "./CreateTag";
import { UpdateTag } from "./UpdateTag";
import SearchInput from "../../../components/reusable-components/SearchInput";

import { ITag } from "../model/ITag";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import Pagination1 from "../../../components/reusable-components/Patination1";

const TagList: React.FC = () => {

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
    data: tags,
    error,
    isFetching,
    refetch,
} = useGetTags1(query);

  const mutationDelete = useDeleteTag();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  
  const [initialLoading, setInitialLoading] = useState(true);

  const handleDelete = (id: string) => {
    setSelectedTagId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = useCallback(() => {
    if (selectedTagId) {
      mutationDelete.mutate(selectedTagId, {
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
    setSelectedTagId(null);
  }, [selectedTagId, mutationDelete]);

  
  const handleUpdate = useCallback((tag: ITag) => {
    setSelectedTag(tag);
    setUpdateModalOpen(true);
  },[]);


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


  
  if (error) return <div>Error</div>;
  if (initialLoading) {
    return <p>Loading...</p>;
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

    tags?.data?.map((tag) => {
      return (
        <tr key={tag._id}>
          <td className="py-2 px-4">{tag.name}</td>
          <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              onClick={() => handleDelete(tag._id)}
            >
              <IconTrash size={16} />
            </Button>
            <Button
              className="text-white bg-yellow-500 hover:bg-yellow-400"
              onClick={() => handleUpdate(tag)}
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
        <CreateTag />
        <SearchInput
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="h-full w-full">
        <Table striped highlightOnHover verticalSpacing="md" className="bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
                <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <span className="flex">Name {getSortIcon("name")}</span>
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
            Page {page} of {tags?.totalPages}
          </div>
          <Pagination1
            total={tags?.totalPages || 1}
            page={page}
            onChange={setPage}
          />
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        {updateModalOpen && selectedTag && (
          <UpdateTag
            tag={selectedTag as ITag}
            closeModal={() => setUpdateModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default TagList;
