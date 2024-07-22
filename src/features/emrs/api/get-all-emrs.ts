import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {BaseTypeForPagination} from '../../utilForFeatures/basePropForPagination';
import { IEmr } from '../model/emr.model';

export const fetchEmrs = async (query:BaseTypeForPagination): 
        Promise<
            {
                data:IEmr[];
                total:number;
                page:number;
                totalPages: number;
              }
                > => {
  console.log("fetchEmrs from frontend");

  const params = new URLSearchParams(
    Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  //const apiUrl = import.meta.env.VITE_API_URL;  

  //const response = await fetch('https://emr-backend-intz.onrender.com/api/emrs');
  //const response = await fetch(apiUrl+'api/emrs');
  const response = await fetch(`http://localhost:9999/api/emrs?${params}`);
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error('Fail to fetch emrs');
  }
  return response.json();
};


interface CustomQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  keepPreviousData?: boolean;
}

const useGetEmrs = (query: BaseTypeForPagination) => {

  return useQuery(
    {
      queryKey: ['emrs',query],
      queryFn:()=> fetchEmrs(query),
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      
    } as CustomQueryOptions<{data:IEmr[],total:number, page:number,totalPages:number}, Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};

export default useGetEmrs;
