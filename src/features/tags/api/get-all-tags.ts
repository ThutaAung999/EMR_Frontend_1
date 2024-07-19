
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ITag } from "../model/ITag";


export interface GetTagsQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  noLimit?: boolean;
}

export const fetchTags1 = async (query:GetTagsQuery):
Promise<{ data: ITag[]; total: number; page: number; totalPages: number }> => {
  console.log("fetchTags from frontend");

  //const apiUrl = import.meta.env.VITE_API_URL;  
  //const response = await fetch(apiUrl+"api/tags");

  //const response = await fetch("https://emr-backend-intz.onrender.com/api/tags");
  
  const params = new URLSearchParams(
    Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();


  const response = await fetch(`http://localhost:9999/api/tags?${params}`);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};

interface CustomQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  keepPreviousData?: boolean;
}

export const useGetTags1 = (query:GetTagsQuery) => {
  return useQuery({
    queryKey: ['tags', query],
    queryFn: () => fetchTags1(query),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
  } as CustomQueryOptions<{ data: ITag[]; total: number; page: number; totalPages: number }, Error>);
};
