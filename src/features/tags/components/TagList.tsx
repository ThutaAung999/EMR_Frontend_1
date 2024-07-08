import React, { useState } from "react";
import { useGetTags } from "../api/get-all-tags";
import { usePagination } from "@mantine/hooks";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { useDeleteTag } from "../api/delete-tag";
import { ConfirmDialog } from "../../../reusable-components/ConfirmDialog";
import { CreateTag } from "./CreateTag";
import Pagination from "../../../reusable-components/Pagination";
import { UpdateTag } from "./UpdateTag";
import { Button, Table, TextInput } from "@mantine/core";
import { ITag } from "../model/ITag";

const TagList: React.FC = () => {
  const { data: tags, error: tagsError, isLoading: tagsLoading } = useGetTags();
  const mutationDelete = useDeleteTag();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 7;
  const totalItems = tags?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { active, setPage, next, previous } = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  const filterTags = (tagsData: ITag[]) => {
    return tagsData.filter((tag) => {
      return tag.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const filteredData = filterTags(tags || []);
  const currentData = filteredData.slice(
    (active - 1) * itemsPerPage,
    active * itemsPerPage
  );

  if (tagsLoading) return <div>Loading...</div>;
  if (tagsError) return <div>Error</div>;
  if (!tags) return <div>No Tags</div>;

  const handleDelete = (id: string) => {
    setSelectedTagId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTagId) {
      mutationDelete.mutate(selectedTagId);
    }
    setConfirmOpen(false);
    setSelectedTagId(null);
  };

  const handleUpdate = (tag: ITag) => {
    setSelectedTag(tag);
    setUpdateModalOpen(true);
  };

  const rows =
    currentData?.map((tag) => {
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
