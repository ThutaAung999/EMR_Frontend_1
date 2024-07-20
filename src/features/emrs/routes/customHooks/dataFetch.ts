
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BaseTypeForPagination } from '../../../utilForFeatures/basePropForPagination';

const fetchData = async (url: string, params: BaseTypeForPagination) => {
  const { data } = await axios.get(url, { params });
  return data;
};

export const useDiseases = (params: BaseTypeForPagination) => 
  useQuery({
    queryKey: ['diseases', params],
    queryFn: () => fetchData('/api/diseases', params)
  });

export const useMedicines = (params: BaseTypeForPagination) => 
  useQuery({
    queryKey: ['medicines', params],
    queryFn: () => fetchData('/api/medicines', params)
  });

export const usePatients = (params: BaseTypeForPagination) => 
  useQuery({
    queryKey: ['patients', params],
    queryFn: () => fetchData('/api/patients', params)
  });

export const useTags = (params: BaseTypeForPagination) => 
  useQuery({
    queryKey: ['tags', params],
    queryFn: () => fetchData('/api/tags', params)
  });
