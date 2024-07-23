import { useQuery } from '@tanstack/react-query';
import { IEmr } from '../model/emr.model';

//--------------------------
const fetchEmrById = async (id: string): Promise<IEmr> => {

  const apiUrl = import.meta.env.VITE_API_URL;  
  const response = await fetch(apiUrl+`api/emrs/${id}`);
  
  
  //const response = await fetch(`https://emr-backend-intz.onrender.com/api/emrs/${id}`);
 // const response = await fetch(`http://localhost:9999/api/emrs/${id}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch emr data');
  }

  return response.json();
};

export const useGetEmrById = (id: string) => {
  return useQuery<IEmr>({
    queryKey: ['emr', id],
    queryFn: () => fetchEmrById(id),
    enabled: !!id, // Only run the query if the id is not null or undefined
  });
};