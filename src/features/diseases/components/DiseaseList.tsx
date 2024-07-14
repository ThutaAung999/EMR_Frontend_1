/*  import React, { useState } from "react";
import { useGetDiseases1 } from "../api/get-all-diseases";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { useDeleteDisease } from "../api/delete-disease";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import { CreateDisease } from "./CreateDisease";
import UpdateDisease from "./UpdateDisease";
import { Button, Table, TextInput } from "@mantine/core";
import { IDisease } from "../model/IDisease";

import Pagination1 from "../../../components/reusable-components/Patination1";

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const { data, error, isLoading } = useGetDiseases1({ page, limit, search: searchQuery, sortBy, sortOrder });

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

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

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

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
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('description')}>Description</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((disease) => (
              <tr key={disease._id}>
                <td className="py-2 px-4">{disease.name}</td>
                <td className="py-2 px-4">{disease.description}</td>
                <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
                  <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(disease._id)}>
                    <IconTrash size={16} />
                  </Button>
                  <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(disease)}>
                    <IconEdit size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-end mt-4">
          <Pagination1 total={data?.totalPages || 1} page={page} onChange={setPage} />
        </div>

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedDisease && (
          <UpdateDisease disease={selectedDisease} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
 */


//This is worded version
/* 
import React, { useState, useCallback } from "react";
import { useGetDiseases1 } from "../api/get-all-diseases";
import { useDeleteDisease } from "../api/delete-disease";
import { IDisease } from "../model/IDisease";
import { Button, Table, TextInput } from "@mantine/core";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import { CreateDisease } from "./CreateDisease";
import UpdateDisease from "./UpdateDisease";
import Pagination1 from "../../../components/reusable-components/Patination1";

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const query = { page, limit, search: searchQuery, sortBy, sortOrder };
  const { data, error, isLoading } = useGetDiseases1(query);

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
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
          // Refetch the data after successful deletion
          setPage(1); // Optionally reset to page 1 after deletion
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

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to page 1 when search query changes
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateDisease />
        <TextInput
          className="w-80"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          mb="md"
          icon={<IconSearch size={16} />}
          autoFocus
        />
      </div>

      <div className="h-full w-full">
        <Table striped highlightOnHover verticalSpacing="md" className="bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('description')}>Description</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((disease) => (
              <tr key={disease._id}>
                <td className="py-2 px-4">{disease.name}</td>
                <td className="py-2 px-4">{disease.description}</td>
                <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
                  <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(disease._id)}>
                    <IconTrash size={16} />
                  </Button>
                  <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(disease)}>
                    <IconEdit size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-end mt-4">
          <Pagination1 total={data?.totalPages || 1} page={page} onChange={setPage} />
        </div>

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedDisease && (
          <UpdateDisease disease={selectedDisease} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
 */


/* import React, { useState, useCallback } from "react";
import { useGetDiseases1 } from "../api/get-all-diseases";
import { useDeleteDisease } from "../api/delete-disease";
import { IDisease } from "../model/IDisease";
import { Button, Table, TextInput } from "@mantine/core";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import { CreateDisease } from "./CreateDisease";
import UpdateDisease from "./UpdateDisease";
import Pagination1 from "../../../components/reusable-components/Patination1";

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const query = { page, limit, search: searchQuery, sortBy, sortOrder };
  const { data, error, isLoading } = useGetDiseases1(query);

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
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

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); 
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateDisease />
        <TextInput
          className="w-80"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          mb="md"
          icon={<IconSearch size={16} />}
          autoFocus
        />
      </div>

      <div className="h-full w-full">
        <Table striped highlightOnHover verticalSpacing="md" className="bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('description')}>Description</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((disease) => (
              <tr key={disease._id}>
                <td className="py-2 px-4">{disease.name}</td>
                <td className="py-2 px-4">{disease.description}</td>
                <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
                  <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(disease._id)}>
                    <IconTrash size={16} />
                  </Button>
                  <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(disease)}>
                    <IconEdit size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-end mt-4">
          <Pagination1 total={data?.totalPages || 1} page={page} onChange={setPage} />
        </div>

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedDisease && (
          <UpdateDisease disease={selectedDisease} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
 */


