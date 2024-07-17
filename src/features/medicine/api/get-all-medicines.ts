import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

//after updating

export interface GetMedicinesQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  noLimit?: boolean;
}


const fetchMedicines1 = async (query: GetMedicinesQuery): Promise<{ data: IMedicine[]; total: number; page: number; totalPages: number }> => {  
  
  const params = new URLSearchParams(query as any).toString();

 // console.log('params :',params)
  
  //const response = await fetch("https://emr-backend-intz.onrender.com/api/medicines");
  /* const apiUrl = import.meta.env.VITE_API_URL; 
  const response = await fetch(apiUrl+"api/medicines");
   */
  const response = await fetch(`http://localhost:9999/api/medicines?${params}`);
  
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch medicines");
  }
  return response.json();
};


interface CustomQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  keepPreviousData?: boolean;
}

export const useGetMedicines1 = (query: GetMedicinesQuery) => {
  //console.log('query inside useGetMedicines1', query);
  return useQuery({
    queryKey: ['medicines', query],
    queryFn: () => fetchMedicines1(query),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
  } as CustomQueryOptions<{ data: IMedicine[]; total: number; page: number; totalPages: number }, Error>);
};


