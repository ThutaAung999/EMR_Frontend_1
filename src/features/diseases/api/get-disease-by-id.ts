import { useQuery } from '@tanstack/react-query';
import { IDisease } from '../model/IDisease';

//--------------------------
const fetchDiseaseById = async (id: string): Promise<IDisease> => {
  const response = await fetch(`http://localhost:9999/api/diseases/${id}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch disease data');
  }

  return response.json();
};

export const useGetDiseaseById = (id: string) => {
  return useQuery<IDisease>({
    queryKey: ['patient', id],
    queryFn: () => fetchDiseaseById(id),
    enabled: !!id, // Only run the query if the id is not null or undefined
  });
};