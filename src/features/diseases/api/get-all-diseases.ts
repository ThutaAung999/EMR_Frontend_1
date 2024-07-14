//Before update

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IDisease } from "../model/IDisease";

// Fetch diseases
export const fetchDiseases = async (): Promise<IDisease[]> => {
  console.log("fetchDiseases from frontend");

  const apiUrl = import.meta.env.VITE_API_URL;  

  const response = await fetch(apiUrl+"api/diseases");
  //const response = await fetch("http://localhost:9999/api/diseases");
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch diseases");
  }
  return response.json();
};

// Hook to get diseases
export const useGetDiseases = () => {
  return useQuery<IDisease[], Error>(
    {
      queryKey: ['diseases'],
      queryFn: fetchDiseases,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.message === "Rate limit exceeded" && failureCount < 3) {
          return true;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    } as UseQueryOptions<IDisease[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};

 

//------------------------------------------------------------------------------------------------
//After update

/* import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IDisease } from "../model/IDisease";
 */

export interface GetDiseasesQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  noLimit?: boolean;
}

const fetchDiseases1 = async (query: GetDiseasesQuery): Promise<{ data: IDisease[]; total: number; page: number; totalPages: number }> => {
  
  
  const params = new URLSearchParams(query as any).toString();
  
  const response = await fetch(`http://localhost:9999/api/diseases?${params}`);
  
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch diseases");
  }
  return response.json();
};


interface CustomQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  keepPreviousData?: boolean;
}

export const useGetDiseases1 = (query: GetDiseasesQuery) => {
  return useQuery({
    queryKey: ['diseases', query],
    queryFn: () => fetchDiseases1(query),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
  } as CustomQueryOptions<{ data: IDisease[]; total: number; page: number; totalPages: number }, Error>);
};




//-----------------------------------------------------------------------------------------------