import React, { useState, useCallback, useEffect } from "react";
import { useGetDiseases1 } from "../api/get-all-diseases";
import { useDeleteDisease } from "../api/delete-disease";
import { IDisease } from "../model/IDisease";
import { Button, Table, TextInput } from "@mantine/core";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { ConfirmDialog } from "../../../components/reusable-components/ConfirmDialog";
import { CreateDisease } from "./CreateDisease";
import UpdateDisease from "./UpdateDisease";
import Pagination1 from "../../../components/reusable-components/Patination1";

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const [searchLoading, setSearchLoading] = useState(false);

  const query = { page, limit, search: searchQuery, sortBy, sortOrder };
  const { data, error, isLoading, refetch } = useGetDiseases1(query);

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
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

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); 
    setSearchLoading(true); // Set search loading to true
  }, []);

  useEffect(() => {
    if (searchQuery) {
      refetch().then(() => setSearchLoading(false)); // Refetch and set search loading to false after data is fetched
    }
  }, [searchQuery, refetch]);

  if (isLoading && !searchLoading) return <div>Loading...</div>; // Display loading only if not during search
  if (error) return <div>Error</div>;

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateDisease />
        <TextInput
          className="w-80"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          mb="md"
          icon={<IconSearch size={16} />}
          autoFocus
        />
      </div>

      <div className="h-full w-full">
        <Table striped highlightOnHover verticalSpacing="md" className="bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('description')}>Description</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((disease) => (
              <tr key={disease._id}>
                <td className="py-2 px-4">{disease.name}</td>
                <td className="py-2 px-4">{disease.description}</td>
                <td className="py-2 px-4 w-24 whitespace-nowrap flex gap-2">
                  <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(disease._id)}>
                    <IconTrash size={16} />
                  </Button>
                  <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(disease)}>
                    <IconEdit size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-end mt-4">
          <Pagination1 total={data?.totalPages || 1} page={page} onChange={setPage} />
        </div>

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {updateModalOpen && selectedDisease && (
          <UpdateDisease disease={selectedDisease} closeModal={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;






//with react-table 

/* 
import React, { useState, useMemo } from 'react';
import { useGetDiseases } from '../api/get-all-diseases';
import { useDeleteDisease } from '../api/delete-disease';
import { ConfirmDialog } from '../../../components/reusable-components/ConfirmDialog';
import { CreateDisease } from './CreateDisease';
import UpdateDisease from './UpdateDisease';
import { Button, TextInput, Pagination } from '@mantine/core';
import { IDisease } from '../model/IDisease';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const { data, error, isLoading } = useGetDiseases({ page, limit, search: searchQuery, sortBy, sortOrder });

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => (
          <div className="flex gap-2">
            <Button className="text-white bg-red-600 hover:bg-red-500" onClick={() => handleDelete(row.original._id)}>
              <IconTrash size={16} />
            </Button>
            <Button className="text-white bg-yellow-500 hover:bg-yellow-400" onClick={() => handleUpdate(row.original)}>
              <IconEdit size={16} />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const dataMemo = useMemo(() => data?.data || [], [data]);

  const table = useReactTable({
    data: dataMemo,
    columns,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
      globalFilter: searchQuery,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSortedDesc() ? ' ▼' : ' ▲') : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                <span className="font-medium">{table.getPageCount()}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {selectedDisease && (
          <UpdateDisease disease={selectedDisease} open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
 */


//with mantine datatable
/* 
import React, { useState, useMemo } from 'react';
import { useGetDiseases } from '../api/get-all-diseases';
import { useDeleteDisease } from '../api/delete-disease';
import { ConfirmDialog } from '../../../components/reusable-components/ConfirmDialog';
import { CreateDisease } from './CreateDisease';
import UpdateDisease from './UpdateDisease';
import { Button, TextInput, Pagination, Table, Group } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IDisease } from '../model/IDisease';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const { data, error, isLoading } = useGetDiseases({ page, limit, search: searchQuery, sortBy, sortOrder });

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { accessor: 'name', header: 'Name' },
      { accessor: 'description', header: 'Description' },
      {
        accessor: '_id',
        header: 'Action',
        render: ({ row }: { row: any }) => (
          <Group spacing="xs">
            <Button color="red" onClick={() => handleDelete(row._id)}>
              <IconTrash size={16} />
            </Button>
            <Button color="yellow" onClick={() => handleUpdate(row)}>
              <IconEdit size={16} />
            </Button>
          </Group>
        ),
      },
    ],
    []
  );

  const dataMemo = useMemo(() => data?.data || [], [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateDisease />
        <TextInput
          className="w-80"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<IconSearch size={16} />}
        />
      </div>

      <div className="h-full w-full">
        <DataTable
          columns={columns}
          data={dataMemo}
          pagination={{
            pageIndex: page - 1,
            pageSize: limit,
            onPageChange: setPage,
            total: data?.totalPages * limit,
          }}
          onSortChange={(sort) => {
            setSortBy(sort?.[0]?.id);
            setSortOrder(sort?.[0]?.desc ? 'desc' : 'asc');
          }}
        />

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {selectedDisease && (
          <UpdateDisease disease={selectedDisease} open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
 */

/* 

import React, { useState, useMemo } from 'react';
import { useGetDiseases } from '../api/get-all-diseases';
import { useDeleteDisease } from '../api/delete-disease';
import { ConfirmDialog } from '../../../components/reusable-components/ConfirmDialog';
import { CreateDisease } from './CreateDisease';
import UpdateDisease from './UpdateDisease';
import { Button, TextInput, Pagination, Table, Group } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IDisease } from '../model/IDisease';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const { data, error, isLoading } = useGetDiseases({ page, limit, search: searchQuery, sortBy, sortOrder });

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { accessor: 'name', header: 'Name' },
      { accessor: 'description', header: 'Description' },
      {
        accessor: '_id',
        header: 'Action',
        render: ({ row }: { row: any }) => (
          <Group spacing="xs">
            <Button color="red" onClick={() => handleDelete(row._id)}>
              <IconTrash size={16} />
            </Button>
            <Button color="yellow" onClick={() => handleUpdate(row)}>
              <IconEdit size={16} />
            </Button>
          </Group>
        ),
      },
    ],
    []
  );

  const dataMemo = useMemo(() => data?.data || [], [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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

  return (
    <section className="h-full w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <CreateDisease />
        <TextInput
          className="w-80"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<IconSearch size={16} />}
        />
      </div>

      <div className="h-full w-full">
        <DataTable
          data={dataMemo}
          columns={columns}
          pagination={{
            page: page - 1,
            perPage: limit,
            controlsPosition: 'default',
            onPageChange: setPage,
            items: data?.totalPages * limit || 0,
          }}
          sorting={{ field: sortBy, order: sortOrder }}
          onSort={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
        />

        <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
        {selectedDisease && (
          <UpdateDisease disease={selectedDisease} open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default DiseaseList;
 */

/* 
import React, { useState, useMemo } from 'react';
import { useGetDiseases } from '../api/get-all-diseases';
import { useDeleteDisease } from '../api/delete-disease';
import { ConfirmDialog } from '../../../components/reusable-components/ConfirmDialog';
import { CreateDisease } from './CreateDisease';
import UpdateDisease from './UpdateDisease';
import { Button, TextInput, Pagination, Table } from '@mantine/core';
import { IDisease } from '../model/IDisease';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';

const DiseaseList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();

  const { data, error, isLoading } = useGetDiseases({ page, limit, search: searchQuery, sortBy, sortOrder });

  const mutationDelete = useDeleteDisease();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<IDisease | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { name: 'Name', key: 'name' },
      { name: 'Description', key: 'description' },
      {
        name: 'Action',
        render: (row: { original: IDisease }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              color="red"
              size="xs"
              onClick={() => handleDelete(row.original._id)}
              icon={<IconTrash size={16} />}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              color="yellow"
              size="xs"
              onClick={() => handleUpdate(row.original)}
              icon={<IconEdit size={16} />}
            >
              Edit
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const dataMemo = useMemo(() => data?.data || [], [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
        <Table striped borderless className="min-w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataMemo.map((row) => (
              <tr key={row._id}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <Pagination
            total={data?.totalPages * limit || 0}
            page={page}
            limit={limit}
            onChange={setPage}
            withGoTo
            maxPages={5}
          />

          <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleConfirmDelete} />
          {selectedDisease && (
            <UpdateDisease disease={selectedDisease} open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default DiseaseList;
 */