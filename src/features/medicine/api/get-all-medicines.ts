import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";
import {BaseTypeForPagination} from '../../utilForFeatures/basePropForPagination';
//after updating

const fetchMedicines1 = async (query: BaseTypeForPagination):
    Promise<{ data: IMedicine[]; total: number; page: number; totalPages: number }> => {

  //const params = new URLSearchParams(query as any).toString();

   // Convert query object to URLSearchParams, filtering out undefined values
   //undefined values တွေပါရင် error တက်နေလို့ အောက်ကကောင်နဲံရှင်းထားတာ
     const params = new URLSearchParams(
      Object.entries(query).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

 // console.log('params :',params)
  
  //const response = await fetch(`https://emr-backend-intz.onrender.com/api/medicines?${params}`);
  const apiUrl = import.meta.env.VITE_API_URL; 
  const response = await fetch(apiUrl+`api/medicines?${params}`);
  
  //const response = await fetch(`http://localhost:9999/api/medicines?${params}`);
    
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

export const useGetMedicines1 = (query: BaseTypeForPagination) => {
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


